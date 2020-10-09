---
title: "How I made this site with Nuxt.js"
createdAt: "2020-09-08"
description: "Using the new Nuxt content module to make a rendered markdown blog"
img: "https://helpdev.eu/wp-content/uploads/2019/01/nuxt-js.jpg"
alt: "VS Code Nuxt site"
featured: "yes"
tags:
  - coding
  - nuxt
  - vue
  - javascript
  - projects
---

![Static Site Generators](https://snipcart.com/media/204774/best-static-site-generator-2020.png)

Since graduating in the spring I've been intensely focusing on coding, and getting up to speed with current frameworks and trends. After getting pretty solid with back-end work on some personal web apps using Flask, I wanted to turn my attention towards the ever so trendy JAMstack and new JS frameworks for more front-end experience . Re-writing my wordpress blog from scratch and deploying it as either an SPA or full-static seemed like the perfect choice.

That left me with deciding which site generator to use. This whole project started by discovering Jekyll, and discovering how much I liked writing content in markdown. The only thing was that I wanted practice with one of the new JS frameworks and I didn't want my project to be in Ruby. Next I discovered 11ty, which seems awesome, but I wanted to have more of a challenge. That left me with React/Gatsby which seems like it's the most popular,  or Vue - in which I found VuePress, Nuxt, or Gridsome. I liked Vue over React from the little experience I had, so I started there. VuePress doesn't seem as customizable as the other two, and I wasn't wanting to learn GraphQL ontop of a new framework so Nuxt it was. Luckily for me, Nuxt just came out with Nuxt Content and full-static rendering in June, which was absolutely perfect.

I started plugging away from the boilerplate created by running
`npm create-nuxt-app` and opted in to use Bulma as the CSS framework. Thankfully the Nuxt/Vue documentation is really helpful, as I spent hours going through it  to fully understand each component/module I wanted to add.  Their introduction tutorial [found here](https://nuxtjs.org/blog/creating-blog-with-nuxt-content/) was a lifesaver and worth browsing through if you're interested in using the framework.

I'm not going to go into too much of the code, since a lot of it was only lightly modified from the tutorial for actually rendering each blog post, but I'll highlight onto what I did add. If you want to go to my repo to view every vue component, all the power to you! The biggest adaptation was adding a /tags path to greatly improve site navigation and organize posts by type. This was as easy as adding a tags object in the markdown YAML, and this vue component:
```javascript
// pages/tags/_slug.vue
<template>
  <div class="container journal">
    <h1>Tags: {{ $route.params.slug }}</h1>
    <ul>
      <li v-for="article of articles" :key="article.slug">
        <NuxtLink class="journal-post" :to="{ name: 'blog-slug', params: { slug: article.slug } }">
          <div>
            <h2 class="journal-title">{{ article.title }}</h2>
            <p class="journal-excerpt">{{ article.description }}</p>
            <span class="journal-excerpt">
              {{ formatDate(article.createdAt) }} &bull;
              {{ article.readingTime }}
            </span>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  methods: {
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString("en", options);
    },
  },
  async asyncData({ params, error, $content }) {
    try {
      const articles = await $content("articles", { deep: true })
        .where({ tags: { $contains: params.slug } })
        .sortBy("createdAt", "desc")
        .fetch();
      return { articles };
    } catch (err) {
      error({
        statusCode: 404,
        message: "Page could not be found",
      });
    }
  },
};
</script>
```
In the script I also included a small function for date formatting as well as an error catching function. I also added features posts on pages/index.vue by adding a "featured" component on the markdown YAML, and the code seen below.
```javascript
// pages/index.vue
<template>
  <div>
    <Hero />
    <h1>Featured</h1>
      <div v-for="article of articles" :key="article.slug">
        <NuxtLink :to="{ name: 'blog-slug', params: { slug: article.slug } }">
          <img :src="article.img" :alt="article.alt" class="thumbnail" />
          <h3 class="project-title">{{ article.title }}</h3>
            <span v-for="tag of article.tags" :key="tag.id">{{tag}}</span>
        </NuxtLink>
      </div>
    <SocialFeed />
  </div>
</template>

<script>
export default {
  async asyncData({ $content }) {
    const articles = await $content("articles", { deep: true })
      .where({ featured: { $contains: "yes" } })
      .sortBy("updatedAt", "desc")
      .fetch();
    return {
      articles,
    };
  },
};
</script>
```
Another additon is that I added custom error routes, however I can't find the article that I read but if I do I'll add a link to it here.
```javascript
// layouts/error.vue
<template>
  <div class="nuxt-error">
    <component :is="errorPage" :error="error" />
  </div>
</template>

<script>
import error404 from "~/components/error/404.vue";
import error500 from "~/components/error/500.vue";
export default {
  name: "nuxt-error",
  layout: "default", // optional
  props: {
    error: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    errorPage() {
      if (this.error.statusCode === 404) {
        return error404;
      }
      // catch everything else
      return error500;
    },
  },
};
</script>
```
```javascript
// components/404.vue
<script>
export default {
  name: "error-404",
  props: {
    error: {
      type: Object,
      default: () => {},
    },
  },
};
</script>
```
Finally, for styling I used Bulma.css for this project, which made workflow quick and easy, especially for responsive displays on mobile. The next one I'm looking at checking out is Tailwind.css, there's a ton of Nuxt tutorials out there which are using it. I got some heavy inspiration from [this Gridsome theme](https://gridsome-forestry.netlify.app/) , but since it was written using Gridsome it was fun re-purposing and adapting it to work with Nuxt. It was also really helpful having a visual aid to direct my style decisions, I can see why teams use image templates prior to building.

And that it! In about a week of work I went from an empty VS Code directory to the site you're reading this on now. In the end I ended up rendering it as a SPA, as I was having styling issues and some of my components weren't loading when going full static (Disqus - I'm looking at you). Actually, it's rendered as below, which means it's partially static, the all of the nuxt specific components work, but from what I understand my  dynamic pages from _slug.vue aren't created on build, they're rendered by js on client-side. Ohwell, my lighgthouse SEO score is perfect and it loads lightning quick anyways, even being bloated down by some SPA components.
```javascript
//nuxt.config.js
export default {
  mode: "spa",
  target: "static"
  ...
}
```
So as far as full static, that's still a work in progress but something I'll be chipping away at. 

Oh and last of all, I deployed with Netlify. It's dead simple to use and works, and I don't need a CMS. I can write my .md content on desktop in Typora and push it to GitHub for seamless deployment.  I looked into something like Forestry so I can live preview, but I can achieve the same result by just using `npm run dev` to check followed by `nuxt build && nuxt generate` before committing.

Thanks for reading! If you have any questions or find any bugs let me know &#128522;
The project is also [available on my Github](https://github.com/willzittlau/Personal-Site) if you would like to use it as a template for your next site or browse the code.