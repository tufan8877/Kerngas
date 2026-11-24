# Project memory

## Product intent & audience

- Production-ready website for a Vienna-based gas appliance service business.
- Audience: local customers needing gas device maintenance, repairs, and appointments; also targets B2B brand/partner discovery.
- Key features: maintenance & repair dedicated pages, brand overviews, interactive appointment booking + fault reporting form with file uploads, integrated Node.js backend (form handling, email).
- Bilingual-ready but primary content language is German (Austrian market).

## Brand personality & voice

- Brand name rebranded from "KERN Gasgeräteservice" to **kerngas** (lowercase preferred).
- Professional, trustworthy, service-oriented gas technician business.
- German-language copy; tone is clear, competent, and practical.
- New KERNGAS logo is the authoritative logo across all pages, SEO metadata, footer, mail templates, and render config.
- Legacy "KERN Gasgeräteservice" references removed from visible UI, SEO titles, mail texts, and config.

## Visual design & UX direction

- React (Vite) + Tailwind CSS + Lucide React icons only; no extra UI/theme packages.
- Use `@/` path alias for all project imports (maps to `src/`).
- Production-quality, non-cookie-cutter aesthetic expected.
- Logo from Lucide or provided asset; consistent header/footer placement.
- Form UX: appointment + fault reporting with file upload support; backend submission via Node.js.
- Pages: dedicated maintenance, repairs, brand overview(s), plus contact/appointment flow.

## Decisions, constraints & rationale

- Rebrand to **kerngas** applied site-wide (UI, SEO, footer, mail templates, render config).
- New logo integrated everywhere; old branding removed.
- Build, TypeScript checks, and linting must pass (confirmed green after rebrand).
- Stack locked: vite-react, Tailwind, lucide-react, Node.js backend. No additional packages unless explicitly requested.
- `@/` import alias enforced instead of deep relative paths.

## Open questions & assumptions

- Assumption: "kerngas" stays lowercase in most contexts; capitalization rules for formal/legal mentions (Impressum) not yet specified.
- No explicit color palette / typography system provided yet; current design inferred from existing build.
- Backend deployment target and mail transport details not documented.
- File upload storage/size limits not specified.