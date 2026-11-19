/**
 * Site content for the homepage draft.
 * Source: inheritedblooddisorders.world (home, About, Vision/Mission, Congress 2026,
 * Mentorship pages), captured 18 Nov 2026. The full content migration lives in a
 * separate workstream; this file is the hand-off point it will replace.
 *
 * `href` values point at the planned new routes. Where the old URL slug differs,
 * the redirect map will handle it.
 */

export const OLD_SITE = 'https://inheritedblooddisorders.world';
export const LMS_URL = 'https://org-lms.netlify.app/gansid';

export type NavGroup = {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
};

export const nav: NavGroup[] = [
  {
    label: 'About',
    href: '/about',
    children: [
      { label: 'About GANSID', href: '/about', description: 'Who we are and how we began' },
      { label: 'Vision, mission & objectives', href: '/about/mission' },
      { label: 'Board of Directors', href: '/about/board' },
      { label: 'The Team', href: '/about/team' },
      { label: 'Our partners', href: '/about/partners' },
      { label: 'Regional networks', href: '/about/regions' },
    ],
  },
  {
    label: 'Disorders',
    href: '/disorders',
    children: [
      { label: 'Sickle cell disease', href: '/disorders/sickle-cell-disease' },
      { label: 'Thalassemia', href: '/disorders/thalassemia' },
      { label: 'Pyruvate kinase deficiency', href: '/disorders/pyruvate-kinase-deficiency' },
      { label: 'Hemophilia', href: '/disorders/hemophilia' },
      { label: 'Aplastic anemia', href: '/disorders/aplastic-anemia' },
      { label: 'Fanconi anemia', href: '/disorders/fanconi-anemia' },
    ],
  },
  {
    label: 'Programs',
    href: '/programs',
    children: [
      { label: 'Advocacy', href: '/programs/advocacy' },
      { label: 'Capacity building', href: '/programs/capacity-building' },
      { label: 'Education', href: '/programs/education' },
      { label: 'Clinical trials & research', href: '/programs/clinical-trials' },
      { label: 'Resources', href: '/resources' },
    ],
  },
  { label: 'Congress', href: '/congress' },
  { label: 'Events', href: '/events' },
  {
    label: 'Get involved',
    href: '/get-involved',
    children: [
      { label: 'Apply for membership', href: '/get-involved/membership' },
      { label: 'Be an affiliate', href: '/get-involved/affiliate' },
      { label: 'Become a volunteer', href: '/get-involved/volunteer' },
      { label: 'Strategic partners', href: '/get-involved/partners' },
      { label: 'Job postings', href: '/get-involved/jobs' },
      { label: 'Join the WhatsApp forum', href: '/get-involved/whatsapp' },
    ],
  },
];

/** "Right now at GANSID" — replaces the six image tiles on the current homepage */
export const highlights = [
  {
    tag: 'Congress 2026 · Hyderabad',
    title: 'Thank you for joining the 4th GANSID Congress',
    body: 'Clinicians, researchers, advocates and people with lived experience met at HICC, Hyderabad, to move inherited blood disorder care from innovation to implementation.',
    cta: 'Relive the photos',
    href: '/congress/2026/photos',
    tone: 'red',
  },
  {
    tag: 'Membership',
    title: 'Become a GANSID member organization',
    body: 'Open to disease-specific, cross-disease and umbrella patient organizations. Members vote at the AGM and join our training and mentorship programs.',
    cta: 'Apply for membership',
    href: '/get-involved/membership',
    tone: 'navy',
  },
  {
    tag: 'Research',
    title: 'Know the current clinical trials in inherited blood disorders',
    body: 'A curated list of active trials and plain-language resources so patients and providers can find studies that matter to them.',
    cta: 'See current trials',
    href: '/programs/clinical-trials',
    tone: 'teal',
  },
  {
    tag: 'Learning',
    title: 'Leadership modules for patient organizations',
    body: 'Free self-paced e-courses on advocacy, fundraising and running an effective patient organization, with a certificate when you finish.',
    cta: 'Start learning',
    href: LMS_URL,
    tone: 'coral',
  },
] as const;

/** True facts only. No invented impact numbers until GANSID supplies them. */
export const facts = [
  { value: '2022', label: 'Founded on 18 January' },
  { value: '6', label: 'Inherited blood disorders we serve' },
  { value: '4th', label: 'Congress, held in Hyderabad in 2026' },
  { value: '501(c)(3)', label: 'U.S. charity status since 2023' },
] as const;

export const vision =
  'A strong and united community of patients and health care providers, equipped to advance disease-specific and cross-disease priorities that improve outcomes for every affected family.';

export const mission =
  'Through data-driven advocacy, collaboration and capacity building, we help health care providers and patient organizations worldwide pursue initiatives that improve outcomes for people with sickle cell disease and other inherited blood disorders.';

export const regions = [
  { code: 'AFR', name: 'Africa Region', href: '/about/regions/africa' },
  { code: 'SEAR', name: 'Southeast Asia Region', href: '/about/regions/southeast-asia' },
] as const;

export type Pillar = {
  id: 'advocacy' | 'capacity' | 'education' | 'research';
  name: string;
  summary: string;
  items: { label: string; audience?: string }[];
  href: string;
};

