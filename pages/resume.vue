<template>
  <div class="resume">
    <LabPageHeader eyebrow="Résumé" :title="resumeData.name" :intro="resumeData.title">
      <button type="button" class="lab-button no-print" :disabled="isDownloading" @click="downloadPDF">
        <Download v-if="!isDownloading" :size="18" aria-hidden="true" />
        <Loader2 v-else class="spin" :size="18" aria-hidden="true" />
        Download PDF
      </button>
    </LabPageHeader>

    <div id="resume-document" v-reveal class="doc lab-wrap">
      <!-- Who and how to reach -->
      <aside class="side" aria-label="Contact">
        <div class="card lab-card id-card" data-reveal>
          <img
            src="/assets/img/rakibul-hasan-passport-image.jpg" alt="Rakibul Hasan Rabbi" class="photo"
            width="96" height="96" loading="lazy" decoding="async"
          >
          <ul class="contact">
            <li>
              <Mail :size="16" aria-hidden="true" />
              <a :href="`mailto:${resumeData.email}`">{{ resumeData.email }}</a>
            </li>
            <li>
              <Phone :size="16" aria-hidden="true" />
              <a :href="`tel:${resumeData.phone.replace(/\s/g, '')}`">{{ resumeData.phone }}</a>
            </li>
            <li>
              <MapPin :size="16" aria-hidden="true" />
              <span>{{ resumeData.location }}</span>
            </li>
            <li>
              <Github :size="16" aria-hidden="true" />
              <a :href="`https://github.com/${resumeData.github}`" target="_blank" rel="noopener" data-cursor-label="Open ↗">github.com/{{ resumeData.github }}</a>
            </li>
            <li>
              <Linkedin :size="16" aria-hidden="true" />
              <a :href="`https://linkedin.com/in/${resumeData.linkedin}`" target="_blank" rel="noopener" data-cursor-label="Open ↗">linkedin.com/in/{{ resumeData.linkedin }}</a>
            </li>
          </ul>
        </div>
      </aside>

      <div class="main">
        <!-- Professional Summary -->
        <section class="card lab-card sec break-inside-avoid" aria-labelledby="r-summary" data-reveal>
          <h2 id="r-summary" class="sec-h lab-mono">Professional Summary</h2>
          <p class="summary">{{ resumeData.summary }}</p>
        </section>

        <!-- Technical Skills -->
        <section class="card lab-card sec break-inside-avoid" aria-labelledby="r-skills" data-reveal>
          <h2 id="r-skills" class="sec-h lab-mono">Technical Skills</h2>
          <dl class="skills">
            <div><dt>Languages:</dt><dd>{{ resumeData.skills.languages }}</dd></div>
            <div><dt>Frameworks:</dt><dd>{{ resumeData.skills.frameworks }}</dd></div>
            <div><dt>Databases:</dt><dd>{{ resumeData.skills.databases }}</dd></div>
            <div><dt>Tools &amp; Cloud:</dt><dd>{{ resumeData.skills.tools }}</dd></div>
          </dl>
        </section>

        <!-- Professional Experience -->
        <section class="sec" aria-labelledby="r-exp">
          <h2 id="r-exp" class="sec-h lab-mono out" data-reveal>Professional Experience</h2>
          <article v-for="(job, index) in resumeData.experience" :key="index" class="card lab-card job break-inside-avoid" data-reveal>
            <div class="job-head">
              <div>
                <h3 class="job-t">{{ job.position }}</h3>
                <p class="job-co">{{ job.company }} · <span>{{ job.location }}</span></p>
              </div>
              <span class="lab-pill">{{ job.period }}</span>
            </div>
            <ul class="tasks">
              <li v-for="(task, tIndex) in job.responsibilities" :key="tIndex">{{ task }}</li>
            </ul>
          </article>
        </section>

        <!-- Education -->
        <section class="card lab-card sec break-inside-avoid" aria-labelledby="r-edu" data-reveal>
          <h2 id="r-edu" class="sec-h lab-mono">Education</h2>
          <div v-for="(edu, index) in resumeData.education" :key="index" class="edu">
            <div class="job-head">
              <h3 class="job-t">{{ edu.degree }}</h3>
              <span class="lab-pill">{{ edu.period }}</span>
            </div>
            <p class="job-co">{{ edu.institution }}</p>
          </div>
        </section>

        <!-- Notable Projects (Key Projects) -->
        <section class="sec" aria-labelledby="r-proj">
          <h2 id="r-proj" class="sec-h lab-mono out" data-reveal>Key Projects</h2>
          <ul class="projects">
            <li v-for="(project, index) in resumeData.projects" :key="index" class="card lab-card project break-inside-avoid" data-reveal>
              <h3 class="job-t">{{ project.name }}</h3>
              <p class="tech">{{ project.technologies }}</p>
              <p class="desc">{{ project.description }}</p>
              <a v-if="project.url" :href="project.url" target="_blank" rel="noopener" class="url" data-cursor-label="Open ↗">
                {{ project.url }}<span class="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Download, Phone, Mail, Github, Linkedin, MapPin, Loader2 } from 'lucide-vue-next'

