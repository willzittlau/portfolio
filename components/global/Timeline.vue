<template>
  <div id="Timeline" class="text-center">
    <ul>
      <li v-for="(job, index) in jobs" :key="index">
        <div>
          <h2 class="text-purple-600">{{ job.title }}</h2>
          <p class="dark:text-yellow-500">{{ job.name }}</p>
          <div v-for="(desc, jndex) in job.description" :key="jndex">
            <p class="dark:text-white">{{ desc.message }}</p>
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