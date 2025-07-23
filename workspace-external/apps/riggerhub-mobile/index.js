/**
 * RiggerHub Mobile App Entry Point
 * Enterprise-grade construction workforce management platform
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Register the main application component
AppRegistry.registerComponent(appName, () => App);

export default App;