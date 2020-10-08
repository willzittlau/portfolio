<template>
  <div id="Hero" class="pt-12 pb-48">
    <div
      style="height: 600px"
      class="flex items-center justify-center relative"
    >
      <div class="text-center z-10">
        <h1 id="title" class="text-5xl dark:text-white">Will Zittlau, B.Asc</h1>
        <h2 id="content" class="text-3xl dark:text-white">
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
.filter-gray-light {
  filter: invert(99%) sepia(26%) saturate(88%) hue-rotate(220deg)
    brightness(116%) contrast(84%);
}
.filter-gray-dark {
  filter: invert(55%) sepia(4%) saturate(2061%) hue-rotate(177deg)
    brightness(89%) contrast(86%);
}
</style>