import AppNavigator from './js/AppNavigator';
import React, { Component } from 'react';

export default class App extends Component {

  state = {
    persons: [],
    payments: [],
  };


  render() {
    return <AppNavigator persons={this.state.persons} payments={this.state.payments} />;
  }
}
