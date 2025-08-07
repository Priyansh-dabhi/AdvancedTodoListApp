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
            ['react-native-dotenv', {
                moduleName: '@env',
                path: '.env',
                blacklist: null,
                whitelist: null,
                safe: false,
                allowUndefined: true,
                verbose: false,
            }],
    // 'nativewind/babel',
    'react-native-reanimated/plugin',
  ],
};
