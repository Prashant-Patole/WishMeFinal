module.exports = function (api) {
  // Disable Babel cache to prevent stale React Compiler transforms in release builds.
  api.cache(false);

  return {
    presets: [["babel-preset-expo", { unstable_transformImportMeta: true }]],
  };
};
