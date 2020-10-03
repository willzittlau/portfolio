<template>
  <div>
    <ul>
      <li v-for="(job, index) in jobs" :key="index">
        <div>
          <h2 class="text-purple-600">{{ job.title }}</h2>
          <p>{{job.name}}</p>
          <div v-for="(desc, jndex) in job.description" :key="jndex">
            {{ desc.message }}
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import jobs from "~/static/data/work.json";

export default {
  asyncData({ params }) {
    return { jobs };
  },
};
</script>