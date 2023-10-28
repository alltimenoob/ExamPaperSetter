/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/renderer/src/**/*.{html,jsx}"],
  theme: {
    extend: {
      colors:{
        "primary":"#1C6758",
        "primaryDark":"#103830"
      },
    },
  },
  plugins: [],
}
