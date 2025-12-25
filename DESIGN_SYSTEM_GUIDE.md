# 🎨 Modern Design System Reference Guide

## Color Palette

### Primary Colors
- **Primary Blue**: `#0a84ff` - Used for main CTAs, links, and primary actions
- **Secondary Purple**: `#8b5cf6` - Used for accents, gradients, and secondary elements

### Status Colors
- **Success Green**: `#22c55e` - For confirmations, approved status
- **Warning Amber**: `#eab308` - For alerts, pending status
- **Error Red**: `#ef4444` - For errors, destructive actions

### Neutral Gray Scale (10 levels)
```
50:   #f9fafb (lightest background)
100:  #f3f4f6
200:  #e5e7eb
300:  #d1d5db
400:  #9ca3af
500:  #6b7280
600:  #4b5563 (standard text)
700:  #374151
800:  #1f2937
900:  #111827 (darkest text)
```

---

## Typography System

### Font Stack
```
System: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif
```

### Sizes & Usage
| Size | Value | Usage |
|------|-------|-------|
| xs | 12px | Small labels, captions |
| sm | 14px | Helper text, small buttons |
| base | 16px | Body text, normal buttons |
| lg | 18px | Subheadings, larger text |
| xl | 20px | Section titles |
| 2xl | 24px | Headings |
| 3xl | 30px | Major headings |
| 4xl | 36px | Large headings |
| 5xl | 48px | Hero titles |

### Font Weights
- **Regular (400)**: Body text, descriptions
- **Medium (500)**: Subheadings, labels
- **Semibold (600)**: Buttons, emphasis
- **Bold (700)**: Headings, titles

### Line Heights
- **Tight (1.25)**: Headings, tight spacing
- **Normal (1.5)**: Body text, standard
- **Relaxed (1.625)**: Long-form content

---

## Spacing System

All spaces are multiples of 8px (8px base unit):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Micro spacing, gaps |
| sm | 8px | Small gaps, padding |
| md | 12px | Standard gaps |
| lg | 16px | Normal padding |
| xl | 24px | Section padding |
| 2xl | 32px | Large sections |
| 3xl | 48px | Very large sections |
| 4xl | 64px | Hero sections |

---

## Component Spacing

### Buttons
- **Padding**: `py-2 px-6` (sm), `py-3 px-8` (md), `py-4 px-8` (lg)
- **Border Radius**: `rounded-lg` (8px), `rounded-xl` (12px)
- **Font Size**: `text-sm` to `text-lg`

### Cards
- **Padding**: `p-6` (24px)
- **Border Radius**: `rounded-2xl` (16px)
- **Border**: `border border-gray-200`
- **Shadow**: `shadow-base` or `shadow-lg`

### Forms
- **Input Height**: `py-2` (32px) or `py-3` (40px)
- **Border**: `border-2 border-gray-200`
- **Radius**: `rounded-lg` (8px) or `rounded-xl` (12px)
- **Focus Ring**: Blue outline with 2px offset

### Gaps (Grid/Flex)
- **Tight**: `gap-2` (8px)
- **Normal**: `gap-4` (16px)
- **Loose**: `gap-6` (24px)
- **Very Loose**: `gap-8` (32px)

---

## Shadow Depths

| Level | CSS | Usage |
|-------|-----|-------|
| sm | `shadow-sm` | Subtle, cards |
| base | `shadow-base` | Standard cards |
| md | `shadow-md` | Elevated modals |
| lg | `shadow-lg` | Floating elements |
| xl | `shadow-xl` | Dropdowns, floating UI |
| 2xl | `shadow-2xl` | Toast notifications |
| inner | `shadow-inner` | Inset shadows |

---

## Animation System

### Keyframe Animations (13 total)

**Fast Animations (300ms):**
- `fadeIn` / `fadeOut` - Opacity transitions
- `slideUp` / `slideDown` - Vertical movement
- `slideInLeft` / `slideInRight` - Horizontal movement
- `scaleIn` - Scale with fade

**Continuous Animations:**
- `pulse` - Opacity pulse (infinite)
- `shimmer` - Horizontal shimmer (2s)
- `spin` - 360° rotation (infinite)
- `bounce` - Vertical bounce (infinite)
- `float` - Vertical float (3s)
- `glow` - Box shadow glow (2s)

### Usage

```tsx
// Fade in
<div className="animate-fade-in" />

// Slide up with delay
<div className="animate-slide-up" style={{ animationDelay: '100ms' }} />

// Pulse effect
<div className="animate-pulse" />

// Bounce infinite
<div className="animate-bounce" />
```

---

## Transition Classes

| Class | Duration | Easing | Usage |
|-------|----------|--------|-------|
| transition-fast | 150ms | cubic-bezier | Quick hover feedback |
| transition-smooth | 250ms | cubic-bezier | Standard transitions |
| transition-slow | 350ms | cubic-bezier | Slow morphs |

---

## Hover Effects

