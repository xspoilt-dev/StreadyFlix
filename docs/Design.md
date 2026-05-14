---
name: Premium Athletic Streaming
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#d4c4b7'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#9c8e83'
  outline-variant: '#50453b'
  surface-tint: '#eebd8e'
  primary: '#eebd8e'
  on-primary: '#472a06'
  primary-container: '#b4885d'
  on-primary-container: '#3f2302'
  inverse-primary: '#7c5730'
  secondary: '#fff9ef'
  on-secondary: '#3a3000'
  secondary-container: '#ffdb3c'
  on-secondary-container: '#725f00'
  tertiary: '#c8c6c5'
  on-tertiary: '#313030'
  tertiary-container: '#929090'
  on-tertiary-container: '#2a2a2a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdcbd'
  primary-fixed-dim: '#eebd8e'
  on-primary-fixed: '#2c1600'
  on-primary-fixed-variant: '#61401b'
  secondary-fixed: '#ffe16d'
  secondary-fixed-dim: '#e9c400'
  on-secondary-fixed: '#221b00'
  on-secondary-fixed-variant: '#544600'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-hero:
    fontFamily: Inter
    fontSize: 80px
    fontWeight: '800'
    lineHeight: 88px
    letterSpacing: -0.04em
  display-hero-mobile:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 52px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-margin-desktop: 64px
  container-margin-mobile: 20px
  gutter: 24px
  section-gap: 80px
---

## Brand & Style
The design system is engineered for a high-stakes, cinematic sports experience. It leverages a **High-Contrast / Bold** aesthetic rooted in "Theatrical Noir"—utilizing deep blacks to create a boundless stage where athletes and action take center stage. 

The brand personality is authoritative yet energetic, balancing the prestige of luxury broadcasting with the raw intensity of live competition. The visual language uses "Light-as-Material," where metallic golds and vibrant highlights don't just act as color, but as the primary source of illumination and focus within a dark environment. The result is an immersive, premium interface that feels like a front-row seat at a championship event.

## Colors
The palette is dominated by a "Deep Charcoal" base to ensure the hardware—the screen—disappears, leaving only the content. 

- **Primary (Metallic Gold):** Used for structural accents, secondary CTAs, and refined borders. It conveys heritage and prestige.
- **Secondary (Vibrant Gold):** Reserved for high-energy interaction points, "Live" indicators, and primary call-to-actions. This color should "glow" against the dark background.
- **Neutral Dark:** The foundation. `#121212` for the base canvas, with `#1A1A1A` used for elevated surface containers to create depth without losing the theatrical atmosphere.
- **Neutral Light:** Pure White (`#FFFFFF`) is used sparingly for primary headings to ensure maximum legibility, while a "Silver Silk" tint is used for secondary body copy to reduce eye strain in dark mode.

## Typography
Typography in this design system is architectural. We utilize **Inter** across all levels, relying on extreme weight variance and tight letter-spacing to create a "sports editorial" feel. 

Headlines should be set with negative letter-spacing to feel compact and high-impact. Use the `display-hero` style for scoreboards and featured athlete names to command attention. For metadata—such as "LIVE," "QUARTER," or "MATCH STATS"—always use the `label-caps` style to maintain an organized, data-driven look that mimics professional broadcast overlays.

## Layout & Spacing
The layout follows a **Fluid Grid** model with generous outer margins to frame the content as a "premium" experience. 

- **Desktop:** A 12-column grid with 64px side margins. This "wide-frame" approach prevents content from feeling cramped and mirrors the 16:9 aspect ratio of cinematic sports.
- **Spacing Rhythm:** We use an 8px linear scale. Section gaps are intentionally large (80px+) to allow the dark space to "breathe," ensuring the user's eye is never overwhelmed by too many competing data points.
- **Reflow:** On mobile, the 12-column grid collapses to a 4-column system, and horizontal scrolling "carousels" are preferred over vertical stacking to maintain the "infinite reel" feeling of a streaming platform.

## Elevation & Depth
Depth is created through **Tonal Layers** and **Ambient Glows** rather than traditional drop shadows.

1.  **Base (Level 0):** `#121212` - The primary background.
2.  **Surface (Level 1):** `#1A1A1A` - For cards, navigation bars, and secondary sections.
3.  **Focus (Level 2):** Subtle "Gold Bloom." Active elements or hovered cards should emit a very soft, low-opacity outer glow using the Metallic Gold color (#A67C52) to simulate a light source hitting a metallic surface.

Glassmorphism is applied specifically to the global navigation bar (`backdrop-filter: blur(20px)`) to maintain a sense of content continuity as the user scrolls through high-resolution imagery.

## Shapes
This design system utilizes **Soft** geometry (Level 1). 

The 4px (`0.25rem`) base radius provides a modern, precision-engineered feel that aligns with high-performance sports equipment. Hard 90-degree angles are avoided to prevent the UI from feeling "dated" or "brutalist," but we also avoid heavy rounding to maintain a serious, professional athletic tone. 

- **Buttons & Inputs:** 4px radius.
- **Large Content Cards:** 8px (`rounded-lg`) to soften the impact of large imagery.
- **Status Chips:** 100px (Pill-shaped) to clearly distinguish them from interactive buttons.

## Components
- **Primary Buttons:** High-energy Vibrant Gold (#FFD700) with black text for maximum "click-intent." Use bold, uppercase labels.
- **Cards:** Borderless by default, using the #1A1A1A surface color. On hover, apply a 1px solid stroke of Metallic Gold (#A67C52) and a 5% scale increase to create an immersive "zoom" effect.
- **Input Fields:** Darker than the surface (`#0F0F0F`) with a thin 1px silver border. The focus state should transition the border to Vibrant Gold.
- **Live Indicators:** A pill-shaped chip with a pulsing #FFD700 dot, ensuring users can immediately identify real-time content.
- **Progress Bars (Scores/Time):** Use the Metallic Gold as the background track and the Vibrant Gold as the progress fill, creating a "liquid light" appearance.
- **Video Player Controls:** High-transparency glass overlays with white iconography. Controls should disappear entirely during inactivity to prioritize the broadcast.