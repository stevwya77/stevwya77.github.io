/**
 * Everything printed on the outside of the J-card lives here.
 * TODO(you) — Step 1: replace every placeholder with your own details.
 */

export interface SiteLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  /** Katakana (or any subtitle) printed under your name, Macroblank-style. */
  nameJp: string;
  /** The "album title": your role or what you do. */
  title: string;
  titleJp: string;
  /** Cassette catalog number, printed on the spine. Make it yours: initials + number. */
  catalog: string;
  year: number;
  location: string;
  email: string;
  links: SiteLink[];
}

export const site = {
  name: 'Stephanie Wyatt',
  nameJp: 'ユア・ネーム',
  title: 'Software Engineer',
  titleJp: 'ソフトウェア・エンジニア',
  catalog: 'YN-001',
  year: 2026,
  location: 'Somewhere sunny',
  email: 'you@example.com',
  links: [
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'Résumé', href: '/resume.pdf' },
  ],
} satisfies SiteConfig;
