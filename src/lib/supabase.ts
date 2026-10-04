import { RsvpError, type Rsvp } from "./rsvp";

// Imported only from the server route. The secret must never use a NEXT_PUBLIC_ prefix.
export async function saveRsvp(rsvp: Rsvp): Promise<void> {
  const base = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!base || !key)
    throw new RsvpError(
      "RSVPs aren’t open just yet. Please check back soon.",
      503,
    );
  const endpoint = new URL("/rest/v1/rsvps", base);
  const headers: Record<string, string> = {
    apikey: key,
    "Content-Type": "application/json",
  };
  // Modern secret keys use apikey; legacy service-role JWTs also use Bearer auth.
  if (key.startsWith("eyJ")) headers.Authorization = `Bearer ${key}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { ...headers, Prefer: "return=minimal" },
    body: JSON.stringify(rsvp),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (response.ok) return;
  if (response.status !== 409) throw new Error("RSVP storage failed");
  const failure = await response.json();
  if (failure.code !== "23505") throw new Error("RSVP storage conflict");
  // A network retry may arrive after the first insert succeeded. Compare internally;
  // never update an existing response or return another guest's data to the caller.
  endpoint.searchParams.set("id", `eq.${rsvp.id}`);
  endpoint.searchParams.set("select", "id,name,attendance,plus_one,needs_room");
  const existingResponse = await fetch(endpoint, {
    headers,
    cache: "no-store",
    signal: AbortSignal.timeout(4000),
  });
  if (!existingResponse.ok) throw new Error("RSVP retry lookup failed");
  const existing = (await existingResponse.json())[0] as Rsvp | undefined;
  if (
    existing &&
    Object.keys(rsvp).every(
      (key) => existing[key as keyof Rsvp] === rsvp[key as keyof Rsvp],
    )
  )
    return;
  throw new RsvpError(
    "This submission has already been used. Reload the page before sending a new RSVP.",
    409,
  );
}
