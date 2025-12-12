export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        upb: {
          blue: {
            50: '#E3F2FD',
            100: '#BBDEFB',
            200: '#90CAF9',
            300: '#64B5F6',
            400: '#42A5F5',
            500: '#0D47A1',
            600: '#0A3D8F',
            700: '#08337A',
            800: '#062966',
            900: '#041F52',
          },
          yellow: {
            50: '#FFFDE7',
            100: '#FFF9C4',
            200: '#FFF59D',
            300: '#FFF176',
            400: '#FFEE58',
            500: '#FFC107',
            600: '#FFB300',
            700: '#FFA000',
            800: '#FF8F00',
            900: '#FF6F00',
          }
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'upb': '0 4px 6px -1px rgba(13, 71, 161, 0.1), 0 2px 4px -1px rgba(13, 71, 161, 0.06)',
        'upb-lg': '0 10px 15px -3px rgba(13, 71, 161, 0.1), 0 4px 6px -2px rgba(13, 71, 161, 0.05)',
        'upb-xl': '0 20px 25px -5px rgba(13, 71, 161, 0.1), 0 10px 10px -5px rgba(13, 71, 161, 0.04)',
      }
    },
  },
  plugins: [],
}