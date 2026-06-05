# Tasks — Increment 0109: Auth Forms Migration to FormField

## Phase 1: Login
- [ ] T-101: src/pages/login.astro — FormField for email
- [ ] T-102: Verify password uses PasswordInput
- [ ] T-103: pnpm build exits 0
- [ ] T-104: curl test: GET /login → 200

## Phase 2: Register
- [ ] T-201: src/pages/register.astro — FormField for all inputs
- [ ] T-202: pnpm build exits 0
- [ ] T-203: curl test: GET /register → 200

## Phase 3: Forgot Password
- [ ] T-301: src/pages/forgot-password.astro — FormField
- [ ] T-302: pnpm build exits 0
- [ ] T-303: curl test: GET /forgot-password → 200

## Phase 4: Reset Password
- [ ] T-401: src/pages/reset-password.astro — FormField
- [ ] T-402: pnpm build exits 0
- [ ] T-403: curl test: GET /reset-password → 200

## Phase 5: Contact
- [ ] T-501: src/pages/contact.astro — FormField + Textarea
- [ ] T-502: pnpm build exits 0
- [ ] T-503: curl test: GET /contact → 200

## Phase 6: E2E
- [ ] T-601: Visual regression test via obscura MCP
- [ ] T-602: Login flow E2E test
- [ ] T-603: Password reset flow E2E test
- [ ] T-604: wrangler deploy
- [ ] T-605: Post-deploy smoke test
