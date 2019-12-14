import { Alert, AlertIOS, Platform } from 'react-native';

const alert = (title, message) => {
    if (Platform.OS === 'ios') {
        AlertIOS.alert(title, message);
    } else if (Platform.OS === 'android') {
        Alert.alert(title, message);
    }
};

export default alert;