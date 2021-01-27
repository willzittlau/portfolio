<template>
  <div class="bounce text-black dark:text-white">
    <a href="#About"
      ><fa :icon="['fas', 'chevron-down']" style="font-size: 48px"
    /></a>
  </div>
</template>

<script>
export default {
  mounted() {
    window.addEventListener("scroll", this.onScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll);
  },
  methods: {
    onScroll(e) {
      if (window.scrollY != 0) {
        document.querySelector(".bounce").classList.add("fade");
      } else {
        document.querySelector(".bounce").classList.remove("fade");
      }
    },
  },
};
</script>

<style lang="css" scoped>
.bounce {
  opacity: 1;
  transition: opacity 0.5s, visibility 0s linear;
  position: fixed;
  left: 50%;
  bottom: 0;
  margin-top: -25px;
  margin-left: -25px;
  -webkit-animation: bounce 1s infinite;
  -moz-animation: bounce 1s infinite;
  -o-animation: bounce 1s infinite;
  animation: bounce 1s infinite;
}

.bounce.fade {
  opacity: 0;
  visibility: hidden;
}

.bounce:hover {
  color: #5a67d8;
}
@-webkit-keyframes bounce {
  0% {
    bottom: 0px;
  }
  50% {
    bottom: 15px;
  }
  100% {
    bottom: 30;
  }
}

@-moz-keyframes bounce {
  0% {
    bottom: 0px;
  }
  50% {
    bottom: 15px;
  }
  100% {
    bottom: 30;
  }
}

@-o-keyframes bounce {
  0% {
    bottom: 0px;
  }
  50% {
    bottom: 15px;
  }
  100% {
    bottom: 30;
  }
}

@keyframes bounce {
  0% {
    bottom: 0px;
  }
  50% {
    bottom: 15px;
  }
  100% {
    bottom: 30;
  }
}
</style>