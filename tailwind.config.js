/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      maxwidth: {
        container: "1440px",
      },
      screens: {
        xs: "320px",
        sm: "375px",
        smx: "414px",
        sml: "500px",
        md: "667px",
        mdx: "736px",
        mdl: "768px",
        lg: "960px",
        lgl: "1024px",
        xl: "1280px",
      },
      colors: {
        transblue: "#172554",
        darkBlue: "#2563EB",
      },
    },
    plugins: [require("tailwind-scrollbar")],
  },
};
