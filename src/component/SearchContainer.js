import React, {Component} from 'react';
import {ActivityIndicator, FlatList, Keyboard, Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Icon} from 'native-base';
import * as Utility from "../utils/Utility";
import * as Strings from "../utils/String";
import SearchScreen from "../screens/SearchScreen";

export default class SearchContainer extends Component {

    static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state;
        return {
            title: Strings.SEARCH_SCREEN,
            headerRight: <Icon name="log-out" style={{fontSize: 25, color: "black", marginRight: 10}} size={25}
                               onPress={() => params.logout()}/>
        };
    };

    constructor(props) {
        super(props);


    }

    componentDidMount() {
        this.props.navigation.setParams({logout: this.logout});
    }


    logout = () => {
        Utility.setAsyncStorage(Strings.IS_LOGIN, "");
        this.props.navigation.replace('loginScreen');
    };

    render() {
        return (<SearchScreen
            onpress={this.onPressItem}
        />)

    }

    onPressItem = (items) => {
        this.props.navigation.navigate('detailCardContainer', {item: items});

    }

}