import type { Config } from "tailwindcss";

export default {
    //darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
		screens: {
			'3xl': '2000px',
		},
		backgroundImage: {
			sidebar: 'var(--sidebar-background)',
		},
		maxHeight: {
			'1/2': '50%',
			'1/3': '33.333333%',
			'2/3': '66.666667%',
			'3/4': '75%',
			'4/5': '80%',
			'5/6': '83.333333%',
		},
  		colors: {
			bixcolor: {
				default: '#074048',
				light: '#006664'
			},
			navbar: 'var(--navbar-background)',
			primary: 'var(--color-primary)',
			secondary: 'var(--color-secondary)',
  			background: 'var(--background)',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}

  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},

		fontFamily: {
		sans: ['Inter', 'sans-serif'], // Aggiungi Verdana come font di default
		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
  safelist: [
    // Elenca specificamente le classi se conosci i livelli massimi:
    'pl-4',
    'pl-8',
    'pl-12',
    'pl-16',
    'pl-20',
    'pl-24', // Aggiungi altri livelli se necessario
    // Oppure usa un pattern (Regex) per includerle tutte fino a un certo punto:
    // {
    //   pattern: /pl-(4|8|12|16|20|24|28|32)/, // Adatta i numeri ai tuoi bisogni
    // },
    // Potresti anche voler mettere in safelist le classi di rotazione se usi JIT
    'rotate-90', 
  ],
} satisfies Config;
