<template>
  <div id="Index">
    <Hero />
    <About />
    <Technologies />
    <Timeline :jobs="jobs" />
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