import React, { Component } from 'react';

import {
    View,
    Image,
    Text,
    Platform,
    ScrollView,
    StyleSheet
} from 'react-native';

import { FocusScrollView } from 'react-native-focus-scroll';

export default class DonationDetail extends Component {
    
  static navigationOptions = {
    title: 'Donation Detail',
    headerTintColor: '#f8f8f8',
    headerStyle: { backgroundColor: '#f42e78', borderWidth: 1, borderBottomColor: 'white' },
    headerTitleStyle: { 
      color: '#f8f8f8', 
      fontSize: 20,
      width: Platform.OS === 'ios' ? 'auto' : 180,
      textAlign: Platform.OS === 'ios' ? 'auto' : 'center'
    },
    headerRight: <View />
  };

  constructor(props){
    super(props);
    this.state = {
      list : this.props.navigation.state.params.list
    }
    this.avatarSource = {uri: this.state.list.picture.medium}
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.textDonate}> Donated By </Text>
          <View style={styles.donateToView}>
            <Image style={styles.profileImage} source={this.avatarSource === null ? 
              require('../../images/imageThumbnail.png'): this.avatarSource}/> 
            <Text style={styles.textDonate}>{this.state.list.name.first} {this.state.list.name.last}</Text>
            <Text style={styles.textBalInfo}>{this.state.list.email}</Text>
            <Text style={styles.textBalInfo}>{this.state.list.cell}</Text>
          </View>
          <Text style = {styles.textDonateBy}> Donated To </Text>
          <View style = {styles.donateToView}>
            <Image style = {styles.balbaseraImg} source={require('../../images/balbasera.png')}/> 
            <Text style = {styles.textDonate}> Bal Basera </Text>
            <Text style = {styles.textBalInfo}> Child Care Home </Text>
            <Text style = {styles.textBalInfo}> ISO: 1542 2525     </Text>
            <Text style = {styles.textBalInfo}> +98000 25451  </Text>
            <Text style = {styles.textBalInfo}> balbasera@gmail.com </Text>
            <Text style = {styles.textBalInfo}> Pal Balaji, Khema-Ka-Kuwa, Jodhpur </Text>
            <View style = {styles.viewLine}></View>
            <Text style = {styles.textDonate}> Donated Description: </Text>
            <Text style = {styles.textBalInfo}> 50 Books, 10 Blankets</Text>
          </View>
        </ScrollView>  
      </View>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: '#f1f3f4',
    flex: 1,
    padding:20,
    // paddingBottom:0,
  },
  textDonate:{
    fontSize:20,
    color:'#000',
    fontWeight:'bold'
  },
  textDonateBy:{
    fontSize:20,
    color:'#000',
    fontWeight:'bold',
    marginTop:10
  },
  donateToView:{
    backgroundColor: '#ffffff',
    flex: 1,
    padding: 20,
    width: '100%',
    height:'auto',
    marginTop: 10
  },
  profileImage:{
    width: 100, 
    height: 100, 
    borderRadius:50
  },
  balbaseraImg:{
    borderRadius:50, 
    marginBottom:10  
  },
  textBalInfo:{
    fontSize:16,
    color:'#a3a3a3',
    marginTop:5
  },
  viewLine:{
    backgroundColor:'#e5e5e5',
    height:2, 
    width:'100%', 
    marginTop:10,
    marginBottom:10
  }
});