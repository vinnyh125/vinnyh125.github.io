// src/data/leadership.ts
import type { Entry } from './experience';

export const leadership: Entry[] = [
  {
    company: 'Cornell Nexus Project Team',
    role: 'Software Team Lead',
    period: 'Dec. 2023 – Present',
    location: 'Ithaca, New York',
    link: 'https://www.cornellnexus.com/',
    bullets: [
      'Led 40-person team responsible for obstacle detection & avoidance algorithms in autonomous robotic beach cleanup',
      'Spearheaded website redesign, increasing traffic from 1,000 to 4,000+ monthly visits and improving recruitment effort',
      'Developed GPS-RTK script in ROS2 to transmit obstacle avoidance and locational data with <4 centimeter precision',
    ],
  },
];
