<template>
  <div
    class="pt-20 min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8 print:py-0 print:px-0 print:bg-white text-gray-900 font-sans">

    <div class="max-w-4xl fixed right-10 bottom-10 mx-auto flex justify-end mb-6 print:hidden">
      <button @click="downloadPDF" :disabled="isDownloading"
        class="flex  items-center gap-2 bg-[#1C2333] hover:bg-secondary/80 text-white p-2 rounded-full font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
        <Download v-if="!isDownloading" class="w-5 h-5" />
        <Loader2 v-else class="w-5 h-5 animate-spin" />
        {{ isDownloading ? '' : '' }}
      </button>
    </div>

    <main id="resume-document"
      class="max-w-4xl mx-auto bg-white p-12 sm:p-16 shadow-xl print:shadow-none print:p-0 print:m-0">

      <header class="border-b-2 border-gray-800 pb-6 mb-8">
        <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-2 tracking-tight uppercase">
          {{ resumeData.name }}
        </h1>
        <h2 class="text-xl text-gray-700 font-semibold mb-4 uppercase tracking-wider">
          {{ resumeData.title }}
        </h2>

        <div class="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-600">
          <div class="flex items-center gap-1.5">
            <Mail class="w-4 h-4 text-gray-500" />
            <a :href="`mailto:${resumeData.email}`" class="hover:text-blue-600">{{ resumeData.email }}</a>
          </div>
          <div class="flex items-center gap-1.5">
            <Phone class="w-4 h-4 text-gray-500" />
            <a :href="`tel:${resumeData.phone.replace(/\\s/g, '')}`" class="hover:text-blue-600">{{ resumeData.phone
            }}</a>
          </div>
          <div class="flex items-center gap-1.5">
            <MapPin class="w-4 h-4 text-gray-500" />
            <span>{{ resumeData.location }}</span>
          </div>
          <!-- <div class="flex items-center gap-1.5">
            <Globe class="w-4 h-4 text-gray-500" />
            <a :href="`https://${resumeData.portfolio}`" target="_blank" class="hover:text-blue-600">{{
              resumeData.portfolio }}</a>
          </div> -->
          <div class="flex items-center gap-1.5">
            <Github class="w-4 h-4 text-gray-500" />
            <a :href="`https://github.com/${resumeData.github}`" target="_blank"
              class="hover:text-blue-600">github.com/{{ resumeData.github }}</a>
          </div>
        </div>
      </header>

      <section class="mb-8 print:mb-6">
        <h3 class="text-lg font-bold text-gray-900 border-b border-gray-300 mb-3 uppercase tracking-wider pb-1">
          Professional Summary</h3>
        <p class="text-gray-700 leading-relaxed text-sm sm:text-base">
          {{ resumeData.summary }}
        </p>
      </section>

      <section class="mb-8 print:mb-6">
        <h3 class="text-lg font-bold text-gray-900 border-b border-gray-300 mb-3 uppercase tracking-wider pb-1">
          Technical Skills</h3>
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-2 text-sm text-gray-700">
          <div class="font-semibold text-gray-900 sm:col-span-1">Languages:</div>
          <div class="sm:col-span-3">{{ resumeData.skills.languages }}</div>

          <div class="font-semibold text-gray-900 sm:col-span-1">Frameworks:</div>
          <div class="sm:col-span-3">{{ resumeData.skills.frameworks }}</div>

          <div class="font-semibold text-gray-900 sm:col-span-1">Databases:</div>
          <div class="sm:col-span-3">{{ resumeData.skills.databases }}</div>

          <div class="font-semibold text-gray-900 sm:col-span-1">Tools & Cloud:</div>
          <div class="sm:col-span-3">{{ resumeData.skills.tools }}</div>
        </div>
      </section>

      <section class="mb-8 print:mb-6">
        <h3 class="text-lg font-bold text-gray-900 border-b border-gray-300 mb-4 uppercase tracking-wider pb-1">
          Professional Experience</h3>

        <div class="space-y-6">
          <div v-for="(job, index) in resumeData.experience" :key="index" class="break-inside-avoid">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
              <div>
                <h4 class="text-base font-bold text-gray-900">{{ job.position }}</h4>
                <div class="text-sm font-semibold text-gray-700">{{ job.company }} &bull; <span class="font-normal">{{
                  job.location }}</span></div>
              </div>
              <div class="text-sm text-gray-600 font-medium mt-1 sm:mt-0 italic whitespace-nowrap">
                {{ job.period }}
              </div>
            </div>
            <ul class="list-disc list-outside ml-5 text-sm text-gray-700 space-y-1.5 leading-relaxed">
              <li v-for="(task, tIndex) in job.responsibilities" :key="tIndex" class="pl-1">
                {{ task }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section class="mb-8 print:mb-6 break-inside-avoid">
        <h3 class="text-lg font-bold text-gray-900 border-b border-gray-300 mb-4 uppercase tracking-wider pb-1">
          Education</h3>
        <div v-for="(edu, index) in resumeData.education" :key="index" class="mb-4 last:mb-0">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
            <h4 class="text-base font-bold text-gray-900">{{ edu.degree }}</h4>
            <div class="text-sm text-gray-600 font-medium italic whitespace-nowrap">{{ edu.period }}</div>
          </div>
          <div class="text-sm text-gray-700">{{ edu.institution }}</div>
        </div>
      </section>

      <section class="mb-8 print:mb-0 break-inside-avoid">
        <h3 class="text-lg font-bold text-gray-900 border-b border-gray-300 mb-4 uppercase tracking-wider pb-1">Notable
          Projects</h3>
        <div class="space-y-4">
          <div v-for="(project, index) in resumeData.projects" :key="index">
            <div class="flex items-baseline gap-2 mb-1">
              <h4 class="text-base font-bold text-gray-900">{{ project.name }}</h4>
              <span class="text-gray-400 text-sm">|</span>
              <span class="text-sm text-gray-600 italic">{{ project.technologies }}</span>
            </div>
            <p class="text-sm text-gray-700 leading-relaxed">{{ project.description }}</p>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useHead } from '#app'
