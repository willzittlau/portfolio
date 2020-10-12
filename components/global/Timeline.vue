<template>
  <div id="Timeline" class="text-center font-semibold text-base md:text-xl dark:text-gray-400">
    <ul>
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