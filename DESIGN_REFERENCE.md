# E-COMMERCE DESIGN REFERENCE

## Color Palette (Modern & Professional)

```
Primary: #1F2937 (Dark Gray/Charcoal)
Secondary: #3B82F6 (Bright Blue)
Accent: #F59E0B (Amber/Gold)
Success: #10B981 (Green)
Error: #EF4444 (Red)
Warning: #F97316 (Orange)
Info: #06B6D4 (Cyan)

Background: #FFFFFF (White)
Surface: #F9FAFB (Light Gray)
Border: #E5E7EB (Gray)
Text Primary: #1F2937 (Dark)
Text Secondary: #6B7280 (Medium Gray)
Text Muted: #9CA3AF (Light Gray)
```

## Typography

```
Font Family: Inter or Geist (clean, modern)

Headlines:
  h1: 48px, font-weight: 700, line-height: 1.2
  h2: 36px, font-weight: 700, line-height: 1.3
  h3: 24px, font-weight: 600, line-height: 1.4
  h4: 20px, font-weight: 600, line-height: 1.5

Body:
  Large: 18px, font-weight: 400, line-height: 1.6
  Regular: 16px, font-weight: 400, line-height: 1.6
  Small: 14px, font-weight: 400, line-height: 1.5

Buttons:
  Large: 16px, font-weight: 600, px: 24, py: 12
  Regular: 14px, font-weight: 600, px: 16, py: 10
  Small: 12px, font-weight: 600, px: 12, py: 8
```

## Spacing Grid (8px)

```
xs:  4px (0.5 rem)
sm:  8px (1 rem)
md:  16px (2 rem)
lg:  24px (3 rem)
xl:  32px (4 rem)
2xl: 48px (6 rem)
3xl: 64px (8 rem)
```

## Component Examples

### Button States
```
Default: bg-blue-600, text-white, cursor-pointer
Hover: bg-blue-700, shadow-md
Active: bg-blue-800, scale: 0.98
Disabled: bg-gray-300, text-gray-500, cursor-not-allowed
Loading: spinner animation inside button
```

### Card Components
```
Background: white
Padding: 24px (md grid)
Border Radius: 12px
Shadow: 0 1px 3px rgba(0,0,0,0.1)
Hover: shadow-lg, slight scale-up (1.02)
Border: 1px solid #E5E7EB
```

### Forms
```
Input Height: 44px (mobile-friendly tap target)
Border: 1px solid #E5E7EB
Border Radius: 8px
Padding: 12px 16px
Font Size: 16px (prevents mobile zoom)
Focus: border-blue-600, outline: none, ring: 2px blue-200
Error: border-red-600, text-red-600
Success: border-green-600, text-green-600
Label: font-weight: 600, margin-bottom: 8px
```

### Product Cards
```
Image Container:
  - Aspect ratio: 1/1 (square)
  - Border Radius: 8px
  - Overflow: hidden
  - Hover: scale 1.05, shadow increase
  
Card Footer:
  - Padding: 16px
  - Product name: font-weight: 600, 2 lines max (ellipsis)
  - Price: font-weight: 700, font-size: 18px, color: #1F2937
  - Discount price (strikethrough): text-gray-400, text-decoration: line-through
  - Rating: small gray text, stars
  
Hover Actions:
  - Add to Cart button: fade in
  - Add to Wishlist: heart icon appear
  - Quick View: overlay with "View Details"
```

### Badges & Labels

```
Discount Badge:
  bg: #F59E0B, text: white, padding: 4px 8px, border-radius: 4px, font-weight: 700, font-size: 12px
  Position: top-right corner of product image

Stock Badge:
  In Stock: bg-green-100, text-green-700, padding: 6px 12px
  Low Stock: bg-orange-100, text-orange-700, padding: 6px 12px
  Out of Stock: bg-red-100, text-red-700, padding: 6px 12px

Status Badge (Order):
  Processing: bg-blue-100, text-blue-700
  Shipped: bg-purple-100, text-purple-700
  Delivered: bg-green-100, text-green-700
  Cancelled: bg-red-100, text-red-700
```

