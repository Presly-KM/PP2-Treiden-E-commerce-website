/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
      "rabbit-red": "#ea2e0e",
    },
  },
},
  plugins: [                                               
    function ({ addUtilities }) {                              
      const newUtilities = {                                    // On crée un objet newUtilities destiné à supprimer les barres de défilement dans les éléments HTML.
        ".no-scrollbar ::-webkit-scrollbar": {
          display: "none",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none", /* IE and Edge */
          "scrollbar-width": "none", /* Firefox */
        },
      };

      addUtilities(newUtilities);
    }
  ],
};