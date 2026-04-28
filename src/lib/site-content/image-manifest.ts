/**
 * Static manifest of images already in /public/images/.
 *
 * MVP picker source: admin sees this list as a dropdown. When new files are
 * added to public/images/, this manifest needs to be updated. A future sprint
 * will replace this with a backend endpoint that lists the directory.
 *
 * Grouping helps the picker show categories (statues vs team vs coins vs misc).
 */
export const IMAGE_MANIFEST = {
    statues: [
        "/images/statues/intro-statue.svg",
        "/images/statues/bridge-statue.svg",
    ],
    team: [
        "/images/team/amanda.jpg",
        "/images/team/thibault.jpg",
        "/images/team/lois.jpg",
        "/images/team/pye.jpg",
    ],
    coins: [
        "/images/coins/coin-frame.svg",
    ],
    branding: [
        "/images/logo.png",
        "/images/bg_image.png",
        "/images/bg_image_1.png",
        "/images/bg_1.png",
        "/images/footer.png",
        "/images/fav.png",
    ],
    legacy: [
        "/images/01.png",
        "/images/1.png",
        "/images/2.png",
        "/images/3.png",
        "/images/broken.png",
        "/images/partners.png",
        "/images/partners1.png",
        "/images/philosophy.png",
        "/images/slide1.png",
        "/images/ventureModel.png",
    ],
} as const;

export const ALL_IMAGES: string[] = [
    ...IMAGE_MANIFEST.statues,
    ...IMAGE_MANIFEST.team,
    ...IMAGE_MANIFEST.coins,
    ...IMAGE_MANIFEST.branding,
    ...IMAGE_MANIFEST.legacy,
];
