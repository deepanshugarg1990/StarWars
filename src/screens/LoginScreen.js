import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button, Form, Input, Item, Label} from 'native-base';
import * as Strings from "../utils/String";

export default class LoginScreen extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.bottom}>
                <Form>
                    <Text style={styles.signInStyle}>{Strings.SIGN_IN}</Text>
                    <Item floatingLabel>
                        <Label>{Strings.USER_NAME}</Label>
                        <Input
                            style={styles.input}
                            autoCapitalize='none'
                            autoCorrect={false}
                            value={this.props.state.userName}
                            onChangeText={(text) => this.props.onTextUpdate('username', text)}
                        />
                    </Item>
                    <Item floatingLabel last>
                        <Label>{Strings.PASSWORD}</Label>
                        <Input
                            style={styles.input}
                            secureTextEntry
                            value={this.props.state.password}
                            onChangeText={(text) => this.props.onTextUpdate('password', text)}
                        />
                    </Item>
                </Form>

                <View style={styles.buttonContainer}>
                    <Button style={{flex: 1, textAlign: 'center', justifyContent: 'center'}}
                            transparent light
                            onPress={this.props.onLoginPress}>
                        <Text>{Strings.SIGN_IN}</Text>
                    </Button>
                </View>
            </View>
        )
    }

};


const styles = StyleSheet.create({
    content: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    input: {
        color: "black"
    },
    buttonContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 15,
        marginHorizontal: 15,
        backgroundColor: 'yellow'
    },
    bottom: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 50
    },
    signInStyle: {
        alignSelf: 'center',
    }
});

