import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    Platform,
    StyleSheet
} from 'react-native';

import { FocusScrollView } from 'react-native-focus-scroll';


export default class Eg extends Component {
    
    static navigationOptions = {
      title: 'Donation Detail',
      headerTintColor: '#f8f8f8',
      headerStyle: { backgroundColor: '#f42e78', borderWidth: 1, borderBottomColor: 'white' },
      headerTitleStyle: { 
        color: '#f8f8f8', 
        fontSize:20,
        width:Platform.OS === 'ios' ? 'auto' : 180,
        textAlign:Platform.OS === 'ios' ? 'auto' : 'center'
      },
      headerRight:<View />
    };

    constructor(props){
        super(props);
        this.state = {
          list : this.props.navigation.state.params.list
        }
    }
    render() {
        
        return (
            <View style={styles.container}>
                <Text>{this.state.list.name.first}</Text>
                <Text>{this.state.list.email}</Text>
                <Text>{this.state.list.gender}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {
      backgroundColor: '#f8f8f8',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    }
});