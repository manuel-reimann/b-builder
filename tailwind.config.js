export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        agrotropic: {
          blue: "#30384b",
          green: "#4d9a85",
          gray: "#848484",
        },
      },
      animation: {
        moveWave: "waveMove 10s linear infinite",
      },
      keyframes: {
        waveMove: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-25%)" },
        },
      },
    },
  },
  plugins: [],
};
