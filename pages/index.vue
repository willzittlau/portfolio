<template>
  <div id="Index">
    <h1 class="text-red-600 text-4xl text-center">*Still a work in Progress!</h1>
    <Hero />
    <About />
    <Technologies />
    <Timeline :jobs="jobs" />
    <Portfolio />
    <Resume />
    <Contact />
  </div>
</template>

<script>
import jobs from "~/static/data/work.json";
import Timeline from "~/components/global/Timeline.vue";

export default {
  components: {
    Timeline,
  },
  asyncData({ params }) {
    return { jobs };
  },
};
</script>