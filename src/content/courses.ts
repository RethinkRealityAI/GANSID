/** Real GANSID Learning Hub catalogue (published courses, Nov 2026). */
export const courses = [
  { n: 1, title: 'Fundamentals of Effective Advocacy', lessons: 11, img: 'advocacy', audience: 'Patient organizations' },
  { n: 2, title: 'Fundraising Strategies that Drive Results', lessons: 5, img: 'fundraising', audience: 'Patient organizations' },
  { n: 3, title: 'Volunteer Management', lessons: 10, img: 'volunteer', audience: 'Patient organizations' },
  { n: 4, title: 'Leadership: What Works and What Does Not', lessons: 7, img: 'leadership', audience: 'Patient organizations' },
  { n: 5, title: 'Project Management', lessons: 7, img: 'project', audience: 'Patient organizations' },
  { n: 6, title: 'Effective Communication', lessons: 9, img: 'communication', audience: 'Patient organizations' },
  { n: 7, title: 'Developing Impactful Strategic Work Plans', lessons: 12, img: 'strategy', audience: 'Patient organizations' },
  { n: 8, title: 'Grant Writing', lessons: 5, img: 'grants', audience: 'Patient organizations' },
  { n: 0, title: 'Emergency Assessment and Management of Acute Complications of Sickle Cell Disease', lessons: 7, img: 'emergency-scd', audience: 'Health care providers' },
] as const;
export type Course = (typeof courses)[number];
