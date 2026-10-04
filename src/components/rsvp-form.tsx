"use client";

import { useRef, useState, type FormEvent } from "react";
type Attendance = "yes" | "no" | "maybe";

function YesNo({ name, legend }: { name: string; legend: string }) {
  return (
    <fieldset className="binary-question">
      <legend>{legend}</legend>
      <div className="binary-options">
        {["yes", "no"].map((value) => (
          <label className="choice binary" key={value}>
            <input type="radio" name={name} value={value} required />
            <span>{value === "yes" ? "Yes" : "No"}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function RsvpForm({ acceptingRsvps }: { acceptingRsvps: boolean }) {
  const [attendance, setAttendance] = useState<Attendance | "">("");
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [error, setError] = useState("");
  const [guestName, setGuestName] = useState("");
  const inFlight = useRef(false);
  const attempt = useRef<{ fingerprint: string; id: string } | null>(null);
  const successHeading = useRef<HTMLHeadingElement>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current || !acceptingRsvps) return;
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? "").trim(),
      attendance,
      plus_one: attendance !== "no" && form.get("plus_one") === "yes",
      needs_room: attendance !== "no" && form.get("needs_room") === "yes",
      website: String(form.get("website") ?? ""),
    };
    if (!payload.name) {
      setError("Please enter your name.");
      return;
    }
    const fingerprint = JSON.stringify(payload);
    if (!attempt.current || attempt.current.fingerprint !== fingerprint) {
      try {
        const saved = JSON.parse(
          sessionStorage.getItem("christmas-rsvp-attempt") ?? "null",
        );
        if (saved?.fingerprint === fingerprint && typeof saved.id === "string")
          attempt.current = saved;
      } catch {
        /* Storage may be disabled; in-memory retries still work. */
      }
      if (attempt.current?.fingerprint !== fingerprint)
        attempt.current = { fingerprint, id: crypto.randomUUID() };
    }
    try {
      sessionStorage.setItem(
        "christmas-rsvp-attempt",
        JSON.stringify(attempt.current),
      );
    } catch {
      /* Optional storage. */
    }
    inFlight.current = true;
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, id: attempt.current!.id }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true)
        throw new Error(
          result.error || "We couldn’t save your RSVP. Please try again.",
        );
      setGuestName(payload.name);
      setStatus("success");
      requestAnimationFrame(() => successHeading.current?.focus());
    } catch (err) {
      setError(
        err instanceof Error &&
          !["TimeoutError", "TypeError", "AbortError"].includes(err.name)
          ? err.message
          : "We couldn’t confirm your RSVP. Check your connection and try again — an unchanged retry won’t create a duplicate.",
      );
      setStatus("idle");
    } finally {
      inFlight.current = false;
    }
  }

  if (status === "success")
    return (
      <div className="rsvp-card success" role="status">
        <span className="success-star" aria-hidden="true">
          ✳
        </span>
        <p className="eyebrow">RSVP RECEIVED</p>
        <h3 tabIndex={-1} ref={successHeading}>
          Thank you, {guestName}.
        </h3>
        <p>
          {attendance === "yes"
            ? "You’re on the list. We can’t wait to celebrate with you!"
            : attendance === "maybe"
              ? "We’ve saved your maybe. Thanks for keeping us in the loop!"
              : "We’ll miss you! Thanks for letting us know."}
        </p>
        <p className="fine-print">
          Need to change your plans? Get in touch with the host. Any room
          request will be confirmed separately.
        </p>
      </div>
    );

  return (
    <form
      className="rsvp-card"
      onSubmit={submit}
      aria-labelledby="form-title"
      aria-busy={status === "sending"}
    >
      <div className="form-heading">
        <h3 id="form-title">Your festive RSVP</h3>
        <span aria-hidden="true">↗</span>
      </div>
      <p className="form-subtitle">
        A few little details, then you’re all set.
      </p>
      {!acceptingRsvps && (
        <p className="notice" role="status">
          RSVPs will open soon. Have a look around in the meantime.
        </p>
      )}
      <fieldset className="form-fields" disabled={status === "sending"}>
        <label className="text-label" htmlFor="guest-name">
          Your name <span>(required)</span>
        </label>
        <input
          className="name-input"
          id="guest-name"
          name="name"
          autoComplete="name"
          placeholder="First and last name"
          maxLength={100}
          required
        />
        <fieldset className="attendance-question">
          <legend>
            Will you be joining us? <span>(required)</span>
          </legend>
          <div className="attendance-options">
            {(
              [
                { value: "yes", label: "Oh, yes!", icon: "✦" },
                { value: "no", label: "Can’t make it", icon: "♡" },
                { value: "maybe", label: "Maybe", icon: "~" },
              ] as const
            ).map(({ value, label, icon }) => (
              <label className="choice attendance" key={value}>
                <input
                  type="radio"
                  name="attendance"
                  value={value}
                  checked={attendance === value}
                  onChange={() => setAttendance(value)}
                  required
                />
                <span>
                  <b aria-hidden="true">{icon}</b>
                  {label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        {attendance !== "no" && (
          <div className="extra-questions">
            <YesNo name="plus_one" legend="Bringing a plus one?" />
            <YesNo
              name="needs_room"
              legend="Need a room in the guest apartment?"
            />
            <p className="fine-print">
              Rooms are limited. Your host will confirm availability separately.
            </p>
          </div>
        )}
        <div className="honeypot" aria-hidden="true">
          <label htmlFor="website">Leave this field empty</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
        <button
          className="button submit-button"
          disabled={!acceptingRsvps || status === "sending"}
          type="submit"
        >
          {status === "sending"
            ? "Sending your RSVP…"
            : acceptingRsvps
              ? "Send my RSVP"
              : "RSVPs opening soon"}
          <span aria-hidden="true">↗</span>
        </button>
      </fieldset>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <p className="privacy-note">
        Just for the guest list. Your details stay with the host.
      </p>
    </form>
  );
}
