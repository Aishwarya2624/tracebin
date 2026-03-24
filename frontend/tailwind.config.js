export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B1021",
        panel: "rgba(22,31,52,0.7)",
        neon: "#5BF3B9",
        cyan: "#4DE1FF",
        amber: "#F5B700"
      },
      boxShadow: {
        glow: "0 0 25px rgba(91,243,185,0.25)",
        card: "0 20px 60px rgba(0,0,0,0.35)"
      }
    }
  },
  plugins: []
};
