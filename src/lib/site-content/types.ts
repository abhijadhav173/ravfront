/**
 * Type definitions for the editable site content (CMS MVP).
 *
 * These types must stay in sync with the seeded JSON shape in
 * `backend/database/seeders/SiteContentSeeder.php`. The same shape is what
 * the admin UI sends back via `PUT /api/v1/admin/site/content/{slug}`.
 *
 * Inline emphasis convention: text fields can contain `**phrase**` markers.
 * `renderInline()` (in ./render.tsx) wraps these in <em> with the gold-italic
 * style. Admins type plain text + `**...**` markers — no HTML, no JSX.
 */

export type CtaVariant = "primary" | "secondary";

export type Cta = {
    label: string;
    href: string;
    variant: CtaVariant;
};

export type FooterLink = {
    label: string;
    href: string;
};

export type ComparisonRow = {
    dim: string;
    old: string;
    next: string;
};

export type PortfolioStepContent = {
    tag: string;
    name: string;
    title: string;
    body: string;
    meta: string[];
    chip: string;
    badgeNum: string;
    badgeLabel: string;
    comingSoon: boolean;
};

export type TeamMemberContent = {
    name: string;
    role: string;
    bio: string;
    photo: string;
    linkedin: string;
};

export type HomeContent = {
    hero: {
        tagline: string;
        logoImage: string;
        templeImage: string;
        scrollCue: string;
    };
    intro: {
        eyebrow: string;
        headline: string;
        body1: string;
        body2: string;
        facts: string[];
        ctas: Cta[];
        statueImage: string;
    };
    bridge: {
        eyebrow: string;
        headline: string;
        lead: string;
        columnOldLabel: string;
        columnNewLabel: string;
        rows: ComparisonRow[];
        statueImage: string;
    };
    portfolio: {
        label: string;
        counterSuffix: string;
        steps: PortfolioStepContent[];
    };
    team: {
        eyebrow: string;
        headline: string;
        lead: string;
        members: TeamMemberContent[];
        coinFrame: string;
    };
    footer: {
        email: string;
        logoText: string;
        links: FooterLink[];
        copyright: string;
    };
};

export type SiteContentEnvelope<T = HomeContent> = {
    slug: string;
    content: T;
    updated_at?: string;
};
