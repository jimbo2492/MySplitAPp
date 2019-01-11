import React, { Component } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
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



export default class HomeScreen extends Component {

    state = {
        index: 0,
        persons: [],
        isLoading: true,
        fromNewPersonScreen: false,
        newPerson: '',
        /*payments: [
            { name: 'Einkauf', value: 50, person: 'Waude' },
            { name: 'Tickets', value: 22, person: 'Luki' },
            { name: 'Eintritt', value: 40, person: 'Laura' },
        ]*/
        payments: [],
    }

    _retrieveData = async () => {
        let persons = [];
        let payments = [];

        let query = await Firebase.db.collection('persons').get();
        query.forEach(person => {
            persons.push({
                id: person.id,
                name: person.data().name,
                total: person.data().total,
                dif: person.data().dif
            });
        });
        this.setState({ persons });

        let query_ = await Firebase.db.collection('payments').get();
        query_.forEach(payment => {
            payments.push({
                id: payment.id,
                title: payment.data().title,
                person: payment.data().person,
                value: payment.data().value
            });
        });
        this.setState({ payments });
        this.setState({ isLoading: false });

        this._calculate();

    };

    _savePersonToDB = async (name, total, dif) => {
        //console.log('los gehts');
        docRef = await Firebase.db.collection('persons').add({ name, total, dif })
        //console.log('durch');
        //persons[persons.length - 1].id = docRef.id;
        this._retrieveData();
    }


    _removePersonFromoDB(id) {
        Firebase.db.collection('persons').doc(id).delete();
    }


    _addPerson = (name) => {

        //console.log('los gehts');
        const total = 0, dif = 0;

        let { persons } = this.state;
        if (name) {
            persons.push({ name: name, total: 0, dif: 0 });
            this._savePersonToDB(name, total, dif);
        }
        this.setState({ index: persons.length - 1, persons: persons });

    }

    _calculate() {

        const payments = this.state.payments;
        const persons = this.state.persons;
        let total_amount = 0;

        for (let i = 0; i < payments.length; i++) {

            total_amount = total_amount + parseFloat(payments[i].value);

            for (let j = 0; j < persons.length; j++) {

                if (payments[i].person === persons[j].name) {
                    // console.log('im IF');

                    persons[j].total = payments[i].value;
                    // console.log(persons);
                }

                persons[j].dif = persons[j].total - total_amount / persons.length;

            };
        };
        this.setState({ persons });
    }

    componentDidMount() {

        //console.log('Home didmount');
        Firebase.init();
        this._retrieveData();

    }


    componentDidUpdate() {

        console.log('Home die Update');
        const name = this.props.navigation.getParam('newPerson', '');

        //console.log('bin hier mit state = ', this.state.newPerson, 'und name = ', name)
        if (this.state.newPerson != name) {
            this.setState({ fromNewPersonScreen: false });
            this.setState({ newPerson: name });
            //console.log('addPerson', name);
            this._addPerson(name);
            this._retrieveData();

        }

    }

    render() {

        console.log('Rendern');
        console.log(this.state.persons);

        const persons = this.state.persons;

        return (
            <View style={styles.container}>
                <StyledButton
                    style={styles.newButton}
                    title="Neue Person"
                    onPress={() => (
                        this.setState({ fromNewPersonScreen: true }),
                        this.props.navigation.navigate('NewPersonScreen')
                    )}
                    visible={true}
                />
                <FlatList

                    data={this.state.persons}

                    keyExtractor={item => item.name}

                    renderItem={({ item, index }) => (
                        <Text>{item.name}, {item.total}, {item.dif}</Text>

                    )}

                    extraData={this.state}
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
