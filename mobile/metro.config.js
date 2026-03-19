const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const fs = require("fs");

const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

config.resolver.unstable_enablePackageExports = true;

// Only pin React/React Native resolution when running inside a monorepo
// (e.g. the Replit workspace) where a parent node_modules could supply a
// duplicate React instance and cause "useState of null" crashes.
// On EAS Build servers there is no parent node_modules, so we skip this.
const parentNodeModules = path.resolve(projectRoot, "..", "node_modules");
if (fs.existsSync(parentNodeModules)) {
  const mobileModules = path.resolve(projectRoot, "node_modules");
  config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (moduleName === "react" || moduleName === "react-native") {
      try {
        const resolved = require.resolve(moduleName, { paths: [mobileModules] });
        return { filePath: resolved, type: "sourceFile" };
      } catch (_) {
        // fall through to default resolver
      }
    }
    return context.resolveRequest(context, moduleName, platform);
  };
}

module.exports = config;
