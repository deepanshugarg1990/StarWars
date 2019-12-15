import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import {SearchContainer, LoginComponent} from './src/component'
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

const AppStackNavigator = createStackNavigator({
    loginScreen: {
        screen: LoginComponent, navigationOptions: {header: null},
    },
    searchContainer:{
        screen: SearchContainer
    }
});


AppRegistry.registerComponent(appName, () => createAppContainer(AppStackNavigator));
