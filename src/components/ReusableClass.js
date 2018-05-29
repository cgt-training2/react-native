import React, { Component } from 'react';

import {
  Platform,
  StyleSheet,
  Text,
  View, 
  Button,
  TextInput,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  BackHandler,
  Dimensions
} from 'react-native';


export default class ReusableClass extends Component {

	SecondClassFunction=()=>{
		Alert.alert("Second Class Function Without Argument Called");
	}

  	handleBackButton = () => {
	 	Alert.alert(
      		'Exit App',
      		'Exiting the application?',
      	[
        	{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        	{text: 'OK', onPress: () => BackHandler.exitApp()},
      	],
      	{ 
      		cancelable: false 
      	}
    )
  		return true;
	}
}