# Tasks — Increment 0109: Auth Forms Migration to FormField

## Phase 1: Login Page

- [ ] T-101: `src/pages/login.astro` — replace email input markup with `<FormField>`
- [ ] T-102: Verify password field still uses PasswordInput
- [ ] T-103: Verify validation icon position preserved
- [ ] T-104: `pnpm build` exits 0
- [ ] T-105: curl test: GET /login → 200 with FormField markup

## Phase 2: Register Page

- [ ] T-201: `src/pages/register.astro` — replace all input fields with `<FormField>`
- [ ] T-202: Verify name, email, password, confirm-password fields work
- [ ] T-203: `pnpm build` exits 0
- [ ] T-204: curl test: GET /register → 200

## Phase 3: Forgot Password Page

- [ ] T-301: `src/pages/forgot-password.astro` — replace email input with `<FormField>`
- [ ] T-302: Verify Button.astro loading state preserved
- [ ] T-303: `pnpm build` exits 0
- [ ] T-304: curl test: GET /forgot-password → 200

## Phase 4: Reset Password Page

- [ ] T-401: `src/pages/reset-password.astro` — replace password inputs with `<FormField>` (or PasswordInput)
- [ ] T-402: Verify confirm-password field works
- [ ] T-403: `pnpm build` exits 0
- [ ] T-404: curl test: GET /reset-password → 200

## Phase 5: Contact Page

- [ ] T-501: `src/pages/contact.astro` — replace name, email, message fields with `<FormField>`
- [ ] T-502: Use Textarea for message field
- [ ] T-503: `pnpm build` exits 0
- [ ] T-504: curl test: GET /contact → 200

## Phase 6: End-to-End Verification

- [ ] T-601: Visual regression test: visit each page via obscura MCP, confirm rendering
- [ ] T-602: Test full login flow: register → confirm email (skipped) → login → dashboard
- [ ] T-603: Test password reset flow: forgot-password → reset-password → login
- [ ] T-604: wrangler deploy to production
- [ ] T-605: Post-deploy smoke test all 5 pages

## Completion Criteria

- [ ] 5 auth pages use FormField
- [ ] Zero inline `<input>` elements in auth forms
- [ ] All auth pages return HTTP 200
- [ ] Login + register + password reset flows work end-to-end
- [ ] `pnpm build` exits 0
