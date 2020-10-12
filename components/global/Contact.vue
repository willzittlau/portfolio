<template>
  <div
    id="Contact"
    class="relative flex items-top justify-center sm:items-center sm:pt-0"
  >
    <div class="pt-16 pb-8 max-w-full mx-auto sm:px-4 lg:px-4">
      <div class="mt-8 overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-5">
          <div
            class="col-span-2 p-6 mr-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
          >
            <h1
              class="text-4xl sm:text-5xl text-gray-800 dark:text-white font-extrabold tracking-tight"
            >
              Get in touch
            </h1>
            <p
              class="text-normal text-lg sm:text-2xl font-medium text-gray-600 dark:text-gray-400 mt-2"
            >
              Fill in the form to start a conversation
            </p>

            <div
              class="flex items-center mt-24 text-gray-600 dark:text-gray-400"
            >
              <svg
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                class="w-8 h-8 text-gray-500"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div class="ml-4 text-md tracking-wide font-semibold w-40">
                Kelowna, BC & Remote Canada
              </div>
            </div>

            <div
              class="flex items-center mt-5 text-gray-600 dark:text-gray-400"
            >
              <svg
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                class="w-8 h-8 text-gray-500"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <div class="ml-4 text-md tracking-wide font-semibold w-40">
                By Request
              </div>
            </div>

            <div
              class="flex items-center mt-5 text-gray-600 dark:text-gray-400"
            >
              <svg
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                class="w-8 h-8 text-gray-500"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <div class="ml-4 text-md tracking-wide font-semibold w-40">
                <a href="mailto:hi@willz.dev">hi@willz.dev</a>
              </div>
            </div>
          </div>

          <form
            name="contact"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            class="col-span-3 px-6 md:px-4 ml-0 md:ml-4 mr-2 md:mr-2 flex flex-col justify-center"
          >
            <div class="flex flex-col">
              <label for="name" class="hidden">Name</label>
              <input
                type="name"
                name="name"
                placeholder="Name"
                class="w-100 mt-2 py-3 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-400 font-semibold focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div class="flex flex-col mt-2">
              <label for="email" class="hidden">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                class="w-100 mt-2 py-3 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-400 font-semibold focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div class="flex flex-col mt-2">
              <label for="subject" class="hidden">Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                class="w-100 mt-2 py-3 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-400 font-semibold focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div class="flex flex-col mt-2">
              <label for="message" class="hidden">Enter your message here...</label>
              <textarea
                name="message"
                placeholder="Enter your message here..."
                class="w-100 mt-2 h-auto py-3 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-400 font-semibold focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              class="md:w-32 bg-indigo-600 hover:bg-blue-dark text-white font-bold py-3 px-6 rounded-lg mt-3 hover:bg-indigo-500 transition ease-in-out duration-300"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.h-auto {
  min-height: 150px;
  height: auto;
}
</style>