```tsx
// Lift up on hover
<button className="hover-lift" />

// Add shadow on hover
<div className="hover-shadow" />

// Scale up on hover
<div className="hover-scale" />
```

### Effect Details:
- **hover-lift**: `translateY(-4px)` + `shadow-lg` (250ms smooth)
- **hover-shadow**: `shadow-lg` (250ms smooth)
- **hover-scale**: `scale-105` (250ms smooth)

---

## Gradient Classes

```tsx
// Primary gradient (blue → lighter blue)
<div className="gradient-primary" /> 
// bg-gradient-to-r from-primary-600 to-primary-500

// Secondary gradient (purple)
<div className="gradient-secondary" />

// Success gradient (green)
<div className="gradient-success" />

// Error gradient (red)
<div className="gradient-error" />

// Warning gradient (amber)
<div className="gradient-warning" />
```

---

## Glass Morphism

```tsx
<div className="glass">
  {/* backdrop blur + white/30 + border white/20 */}
</div>
```

Perfect for modal overlays, floating panels, and modern UI elements.

---

## Focus Ring Styling

```tsx
<input className="focus-ring" />
{/* 
  focus:outline-none 
  focus:ring-2 
  focus:ring-offset-2 
  focus:ring-primary-600 
*/}
```

Applied to all interactive elements for accessibility.

---

## Text Truncation

```tsx
// Single line truncation
<p className="truncate-1" />

// Two line truncation
<p className="truncate-2" />

// Three line truncation
<p className="truncate-3" />
```

---

## Scrollbar Styling

```tsx
// Hide scrollbar
<div className="scrollbar-hide" />

// Thin custom scrollbar
<div className="scrollbar-thin" />
```

---

## Button Patterns

### Primary Button
```tsx
<button className="px-6 py-2 bg-gradient-primary text-white rounded-lg font-semibold hover-lift">
  Action
</button>
```

### Secondary Button
```tsx
<button className="px-6 py-2 bg-white border-2 border-primary-600 text-primary-600 rounded-lg font-semibold hover:bg-primary-50">
  Secondary
</button>
```

### Icon Button
```tsx
<button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
  <Icon size={20} />
</button>
```

---

## Form Input Patterns

### Text Input
```tsx
<input 
  type="text"
  placeholder="Enter text..."
  className="px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-600 focus-ring"
/>
```

### Error State
```tsx
<input 
  type="text"
  className="px-4 py-2 bg-gray-50 border-2 border-error-300 rounded-lg focus:outline-none focus:border-error-600 focus-ring"
/>
```

### Success State
```tsx
<input 
  type="text"
  className="px-4 py-2 bg-gray-50 border-2 border-success-300 rounded-lg focus:outline-none focus:border-success-600 focus-ring"
/>
```

---

## Badge Patterns

### Primary Badge
```tsx
<span className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">
  New
</span>
```

### Success Badge
```tsx
<span className="inline-flex items-center gap-1 px-3 py-1.5 bg-success-100 text-success-700 rounded-full text-xs font-semibold">
  Approved
</span>
```

### Error Badge
```tsx
<span className="inline-flex items-center gap-1 px-3 py-1.5 bg-error-100 text-error-700 rounded-full text-xs font-semibold">
  Error
</span>
```

---

## Loading States

### Spinner
```tsx
<div className="animate-spin w-5 h-5 border-2 border-gray-300 border-t-primary-600 rounded-full" />
```

### Skeleton (use with shimmer)
```tsx
<div className="h-12 bg-gray-200 rounded-lg animate-shimmer" />
```

### Progress Bar
```tsx
<div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
  <div className="bg-gradient-primary h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
</div>
```

---

## Responsive Breakpoints

```tsx
// Mobile only (default)
<div className="text-base" />

// Tablet up (768px+)
<div className="md:text-lg" />

// Desktop up (1024px+)
<div className="lg:text-xl" />

// Large desktop (1280px+)
<div className="xl:text-2xl" />
```

---

## Best Practices

✅ **DO:**
- Use design tokens for consistency
- Apply hover effects to interactive elements
- Use smooth transitions (250ms default)
- Include focus rings on all interactive elements
- Provide loading and empty states
- Test for accessibility (Tab, Enter, Escape)
- Use gradient text sparingly for emphasis
- Stack animations with staggered delays

❌ **DON'T:**
- Mix animation durations unpredictably
- Forget focus rings (accessibility critical)
- Use colors outside the palette
- Apply animations to non-interactive elements
- Overuse animations (should be subtle)
- Forget loading states on async operations
- Use images without proper sizing
- Ignore mobile responsiveness

---

## Performance Tips

- CSS animations use GPU acceleration (transforms, opacity)
- Avoid animating properties like width, height (use scale instead)
- Use `will-change` sparingly on heavily animated elements
- Lazy load images with Next.js `Image` component
- Use `useCallback` to prevent unnecessary re-renders
- Test animations on low-end devices

---

This design system ensures consistency, accessibility, and a modern, professional appearance across the entire ecommerce platform. 🎨✨
