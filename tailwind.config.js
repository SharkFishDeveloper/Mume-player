/** @type {import('tailwindcss').Config} */
module.exports = {
  // Add the paths to all of your component files.
  content: [
  "./App.{js,jsx,ts,tsx}",      // Root App file
  "./app/**/*.{js,jsx,ts,tsx}",  // Expo Router folder
  "./src/**/*.{js,jsx,ts,tsx}",  // Source folder
  "./components/**/*.{js,jsx,ts,tsx}"
],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};