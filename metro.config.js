// const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
// const { withNativeWind } = require('nativewind/metro');

// /**
//  * Metro configuration
//  * https://reactnative.dev/docs/metro
//  *
//  * @type {import('@react-native/metro-config').MetroConfig}
//  */
// const config = {};

// module.exports = mergeConfig(getDefaultConfig(__dirname), config);

// module.exports = withNativeWind(config, { input: './global.css' })


// const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
// const { withNativeWind } = require('nativewind/metro');

// // Get the base config
// const defaultConfig = getDefaultConfig(__dirname);

// // Merge NativeWind with Metro
// const config = withNativeWind(defaultConfig, {
//   input: './global.css', 
// });

// module.exports = config;

// const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
// const { withNativeWind } = require('nativewind/metro');

// const config = {};

// module.exports = withNativeWind(
//     mergeConfig(getDefaultConfig(__dirname), config)
// );

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);