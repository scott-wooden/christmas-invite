# A 90’s Christmas

A single-page party invitation for **Moda Central, Hove**, built with Next.js, TypeScript, plain CSS, and a Supabase-backed RSVP endpoint. **5th December: arrive from 4pm, dinner ready from 6pm.** Dress code: **90’s Christmas jumpers or 90’s Christmas glam — your choice!**

**Status:** local build complete; hosting deferred. See [MILESTONES.md](MILESTONES.md) for progress and verification. Without Supabase credentials, the invitation works and the form displays “RSVPs opening soon”. It does not pretend to save responses.

## Run locally

Requires Node.js 20.9 or newer; use an active LTS version for deployment.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. To check the production build:

```sh
npm test
npm run build
npm start
```

Stop the development server before `npm start` if both would use port 3000. `npm run typecheck` is also available. The production build performs TypeScript checks.

## Customise the invitation

Edit `src/config/event.ts` to change the title, date, time, venue, city, arrival details, dress code, or RSVP note.

The current wallpaper and profile photo are the supplied reference image, stored unchanged at `public/images/christmas-living-room.png`. Add a JPG/WebP/PNG in `public/images/` and update `backgroundImage` in the event configuration to replace both. The original illustration is retained at `public/images/christmas-background.svg` as an alternative. Colours, spacing, and responsive layouts live in `src/app/globals.css`.

The design blends a Christmas living-room wallpaper with XP-style blue window bars, bevelled controls, a Myspace-inspired profile, Notepad event details, and festive web badges. Typography uses system Tahoma/Verdana, Georgia, and Courier fonts, with no external font requests.

GIF-style twinkles, lights, and dancing trees use lightweight CSS loops. The taskbar's pause/resume button stops all decorative animation; system reduced-motion settings disable it automatically. Desktop shortcuts navigate to sections. Mobile layouts stack the windows and hide nonessential sidebar decorations. There are no pretend close/minimise buttons or autoplay audio.

## Connect Supabase when ready

1. Create or select a Supabase project.
2. Run both SQL files in `supabase/migrations/` in filename order: first `202610040001_create_rsvps.sql`, then `202610260001_add_dietary_requirements.sql`. If you already created the table, run only the second migration. Alternatively apply them using your Supabase migration workflow.
3. Copy `.env.example` to `.env.local`.
4. Set `SUPABASE_URL` to the project URL and `SUPABASE_SECRET_KEY` to the server secret key. The legacy `service_role` JWT is also supported. A publishable/anonymous key is not sufficient.
5. Restart the local server. Submission becomes available when both environment variables are present; actual saving still requires the migration and valid credentials.
6. Submit a clearly labelled test response and check the `rsvps` table. Verify public/anonymous clients cannot read or write that table, then delete the test response in the dashboard.

Keep secrets out of chat and Git. Never prefix these variables with `NEXT_PUBLIC_`. `.env.local` is ignored. [Supabase secret keys belong on the server](https://supabase.com/docs/guides/getting-started/api-keys).

The browser sends an RSVP to `POST /api/rsvp`. The server validates it and uses Supabase's REST API. The table has row-level security enabled with no public policies, and no table privileges for `anon` or `authenticated`. Only the server can insert/read responses; guests cannot access a public guest list. The Supabase dashboard is the host's initial management interface, including CSV export.

## RSVP behaviour

- Required name and Yes / No / Maybe attendance.
- Optional dietary requirements (up to 500 characters), including any plus-one requirements. Hidden and cleared for No responses.
- Required explicit Yes / No answers for a plus one and a guest-apartment room when attending or undecided.
- Choosing No hides those questions and stores both as false.
- Room requests are requests, not confirmed reservations.
- The submit button locks during a request. An unchanged retry reuses its UUID and cannot overwrite an existing RSVP or create an extra row. Pending submission identity is kept in session storage where available.
- Errors keep the form available for retry. A success receipt appears only after confirmed persistence.
- Names are not unique. Guests do not have accounts or cross-device editing; changes should go through the host. A changed/new submission may create a separate response.

The invitation is accessible to anyone with its URL. A `noindex` directive discourages search indexing but is not access control. The endpoint includes bounded inputs, an origin check, and a honeypot; these are basic protections, not comprehensive rate limiting. If the link is distributed widely, add platform rate limiting before opening RSVPs publicly.

## Deploy to Vercel later

1. Push this repository to your chosen private Git remote.
2. Import it into Vercel and select the Next.js preset, with the repository root as the project root. Standard `npm run build` settings are sufficient; no custom deployment boilerplate is required.
3. Add `SUPABASE_URL` and `SUPABASE_SECRET_KEY` as server environment variables in the intended Vercel environment. Keep preview tests in a separate Supabase project so they do not affect the real guest list.
4. Deploy a preview and check the image, mobile layout, all attendance options, persisted values, retry behaviour, and database access restrictions.
5. Confirm the event details, deploy production, and smoke-test a labelled RSVP. Remove the test response after checking it.

[Vercel supports Git-based deployments](https://vercel.com/docs/git). Hosting setup is intentionally pending until requested.

## Project map

| Path                           | Purpose                                           |
| ------------------------------ | ------------------------------------------------- |
| `src/config/event.ts`          | Editable event details and background path        |
| `src/app/page.tsx`             | Invitation and event sections                     |
| `src/components/rsvp-form.tsx` | Form, validation UI, pending/error/success states |
| `src/app/api/rsvp/route.ts`    | Server-only RSVP endpoint                         |
| `src/lib/rsvp.ts`              | Payload validation and HTTP handling              |
| `src/lib/supabase.ts`          | Private persistence and retry verification        |
| `supabase/migrations/`         | Database schema and access restrictions           |
| `tests/rsvp.test.ts`           | Focused tests using mocked storage responses      |

## Verification limits

Local tests, production build, and responsive browser checks have passed. A real Supabase migration, anonymous access checks, and a full browser-to-live-database submission remain part of the launch milestone. No cloud resources have been created and no site has been published.
