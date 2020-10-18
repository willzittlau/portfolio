<template>
  <div id="site" class="bg-white dark:bg-gray-800">
    <Header />
    <Nuxt />
    <div id="wrapper"></div>
    <Footer />
  </div>
</template>

<style scoped>
/* For sticky footer */
#site {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}
#wrapper {
  flex: 1;
}
</style>
