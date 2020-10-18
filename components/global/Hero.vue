<template>
  <div id="Hero" class="pt-8 min-h-screen">
    <div class="height-container flex items-center justify-center relative">
      <div class="text-center z-10">
        <h1 id="title" class="text-4xl sm:text-5xl md:text-6xl dark:text-white font-bold">
          Will Zittlau, B.Asc
        </h1>
        <h2 id="content" class="text-2xl sm:text-3xl md:text-4xl dark:text-white font-semibold">
          I make things and solve complex problems.
        </h2>
      </div>
      <img
        class="h-full block absolute inset-x-0 m-auto bottom-0 z-0 filter-gray-light opacity-100 dark:opacity-0"
        src="~assets/img/400x400-no-box.png"
        alt="Will Zittlau"
      />
      <img
        class="h-full block absolute inset-x-0 m-auto bottom-0 z-0 filter-gray-dark opacity-0 dark:opacity-100"
        src="~assets/img/400x400-no-box.png"
        alt="Will Zittlau"
      />
    </div>
  </div>
</template>

<style scoped>
.height-container{
  @media only screen and (max-width: 480px) {
    height:400px;}
  @media only screen and (min-width: 480px) {
    height:600px;}
  }

.filter-gray-light {
  filter: invert(99%) sepia(26%) saturate(88%) hue-rotate(220deg)
    brightness(116%) contrast(84%);
}
/*.filter-gray-light {
  filter: invert(90%) sepia(47%) saturate(53%) hue-rotate(171deg)
    brightness(99%) contrast(95%);
} ==bg-gray-200 */
.filter-gray-dark {
  filter: invert(55%) sepia(4%) saturate(2061%) hue-rotate(177deg)
    brightness(89%) contrast(86%);
}
</style>