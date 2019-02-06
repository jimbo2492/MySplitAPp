import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer, createBottomTabNavigator, createStackNavigator} from 'react-navigation';
import { Icon } from 'expo';

//Import eingener Dateien
import HomeScreen from './Screens/HomeScreen';
import PaymentsScreen from './Screens/PaymentsScreen';
import NewPersonScreen from './Screens/NewPersonScreen';
import NewPaymentScreen from './Screens/NewPaymentScreen';


//HomeStack -> Übersichtsseite und Seite zum Hinzufügen von Personen
const HomeStack = createStackNavigator({

    HomeScreen,
    NewPersonScreen

}, {
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: 'aliceblue'
            }
        }

    })

//PaymentStack -> Übersichtsseite der Zahlungen und Hinzufügen von Zahlungen
const PaymentStack = createStackNavigator({

    PaymentsScreen,
    NewPaymentScreen

}, {
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: 'aliceblue'
            }
        }

    })

//TabNavigator enthält die zwei definierten Stacks
const TabNavigator = createBottomTabNavigator({
    Home: {
        screen: HomeStack,
        navigationOptions: {
            title: 'Übersicht',
            tabBarIcon: ({ tintColor }) => (
                <Icon.Feather name="home" size={24} color={tintColor} />
            ),
        }

    },
    payments: {
        screen: PaymentStack,
        navigationOptions: {
            title: 'Zahlungen',
            tabBarIcon: ({ tintColor }) => (
                <Icon.Feather name="credit-card" size={24} color={tintColor} />
            ),
        }
    }
},
    {
        tabBarOptions: {
            activeTintColor: 'darkorange',
            style: {
                backgroundColor: 'aliceblue'
            }
        }
    }
);

export default createAppContainer(TabNavigator);
