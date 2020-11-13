
<template>
  <button
    class="bg-transparent hover:bg-indigo-400 text-indigo-600 font-semibold hover:text-transparent py-2 px-4 border border-indigo-600 hover:border-transparent rounded"
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