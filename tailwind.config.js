module.exports = {
  theme: {
    darkSelector: ".dark-mode",
    inset: {
      "0": 0,
      auto: "auto",
      "1/2": "50%"
    },
    extend: {
      colors: {
        lightgrey: "#eaeaea",
      }
    }
  },
  variants: {
    opacity: [
      "dark",
      "dark-hover",
      "dark-focus",
      "responsive",
      "hover",
      "focus"
    ],
    backgroundColor: [
      "dark",
      "dark-hover",
      "dark-group-hover",
      "dark-even",
      "dark-odd",
      "hover",
      "responsive"
    ],
    borderColor: [
      "dark",
      "dark-focus",
      "dark-focus-within",
      "hover",
      "responsive"
    ],
    textColor: ["dark", "dark-hover", "dark-active", "hover", "responsive"]
  },
  plugins: [require("tailwindcss-dark-mode")()]
};
