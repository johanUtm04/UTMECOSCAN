export default {
  content: [
    "./index.html", // Aquí le dices a Tailwind que revise este archivo para buscar clases CSS usadas
    "./src/**/*.{js,ts,jsx,tsx}", // Y que revise TODOS los archivos JS, TS, JSX, TSX dentro de src y sus subcarpetas
  ],
  theme: {
    extend: {
      colors: {
        utm: "#18a39b",      // Aquí defines un color personalizado llamado "utm"
        "utm-dark": "#137d74" // Otro color personalizado para hover o variantes
      },
    },
  },
  plugins: [], // Aquí irían plugins extra que quieras usar (por ahora vacío)
}
