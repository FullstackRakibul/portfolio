<template>
  <div
    class="pt-20 min-h-screen overflow-y-scroll bg-gray-100 py-10 px-4 sm:px-6 lg:px-8 print:py-0 print:px-0 print:bg-white text-gray-900 font-sans">
    <!-- Download button (unchanged) -->
    <div class="max-w-4xl fixed right-10 bottom-10 mx-auto flex justify-end mb-6 print:hidden">
      <button @click="downloadPDF" :disabled="isDownloading"
        class="flex items-center gap-2 bg-[#1C2333] hover:bg-secondary/80 text-white p-2 rounded-full font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
        <Download v-if="!isDownloading" class="w-5 h-5" />
        <Loader2 v-else class="w-5 h-5 animate-spin" />
      </button>
    </div>

    <main id="resume-document"
      class="max-w-4xl mx-auto bg-white p-12 sm:p-16 shadow-xl print:shadow-none print:p-0 print:m-0">
      <header class="border-b-2 border-gray-800 pb-6 mb-8">
        <!-- Top row: name/title + photo -->
        <div class="flex flex-row justify-between items-start gap-4 mb-4">
          <div>
            <h1 class="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight uppercase">
              {{ resumeData.name }}
            </h1>
            <h2 class="text-sm text-gray-700 font-semibold uppercase tracking-wider">
              {{ resumeData.title }}
            </h2>
          </div>
          <!-- Professional headshot -->
          <img src="../public/assets/img/rakibul-hasan-passport-image.jpg" alt="Rakibul Hasan Rabbi"
            class="w-20 h-20 sm:w-20 sm:h-20 rounded-full border-2 border-gray-300 shadow-sm " />
        </div>

        <!-- Contact details row (unchanged) -->

        <div class="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-600">
          <div class="flex items-center gap-1.5">
            <Mail class="w-4 h-4 text-gray-500" />
            <a :href="`mailto:${resumeData.email}`" class="hover:text-blue-600">{{ resumeData.email }}</a>
          </div>
          <div class="flex items-center gap-1.5">
            <Phone class="w-4 h-4 text-gray-500" />
            <a :href="`tel:${resumeData.phone.replace(/\s/g, '')}`" class="hover:text-blue-600">{{ resumeData.phone
            }}</a>
          </div>
          <div class="flex items-center gap-1.5">
            <MapPin class="w-4 h-4 text-gray-500" />
            <span>{{ resumeData.location }}</span>
          </div>
          <div class="flex items-center gap-1.5">
            <Github class="w-4 h-4 text-gray-500" />
            <a :href="`https://github.com/${resumeData.github}`" target="_blank"
              class="hover:text-blue-600">github.com/{{ resumeData.github }}</a>
          </div>
          <!-- New LinkedIn link -->
          <div class="flex items-center gap-1.5">
            <Linkedin class="w-4 h-4 text-gray-500" />
            <a :href="`https://linkedin.com/in/${resumeData.linkedin}`" target="_blank"
              class="hover:text-blue-600">linkedin.com/in/{{ resumeData.linkedin }}</a>
          </div>
        </div>
      </header>

      <!-- Professional Summary -->
      <section class="mb-8 print:mb-6">
        <h3 class="text-lg font-bold text-gray-900 border-b border-gray-300 mb-3 uppercase tracking-wider pb-1">
          Professional Summary</h3>
        <p class="text-gray-700 leading-relaxed text-sm sm:text-base">
          {{ resumeData.summary }}
        </p>
      </section>

      <!-- Technical Skills -->
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

      <!-- Professional Experience -->
      <section class="mb-8 print:mb-6">
        <h3 class="text-lg font-bold text-gray-900 border-b border-gray-300 mb-4 uppercase tracking-wider pb-1">
          Professional Experience</h3>
        <div class="space-y-6">
          <div v-for="(job, index) in resumeData.experience" :key="index" class="break-inside-avoid">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
              <div>
                <h4 class="text-base font-bold text-gray-900">{{ job.position }}</h4>
                <div class="text-sm font-semibold text-gray-700">{{ job.company }} • <span class="font-normal">{{
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

      <!-- Education -->
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

      <!-- Notable Projects (Key Projects) -->
      <section class="mb-8 print:mb-0 break-inside-avoid">
        <h3 class="text-lg font-bold text-gray-900 border-b border-gray-300 mb-4 uppercase tracking-wider pb-1">
          Key Projects</h3>
        <div class="space-y-4">
          <div v-for="(project, index) in resumeData.projects" :key="index">
            <div class="flex items-baseline gap-2 mb-1">
              <h4 class="text-base font-bold text-gray-900">{{ project.name }}</h4>
              <span class="text-gray-400 text-sm">|</span>
              <span class="text-sm text-gray-600 italic">{{ project.technologies }}</span>
            </div>
            <p class="text-sm text-gray-700 leading-relaxed">{{ project.description }}</p>
            <a v-if="project.url" :href="project.url" target="_blank"
              class="text-xs text-blue-600 hover:underline inline-block mt-1">
              {{ project.url }}
            </a>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useHead } from '#app'
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

  /* Retain border lines for visual separation */
  .border-b {
    border-bottom-color: #000 !important;
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