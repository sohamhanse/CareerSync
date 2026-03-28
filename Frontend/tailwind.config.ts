
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// CareerSync Cobalt Blue + Cream palette
				cobalt: {
					50: '#eef1fb',
					100: '#d4dbf5',
					200: '#a9b7eb',
					300: '#7e93e1',
					400: '#536fd7',
					500: '#1f3fc3',   // Primary cobalt blue
					600: '#1a35a5',
					700: '#152b87',
					800: '#102069',
					900: '#0b164b',
					950: '#060d2f',
				},
				cream: {
					50: '#faf9f0',
					100: '#f5f4e5',
					200: '#efeed7',   // Primary cream
					300: '#e5e3c3',
					400: '#d5d2a8',
					500: '#c5c18d',
					600: '#a8a36e',
					700: '#8b8553',
					800: '#6e6a3e',
					900: '#524f2d',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'pulse-gentle': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' },
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'shimmer': {
					'0%': { backgroundPosition: '-500px 0' },
					'100%': { backgroundPosition: '500px 0' },
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'slide-up': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(20px)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' },
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
				'subtle-bounce': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-3px)' },
				},
				'progress-line': {
					'0%': { width: '0%' },
					'100%': { width: '100%' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-gentle': 'pulse-gentle 3s ease-in-out infinite',
				'float': 'float 6s ease-in-out infinite',
				'shimmer': 'shimmer 2s infinite linear',
				'fade-in': 'fade-in 0.6s ease-out',
				'slide-up': 'slide-up 0.6s ease-out',
				'slide-in-right': 'slide-in-right 0.6s ease-out',
				'scale-in': 'scale-in 0.4s ease-out',
				'subtle-bounce': 'subtle-bounce 2s ease-in-out infinite',
				'progress-line': 'progress-line 2.5s ease-out',
			},
			fontFamily: {
				sans: ['Poppins', 'system-ui', 'sans-serif'],
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'cobalt-gradient': 'linear-gradient(135deg, #1f3fc3, #152b87)',
				'cobalt-light-gradient': 'linear-gradient(135deg, #536fd7, #1f3fc3)',
				'cream-gradient': 'linear-gradient(135deg, #faf9f0, #efeed7)',
				'hero-gradient': 'linear-gradient(135deg, #0b164b 0%, #1f3fc3 50%, #536fd7 100%)',
				'card-gradient': 'linear-gradient(135deg, rgba(31, 63, 195, 0.03), rgba(239, 238, 215, 0.3))',
				'cta-gradient': 'linear-gradient(135deg, #1f3fc3, #0b164b)',
			},
			boxShadow: {
				'subtle': '0 1px 3px rgba(31, 63, 195, 0.06)',
				'card': '0 4px 16px -2px rgba(31, 63, 195, 0.08)',
				'hover': '0 12px 32px -4px rgba(31, 63, 195, 0.15)',
				'button': '0 2px 8px rgba(31, 63, 195, 0.2)',
				'nav': '0 2px 12px rgba(31, 63, 195, 0.06)',
				'glass': '0 4px 20px rgba(31, 63, 195, 0.05)',
			},
			spacing: {
				'18': '4.5rem',
				'22': '5.5rem',
			},
			letterSpacing: {
				'tight': '-0.01em',
				'tighter': '-0.02em',
				'super-tight': '-0.03em',
			},
			lineHeight: {
				'extra-tight': '1.1',
			},
			transitionDuration: {
				'400': '400ms',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
