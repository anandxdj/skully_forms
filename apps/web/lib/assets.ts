export const ASSETS = {
  logos: {
    symbol: "/assets/logos/logo-symbol.svg",
    wordmarkDark: "/assets/logos/logo-wordmark-dark.svg",
    wordmarkLight: "/assets/logos/logo-wordmark-light.svg",
  },
  illustrations: {
    emptyDashboard: "/assets/illustrations/illustration-empty-dashboard.svg",
    submissionSuccess: "/assets/illustrations/illustration-submission-success.svg",
    // Hero skeleton (boba — light theme, transparent bg)
    heroSkeleton: "/assets/illustrations/illustration-hero-skeleton.png",
    heroSkeletonDark: "/assets/illustrations/illustration-hero-skeleton.png",
    // Legacy keys kept for compatibility
    developerSkeletonLight: "/assets/skeletons/Skeleton%20with%20laptop.png",
    developerSkeletonDark: "/assets/skeletons/Skeleton%20with%20laptop.png",
    gamerSkeletonLight: "/assets/skeletons/Skeleton%20Gaming.png",
    gamerSkeletonDark: "/assets/skeletons/Skeleton%20Gaming.png",
    skaterSkeletonLight: "/assets/skeletons/Skeleton%20with%20skateboard.png",
    skaterSkeletonDark: "/assets/skeletons/Skeleton%20with%20skateboard.png",
    successSkeletonLight: "/assets/skeletons/Skeleton%20Dancing.png",
    successSkeletonDark: "/assets/skeletons/Skeleton%20Dancing.png",
    emptyBoxSkeletonLight: "/assets/skeletons/skeleton_in_box.png",
    emptyBoxSkeletonDark: "/assets/skeletons/skeleton_in_box.png",
  },
  skeletons: {
    gaming: "/assets/skeletons/Skeleton%20Gaming.png",
    laptop: "/assets/skeletons/Skeleton%20with%20laptop.png",
    writingDiary: "/assets/skeletons/Skeleton_Writing_Diary.png",
    cookieHoodie: "/assets/skeletons/Skeleton%20with%20jacket%20with%20cookie.png",
    moneyBag: "/assets/skeletons/skeleton_with_money.png",
    inBox: "/assets/skeletons/skeleton_in_box.png",
    greenPlants: "/assets/skeletons/Green-skeleton-with-plants.png",
    skateboard: "/assets/skeletons/Skeleton%20with%20skateboard.png",
    dancing: "/assets/skeletons/Skeleton%20Dancing.png",
    greenCap: "/assets/skeletons/Green%20skeleton%20with%20cap.png",
  },
  backgrounds: {
    pink: "/assets/background/pink%20background.png",
    pinkCloud: "/assets/background/pink%20Cloud%20Background.png",
    pinkToo: "/assets/background/pink%20background%20too.png",
    pinkStage: "/assets/background/pink%20stage.png",
    dark: "/assets/background/dark%20background.png",
    dark2: "/assets/background/Dark%20Background%202.png",
    leaf: "/assets/background/Leaf%20Background.png",
    goldenLeaf: "/assets/background/Golden%20Leaf.png",
    frame: "/assets/background/frame_052%202.png",
  },
  funSkeletons: {
    flowers:       "/assets/fun_skeleton/frame_001%202.png",
    skateboarder:  "/assets/fun_skeleton/frame_002%202.png",
    boba:          "/assets/fun_skeleton/frame_005%202.png",
    laptop:        "/assets/fun_skeleton/frame_008%202.png",
    detective:     "/assets/fun_skeleton/frame_012%202.png",
    guitar:        "/assets/fun_skeleton/frame_015%202.png",
    flamingo:      "/assets/fun_skeleton/frame_018%202.png",
    sleeping:      "/assets/fun_skeleton/frame_020%202.png",
    skateboard2:   "/assets/fun_skeleton/frame_025%202.png",
    corgi:         "/assets/fun_skeleton/frame_030%202.png",
    wizard:        "/assets/fun_skeleton/frame_035%202.png",
    dj:            "/assets/fun_skeleton/frame_040%202.png",
    birthday:      "/assets/fun_skeleton/frame_045%202.png",
    beachChair:    "/assets/fun_skeleton/frame_050%202.png",
  },
  textures: {
    gridOverlay: "/assets/textures/texture-grid-sunset.svg",
    darkMesh: "/assets/textures/texture-mesh-dark.webp",
  },
  icons: {
    cyberSkully: "/assets/icons/icon-custom-cyberpunk-skull.svg",
  },
} as const;

export type AssetRegistry = typeof ASSETS;
export type AssetGroup = keyof AssetRegistry;
export type AssetKey<G extends AssetGroup> = keyof AssetRegistry[G];
export type AssetPathValue<G extends AssetGroup, K extends AssetKey<G>> = AssetRegistry[G][K];