export const pillars: Pillar[] = [
  {
    id: 'advocacy',
    name: 'Advocacy',
    summary:
      'Unified, data-driven advocacy on shared priorities, from the World Health Organization to national health ministries.',
    items: [
      { label: 'Advocacy with the WHO' },
      { label: 'World Inherited Blood Disorders Day' },
      { label: 'Other advocacy initiatives' },
    ],
    href: '/programs/advocacy',
  },
  {
    id: 'capacity',
    name: 'Capacity building',
    summary:
      'Mentorship, peer forums and support programs that equip clinicians and patient organizations, especially in low- and middle-resource settings.',
    items: [
      { label: 'Mentorship program', audience: 'Health care providers' },
      { label: 'Clinician online forum', audience: 'Health care providers' },
      { label: 'My Clinician Story', audience: 'Health care providers' },
      { label: 'Support programs', audience: 'Patient organizations' },
      { label: 'Share your story', audience: 'Patient organizations' },
      { label: 'Member-led projects', audience: 'Patient organizations' },
    ],
    href: '/programs/capacity-building',
  },
  {
    id: 'education',
    name: 'Education',
    summary:
      'A hub for training and knowledge translation: e-courses, case sessions, journal clubs and Congress webcasts.',
    items: [
      { label: 'E-training', audience: 'Health care providers' },
      { label: 'Case management sessions', audience: 'Health care providers' },
      { label: 'Journal Club web sessions', audience: 'Health care providers' },
      { label: 'E-learning leadership modules', audience: 'Patient organizations' },
      { label: 'Web learning', audience: 'Patient organizations' },
      { label: 'Congress webcast', audience: 'Everyone' },
    ],
    href: '/programs/education',
  },
  {
    id: 'research',
    name: 'Clinical trials & research',
    summary:
      'Helping innovation reach everyone, by connecting patients and providers with trials and the resources to understand them.',
    items: [{ label: 'Current clinical trials' }, { label: 'Clinical trials resources' }],
    href: '/programs/clinical-trials',
  },
];

export const disorders = [
  { name: 'Sickle cell disease', href: '/disorders/sickle-cell-disease' },
  { name: 'Thalassemia', href: '/disorders/thalassemia' },
  { name: 'Pyruvate kinase deficiency', short: 'PKD', href: '/disorders/pyruvate-kinase-deficiency' },
  { name: 'Hemophilia', href: '/disorders/hemophilia' },
  { name: 'Aplastic anemia', href: '/disorders/aplastic-anemia' },
  { name: 'Fanconi anemia', href: '/disorders/fanconi-anemia' },
] as const;

export const timeline = [
  {
    date: '18 Jan 2022',
    title: 'Founded as SCDIMA',
    body: 'The Sickle Cell Disease International Mentorship Association begins.',
  },
  {
    date: '1 Jun 2022',
    title: 'Becomes IBDIN',
    body: 'Renamed the Inherited Blood Disorders International Network to serve more conditions.',
  },
  {
    date: '12 Sep 2022',
    title: 'GANSID is named',
    body: 'The Global Action Network for Sickle Cell & Other Inherited Blood Disorders.',
  },
  { date: '30 Jun 2023', title: 'Registered in Canada', body: 'Incorporated in Toronto.' },
  {
    date: '16 Nov 2023',
    title: '501(c)(3) status',
    body: 'Recognized as a charity in the United States.',
  },
  {
    date: '2026',
    title: '4th Congress, Hyderabad',
    body: 'Our first in-person Congress, at HICC in Hyderabad, India.',
  },
] as const;

export const founders = [
  'Mrs. Lanre Tunji-Ajayi, M.S.M.',
  'Dr. Adlette Inati',
  'Mr. Riyad Elbard',
  'Dr. Marimilia Pita',
  'Dr. Eydith Ortiz',
] as const;

export const congress = {
  edition: '4th GANSID Congress',
  city: 'Hyderabad',
  country: 'India',
  venue: 'HICC',
  theme: 'From Innovation to Implementation: Bridging Science and Access in Inherited Blood Disorders',
  focus: [
    'Emerging therapies and curative approaches, including gene and cell therapies',
    'Transfusion medicine and comprehensive care',
    'Implementation science and health system integration in low- and middle-income countries',
    'Patient-centred outcomes, quality of life and community engagement',
  ],
} as const;

export const learning = {
  providers: ['E-training', 'Case management sessions', 'Journal Club web sessions', 'Congress clinician webcast'],
  organizations: ['Leadership e-learning modules', 'Web learning', 'Congress patient webcast'],
} as const;

export const involve = [
  {
    title: 'Become a member',
    body: 'Patient organizations join a global network with voting rights, training and mentorship.',
    href: '/get-involved/membership',
    tone: 'red',
  },
  {
    title: 'Volunteer with us',
    body: 'Lend your time and skills to advocacy, events and outreach across our regions.',
    href: '/get-involved/volunteer',
    tone: 'navy',
  },
  {
    title: 'Donate today',
    body: 'Fund mentorship, training and advocacy where resources for blood disorders are scarcest.',
    href: '/donate',
    tone: 'coral',
  },
] as const;

export const contact = {
  address: '8 The Green, Suite 4000, Dover, DE 19901, USA',
  email: 'admin@inheritedblooddisorders.world',
  socials: [
    { label: 'Facebook', href: 'https://www.facebook.com/iblooddisorders/' },
    { label: 'X', href: 'https://twitter.com/IBloodDisorders' },
    { label: 'YouTube', href: 'https://www.youtube.com/channel/UCOga5_Rfmsr4ubtA7C6901w' },
    { label: 'Instagram', href: 'https://www.instagram.com/iblooddisorders/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/iblooddisorders' },
  ],
} as const;