const isDownloading = ref(false)

const resumeData = {
  name: 'Rakibul Hasan Rabbi',
  title: 'Full-Stack Software Developer',
  email: 'rakibul.cse.47@gmail.com',
  phone: '+880 1581 500678',
  location: 'Dhaka, Bangladesh',
  github: 'FullstackRakibul',
  linkedin: 'fullstackrakibul',
  summary: 'Full-Stack Software Developer with experience building scalable enterprise software solutions using .NET, SQL Server, React, Angular, and Vue.js. Currently working with one of Bangladesh’s largest clothing export companies, maintaining core business systems including HRM, payroll, and production management platforms. Skilled at transforming complex business workflows into efficient and user-friendly applications. Passionate about clean architecture, database optimization, and building reliable enterprise systems. Currently expanding expertise in cloud technologies such as AWS and Azure.',
  skills: {
    languages: 'C#, JavaScript, TypeScript, Python, PHP',
    frameworks: '.NET / ASP.NET / ASP.NET Core, React, Vue.js, Angular, Laravel, Entity Framework',
    databases: 'Microsoft SQL Server, MySQL, PostgreSQL',
    tools: 'Git, IIS, SQL Server Management Studio, WordPress, Shopify, Webflow, Bubble.io, AWS (learning), Azure (learning)'
  },
  experience: [
    {
      company: 'Ha-Meem Group',
      position: 'Software Support Engineer',
      period: 'Nov 2023 – Present',
      location: 'Dhaka, Bangladesh',
      responsibilities: [
        'Maintain and optimize enterprise ERP systems used for HRM, payroll, and production management.',
        'Develop and support internal software solutions using ASP.NET MVC, React.js, and SQL Server.',
        'Manage and optimize large-scale databases using Microsoft SQL Server Management Studio.',
        'Monitor and maintain Windows Server and IIS infrastructure to ensure system stability.',
        'Improved operational efficiency by resolving system bottlenecks and supporting business-critical applications.'
      ]
    },
    {
      company: 'bdCalling IT Ltd',
      position: 'Web Developer',
      period: 'Aug 2023 – Nov 2023',
      location: 'Dhaka, Bangladesh',
      responsibilities: [
        'Developed and maintained websites using WordPress, Shopify, Wix, and Webflow.',
        'Built dynamic business websites and CMS platforms for international clients.',
        'Implemented responsive UI designs and improved website performance.'
      ]
    },
    {
      company: 'Global IT Solutions',
      position: 'Project Manager',
      period: 'Jun 2023 – Aug 2023',
      location: 'Dhaka, Bangladesh',
      responsibilities: [
        'Managed development teams delivering Laravel, Vue.js, and WordPress projects.',
        'Designed database structures and coordinated backend development.',
        'Oversaw project delivery timelines and client communication.'
      ]
    },
    {
      company: 'Creative Tech Park',
      position: 'Web Developer',
      period: 'Jul 2022 – Jul 2023',
      location: 'Dhaka, Bangladesh',
      responsibilities: [
        'Developed web applications using Laravel, Vue.js, PHP, and MySQL.',
        'Implemented database design and version control using Git.',
        'Delivered multiple business and e-commerce platforms.'
      ]
    }
  ],
  education: [
    {
      degree: 'Bachelor of Science in Computer Science & Engineering',
      institution: 'City University, Bangladesh',
      period: 'Graduated'
    }
  ],
  projects: [
    {
      name: 'Calcifer Microservice API Template',
      technologies: 'C#, .NET, NuGet',
      description: 'Microservice API template for .NET Core.',
      url: 'https://www.nuget.org/packages/Calcifer.Microservice.Api.Template'
    },
    {
      name: 'Channel 24 CRM',
      technologies: 'Vue, Admin Panel',
      description: 'Administrative CRM panel designed for managing operations and internal processes.',
      url: 'https://panel-ch24.vercel.app/#/login'
    },
    {
      name: 'Ha-Meem Group',
      technologies: 'Vue, Nuxt',
      description: 'Enterprise corporate portal showcasing large scale manufacturing operations.',
      url: 'https://ha-meemgroup.vercel.app/'
    },
    {
      name: 'Shobdo Bisharod',
      technologies: 'Vue, Nuxt, Node',
      description: 'Dynamic educational web application tool.',
      url: 'https://shobdo-bisharod21.vercel.app'
    }
  ]
}

