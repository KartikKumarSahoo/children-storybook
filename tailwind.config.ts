/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        child: [
          "Comic Sans MS",
          "Marker Felt",
          "Chalkduster",
          "cursive",
          "system-ui",
        ],
      },
    },
  },
  plugins: [],
};
