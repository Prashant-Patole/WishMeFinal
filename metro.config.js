const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const mobileModules = path.resolve(projectRoot, "node_modules");

const config = getDefaultConfig(projectRoot);

// Required for expo-router/entry resolution
config.resolver.unstable_enablePackageExports = true;

// Force react and react-native to always resolve from THIS project's node_modules.
// Prevents duplicate React instance crash ("useState of null") that can happen
// when another node_modules directory exists at a parent level.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "react" || moduleName === "react-native") {
    const resolved = require.resolve(moduleName, { paths: [mobileModules] });
    return { filePath: resolved, type: "sourceFile" };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