const downloadPDF = () => {
  isDownloading.value = true
  setTimeout(() => {

    window.print()
    isDownloading.value = false
  }, 150)
}

useHead({
  title: `${resumeData.name} - Resume`,
  meta: [
    { name: 'description', content: `Professional ATS-friendly resume of ${resumeData.name}, ${resumeData.title}` }
  ]
})
</script>

<style scoped>
.doc {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--gap);
  align-items: start;
}
.side { grid-column: 1 / span 4; position: sticky; top: calc(var(--header-h-tight) + 24px); }
.main { grid-column: 5 / -1; display: grid; gap: var(--gap); min-width: 0; }
.card { padding: clamp(20px, 2.6vw, 32px); }

.id-card { display: grid; gap: var(--s-5); }
.photo {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  border: 2px solid var(--mint);
  object-fit: cover;
  object-position: 50% 22%;
}
.contact { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--s-3); font-size: 15px; }
.contact li { display: grid; grid-template-columns: 16px minmax(0, 1fr); gap: var(--s-3); align-items: center; }
.contact svg { color: var(--mint); }
.contact a { color: var(--ink); overflow-wrap: anywhere; text-decoration: underline; text-decoration-color: var(--line-strong); text-underline-offset: 0.25em; }
.contact a:hover { color: var(--mint); text-decoration-color: currentColor; }

.sec { display: grid; gap: var(--gap); }
.card.sec { gap: 0; }
.sec-h { color: var(--mint); font-size: 12px; margin-bottom: var(--s-4); }
.sec-h.out { margin-bottom: 0; }
.summary { font-size: var(--step-body); line-height: 1.65; }

.skills { margin: 0; display: grid; gap: var(--s-3); font-size: 16px; }
.skills div { display: grid; grid-template-columns: 9.5rem minmax(0, 1fr); gap: var(--s-4); }
.skills dt { font-weight: 600; }
.skills dd { margin: 0; color: var(--muted); }

