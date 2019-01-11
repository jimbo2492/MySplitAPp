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


    state = {
        index: 0,
        persons: [],
        payments: [],
        isLoading: true,
        fromNewPaymentScreen: false,
        newPaymentTitle: '',
        newPaymentPerson: '',
        newPaymentValue: '',
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


    };

    _savePaymentToDB = async (title, person, value) => {
        //console.log('los gehts');
        docRef = await Firebase.db.collection('payments').add({ title, person, value })
        //console.log('durch');
        //persons[persons.length - 1].id = docRef.id;
        this._retrieveData();
    }

    _addPayment = (title, person, value) => {

        //console.log('los gehts');

        let { payments } = this.state;

        if ((title) && (person) && (value)) {
            payments.push({ title: title, person: person, value: value });
            this._savePaymentToDB(title, person, value);
        }
        this.setState({ index: payments.length - 1, payments: payments });
        //console.log('neues payment: ' + this.state.payments)

    }



    componentDidMount() {

        console.log('Payment didmount');
        this._retrieveData();
    }

    componentDidUpdate() {

        const title = this.props.navigation.getParam('title', '');
        const person = this.props.navigation.getParam('person', '');
        const value = this.props.navigation.getParam('value', '');

        //console.log('bin hier mit state = ', this.state.newPerson, 'und name = ', name)
        if ((this.state.newPaymentTitle != title) && (this.state.newPaymentPerson != person) && (this.state.newPaymentValue != value)) {
            this.setState({ fromNewPaymentScreen: false });
            this.setState({ newPaymentTitle: title });
            this.setState({ newPaymentPerson: person });
            this.setState({ newPaymentValue: value });
            //console.log('addPerson', name);
            this._addPayment(title, person, value);
            this._retrieveData();

        }

    }

    render() {
        return (
            <View style={styles.container}>
                <StyledButton
                    style={styles.newButton}
                    title="Neue Zahlung"
                    onPress={() => this.props.navigation.navigate('NewPaymentScreen')}
                    visible={true}
                />
                <FlatList

                    data={this.state.payments}

                    keyExtractor={item => item.title}
                    renderItem={({ item }) => (
                        <Text>{item.title}, {item.value}, {item.person}</Text>
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
