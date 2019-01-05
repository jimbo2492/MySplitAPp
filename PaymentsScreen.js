import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, FlatList, TextInput } from 'react-native';
import { createAppContainer, createBottomTabNavigator } from 'react-navigation';

import Firebase from '../../js/Firebase';


function StyledButton(props) {
    if (props.visible) {
        return (
            <View style={props.style}>
                <Button title={props.title} onPress={props.onPress} />
            </View>
        )
    }
    else {
        return null;
    }
}

export default class SettingsScreen extends Component {

    _retrieveData = async () => {
        let persons = [];
        let query = await Firebase.db.collection('persons').get();
        query.forEach(person => {
            persons.push({
                id: person.id,
                name: person.data().name,
                total: person.data().total,
                dif: person.data().dif
            });
        });
        this.setState({ persons, isLoading: false });
        console.log({ persons });
    };

    componentDidMount() {

        console.log('Payment didmount');
        this._retrieveData();
    }

    render() {
        return (
            <View style={styles.container}>
                <StyledButton
                    style={styles.newButton}
                    title="Neue Zahlung"
                    onPress={() => this.props.navigation.navigate('NewPersonScreen')}
                    visible={true}
                />
                <FlatList

                    data={[
                        { name: 'Einkauf', value: 50, person: 'Waude' },
                        { name: 'Tickets', value: 22, person: 'Luki' },
                        { name: 'Eintritt', value: 40, person: 'Laura' },
                    ]}

                    keyExtractor={item => item.name}
                    renderItem={({ item }) => (
                        <Text>{item.name}, {item.value}, {item.person}</Text>
                    )}
                />

            </View>
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
    newButton: {
        position: 'absolute',
        left: 10,
        top: 40,
    },
});