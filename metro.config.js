const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Required for expo-router/entry resolution
config.resolver.unstable_enablePackageExports = true;

// Force react and react-native to always resolve from THIS project's node_modules.
// Prevents duplicate React instance crash ("useState of null") that happens when
// multiple node_modules directories exist (e.g. parent folder also has node_modules).
const projectNodeModules = path.resolve(__dirname, "node_modules");

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "react" || moduleName === "react-native") {
    return context.resolveRequest(
      {
        ...context,
        originModulePath: path.resolve(projectNodeModules, "react/index.js"),
      },
      moduleName,
      platform
    );
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
