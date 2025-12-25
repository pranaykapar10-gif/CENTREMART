/**
 * Design System - Colors, Typography, Spacing, Shadows, Animations
 * Global design tokens for consistent modern UI/UX
 */

export const designTokens = {
  // Primary Color Palette (Modern Blue)
  colors: {
    primary: {
      50: '#f0f7ff',
      100: '#e0efff',
      200: '#bae0ff',
      300: '#7cc5ff',
      400: '#36aaff',
      500: '#0a84ff',
      600: '#0066ff',
      700: '#0052cc',
      800: '#003da6',
      900: '#002e7a',
    },
    secondary: {
      50: '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#8b5cf6',
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95',
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#eab308',
      600: '#ca8a04',
      700: '#a16207',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },

  // Typography
  typography: {
    fontFamily: {
      sans: 'system-ui, -apple-system, sans-serif',
      mono: '"Fira Code", "Courier New", monospace',
    },
    fontSize: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem', // 48px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // Spacing (8px base unit)
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '2.5rem', // 40px
    '3xl': '3rem', // 48px
    '4xl': '4rem', // 64px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.25rem', // 4px
    base: '0.5rem', // 8px
    md: '0.75rem', // 12px
    lg: '1rem', // 16px
    xl: '1.5rem', // 24px
    '2xl': '2rem', // 32px
    full: '9999px',
  },

  // Shadows (Depth system)
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  },

  // Transitions & Animations
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Z-Index Scale
  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    modal: 40,
    popover: 50,
    tooltip: 60,
    notification: 70,
  },
};

// Animation CSS string generators
export const animations = {
  fadeIn: `@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }`,

  slideUp: `@keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(16px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }`,

  slideDown: `@keyframes slideDown {
    from { 
      opacity: 0;
      transform: translateY(-16px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }`,

  slideInLeft: `@keyframes slideInLeft {
    from { 
      opacity: 0;
      transform: translateX(-24px);
    }
    to { 
      opacity: 1;
      transform: translateX(0);
    }
  }`,

  slideInRight: `@keyframes slideInRight {
    from { 
      opacity: 0;
      transform: translateX(24px);
    }
    to { 
      opacity: 1;
      transform: translateX(0);
    }
  }`,

  scaleIn: `@keyframes scaleIn {
    from { 
      opacity: 0;
      transform: scale(0.95);
    }
    to { 
      opacity: 1;
      transform: scale(1);
    }
  }`,

  pulse: `@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }`,

  shimmer: `@keyframes shimmer {
    -100% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }`,

  spin: `@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }`,

  bounce: `@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }`,
};

// Tailwind CSS utility classes (paste into globals.css)
export const tailwindUtilities = `
  @layer utilities {
    /* Animations */
    .animate-fade-in {
      animation: fadeIn 300ms ease-out;
    }

    .animate-slide-up {
      animation: slideUp 300ms ease-out;
    }

    .animate-slide-down {
      animation: slideDown 300ms ease-out;
    }

    .animate-slide-in-left {
      animation: slideInLeft 300ms ease-out;
    }

    .animate-slide-in-right {
      animation: slideInRight 300ms ease-out;
    }

    .animate-scale-in {
      animation: scaleIn 300ms ease-out;
    }

    .animate-shimmer {
      animation: shimmer 2s infinite;
    }

    /* Smooth Transitions */
    .transition-smooth {
      transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .transition-fast {
      transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .transition-slow {
      transition: all 350ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Hover Effects */
    .hover-lift {
      transition: transform 200ms, box-shadow 200ms;
    }

    .hover-lift:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .hover-shadow {
      transition: box-shadow 200ms;
    }

    .hover-shadow:hover {
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    /* Gradient Backgrounds */
    .gradient-primary {
      background: linear-gradient(135deg, #0a84ff 0%, #0066ff 100%);
    }

    .gradient-success {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    }

    .gradient-warning {
      background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%);
    }

    .gradient-error {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    }

    /* Glass Morphism */
    .glass {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    /* Blur Backgrounds */
    .blur-sm {
      backdrop-filter: blur(4px);
    }

    .blur-md {
      backdrop-filter: blur(12px);
    }

    .blur-lg {
      backdrop-filter: blur(20px);
    }

    /* Focus States */
    .focus-ring {
      outline: 2px solid transparent;
      outline-offset: 2px;
      transition: outline 200ms;
    }

    .focus-ring:focus-visible {
      outline: 2px solid #0a84ff;
      outline-offset: 2px;
    }

    /* Disabled States */
    .disabled-opacity {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Text Truncation */
    .truncate-1 {
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    .truncate-2 {
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .truncate-3 {
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }

    /* Scrollbar Styling */
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }

    .scrollbar-thin::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    .scrollbar-thin::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    .scrollbar-thin::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 3px;
    }

    .scrollbar-thin::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  }
`;

export default designTokens;
