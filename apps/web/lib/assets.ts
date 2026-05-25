/**
 * Strongly-typed asset path registry.
 * AI developers and human developers MUST use this constant map instead of hardcoding raw strings.
 * This guarantees path correctness and enables TypeScript compiler checks for assets.
 */
export const ASSETS = {
  logos: {
    // Brand logos
    symbol: "/assets/logos/logo-symbol.svg",
    wordmarkDark: "/assets/logos/logo-wordmark-dark.svg",
    wordmarkLight: "/assets/logos/logo-wordmark-light.svg",
  },
  illustrations: {
    // Page state illustrations
    emptyDashboard: "/assets/illustrations/illustration-empty-dashboard.svg",
    submissionSuccess: "/assets/illustrations/illustration-submission-success.svg",
  },
  textures: {
    // Backdrop background grids and meshes
    gridOverlay: "/assets/textures/texture-grid-sunset.svg",
    darkMesh: "/assets/textures/texture-mesh-dark.webp",
  },
  icons: {
    // Custom non-standard SVG icons (use Lucide React for standard dashboard items)
    cyberSkully: "/assets/icons/icon-custom-cyberpunk-skull.svg",
  }
} as const;

export type AssetRegistry = typeof ASSETS;
export type AssetGroup = keyof AssetRegistry;
export type AssetKey<G extends AssetGroup> = keyof AssetRegistry[G];
export type AssetPathValue<G extends AssetGroup, K extends AssetKey<G>> = AssetRegistry[G][K];
