import React, { Component } from 'react';
import { StyleSheet, Text, Button, Modal, View, TextInput } from 'react-native';
import { createAppContainer, createBottomTabNavigator } from 'react-navigation';


export default class NewPaymentScreen extends Component {


    state = {
        index: 0,
        persons: [],
        content_title: null,
        content_person: null,
        content_value: null,
        isLoading: true,
    }

    _addPayment = () => {
        const title = this.state.content_title;
        const person = this.state.content_person;
        const value = this.state.content_value;

        this.props.navigation.navigate('PaymentsScreen', { title: title, person: person, value: value });
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
                        placeholder="Titel"
                        onChangeText={text => this.setState({ content_title: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Person"
                        onChangeText={text => this.setState({ content_person: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Betrag"
                        keyboardType='phone-pad'
                        onChangeText={text => this.setState({ content_value: text })}
                    />
                    <Button
                        title="Speichern"
                        onPress={() => {
                            this._addPayment()
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
