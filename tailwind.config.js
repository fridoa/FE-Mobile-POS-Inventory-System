/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: include all locations where you use NativeWind classes (app/, app-example/, components, root App entry)
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./app-example/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./App.{js,jsx,ts,tsx}", "./global.css"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
