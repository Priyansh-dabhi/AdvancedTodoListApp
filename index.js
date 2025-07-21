/**
 * @format
 */

import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './Src/App.tsx';
import { name as appName } from './app.json';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const RootApp = () => (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <App />
    </GestureHandlerRootView>
);
AppRegistry.registerComponent(appName, () => RootApp);
