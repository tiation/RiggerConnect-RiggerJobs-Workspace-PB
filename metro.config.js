const { getDefaultConfig } = require('@expo/metro-config');

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);
  
  // Add custom configuration to handle package naming collisions
  config.resolver.blockList = [
    /apps\/worker-web\/.*/, // Exclude the worker-web package
    /apps\/mobile-ios\/web\/.*/, // Exclude mobile-ios web package
    /tiation-rigger-platform\/apps\/mobile\/.*/, // Exclude tiation-rigger-platform mobile app
  ];
  
  // Configure watchman to ignore node_modules
  config.watchFolders = [__dirname];
  config.resolver.nodeModulesPaths = [__dirname + '/node_modules'];

  return config;
})();
