# Build milestones

- [x] M0 — Plan: scope, architecture, Git repository.
- [x] M1 — Foundation: Next.js, TypeScript, scripts, configuration, environment template, locked dependencies.
- [x] M2 — Invitation: Christmas artwork, event details, accessible responsive RSVP form.
- [x] M3 — Persistence code: Supabase migration, protected server submission, validation, safe retries. Live Supabase verification deferred to M5.
- [x] M4 — Local verification: production build, six functional tests, desktop/mobile browser checks, setup guide.
- [ ] M5 — Launch: real event details, Supabase project/migration, private remote repository, Vercel environment and deployment, live database/access checks.

## Inputs for launch

- Confirmed: A 90’s Christmas; 5th December; arrive from 4pm; dinner ready from 6pm; Moda Central, Hove. Dress code: 90’s Christmas jumpers or 90’s Christmas glam — your choice.
- Vercel and Supabase project access; repository destination. Keep secret keys out of chat and Git.
- Received a Christmas living-room reference photo, now used as the wallpaper and profile photo. The original illustrated SVG remains available as an alternative.

The current authorised stage is the local build. M5 is deferred at the user's request until infrastructure is connected and the live submission flow is verified.

## Verification record

- `npm test`: six passing tests for validation, all attendance states, HTTP boundary, database errors, safe retries, and missing credentials. Database responses are mocked; this is not a live Supabase test.
- `npm run build`: production build and TypeScript passed.
- Browser: inspected invitation and RSVP layouts at desktop and mobile widths; no horizontal overflow at 320, 390, and 1440 pixels. Verified Yes/No/Maybe selection, conditional fields, and plus-one/room controls. No browser warnings/errors observed.
- Local HTTP smoke test: unconfigured API returns 503 and a helpful message, never a success receipt.
- Pending M5: real database migration and RLS checks, end-to-end saved RSVP and success receipt, deployed Vercel smoke test. No cloud project or remote Git repository created.

## Approved redesign — family computer Christmas

- [x] R1 — Direction approved: reference-photo wallpaper, XP window chrome, Myspace profile, hard shadows and festive animation.
- [x] R2 — Visual rebuild: browser frame, profile sidebar, Notepad details, bevelled RSVP controls, desktop shortcuts and taskbar.
- [x] R3 — Motion: GIF-style CSS sparkles, fairy lights and dancing trees; working pause/resume and reduced-motion support.
- [x] R4 — Verification: production build; mobile checks at 320/390px; desktop preview; conditional RSVP fields, radio controls and animation pause checked in the browser.
- [x] R5 — Redesign documented and ready for its Git milestone commit. Hosting remains deferred.
