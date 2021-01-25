
<template>
  <button
    class="bg-transparent hover:bg-indigo-400 text-black dark:text-white font-semibold hover:text-white py-2 px-4 border border-black dark:border-white hover:border-transparent rounded"
    @click="toggle"
  >
    Change Theme
  </button>
</template>

<script>
export default {
  methods: {
    toggle() {
      this.$colorMode.preference =
        this.$colorMode.value == "light" ? "dark" : "light";
    },
  },
};
</script>