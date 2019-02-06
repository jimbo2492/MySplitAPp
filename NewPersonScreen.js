import React, { Component } from 'react';
import { StyleSheet, Text, Button, Modal, View, TextInput } from 'react-native';
import { createAppContainer, createBottomTabNavigator } from 'react-navigation';


export default class NewPersonScreen extends Component {


    state = {
        index: 0,
        persons: [],
        content: null,
        isLoading: true,
    }

    _addPerson = () => {
        const name = this.state.content;
        this.props.navigation.navigate('HomeScreen', { newPerson: name, });
    }


    render() {

        const navigation = this.props.navigation;

        return (
            <Modal
                animationType="slide"
                onRequestClose={() => {
                    navigation.goBack();
                }
                }
            >
                <View style={styles.container}>
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        onChangeText={text => this.setState({ content: text })}
                    />
                    <Button
                        title="Speichern"
                        onPress={() => {
                            this._addPerson()
                        }
                        }
                    />
                </View>
            </Modal >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: 'deepskyblue',
        borderRadius: 4,
        width: '80%',
        marginBottom: 20,
        fontSize: 20,
        padding: 10,
        height: 50

    }
});
