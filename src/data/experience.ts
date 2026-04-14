// src/data/experience.ts
export interface Entry {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
  link?: string;
}

export const experience: Entry[] = [
  {
    company: 'Amazon',
    role: 'Software Development Intern',
    period: 'May 2025 – Aug. 2025',
    location: 'Austin, Texas',
    link: 'https://amazon.com',
    bullets: [
      'Built full-stack self-service tool (React, TypeScript, Lambda, S3, API Gateway) enabling product and legal teams to customize consent prompt ordering directly on Amazon.com without engineering intervention',
      'Refactored Tier-1 service delivering cookie consent banners to 300M+ users, streamlined compliance across regions',
      'Improved operational efficiency by 95%, cutting configuration turnaround from 3 weeks to 1 day and eliminating recurring engineering overhead',
    ],
  },
  {
    company: 'Cornell University',
    role: 'CS 4414 Teaching Assistant',
    period: 'May 2025 – Present',
    location: 'Ithaca, New York',
    bullets: [
      'Holding weekly office hours to help 400+ students with systems programming and cloud computing using C++',
      'Providing technical support and guidance on C++, Linux tools, memory management, multi-threading, and CUDA',
      'Built 100+ Dockerized C++ tests for course autograder, ensuring accurate evaluation and reducing grading overhead',
    ],
  },
  {
    company: 'Hyphenova',
    role: 'Software Engineering Intern',
    period: 'May 2024 – Aug. 2024',
    location: 'Los Angeles, California',
    link: 'https://hyphenova.com',
    bullets: [
      "Migrated 70-person startup's codebase to React/Next.js, cutting load times 30% and reducing onboarding by 40%",
      'Developed and launched 3 marketing landing pages in React for VidCon 2024, driving 5,000+ new user sign-ups',
      'Implemented secure React Native login/signup with PostgreSQL backend, launching to 800+ users across the world',
    ],
  },
  {
    company: 'The Cai Lab: Neural Development, Injury and Diseases',
    role: 'Visiting Scholar',
    period: 'June 2024 – Sep. 2024',
    location: 'Piscataway, New Jersey',
    link: 'https://sites.rutgers.edu/cailab/about/',
    bullets: [
      'Developed Python algorithm to filter out unwanted waves from 100gb+ of scotopic data with 92% accuracy',
      'Implemented data visualizations comparing wave smoothing parameters using Pandas and Matplotlib',
      'Assessed gene therapy impact by using R to visualize and classify 300gb+ of animal recovery cell samples',
    ],
  },
  {
    company: 'Fu-Wah Garden Inc.',
    role: 'Front-End Developer Intern',
    period: 'May 2023 – Aug. 2023',
    location: 'Ewing, New Jersey',
    link: 'https://www.fuwahgarden.com/',
    bullets: [
      'Developed and designed official website for Fu-Wah Chinese Restaurant using HTML, CSS, and JavaScript',
      'Optimized search engine visibility, obtaining 20,000+ monthly page views resulting in 7.8% conversion rate',
      'Improved online presence, driving 12% more traffic to Doordash page yielding additional $1,800+ monthly revenue',
    ],
  },
];
