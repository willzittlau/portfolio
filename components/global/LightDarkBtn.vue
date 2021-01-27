
<template>
  <button
    class=" text-black dark:text-white hover:text-indigo-600 mt-4"
    @click="toggleTheme(); toggleIcon();"
  >
    <fa :icon="light ? ['fas', 'lightbulb'] : ['fas', 'moon']" style="font-size: 32px" />
  </button>
</template>

<script>
export default {
  data() {
    return {
      light: true,
    };
  },
  methods: {
    toggleTheme() {
      this.$colorMode.preference =
        this.$colorMode.value == "light" ? "dark" : "light";
    },
    toggleIcon(){
      this.light = !this.light
    }
  },
};
</script>

<style lang="css" scoped>
  button:focus{
    outline: none;
  }
  button{
    padding: 0px;
  }
</style>