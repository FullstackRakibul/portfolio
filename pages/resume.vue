<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900">
    <!-- Resume Container -->
    <div id="resume-content" class="max-w-4xl mx-auto p-8 bg-white shadow-lg print:shadow-none print:p-0 print:bg-white">
      <!-- Header Section -->
      <header class="mb-8 pb-8 border-b-2 border-indigo-200 print:border-gray-300">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h1 class="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
              {{ resumeData.name }}
            </h1>
            <p class="text-xl text-indigo-600 font-semibold">{{ resumeData.title }}</p>
          </div>
        </div>
        
        <!-- Contact Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700">
          <div class="flex items-center gap-2">
            <PhoneIcon :size="16" class="text-indigo-600 flex-shrink-0" />
            <a :href="`tel:${resumeData.contact.phone}`" class="hover:text-indigo-600">
              {{ resumeData.contact.phone }}
            </a>
          </div>
          <div class="flex items-center gap-2">
            <MailIcon :size="16" class="text-indigo-600 flex-shrink-0" />
            <a :href="`mailto:${resumeData.contact.email}`" class="hover:text-indigo-600">
              {{ resumeData.contact.email }}
            </a>
          </div>
          <div class="flex items-center gap-2">
            <LinkedinIcon :size="16" class="text-indigo-600 flex-shrink-0" />
            <span>linkedin.com/in/{{ resumeData.contact.linkedin }}</span>
          </div>
          <div class="flex items-center gap-2">
            <GithubIcon :size="16" class="text-indigo-600 flex-shrink-0" />
            <span>github.com/{{ resumeData.contact.github }}</span>
          </div>
          <div class="col-span-1 md:col-span-2 flex items-center gap-2">
            <MapPinIcon :size="16" class="text-indigo-600 flex-shrink-0" />
            <span>{{ resumeData.contact.location }}</span>
          </div>
        </div>
      </header>

      <!-- Professional Summary -->
      <section class="mb-8">
        <h2 class="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
          <BriefcaseIcon :size="24" class="text-indigo-600" />
          Professional Summary
        </h2>
        <p class="text-slate-700 leading-relaxed">{{ resumeData.summary }}</p>
      </section>

      <!-- Experience Section -->
      <section class="mb-8">
        <h2 class="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <WorkIcon :size="24" class="text-indigo-600" />
          Experience
        </h2>
        <div class="space-y-6">
          <article
            v-for="(job, index) in resumeData.experience"
            :key="index"
            class="border-l-4 border-indigo-300 pl-4"
          >
            <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2">
              <div>
                <h3 class="text-xl font-bold text-slate-900">{{ job.title }}</h3>
                <p class="text-indigo-600 font-semibold">{{ job.company }}</p>
              </div>
              <div class="text-sm text-slate-600 font-medium">
                <p>{{ job.startDate }} – {{ job.current ? 'Present' : job.endDate }}</p>
                <p class="text-slate-500">{{ job.location }}</p>
              </div>
            </div>
            
            <ul class="list-disc list-inside space-y-1 text-slate-700 text-sm mb-3">
              <li v-for="(desc, i) in job.description" :key="i">{{ desc }}</li>
            </ul>
            
            <div v-if="job.skills" class="flex flex-wrap gap-2">
              <span
                v-for="skill in job.skills"
                :key="skill"
                class="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold"
              >
                {{ skill }}
              </span>
            </div>
          </article>
        </div>
      </section>

      <!-- Education Section -->
      <section class="mb-8">
        <h2 class="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <GraduationCapIcon :size="24" class="text-indigo-600" />
          Education
        </h2>
        <article v-for="(edu, index) in resumeData.education" :key="index" class="border-l-4 border-indigo-300 pl-4">
          <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
            <div>
              <h3 class="text-lg font-bold text-slate-900">
                {{ edu.degree }} in {{ edu.field }}
              </h3>
              <p class="text-indigo-600 font-semibold">{{ edu.institution }}</p>
            </div>
            <div class="text-sm text-slate-600 font-medium">
              <p>{{ edu.graduationDate }}</p>
              <p v-if="edu.cgpa" class="text-slate-500">CGPA: {{ edu.cgpa }}</p>
            </div>
          </div>
        </article>
      </section>

      <!-- Skills Section -->
      <section class="mb-8">
        <h2 class="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <ZapIcon :size="24" class="text-indigo-600" />
          Technical Skills
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="skillGroup in resumeData.skills"
            :key="skillGroup.category"
            class="border-l-4 border-indigo-300 pl-4"
          >
            <h3 class="font-bold text-slate-900 mb-3">{{ skillGroup.category }}</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="skill in skillGroup.skills"
                :key="skill"
                class="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Languages Section -->
      <section>
        <h2 class="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <GlobeIcon :size="24" class="text-indigo-600" />
          Languages
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="border-l-4 border-indigo-300 pl-4">
            <p class="font-semibold text-slate-900">Bangla</p>
            <p class="text-slate-600 text-sm">Native / Fluent</p>
          </div>
          <div class="border-l-4 border-indigo-300 pl-4">
            <p class="font-semibold text-slate-900">English</p>
            <p class="text-slate-600 text-sm">Professional Fluency</p>
          </div>
        </div>
      </section>
    </div>

    <!-- Floating Download Button -->
    <button
      @click="downloadPDF"
      class="print:hidden fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 z-50 hover:scale-110 active:scale-95"
      :class="{ 'opacity-50 cursor-not-allowed': isDownloading }"
      :disabled="isDownloading"
      title="Download as PDF"
    >
      <DownloadIcon :size="24" class="animate-pulse hover:animate-none" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RESUME_DATA } from '~/data/resume'
import {
  BriefcaseIcon,
  DownloadIcon,
  GithubIcon,
  GlobeIcon,
  GraduationCapIcon,
  LinkedinIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  WorkIcon,
  ZapIcon,
} from 'lucide-vue-next'

const resumeData = RESUME_DATA
const isDownloading = ref(false)

const downloadPDF = async () => {
  isDownloading.value = true
  
  try {
    // Use native browser print-to-PDF functionality
    window.print()
  } catch (error) {
    console.error('Error downloading PDF:', error)
  } finally {
    isDownloading.value = false
  }
}

useHead({
  title: `${RESUME_DATA.name} - Resume`,
  meta: [
    {
      name: 'description',
      content: `Professional resume of ${RESUME_DATA.name}, ${RESUME_DATA.title}`,
    },
  ],
})
</script>

<style scoped>
/* Print Styles */
@media print {
  ::-webkit-scrollbar {
    display: none;
  }

  body,
  html {
    background: white !important;
  }

  #resume-content {
    max-width: 100%;
    box-shadow: none;
    padding: 0.5in;
    margin: 0;
  }

  /* Prevent page breaks inside sections */
  section {
    page-break-inside: avoid;
  }

  article {
    page-break-inside: avoid;
  }

  /* Remove links underline in print */
  a {
    text-decoration: none;
    color: inherit;
  }

  /* Adjust colors for print */
  .text-indigo-600 {
    color: #4f46e5;
  }

  .bg-indigo-100 {
    background-color: #e0e7ff;
    color: #4f46e5;
  }

  .border-indigo-300 {
    border-color: #a5b4fc;
  }

  /* Ensure proper sizing for print */
  @page {
    margin: 0.5in;
    size: letter;
  }
}

/* Hide button during print */
@media print {
  .print\:hidden {
    display: none !important;
  }
}

/* Smooth animations */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.hover\:animate-none:hover {
  animation: none;
}
</style>
