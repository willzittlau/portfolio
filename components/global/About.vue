<template>
  <div id="About">
    <nuxt-content :document="mdContent" />
  </div>
</template>

<script>
export default {
  components: {},
  async asyncData({ $content }) {
    const mdContent = await $content("divs/about").fetch();
    return { mdContent };
  },
  name: 'About'
};
</script>

<style scoped>
</style>