## Animation Timing Functions

```
Fast: 150ms (ease-in-out) - button hover, tooltips
Regular: 300ms (ease-in-out) - page transitions, modals
Slow: 500ms (ease-in-out) - hero animations, carousel

Easing: cubic-bezier(0.4, 0, 0.2, 1)
```

## Responsive Breakpoints

```
Mobile: 0px - 640px (max-width: 639px)
Tablet: 640px - 1024px (max-width: 1023px)
Desktop: 1024px+ (min-width: 1024px)

Mobile First Approach:
  - 1 column on mobile
  - 2 columns on tablet
  - 3-4 columns on desktop
```

## Hover & Interactive Effects

```
Links: underline on hover, color fade
Buttons: brightness increase, slight scale, shadow
Cards: shadow increase, slight lift
Images: zoom (1.05), brightness (0.95 on dark overlay)
Forms: border color change, ring shadow
Dropdowns: smooth slide animation (200ms)
Modals: fade background (opacity 0 → 0.5), slide content (300ms)
```

## Accessibility

```
Focus Indicators: ring: 2px offset-2px, color: blue-600
Color Contrast: minimum 4.5:1 for text
Touch Targets: minimum 44x44px
Font Size: minimum 16px on mobile (prevent zoom)
Line Height: 1.5-1.6 for body text
Letter Spacing: slightly increased for headers
```

## Shadows

```
No Shadow: none
sm: 0 1px 2px rgba(0,0,0,0.05)
md: 0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)
lg: 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)
xl: 0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)
```

## Hero Banner Design

```
Full-width: width: 100vw (or 100% with proper overflow)
Min Height: 400px (mobile), 600px (desktop)
Background: solid image or video
Overlay: rgba(0,0,0,0.3) - semi-transparent dark overlay for text readability
Content Alignment: center or left-center
Text Color: white (for contrast)
CTA Button: prominent, contrasting color (blue or gold)
Parallax Effect: transform: translateY(-50px) on scroll

On Mobile:
  - No parallax (performance)
  - Taller text spacing
  - Larger font sizes
  - Single CTA button
```

## Featured Products Carousel

```
Cards per View: 4 (desktop), 2 (tablet), 1 (mobile)
Card Style: with image, name, price, rating, add-to-cart
Gap Between Cards: 16px (md grid)
Auto-play: 5 seconds
Transition: 300ms ease-in-out
Navigation: Previous/Next buttons (arrow icons)
Pagination Dots: visible, clickable
On Mobile:
  - Swipe navigation enabled
  - Drag to scroll
  - Carousel loops
```

## Admin Dashboard Colors

```
Primary: #3B82F6 (Blue)
Danger: #EF4444 (Red)
Success: #10B981 (Green)
Warning: #F97316 (Orange)

Chart Colors:
  Line 1: #3B82F6
  Line 2: #EC4899
  Line 3: #8B5CF6
  Line 4: #06B6D4
  Line 5: #F59E0B
```

## Loading States

```
Skeleton Loading: background: linear-gradient(90deg, #E5E7EB 0%, #F3F4F6 50%, #E5E7EB 100%)
Animation: background-position 2 seconds infinite

Spinner: rotating circle, 40px diameter, 4px stroke-width, color: blue-600
Duration: 1s linear infinite

Progress Bar: height: 4px, bg: linear-gradient (blue gradient)
Animation: smooth width transition (300ms)
```

---

## Implementation Notes

All components should use Tailwind CSS utility classes. Use shadcn/ui as a base for common components like buttons, cards, forms, tables, etc. Customize with the color palette above.

Animations should feel smooth and purposeful. Avoid excessive animations that distract from content. Focus on micro-interactions that provide feedback.

Mobile-first design: build for mobile first, then enhance for larger screens. Test on real devices.
