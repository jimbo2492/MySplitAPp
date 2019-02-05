import React, { Component } from 'react';
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, View } from 'react-native';
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
        show_differences: false,
        calc_text: ''
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

        var buf_payment = 0;
        var buf_dif = 0;

        for (let i = 0; i < payments.length; i++) {

            total_amount = total_amount + parseFloat(payments[i].value);

            for (let j = 0; j < persons.length; j++) {

                if (payments[i].person === persons[j].name) {
                    // console.log('im IF');

                    persons[j].total = parseFloat(persons[j].total) + parseFloat(payments[i].value);
                    // console.log(persons);
                }

                buf_dif = persons[j].total - total_amount / persons.length;
                buf_dif = parseFloat(buf_dif).toFixed(2);
                persons[j].dif = buf_dif;

            };
        };
        this.setState({ persons });
    }

    _calc_differences() {

        const persons_to_calc = this.state.persons;
        let max_dif, min_dif, round_error;

        let index_max = -1;
        let index_min = -1;
        let newLine = '';
        let amount = '';

        do {
            max_dif = 0;
            min_dif = 0;
            for (let i = 0; i < persons_to_calc.length; i++) {

                if (parseFloat(persons_to_calc[i].dif) > max_dif) {
                    max_dif = parseFloat(persons_to_calc[i].dif);
                    index_max = i;
                }
                if (parseFloat(persons_to_calc[i].dif) < min_dif) {
                    min_dif = parseFloat(persons_to_calc[i].dif);
                    index_min = i;
                }
            }

            if (Math.abs(max_dif) >= (Math.abs(min_dif))) {
                persons_to_calc[index_max].dif = Math.round((parseFloat(max_dif) + parseFloat(min_dif)) * 100) / 100;
                persons_to_calc[index_min].dif = Math.round((parseFloat(min_dif) - parseFloat(min_dif)) * 100) / 100;
                amount = min_dif;
            }
            else {
                persons_to_calc[index_max].dif = Math.round((parseFloat(max_dif) - parseFloat(max_dif)) * 100) / 100;
                persons_to_calc[index_min].dif = Math.round((parseFloat(min_dif) + parseFloat(max_dif)) * 100) / 100;
                amount = max_dif;
            }

            console.log(index_max, ' ', max_dif);
            console.log(index_min, ' ', min_dif);

            if (max_dif != 0 && min_dif != 0) {
                newLine = newLine + '\n\n' + persons_to_calc[index_min].name + ' bezahlt ' + Math.abs(amount) + '€ an ' + persons_to_calc[index_max].name
            }

        } while (max_dif != 0 && min_dif != 0);

        if (max_dif === 0) {
            round_error = min_dif;
            persons_to_calc[index_min].dif = 0;
        }
        if (min_dif === 0) {
            round_error = max_dif;
            persons_to_calc[index_max].dif = 0;
        }

        newLine = newLine + '\n\n' + ' Rundungsfehler: ' + Math.abs(round_error) + '€';

        this.setState({ calc_text: newLine });

        this.setState({ show_differences: true });

    }

    componentDidMount() {

        //console.log('Home didmount');
        Firebase.init();
        this._retrieveData();

    }


    componentDidUpdate() {

        // console.log('Home die Update');
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

        //console.log('Rendern');
        //console.log(this.state.persons);

        const persons = this.state.persons;

        if (this.state.isLoading)
            return (
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="darkorange" />
                </View>
            )

        if (this.state.show_differences)
            return (
                <View style={styles.container}>
                    <Text size="large" color="darkorange"> {this.state.calc_text} </Text>
                    <StyledButton
                        style={styles.backButton}
                        title="Zurück"
                        onPress={() => (
                            this.setState({ show_differences: false }),
                            this._retrieveData()
                        )}
                        visible={true}
                    />
                </View>
            )
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
                <StyledButton
                    style={styles.calcButton}
                    title="Berechnung"
                    onPress={() => (
                        //this.setState({ fromNewPersonScreen: true }),
                        this._calc_differences()
                    )}
                    visible={true}
                />
                <FlatList

                    data={this.state.persons}
                    onRefresh={this._refresh}
                    refreshing={this.state.isLoading}
                    keyExtractor={item => item.name}
                    ItemSeparatorComponent={() => <View style={styles.listSeperator} />}
                    renderItem={({ item, index }) => (
                        <View >
                            <View>
                                <Text style={{ fontSize: 20 }}> {item.name} </Text>
                            </View>
                            <View>
                                <Text>     Gesamtausgaben: {item.total} €</Text>
                            </View>
                            <View>
                                <Text>     Differenz: {item.dif} €</Text>
                            </View>
                        </View>

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
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    newButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
    },
    calcButton: {
        position: 'absolute',
        right: 20,
        bottom: 120,
    },
    backButton: {
        position: 'absolute',
        right: 20,
        bottom: 120,
    },
    listSeperator: {
        height: 10
    }
});
