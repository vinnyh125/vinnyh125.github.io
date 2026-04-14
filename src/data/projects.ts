// src/data/projects.ts
export interface Project {
  name: string;
  stack: string[];
  bullets: string[];
  github: string;
  live?: string;
}

export const projects: Project[] = [
  {
    name: 'CURoomie',
    stack: ['Next.js', 'React', 'TailwindCSS', 'Firebase', 'Google Cloud', 'Vercel'],
    bullets: [
      'Created centralized web app for 15,000+ Cornell students to find compatible roommates on and off campus',
      'Integrated Firebase for Google authentication and explored PostgreSQL for data handling and analytics',
      'Engineered machine learning-based matching algorithm involving ranked heuristics and Gale-Shapley',
    ],
    github: 'https://github.com/vinnyh125',
  },
  {
    name: 'Strophe',
    stack: ['Dart', 'Flutter', 'SQL', 'SQLite'],
    bullets: [
      'Developed mobile app that fetches and displays 150,000+ random poems from PoetryDB API using Flutter',
      'Constructed CRUD functionality using SQL in SQLite database for storing user-favorited poems and authors',
      'Integrated local storage for offline access to saved poems and optimized async API calls, reducing latency',
    ],
    github: 'https://github.com/vinnyh125/strophe-mobile',
  },
  {
    name: 'Fu-Wah Garden',
    stack: ['HTML', 'CSS', 'JavaScript'],
    bullets: [
      'Developed and designed official website for Fu-Wah Chinese Restaurant',
      'Optimized SEO, obtaining 20,000+ monthly page views and 7.8% conversion rate',
      'Drove 12% more traffic to Doordash page, yielding $1,800+ additional monthly revenue',
    ],
    github: 'https://github.com/vinnyh125/fuwah',
    live: 'https://www.fuwahgarden.com/',
  },
];
