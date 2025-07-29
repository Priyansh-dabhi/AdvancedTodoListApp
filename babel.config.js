// babel.config.js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './', // NOT './src'
        },
      },
    ],
    // 'nativewind/babel',
    'react-native-reanimated/plugin',
  ],
};
