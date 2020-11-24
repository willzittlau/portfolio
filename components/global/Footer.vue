<template>
  <div id="Footer" 
    class="w-full h-20 bg-lightgrey dark:bg-gray-700 text-center items-center justify-center"
  >
    <div class="md:grid-cols-3 dark:text-white text-2xl content-center justify-center flex">
      &copy; {{ new Date().getFullYear() }} Will Zittlau
      &nbsp;
      <span class="md:grid-cols-3 content-center justify-center flex mt-2">
        <a href="https://nuxtjs.org/">
          <img
            width="150"
            height="50"
            src="~assets/img/svg/built-with-nuxt-light.svg"
            alt="Built with Nuxt"
          />
        </a>
      </span>
      <span class="md:grid-cols-3">&nbsp;
      and made with
      <span style="color: #e25555">&#9829;</span>
      </span>
    </div>
  </div>
</template>
