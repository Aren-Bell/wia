# KAVI homepage frontend handoff

## Scope of this branch

Homepage (`/home`), sample login (`/login`), reusable product shell and controls, general/report composer, cards, detail/branch routes, nested comment connectors and resolution UI. Light/dark desktop, tablet and mobile layouts are included. Jelajah and Timeline are deferred and intentionally absent from this commit; their navigation displays an unavailable notice. The complete drafts remain in the separate local `wia` checkout.

This branch is based on the latest backend master. Existing APIs, auth, database schema, backend utilities and backend tests are preserved. UI interactions still use the frontend demo provider; API integration is left to the backend team.

## Run

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open `/login` and choose a sample account. The login is explicitly a demo and does not send credentials or grant real agency permissions. Refresh resets the demo session. The homepage does not fetch backend data.

The repository now contains backend routes that initialize a database client during production build. For real backend use, configure the variables documented in `.env.example`. For isolated build validation without connecting to a service, `TURSO_DATABASE_URL=file::memory:` supplies a disposable in-memory URL; never commit real environment values.

## Folder ownership

| Folder                               | Purpose                                                                     |
| ------------------------------------ | --------------------------------------------------------------------------- |
| `app/home`, `app/login`, `app/posts` | Frontend route entry points                                                 |
| `components/ui`                      | Button, Avatar and accessible native Dialog                                 |
| `components/layout`                  | Responsive navigation, centered feed and supporting column                  |
| `features/auth`                      | Sample frontend session and in-memory state                                 |
| `features/feed`                      | Homepage tabs and feed                                                      |
| `features/posts`                     | Cards, composer, detail and nested comments                                 |
| `features/validation`                | Evidence, countdown, voting and results UI                                  |
| `types`, `mocks`                     | Frontend types and sample content                                           |
| `lib/validation.ts`                  | Pure frontend media/result validation; other lib files remain backend-owned |
| `app/globals.css`                    | Shared semantic theme tokens and responsive styles                          |

Inter is served locally under `public/fonts` with its OFL license. Existing backend scripts and configuration remain available.

## IDs and integration boundary

**Backend IDs and foreign keys are deliberately empty strings.** This applies to users, posts, comments and resolution fixtures and newly composed content. `localKey`, `authorKey`, `parentKey` and `agencyKeys` are separate session-only UI references, never database IDs. The UUID generated for a new item is assigned only to `localKey`. The backend team will replace these relationships and connect real IDs later. Native HTML IDs used for accessibility, anchors and comment scrolling are DOM identifiers, not database identifiers.

The React provider keeps data in memory, not localStorage. Photo previews use browser blob URLs and are not uploaded. Replacing provider operations with backend adapters should keep UI components reusable. Current frontend models are view models, not insert payloads for the database. Do not insert the demo fixtures into backend tables.

Backend integration still needs to reconcile report type, public anonymity, verified agency tags, validation submissions/history and 72-hour voting. Social UP/DOWN votes and resolution votes are separate. The backend `reports` table describes abuse reports, not civic report posts. Existing backend behavior is not rewritten by this frontend delivery.

## Checks

```sh
pnpm lint:frontend
pnpm typecheck
pnpm build
pnpm exec playwright install chromium
pnpm test:frontend
pnpm format:check:frontend
```

Playwright is scoped to `frontend.spec.ts`; it does not run the backend test scripts or touch external databases. Existing backend tests keep their own scripts. Formatting is scoped to frontend-owned files so it does not rewrite API routes or backend utilities.
