// src/data/skills.ts
export interface SkillGroup {
  label: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  {
    label: 'Languages',
    items: ['Python', 'JavaScript', 'Java', 'SQL', 'C', 'C++', 'OCaml', 'HTML & CSS'],
  },
  {
    label: 'Libraries & Frameworks',
    items: ['React', 'TypeScript', 'Next.js', 'Flutter', 'React Native', 'Flask', 'OpenCV', 'PyTorch'],
  },
  {
    label: 'Databases & Tools',
    items: ['AWS CDK', 'IAM', 'PostgreSQL', 'Docker', 'Firebase', 'Git', 'DynamoDB', 'Lambda', 'S3', 'API Gateway'],
  },
];
