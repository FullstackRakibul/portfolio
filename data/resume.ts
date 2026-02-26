export interface Contact {
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  location: string;
}

export interface ExperienceItem {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  description: string[];
  skills?: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  field: string;
  graduationDate: string;
  cgpa?: number;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface ResumeData {
  name: string;
  title: string;
  summary: string;
  contact: Contact;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
}

export const RESUME_DATA: ResumeData = {
  name: "Rakibul Hasan",
  title: "Software Engineer | Full-Stack Developer",
  summary: "Expert in .NET Core, Clean Architecture, and SQL Server for ERP and HRM systems. Full-Stack Engineer with 6+ years of experience delivering 40+ web projects using Vue, Nuxt, Angular, and React. Specialized in building high-performance enterprise solutions with scalable backend systems.",

  contact: {
    phone: "+880-1581500678",
    email: "rakibul.cse.47@gmail.com",
    linkedin: "rakibul-sapio",
    github: "FullstackRakibul",
    location: "N/S Road-01, Block #A, Banasree, Dhaka",
  },

  experience: [
    {
      title: "Software Engineer",
      company: "HA-MEEM GROUP",
      location: "Dhaka, Bangladesh",
      startDate: "Nov 2023",
      endDate: "Present",
      current: true,
      description: [
        "Develop and maintain enterprise web applications using ASP.NET Core and C#",
        "Design scalable backend systems following Clean Architecture principles",
        "Manage and optimize SQL Server databases for performance and security",
        "Automate internal processes to improve operational efficiency",
        "Troubleshoot complex system issues and support cross-functional teams",
        "Maintain HRM/Production systems for 85,000+ users",
      ],
      skills: ["ASP.NET Core", "C#", "SQL Server", "Vue.js", "Angular", "Clean Architecture", "Microservices"],
    },
    {
      title: "Web Programmer",
      company: "bdCalling IT Ltd",
      location: "Dhaka, Bangladesh",
      startDate: "Aug 2023",
      endDate: "Oct 2023",
      description: [
        "Collaborated with cross-functional teams including project managers, designers, and developers",
        "Understood requirements and delivered high-quality software solutions",
        "Worked with .NET Framework for enterprise applications",
      ],
      skills: [".NET Framework", "C#"],
    },
    {
      title: "Project Manager",
      company: "Global IT Solutions",
      location: "Dhaka, Bangladesh",
      startDate: "May 2023",
      endDate: "Jul 2023",
      description: [
        "Managed software projects and technical documentation",
        "Oversaw database management and project risk assessment",
        "Coordinated between development teams and stakeholders",
      ],
      skills: ["Project Management", "Database Management", "Risk Management"],
    },
    {
      title: "Junior Software Engineer",
      company: "Self-Employed/Contract Work",
      location: "Bangladesh",
      startDate: "Jul 2022",
      endDate: "Jul 2023",
      description: [
        "Developed web applications using Laravel and Vue.js stack",
        "Optimized WordPress installations and implemented custom plugins",
        "Built responsive and performant user interfaces",
      ],
      skills: ["Laravel", "Vue.js", "WordPress", "PHP", "MySQL"],
    },
  ],

  education: [
    {
      degree: "BSc",
      institution: "City University",
      field: "Computer Science and Engineering",
      graduationDate: "2022",
      cgpa: 3.33,
    },
  ],

  skills: [
    {
      category: "Backend Development",
      skills: ["ASP.NET Core", "C#", ".NET Framework", "Laravel", "Django", "Node.js"],
    },
    {
      category: "Frontend Development",
      skills: ["Vue.js", "Nuxt", "React", "Angular", "AngularJS", "JavaScript"],
    },
    {
      category: "Databases & Infrastructure",
      skills: ["SQL Server", "MySQL", "MongoDB", "PostgreSQL", "Windows Infrastructure"],
    },
    {
      category: "Tools & Technologies",
      skills: ["Docker", "Git", "GitHub", "REST APIs", "Minimal APIs", "Clean Architecture"],
    },
    {
      category: "Other Skills",
      skills: ["UI/UX Engineering", "Cloud-Native Solutions", "CMS", "PHP"],
    },
  ],
};
