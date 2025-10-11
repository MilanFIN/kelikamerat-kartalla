/** Supported map types */
export const MapType = {
    BRIGHT: "bright",
    DARK: "dark",
} as const;

export type MapType = typeof MapType[keyof typeof MapType];

/** Map tile URL mapping for each map type */
export const TILE_URLS: Record<MapType, string> = {
    [MapType.BRIGHT]: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    [MapType.DARK]:
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
};
