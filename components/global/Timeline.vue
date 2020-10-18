<template>
  <div id="Timeline" class="text-center">
    <h1 class="w-auto inline-block mx-auto dark:text-white text-lightgrey text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold border-b-4 md:border-b-8 border-indigo-600">
      Timeline
    </h1>
    <ul class="pt-8 px-4 md:px-12 font-semibold text-base md:text-xl dark:text-gray-400">
      <li v-for="(job, index) in jobs" :key="index">
        <div>
          <h2>{{ job.title }}</h2>
          <p>{{ job.name }}</p>
          <div v-for="(desc, jndex) in job.description" :key="jndex">
            <p>{{ desc.message }}</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ["jobs"], // to receive data from page/index.vue
};
</script>