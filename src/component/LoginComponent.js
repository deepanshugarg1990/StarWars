import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import LoginScreen from "../screens/LoginScreen";
import Alert from '../utils/alert'
import * as Strings from "../utils/String";
import * as Utility from "../utils/Utility";

export default class LoginComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            password: '',
            isLoading: false
        }
    }

    async componentDidMount() {
        let isLogin = await Utility.getAsyncStorage(Strings.IS_LOGIN);
        if (isLogin === "true") {
            this.props.navigation.replace('searchContainer')
        }
    }


    render() {
        return (
            <View style={{flex: 1}}>
                {this.state.isLoading && <ActivityIndicator
                    style={styles.activityIndicatorStyle}
                    color='yellow'
                    size="large"
                />
                }

                <LoginScreen
                    state={this.state}
                    style={styles.bottom}
                    onTextUpdate={this.textUpdate}
                    onLoginPress={this.loginPress}
                />
            </View>
        )
    }

    loginPress = () => {
        if (this.state.userName.trim() === '') {
            Alert(Strings.ERROR, "User Name is empty")
        } else if (this.state.password.trim() === '') {
            Alert(Strings.ERROR, "Password is empty")
        } else {
            this.setState({isLoading: true});
            if (this.loginApiCall()) {
                Utility.setAsyncStorage(Strings.IS_LOGIN, "true");
                this.props.navigation.replace('searchContainer');
            } else {
                this.setState({isLoading: false});
                const title = 'Unable to sign in';
                const message = 'The username or password that you typed is incorrect';
                alert(title, message);
            }
        }
    };

    loginApiCall = () => {
        let authenticated = false;
        let url = `https://swapi.co/api/people/?search=${this.state.userName.trim()}`;
        return fetch(url).then(response => {
            return response.json();
        }).then(responseJson => {
            if (responseJson.results) {
                let name = responseJson.results[0].name;
                let birthYear = responseJson.results[0].birth_year;
                authenticated = this.state.userName.trim().toLowerCase() === name.toLowerCase() && this.state.password.trim() === birthYear;
            }
            return authenticated;
        }).catch(error => console.log('Error fetching data:', error));
    };


    textUpdate = (value, text) => {
        switch (value) {
            case 'username':
                this.setState({userName: text});
                break;
            case 'password':
                this.setState({password: text});
                break;
        }

    }

};


const styles = StyleSheet.create({
    bottom: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 36
    },
    activityIndicatorStyle: {
        position: 'absolute',
        alignSelf: 'center',
        justifyContent: 'center',
        flex: 1,
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        zIndex: 2
    }

});

