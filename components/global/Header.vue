<template>
  <div class="px-12 font-semibold text-base md:text-xl dark:text-white">
    <div class="font-sans antialiased">
      <nav class="flex items-center justify-between flex-wrap p-6">
        <div class="flex items-center flex-no-shrink text-black mr-6">
          <a href="https://willz.dev">
            <svg
              class="logo"
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              width="192.000000pt"
              height="192.000000pt"
              viewBox="0 0 192.000000 192.000000"
              preserveAspectRatio="xMidYMid meet"
            >
              <g
                transform="translate(0.000000,192.000000) scale(0.100000,-0.100000)"
                fill="#currentColor"
                stroke="none"
              >
                <!-- <path
                  d="M0 960 l0 -960 960 0 960 0 0 960 0 960 -960 0 -960 0 0 -960z m1860
-5 l0 -895 -900 0 -900 0 0 895 0 895 900 0 900 0 0 -895z"
                /> -->
                <path
                  d="M1355 1598 c-25 -22 -26 -28 -29 -153 -2 -91 -8 -141 -19 -167 -15
-36 -19 -38 -60 -38 -53 0 -76 -18 -102 -77 -23 -54 -10 -74 41 -66 25 4 34 2
34 -8 -1 -38 -84 -166 -155 -239 -69 -70 -99 -57 -99 43 0 74 53 243 121 386
51 108 53 141 8 153 -40 11 -68 -11 -109 -83 -48 -86 -68 -117 -113 -180 -24
-33 -43 -62 -43 -65 0 -4 -10 -17 -22 -29 -13 -12 -49 -53 -80 -91 -85 -103
-182 -193 -186 -172 -7 34 165 402 234 503 23 32 17 74 -15 106 -56 55 -154
35 -332 -68 -220 -127 -302 -204 -254 -240 28 -20 50 -16 78 15 104 110 142
144 203 178 123 69 204 92 204 58 0 -9 -21 -55 -47 -103 -87 -161 -191 -377
-212 -439 -26 -78 -26 -116 0 -153 42 -59 66 -58 140 5 20 17 52 42 70 56 44
32 160 160 212 232 22 32 42 57 44 55 1 -2 -4 -30 -13 -63 -25 -95 1 -194 58
-225 97 -52 235 66 377 322 25 46 25 46 70 42 61 -7 115 -33 119 -58 3 -22
-77 -160 -139 -240 -118 -153 -179 -228 -223 -276 -73 -81 -97 -157 -60 -193
23 -24 104 -20 209 9 50 14 131 36 182 50 51 14 113 34 138 45 l46 20 -16 30
c-14 26 -18 28 -42 19 -65 -24 -214 -50 -292 -50 -45 0 -85 2 -87 4 -2 2 9 21
25 43 17 21 50 66 75 99 24 33 53 70 64 81 10 12 43 52 73 88 30 37 71 89 92
114 48 60 89 146 89 188 0 18 -8 46 -18 63 -21 36 -119 91 -162 91 -40 0 -44
8 -27 61 52 163 65 261 40 310 -19 36 -53 38 -90 7z"
                />
              </g>
            </svg>
          </a>
        </div>
        <div class="block sm:hidden">
          <button
            @click="toggle"
            class="flex items-center px-3 py-2 border rounded"
          >
            <svg
              class="fill-current h-3 w-3"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <div
          v-bind:class="[open ? 'block' : 'hidden']"
          class="w-full flex-grow sm:flex sm:items-center sm:w-auto"
        >
          <div class="text-xl sm:flex-grow">
            <a
              href="#About"
              class="no-underline block mt-4 sm:inline-block sm:mt-0 hover:text-indigo-600 mr-8"
            >
              About
            </a>
            <a
              href="#Technologies"
              class="no-underline block mt-4 sm:inline-block sm:mt-0 hover:text-indigo-600 mr-8"
            >
              Technologies
            </a>
            <a
              href="#Timeline"
              class="no-underline block mt-4 sm:inline-block sm:mt-0 hover:text-indigo-600 mr-8"
            >
              Timeline
            </a>
            <a
              href="#Portfolio"
              class="no-underline block mt-4 sm:inline-block sm:mt-0 hover:text-indigo-600 mr-8"
            >
              Portfolio
            </a>
            <a
              href="#Contact"
              class="no-underline block mt-4 sm:inline-block sm:mt-0 hover:text-indigo-600 mr-8"
            >
              Contact
            </a>
            <a
              href="#Footer"
              class="no-underline block mt-4 sm:inline-block sm:mt-0 hover:text-indigo-600 mr-8"
            >
              Footer
            </a>
          </div>
        </div>
        <div>
          <LightDarkBtn class="px-6" />
        </div>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      open: false,
    };
  },
  methods: {
    toggle() {
      this.open = !this.open;
    },
  },
};
</script>

<style scoped>
.dark-mode .logo {
  fill: white;
}
svg.logo {
  height: 100px;
  width: 100px;
}
</style>