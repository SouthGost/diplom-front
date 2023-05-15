/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';



const MyHeadlessTask = async () => {
    console.log('Receiving HeartBeat!');
    console.log("3");

};


AppRegistry.registerHeadlessTask('Heartbeat', () => MyHeadlessTask);
AppRegistry.registerComponent(appName, () => App);
