export type Rsvp = {
  id: string;
  name: string;
  attendance: "yes" | "no" | "maybe";
  plus_one: boolean;
  needs_room: boolean;
};

export class RsvpError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

export function parseRsvp(value: unknown): Rsvp {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new RsvpError("Please complete the RSVP form.");
  const v = value as Record<string, unknown>;
  if (typeof v.website !== "string" || v.website !== "")
    throw new RsvpError("We couldn’t accept this submission.");
  if (
    typeof v.id !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      v.id,
    )
  )
    throw new RsvpError("Please reload the page and try again.");
  if (
    typeof v.name !== "string" ||
    !v.name.trim() ||
    v.name.trim().length > 100 ||
    /[\u0000-\u001f\u007f]/.test(v.name)
  )
    throw new RsvpError("Please enter a name between 1 and 100 characters.");
  if (
    v.attendance !== "yes" &&
    v.attendance !== "no" &&
    v.attendance !== "maybe"
  )
    throw new RsvpError("Please choose Yes, No, or Maybe.");
  if (typeof v.plus_one !== "boolean" || typeof v.needs_room !== "boolean")
    throw new RsvpError("Please answer the plus-one and room questions.");
  return {
    id: v.id.toLowerCase(),
    name: v.name.trim(),
    attendance: v.attendance,
    plus_one: v.attendance === "no" ? false : v.plus_one,
    needs_room: v.attendance === "no" ? false : v.needs_room,
  };
}

export type SaveRsvp = (rsvp: Rsvp) => Promise<void>;

function json(data: unknown, status: number) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

// Kept independent of Next.js to test the real HTTP boundary with a controlled store.
export async function handleRsvp(request: Request, save: SaveRsvp) {
  try {
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin)
      throw new RsvpError("Please submit from the invitation page.", 403);
    if (
      !/^application\/json(?:\s*;|$)/i.test(
        request.headers.get("content-type") ?? "",
      )
    )
      throw new RsvpError("Expected a JSON submission.", 415);
    // Bound the actual streamed body, even when content-length is missing or false.
    const reader = request.body?.getReader();
    if (!reader) throw new RsvpError("Please complete the RSVP form.");
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 4096) {
        await reader.cancel();
        throw new RsvpError("This submission is too large.", 413);
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    let payload: unknown;
    try {
      payload = JSON.parse(new TextDecoder().decode(bytes));
    } catch {
      throw new RsvpError("Invalid submission. Please try again.");
    }
    await save(parseRsvp(payload));
    return json({ ok: true }, 200);
  } catch (err) {
    if (err instanceof RsvpError)
      return json({ error: err.message }, err.status);
    // Never expose database responses, credentials, or guest data in errors/logs.
    return json(
      { error: "We couldn’t save your RSVP. Please try again in a moment." },
      503,
    );
  }
}
