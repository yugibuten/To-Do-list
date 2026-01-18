/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        sand: "#f6f1e7",
        ocean: "#1f7a8c",
        ember: "#e85d04",
        moss: "#2f5233"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(15, 23, 42, 0.18)",
        lift: "0 12px 30px rgba(15, 23, 42, 0.12)"
      }
    }
  },
  plugins: []
};
