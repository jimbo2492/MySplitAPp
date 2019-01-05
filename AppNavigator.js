import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
    createAppContainer,
    createBottomTabNavigator,
    createStackNavigator
} from 'react-navigation';

import { Icon } from 'expo';
import HomeScreen from './Screens/HomeScreen';
import PaymentsScreen from './Screens/PaymentsScreen';
import NewPersonScreen from './Screens/NewPersonScreen';


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
        screen: PaymentsScreen,
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
