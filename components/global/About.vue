<template>
  <div id="About">
    <nuxt-content :document="about" />
  </div>
</template>

<script>
export default {
  components: {},
  async asyncData({ $content }) {
    const about = await $content("about").fetch();
    return { mdContent };
  },
  name: 'About'
};
</script>

<style scoped>
</style>