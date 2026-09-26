/**
 * Everything printed on the outside of the J-card lives here.
 * 
 */

export interface SiteLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  /** Katakana/subtitle printed under name */
  nameJp: string;
  /** The "album title": role */
  title: string;
  titleJp: string;
  /** Cassette catalog number on the spine */
  catalog: string;
  year: number;
  location: string;
  email: string;
  links: SiteLink[];
  status: 'open-to-work' | 'freelance' | 'not-looking'
}

export const site = {
  name: 'Stephanie Wyatt',
  nameJp: 'ユア・ネーム',
  title: 'Software Engineer',
  titleJp: 'ソフトウェア・エンジニア',
  catalog: 'SW-077',
  year: 2026,
  location: 'NYC',
  email: 'stephwyatt08@gmail.com',
  links: [
    { label: 'GitHub', href: 'https://github.com/stevwya77' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/stephanie-wyatt25/' },
    { label: 'Résumé', href: '#' },
  ],
  status: "open-to-work",
} satisfies SiteConfig;