.job-head { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: var(--s-2) var(--s-4); }
.job-t { font: 600 19px / 1.3 var(--font-text); letter-spacing: -0.01em; }
.job-co { margin-top: 4px; font-size: 15px; font-weight: 600; color: var(--muted); }
.job-co span { font-weight: 400; }
.tasks { margin: var(--s-4) 0 0; padding-left: 1.2em; display: grid; gap: var(--s-2); font-size: 16px; line-height: 1.55; }
.tasks li::marker { color: var(--mint); }
.edu + .edu { margin-top: var(--s-4); }

.projects { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--gap); }
.project { display: flex; flex-direction: column; gap: var(--s-2); min-width: 0; }
.tech { font-size: 14px; color: var(--muted); font-style: italic; }
.desc { font-size: 16px; }
.url { margin-top: auto; padding-top: var(--s-2); color: var(--mint); font-size: 14px; overflow-wrap: anywhere; }

.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .spin { animation: none; } }

@media (max-width: 899px) {
  .doc { grid-template-columns: 1fr; row-gap: var(--gap); }
  .side, .main { grid-column: 1; }
  .side { position: static; }
  .projects { grid-template-columns: 1fr; }
}
@media (max-width: 479px) {
  .skills div { grid-template-columns: 1fr; gap: 2px; }
}

/* Paper: the printed résumé is a plain, single-column, black-on-white document (ATS-friendly). */
@media print {
  .resume :deep(.ph) { padding: 0 0 12pt; }
  .resume :deep(.ph .floor),
  .resume :deep(.ph .eyebrow),
  .no-print { display: none !important; }
  .resume :deep(.ph .title) { font-size: 24pt; letter-spacing: 0; max-width: none; }
  .resume :deep(.ph .intro) { margin-top: 4pt; font-size: 11pt; }
  .doc, .main { display: block; width: auto; }
  .side { position: static; margin-bottom: 12pt; }
  .card {
    padding: 0 !important;
    margin-bottom: 14pt;
    background: none !important;
    border: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important; /* taste-skill-ignore: removes the card shadow on paper */
  }
  .id-card { display: block; }
  .photo { display: none; }
  .contact { display: flex; flex-wrap: wrap; gap: 4pt 14pt; font-size: 9.5pt; }
  .contact li { display: block; }
  .contact svg { display: none; }
  .contact a { text-decoration: none; }
  .sec-h { font-family: inherit; font-size: 11pt; letter-spacing: 0.06em; border-bottom: 1px solid #000; padding-bottom: 3pt; margin-bottom: 8pt; } /* taste-skill-ignore: section rules on the printed résumé, as before */
  .summary, .tasks, .skills, .desc { font-size: 10pt; }
  .projects { display: block; }
  .project { margin-bottom: 10pt; }
  .lab-pill { border: 0; padding: 0; font-style: italic; }
}
</style>

<style>
/* Global print styles to enforce ATS-friendly clean PDF generation */
@media print {
  @page {
    size: A4;
    margin: 15mm 15mm 15mm 15mm;
    margin-header: 0mm;
    margin-footer: 0mm;
  }

  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    background-color: white !important;
  }

  /* Hide navigation, footers, and interactive elements */
  nav,
  footer,
  .print\:hidden {
    display: none !important;
  }

  /* Prevent awkward page breaks inside core sections */
  .break-inside-avoid {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  h1,
  h2,
  h3,
  h4 {
    page-break-after: avoid;
    break-after: avoid;
  }

  /* Ensure text is standard black for parsers */
  * {
    color: #000 !important;
  }

  /* Additional rule to hide browser-generated content */
  body::before,
  body::after,
  header::before,
  header::after,
  footer::before,
  footer::after,
  #resume-document::before,
  #resume-document::after {
    display: none !important;
    content: none !important;
  }

  /* Your existing print styles remain below */
  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    background-color: white !important;
  }

  /* Hide navigation, footers, and interactive elements */
  nav,
  footer,
  .print\:hidden {
    display: none !important;
  }


  /* Prevent awkward page breaks inside core sections */
  .break-inside-avoid {
    break-inside: avoid;
    page-break-inside: avoid;
  }
}
</style>