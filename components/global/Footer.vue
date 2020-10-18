<template>
  <div
    class="w-full h-40 bg-lightgrey dark:bg-gray-700 text-center items-center justify-center"
  >
    <div class="dark:text-white">
      &copy; {{ new Date().getFullYear() }} Will Zittlau
      <br />
      <span>
        <a href="https://nuxtjs.org/">
          <img
            width="100"
            height="18"
            src="~assets/img/svg/built-with-nuxt-light.svg"
            alt="Built with Nuxt"
          />
        </a>
      </span>
      and made with
      <span style="color: #e25555">&#9829;</span>
    </div>
  </div>
</template>
