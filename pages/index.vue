<template>
  <div class="relative">
    <!-- Hero Section with Enhanced Particle Name Animation -->
    <section class="relative min-h-screen">
      <EnhancedNameParticles />
      
    </section>
    <!-- About Section -->
    <section id="about" class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl sm:text-4xl font-bold mb-8 text-center">
          <span class="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">About Me</span>
        </h2>
        <div class="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
          <blockquote class="text-xl italic text-gray-300 mb-6 text-center">
            "The quiet architect of systems and spirit, a soul who sees code and cosmos as kin."
          </blockquote>
          <p class="text-gray-300 leading-relaxed mb-6">
            I'm Rakibul Hasan Rabbi – a passionate software developer with a strong focus on enterprise application
            development,
            UI engineering, and systems architecture. My current role at Hameem Group has me overseeing ERP modules,
            Windows-based services, HRM integrations, and production streamlining – all built using .NET, SQL Server,
            and modern JavaScript frameworks like React and Next.js.
          </p>
          <p class="text-gray-300 leading-relaxed mb-6">
            I've worn many hats across startups and agencies – from project management and UI/UX, to full-stack
            development
            and DevOps. Whether it's WordPress or ASP.NET Core, Vue.js or Angular – I make tools work together for
            humans,
            not the other way around.
          </p>
          <p class="text-gray-300 leading-relaxed">
            🔧 I'm currently deepening my expertise in Azure and AWS, preparing for the next leap into cloud-native
            development.
          </p>
        </div>
      </div>
    </section>

    <!-- Tech Stack Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl sm:text-4xl font-bold mb-12 text-center">
          <span class="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Tech Stack</span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TechCard title="Languages & Frameworks"
            :items="['C# / .NET / ASP.NET Core / MVC', 'JavaScript / TypeScript', 'React / Vue / Angular / Next.js', 'Python (Django) / PHP (Laravel, WordPress)']"
            icon="Code" />
          <TechCard title="Databases" :items="['SQL Server', 'MySQL', 'PostgreSQL']" icon="Database" />
          <TechCard title="CMS & Low-Code" :items="['WordPress', 'Webflow', 'Bubble.io', 'HubSpot', 'Wix', 'Shopify']"
            icon="Layout" />
          <TechCard title="Tools & DevOps"
            :items="['Git, GitHub, Bitbucket', 'IIS, Nginx, Docker', 'VS Code, Visual Studio', 'ClickUp, Trello, Jira']"
            icon="Settings" />
          <TechCard title="Cloud & Server"
            :items="['AWS (EC2, S3, RDS)', 'Azure (App Services, SQL)', 'Windows Server, IIS', 'cPanel']"
            icon="Cloud" />
        </div>
      </div>
    </section>

    <!-- Experience Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl sm:text-4xl font-bold mb-12 text-center">
          <span class="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Experience</span>
        </h2>
        <div class="space-y-8">
          <ExperienceCard company="Hameem Group" position="Software Support Engineer" period="Nov 2023 – Present"
            location="Dhaka, Bangladesh" :responsibilities="[
              'Maintained & improved enterprise ERP systems with .NET and SQL Server',
              'Built scalable, performance-driven modules in ASP.NET Core, MVC, and React',
              'Managed HRM, payroll, production and financial workflows',
              'Administered Windows servers, IIS, and database infrastructure'
            ]" />
          <ExperienceCard company="bdCalling IT Ltd" position="Web Developer" period="Aug 2023 – Nov 2023"
            :responsibilities="[
              'Developed CMS websites using WordPress, Webflow, Bubble.io, and Shopify'
            ]" />
          <ExperienceCard company="Global IT Solutions" position="Project Manager" period="Jun 2023 – Aug 2023"
            :responsibilities="[
              'Led cross-functional teams to deliver Vue.js and Laravel-based web solutions',
              'Focused on business logic modeling, backend API design, and e-commerce integration'
            ]" />
          <ExperienceCard company="Creative Tech Park" position="Web Developer & PM" period="Jul 2022 – Jul 2023"
            :responsibilities="[
              'Full-stack web development using Vue.js, Laravel, and MySQL',
              'Managed development cycles, handled clients and deployments'
            ]" />
        </div>
      </div>
    </section>

    <!-- Projects Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl sm:text-4xl font-bold mb-12 text-center">
          <span class="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Featured
            Projects</span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProjectCard v-for="project in projects" :key="project.url" :title="project.title" :url="project.url"
            :description="project.description" />
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl sm:text-4xl font-bold mb-8">
          <span class="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Let's Connect</span>
        </h2>
        <p class="text-xl text-gray-300 mb-12">Feel free to reach out for collaborations or just a friendly hello!</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ContactCard icon="Phone" label="Phone" value="+880 1581 500678" href="tel:+8801581500678" />
          <ContactCard icon="Mail" label="Email" value="rakibul.cse.47@gmail.com"
            href="mailto:rakibul.cse.47@gmail.com" />
          <ContactCard icon="Github" label="GitHub" value="FullstackRakibul"
            href="https://github.com/FullstackRakibul" />
          <ContactCard icon="Globe" label="Portfolio" value="rabbitic.com" href="https://rabbitic.com" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>


const projects = [
  { title: 'Global IT Solutions', url: 'https://globalitsolutions.com.bd', description: 'Corporate website with modern design' },
  { title: 'Taash Clothing', url: 'https://taashclothing.com', description: 'E-commerce fashion platform' },
  { title: 'Paakhi Home', url: 'https://paakhihome.com', description: 'Home decor and furniture store' },
  { title: 'Ocean Gauge', url: 'http://oceangauge.com', description: 'Marine equipment solutions' },
  { title: 'My Prime Box', url: 'https://myprimebox.com', description: 'Subscription box service' },
  { title: 'RDT SQA', url: 'https://rdtsqa.com', description: 'Quality assurance services' },
  { title: 'Discover Thailand Co', url: 'https://discoverthailandco.com', description: 'Travel and tourism platform' },
  { title: 'Top Notch Assignments', url: 'http://topnotchassignments.net', description: 'Academic writing services' },
  { title: 'Nagar Kantha', url: 'http://www.nagarkantha.com', description: 'News and media portal' }
]

useHead({
  title: 'Rakibul H. Rabbi - Full-Stack Developer Portfolio',
  meta: [
    { name: 'description', content: 'Full-Stack Software Developer specializing in .NET, React, Vue, and enterprise applications. View my portfolio and projects.' }
  ]
})
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes gradient {

  0%,
  100% {
    background-size: 200% 200%;
    background-position: left center;
  }

  50% {
    background-size: 200% 200%;
    background-position: right center;
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

.animation-delay-200 {
  animation-delay: 0.2s;
  opacity: 0;
}

.animation-delay-400 {
  animation-delay: 0.4s;
  opacity: 0;
}

.animation-delay-600 {
  animation-delay: 0.6s;
  opacity: 0;
}

.animate-gradient {
  animation: gradient 3s ease infinite;
}
</style>