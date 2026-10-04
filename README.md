# Christmas party website

Status: planning. No application or deployment has been created yet.

## Approach

Build a single responsive page using the standard Next.js App Router boilerplate, TypeScript, and plain CSS. Deploy to Vercel and store RSVPs in Supabase Postgres. Use the Supabase dashboard to review and export responses, keeping the initial website small.

## Page and design

- A Christmas background image with a dark overlay for readable text. Store it at `public/images/christmas-background.webp` so it is easy to replace.
- A warm, simple invitation style: evergreen, cream, and muted gold; clear typography and generous spacing.
- Event title, date, time, venue/address, and optional notes in one editable configuration file.
- Event details followed by the RSVP form; a single column on phones and a wider layout on desktop.
- Accessible labels, keyboard navigation, visible focus states, and large touch targets.

## RSVP behaviour

- Required name.
- Required attendance choice: Yes, No, or Maybe.
- Explicit Yes/No answers for bringing a plus one and needing a room in the guest apartment.
- When attendance is No, hide the extra questions and save both as false.
- Explain that requesting a room does not confirm a booking.
- Validate in the browser and on the server. Show submitting, success, and retryable error states; only confirm success after persistence.
- Prevent double-click submissions and make retries idempotent using a client-generated submission UUID retained for that attempt.
- Initial scope: no guest accounts or cross-device RSVP editing. Names are not unique; different guests may share a name. Separate submissions can still create separate responses, which the host can manage in Supabase.

## Data and access

One `rsvps` table, created by a tracked SQL migration:

| Field | Type / constraint |
| --- | --- |
| id | UUID primary key; also the submission idempotency key |
| name | Trimmed text, 1–100 characters |
| attendance | Text constrained to yes, no, maybe |
| plus_one | Boolean |
| needs_room | Boolean |
| created_at | Timestamp with time zone, default now() |

Add a database constraint that No responses cannot request a plus one or room. Submit through a Next.js server endpoint. Keep the Supabase secret key in server-only environment variables. Enable row-level security and deny anonymous table reads and writes; the endpoint uses the server credential and accepts only validated RSVP fields. Do not expose a public guest list or RSVP read endpoint. Add a hidden honeypot for basic spam filtering; it is not comprehensive abuse protection.

## Build and Git milestones

1. `docs: record Christmas party website plan` — this document and initial ignore rules.
2. `chore: scaffold Next.js app` — minimal boilerplate, scripts, environment example, and event configuration.
3. `feat: add responsive Christmas invitation and RSVP form` — replaceable background, event details, accessible form, and UI states.
4. `feat: persist RSVPs in Supabase` — SQL migration, server validation, idempotent inserts, and database integration.
5. `test: verify RSVP flow and document Vercel deployment` — focused validation/integration checks and setup instructions.

Keep secrets, generated builds, dependencies, and local deployment metadata out of Git. Use a private remote repository when connecting Vercel; commit each completed milestone.

## Verification

- Production build and TypeScript checks.
- Check narrow mobile and desktop layouts, keyboard interaction, labels, and image contrast.
- Exercise all three attendance options, required fields, plus-one/room behaviour, and database failures.
- Verify a repeated submission UUID creates one row; verify anonymous clients cannot read or directly write responses.
- Confirm persisted values in Supabase, then smoke-test the Vercel deployment with a clearly labelled test response and remove it afterwards.

## Deployment

Create or select a Supabase project, apply the migration, and configure server-only environment variables locally and in Vercel. Connect the Git repository to Vercel using its Next.js preset. Verify a preview deployment, then deploy production. Document how to replace the image, edit details, inspect RSVPs, and redeploy. Keep preview tests separate from real guest responses.

## Inputs needed before launch

- Party title, date, time, location, and any dress-code or arrival notes.
- Preferred background, if replacing the initial Christmas image.
- Vercel and Supabase account/project access, and the remote Git repository destination.
- Default assumption: guests can RSVP without signing in and the invitation is accessible to anyone with its URL. A private invitation or access code would need an explicit access-control choice.

Placeholder event details can be used during development. No external resources need to be provisioned during this planning step.

## References

- [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [Vercel Git deployments](https://vercel.com/docs/git)
- [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys)
- [Supabase row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security)
