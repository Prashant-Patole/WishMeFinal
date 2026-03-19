module.exports = function (api) {
  // Disable Babel cache to prevent stale React Compiler transforms in release builds.
  // This is required when newArchEnabled=true and reactCompiler=false.
  api.cache(false);

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin"
    ]
  };
};
