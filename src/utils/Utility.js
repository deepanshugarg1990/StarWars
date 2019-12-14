import {AsyncStorage} from "react-native";

export async function getAsyncStorage(key) {
    try {
        const data = await AsyncStorage.getItem(key);
        return data;
    } catch (error) {
        Utility.log(error);
    }
}

export function setAsyncStorage(key, item) {
    try {
        AsyncStorage.setItem(key, item);
    } catch (error) {
        Utility.log(error);
    }
}

