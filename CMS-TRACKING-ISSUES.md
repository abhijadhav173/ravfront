# CMS Tracking Issues

Use these as GitHub issues for the CMS stabilization board.

Recommended board columns:

- Backlog
- Ready
- In progress
- Review
- Shipped

## 1. CMS: add page registry for fixed routes vs generic pages

### Problem

The CMS currently infers public URLs from slugs. That is unsafe because fixed-layout CMS pages like `about-us`, `our-model`, and `contact-us` live at real routes, while custom pages live under `/p/[slug]`.

### Scope

- Add a shared `PAGE_REGISTRY` or equivalent.
- Include `home`, `contact-us`, `about-us`, and `our-model`.
- Declare each page's public route, layout mode, default content, and content type.
- Treat unknown/custom slugs as generic pages at `/p/[slug]`.
- Replace scattered route guessing with registry lookups.

### Acceptance Criteria

- Admin page list opens fixed pages at their true routes.
- Generic pages still open at `/p/[slug]`.
- Adding a fixed CMS page requires one registry entry.
- `npx tsc --noEmit` passes.

## 2. CMS: validate and normalize page content before save

### Problem

The backend accepts arbitrary JSON for `site_content.content`. A small editor mistake can persist malformed data and break rendering later.

### Scope

- Add frontend normalization for each fixed page type.
- Ensure arrays keep stable shapes, such as `string[]` staying `string[]`.
- Merge missing fields with defaults before saving.
- Reject or repair unsupported field types.

### Acceptance Criteria

- Saving `contact-us`, `about-us`, `our-model`, and `home` cannot corrupt known content shapes.
- Missing fields are restored from defaults.
- Wrong primitive/object array values are handled safely.
- Existing valid saved content still loads.

## 3. CMS: add backend schema/type guard for fixed page slugs

### Problem

The Laravel endpoint stores any JSON blob for any slug. Fixed-layout pages need stronger backend protection.

### Scope

- Add server-side validation keyed by slug or page type.
- Keep generic pages flexible, but validate fixed pages.
- Return useful validation errors to the admin UI.
- Consider adding a `type` column or derived type registry.

### Acceptance Criteria

- `home`, `contact-us`, `about-us`, and `our-model` reject obviously malformed content.
- Generic `/p/[slug]` pages still support block-based content.
- Admin save failures show clear error messages.

## 4. CMS: drafts, publish flow, and rollback safety

### Problem

Inline editing currently risks pushing changes directly to the public page. There is no draft/published separation or rollback path.

### Scope

- Add draft vs published content storage.
- Public reads should use published content only.
- Admin editor should save drafts.
- Add publish action.
- Add basic revision snapshots or last-known-good backup.

### Acceptance Criteria

- Editing does not change the public site until publish.
- Admins can discard draft changes.
- Admins can recover from at least the previous published version.

## 5. CMS: fixed-page edit components should use typed providers

### Problem

Fixed pages currently cast their content into `HomeContent` to reuse `EditModeProvider`. That works, but it weakens TypeScript and makes shape bugs easier.

### Scope

- Make `EditModeProvider` generic over page content type.
- Replace fixed-page `HomeContent` casts with typed providers.
- Keep existing path-based editing API.
- Preserve current editor behavior.

### Acceptance Criteria

- `ContactPageContent`, `AboutUsPageContent`, and `OurModelPageContent` pass through the editor without unsafe casts.
- TypeScript catches incorrect default list item shapes.
- Existing homepage editing still works.

## 6. CMS: production-safe rollout plan for main

### Problem

The `cms-mvp` branch contains both CMS infrastructure and design/page migration work. We need a safe path for production.

### Scope

- Decide which CMS pieces should land on `main` first.
- Separate asset library/admin backend from public page migrations if needed.
- Document environment variables for Railway, Vercel, and R2.
- Verify CI/build/deploy path.

### Acceptance Criteria

- A production rollout checklist exists.
- Required env vars are documented.
- The first merge can ship without changing public page design unexpectedly.
- CI passes or known unrelated failures are documented.

