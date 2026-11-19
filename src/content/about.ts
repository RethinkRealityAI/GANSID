/**
 * About GANSID: copy carried over verbatim from inheritedblooddisorders.world
 * (/about-the-gansid, /vision-mission-and-objectives, /regional-networks,
 * /regions-of-the-gansid, /africa-region-afr, /southeast-asia-region-sear).
 * Kept as plain data so it can move into the CMS later without touching layout.
 */

export const aboutIntro = {
  eyebrow: 'About GANSID',
  title: ['Bringing the voices of', 'inherited blood', 'disorders together'],
  lede: 'The Global Action Network for Sickle Cell & Other Inherited Blood Disorders unites the forces of organizations and clinicians serving inherited blood disorders to better amplify their impact globally.',
  place: { tag: 'Headquarters', name: 'Dover, Delaware', note: 'Also registered in Toronto, Canada' },
};

export const gap = {
  title: 'The gap',
  body: 'Whether operating in a low, medium, or high-resource environment, most advocates and organizations supporting individuals and families affected by inherited blood disorders are typically motivated by a personal connection to the disease. This ensures a passionate commitment, but may not provide access to the opportunities or resources needed for effective advocacy.',
};

export const opportunity = {
  title: 'The opportunity',
  body: [
    'GANSID was established to identify common purposes among inherited blood disorders and encourage disease-specific and cross-disease advocacy initiatives to meet the needs of people living with inherited blood disorders, no matter where they live in the world.',
    'It brings the voices of inherited blood disorders together to advance care, treatment, research, capacity building, and education in regions of the world facing acute challenges due to underdeveloped healthcare systems, poverty, and a lack of disease awareness among patient populations.',
  ],
};

export const whoWeAre = {
  statement:
    'A global network of patient organizations, health care providers, health organizations, researchers, professional and academic societies, and industry partners that serve people impacted by sickle cell disease and other inherited blood disorders.',
  members: [
    'Patient organizations',
    'Health care providers',
    'Health organizations',
    'Researchers',
    'Professional & academic societies',
    'Industry partners',
  ],
  how: 'GANSID is strengthening the advocacy skill sets of the patient organizations and clinicians serving the inherited blood disorders communities through training, mentorship, and cross-disease collaborations.',
};

export const vision =
  'A strong and united sickle cell and other inherited blood disorders patient and health care provider communities equipped to effectively advance disease-specific and cross-disease priorities that improve outcomes for affected families.';

export const mission =
  'Through data-driven advocacy, collaboration, and capacity building, we empower healthcare providers and patient organizations to advance disease-specific and cross-disease initiatives, improving outcomes for people living with sickle cell & other inherited blood disorders, regardless of where they are in the world.';

export const objectives = [
  'Advance disease-specific and cross-disease initiatives that meet the immediate needs of people living with sickle cell disease & other inherited blood disorders.',
  'Equip clinicians and patient organizations serving the inherited blood disorders community to shape and advance efforts that ensure the promise of innovations can be fully realized for all.',
  'Strengthen and empower clinicians and patient organizations serving the sickle cell & other inherited blood disorders community through the creation of regional networks, especially in areas of the highest unmet needs.',
  'Act as a medium for capacity building, training, and mentorship, and for translating knowledge and materials, compiling and disseminating information.',
  'Support cross-disease patient-centered education initiatives to strengthen care infrastructure, improve training and education of health care providers, and expand their access to resources.',
  'Encourage the formation and development of national and regional inherited blood disorder organizations globally, and assist and stimulate them through disease-specific and cross-disease exchange of skills and knowledge.',
  'Enable advancement of shared priorities within the inherited blood disorders community through unified and coordinated data-driven advocacy efforts.',
];

/** Founder photos live on the current WordPress site until the media library moves. */
const WP = 'https://inheritedblooddisorders.world/wp-content/uploads';
export const founderPeople = [
  { name: 'Mrs. Lanre Tunji-Ajayi, M.S.M.', role: 'Founder', photo: `${WP}/2023/01/lanre2_2023.png` },
  { name: 'Dr. Adlette Inati', role: 'Co-founder', photo: `${WP}/2023/08/bio-Adlette-Inati.png` },
  { name: 'Mr. Riyad Elbard', role: 'Co-founder', photo: `${WP}/2023/01/Riyad-Elbard.png` },
  { name: 'Dr. Marimilia Pita', role: 'Co-founder', photo: `${WP}/2023/01/pita_2023.png` },
  { name: 'Dr. Eydith Ortiz', role: 'Co-founder', photo: `${WP}/2023/09/bio-Eydith-Comenencia.png` },
];

export const regionsIntro = {
  body: 'GANSID utilizes a regional network model to advance its global activities. Through these networks, it provides platforms for sharing, networking, and collaboration that enable the advancement of public policy priorities through coordinated advocacy, and empowers patient organizations through training, capacity building, and mentorship.',
  leadDuties: ['Identifying regional priorities and elevating them to leadership', 'Advancing the execution of programming at the regional level'],
  note: 'The eight regions are based on WHO regions, with the Americas split into North, Central and South, and the Caribbean.',
};

export type Region = {
  /** Only the abbreviations the current site uses; the Americas and Caribbean have none. */
  code?: string;
  name: string;
  leads?: { name: string; title: string; photo: string }[];
};

export const regions: Region[] = [
  {
    code: 'AFR',
    name: 'African Region',
    leads: [
      { name: 'Mary Akua Ampomah', title: 'Interim Manager', photo: `${WP}/2024/08/Mary-Akua-Ampomah-240x300.jpg` },
      { name: 'Olajide Ayoola', title: 'Interim Lead', photo: `${WP}/2024/06/Ayoola-Olajide-300x300.jpg` },
    ],
  },
  { name: 'Americas, North' },
  { name: 'Americas, Central and South' },
  { name: 'Caribbean' },
  {
    code: 'SEAR',
    name: 'South-East Asian Region',
    leads: [{ name: 'Dr. JS Arora', title: 'Interim Lead', photo: `${WP}/2024/07/Dr-Arora-208x300.jpg` }],
  },
  { code: 'EUR', name: 'European Region' },
  { code: 'EMR', name: 'Eastern Mediterranean Region' },
  { code: 'WPR', name: 'Western Pacific Region' },
];
