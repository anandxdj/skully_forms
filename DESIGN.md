# Skully Forms — Design System

## Color Tokens (Tailwind v4 OKLCH)

### Light Mode (`:root`)
| Token | OKLCH | Hex approx | Role |
|---|---|---|---|
| `--background` | `oklch(0.985 0.005 70)` | #FAF8F5 | Warm cream page bg |
| `--foreground` | `oklch(0.18 0.005 70)` | #1B1917 | Deep charcoal text |
| `--card` | `oklch(0.99 0.003 70)` | #FCFAF8 | Card surface |
| `--primary` | `oklch(0.72 0.11 12)` | #ed9194 | Rose-pink CTA |
| `--primary-foreground` | `oklch(1 0 0)` | white | Text on primary |
| `--muted` | `oklch(0.96 0.008 70)` | — | Muted bg |
| `--muted-foreground` | `oklch(0.55 0.005 70)` | #757169 | Secondary text |
| `--border` | `oklch(0.92 0.006 70)` | #E2DFD8 | Soft border |

### Dark Mode (`.dark`)
| Token | OKLCH | Role |
|---|---|---|
| `--background` | `oklch(0 0 0)` | Pure black |
| `--card` | `oklch(0.12 0 0)` | Near-black card |
| `--primary` | `oklch(0.55 0.22 25)` | Vibrant red |
| `--border` | `oklch(1 0 0 / 10%)` | Low-opacity white |

### Brand Accent (both modes — intentional hardcoded)
- `#ff2e8c` — hot pink glow, hover rings, active indicators
- `#9d4edd` — purple secondary accent, gradients
- `#00f5ff` — cyan accent (logic branching feature)

## Typography
- **Font**: system sans (Next.js default), `font-sans`
- **Scale**: `text-4xl`/`font-black` headings → `text-xs`/`font-semibold` body
- **Hero heading**: `text-4xl sm:text-5xl md:text-[56px] font-black tracking-tight leading-[1.15]`
- **Section label**: `text-xs font-black tracking-widest uppercase text-[#ff2e8c]`
- **Card title**: `text-xs font-black`
- **Body**: `text-sm text-muted-foreground leading-relaxed`

## Spacing & Radius
- Base radius: `0.75rem` (12px) — `rounded-xl` is the standard
- Cards: `rounded-2xl`
- Buttons: `rounded-xl`
- Section padding: `py-24`
- Max content width: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`

## Elevation
- Cards: `shadow-sm` default, `shadow-lg` on hover
- Modals: `shadow-2xl`
- CTAs: `shadow-md shadow-primary/10`
- Glow variants: `shadow-[0_0_30px_rgba(255,46,140,0.1)]` on feature cards

## Component Patterns

### Primary Button
```tsx
className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold text-primary-foreground bg-primary hover:opacity-95 rounded-xl transition-all shadow-md shadow-primary/10 hover:scale-[1.02] active:scale-[0.98]"
```

### Ghost Button
```tsx
className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold text-foreground border border-border bg-background/50 hover:bg-muted/50 rounded-xl transition-all"
```

### Form Input (underline style)
```tsx
className="w-full bg-background border-b border-border/85 focus:border-primary text-xs py-2 px-1 outline-none text-foreground transition-colors font-semibold"
```

### Stat Chip
```tsx
className="px-2 py-0.5 text-3xs font-extrabold rounded-full bg-primary/10 border border-primary/20 text-primary uppercase tracking-wide"
```

## Illustration Usage
All illustrations imported via `ASSETS` from `apps/web/lib/assets.ts`.  
Never hardcode paths. Always wrap in `{mounted ? <Image ...> : <skeleton>}` for hydration safety.

| Key | Light file | Dark file | Used on |
|---|---|---|---|
| `heroSkeleton` / `heroSkeletonDark` | illustration-hero-skeleton.png | illustration-hero-skeleton-dark.png | Landing hero |
| `developerSkeletonLight` / `developerSkeletonDark` | illustration-developer-skeleton-light.png | illustration-developer-skeleton-dark.png | Login right panel |
| `gamerSkeletonLight` / `gamerSkeletonDark` | illustration-gamer-skeleton-light.png | illustration-gamer-skeleton-dark.png | Success / celebration |
| `emptyBoxSkeletonLight` / `emptyBoxSkeletonDark` | illustration-box-skeleton-light.png | illustration-box-skeleton-dark.png | Empty state / forgot password |
| `successSkeletonLight` / `successSkeletonDark` | illustration-success-skeleton-light.png | illustration-success-skeleton-dark.png | Form submit success |

## Animation
- Float: `animation: float 6s ease-in-out infinite` on hero illustrations
- Pulse glow: `animation: pulseGlow 4s infinite ease-in-out` on phone mockup
- Transition default: `transition-all duration-200`
- Scale micro-interactions: `hover:scale-[1.02] active:scale-[0.98]`
- No bounce, no elastic. Exponential ease-out only.

## Public Form Themes (ThemeWrapper)
Four named themes inject CSS custom properties directly on the container:
- `slate` — dark gray professional
- `cyberpunk` — pitch black + neon pink + cyan
- `sunset` — warm burgundy + amber
- `forest` — deep emerald + mint
