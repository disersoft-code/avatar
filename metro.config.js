const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
    const config = getDefaultConfig(__dirname);

    const { resolver } = config;

    config.resolver = {
        ...resolver,
        assetExts: [
            resolver.assetExts.filter((ext) => ext !== "svg"),
            "glb",
            "gltf",
            "png",
            "jpg",
            "ttf",
            "fbx",
            "mp3",
        ],
        sourceExts: [
            ...resolver.sourceExts,
            "svg",
            "js",
            "jsx",
            "json",
            "ts",
            "tsx",
            "cjs",
            "mjs",
        ],
    };

    return config;
})();