import { Download, Phone, Mail, Github, Globe, MapPin, Loader2 } from 'lucide-vue-next'

const isDownloading = ref(false)

// Updated with your actual data for maximum context
const resumeData = {
  name: 'Rakibul Hasan Rabbi',
  title: 'Full-Stack Software Developer',
  email: 'rakibul.cse.47@gmail.com',
  phone: '+880 1581 500678',
  location: 'Dhaka, Bangladesh',
  github: 'FullstackRakibul',
  // portfolio: 'rabbitic.com',
  summary: 'Passionate and results-driven Full-Stack Software Developer with over 2 years of experience specializing in enterprise application development, systems architecture, and UI engineering. Proven track record in overseeing ERP modules, Windows-based services, and complex integrations to streamline production workflows. Adept at bridging the gap between technical infrastructure and human-centric design using modern frameworks and robust backend architectures.',
  skills: {
    languages: 'C#, JavaScript, TypeScript, Python, PHP',
    frameworks: '.NET, ASP.NET Core, MVC, React, Vue.js, Angular, Nuxt.js, Next.js, Laravel',
    databases: 'SQL Server, MySQL, PostgreSQL',
    tools: 'Git, Docker, IIS, Nginx, Azure, AWS, CI/CD, Azure DevOps'
  },
  experience: [
    {
      company: 'Ha-Meem Group',
      position: 'Software Support Engineer',
      period: 'Nov 2023 – Present',
      location: 'Dhaka, Bangladesh',
      responsibilities: [
        'Maintain and improve enterprise-grade ERP systems utilizing .NET and SQL Server to streamline corporate operations.',
        'Build scalable, performance-driven modules using ASP.NET Core, MVC, and React for cross-departmental functionality.',
        'Manage and optimize workflows across HRM, payroll, production, and financial systems.',
        'Administer Windows servers, IIS, and database infrastructure to ensure high availability and minimal downtime.',
        'Developed and deployed automated communication microservices, including a customized internal anniversary email service.'
      ]
    },
    {
      company: 'bdCalling IT Ltd',
      position: 'Web Developer',
      period: 'Aug 2023 – Nov 2023',
      location: 'Dhaka, Bangladesh',
      responsibilities: [
        'Developed and customized CMS-driven web applications utilizing WordPress, Webflow, Bubble.io, and Shopify.',
        'Ensured responsive design and optimal user experience across various device resolutions and platforms.'
      ]
    },
    {
      company: 'Global IT Solutions',
      position: 'Project Manager',
      period: 'Jun 2023 – Aug 2023',
      location: 'Dhaka, Bangladesh',
      responsibilities: [
        'Led cross-functional teams to deliver highly optimized Vue.js and Laravel-based web solutions on schedule.',
        'Focused on business logic modeling, robust backend API design, and seamless e-commerce integration.'
      ]
    },
    {
      company: 'Creative Tech Park',
      position: 'Web Developer & PM',
      period: 'Jul 2022 – Jul 2023',
      location: 'Dhaka, Bangladesh',
      responsibilities: [
        'Engineered full-stack web solutions utilizing Vue.js, Laravel, and MySQL environments.',
        'Managed entire development lifecycles from requirement gathering through deployment and client handover.'
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
      name: 'Rookie .NET Scaffolding CLI',
      technologies: '.NET, Angular, CLI Tools',
      description: 'Developed an advanced project scaffolding system that auto-generates a .NET API, a corresponding Angular administrative dashboard, and dedicated CLI commands for rapid enterprise development.'
    },
    {
      name: 'Calcifer Microservice API Template',
      technologies: '.NET, NuGet',
      description: 'Created and published an official open-source .NET microservice project template directly to NuGet to standardize API structures.'
    },
    {
      name: 'Channel 24 ERP / CRM',
      technologies: 'Vue.js, UX/UI',
      description: 'Implemented comprehensive UX updates and architectural restructuring for Times Media Limited\'s internal CRM and billing dashboard.'
    }
  ]
}

const downloadPDF = () => {
  isDownloading.value = true
  // Small delay to allow button state to update before the browser print dialog freezes the thread
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

<style>
/* Global print styles to enforce ATS-friendly clean PDF generation */
@media print {
  @page {
    size: A4;
    margin: 15mm 15mm 15mm 15mm;
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

  /* Retain border lines for visual separation */
  .border-b {
    border-bottom-color: #000 !important;
  }
}
</style>