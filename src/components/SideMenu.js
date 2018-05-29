import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {NavigationActions} from 'react-navigation';
import {ScrollView, Platform, Image,Text, View, AsyncStorage,Alert, StyleSheet} from 'react-native';

export default class SideMenu extends Component {

  constructor(props) {
    super(props);
    this.state ={
      user_name : '',
      loggedIn:false,
      img_profile:'',
      userObj:{}
    },
    global.user_name = '' 
  }

  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }

  navigateToScreenLogout = (route) => () => {
    global.user_name = '';
    this.state.user_name = '';
    this.setState({loggedIn: false})
    AsyncStorage.removeItem('@User');
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }

  render () {
    
    // let message = this.menu();
    let message;

    const login = <Text style={styles.textLogin} onPress={this.navigateToScreen('LoginScreen')}>Login</Text>;
    const logout = <Text style={styles.textLogin} onPress={this.navigateToScreenLogout('drawerStack')}>Logout</Text>; 

    AsyncStorage.getItem('@User').then((result) => {
      if (result) {
        // console.log();
        this.state.userObj = JSON.parse(result);
        this.state.user_name = this.state.userObj.name;
        this.state.img_profile = this.state.userObj.image_url;        
        this.setState({loggedIn: true})
      } else {
        this.setState({loggedIn: false})
      }
    })
    

    if (this.state.loggedIn) {
        // Alert.alert(this.state.user_name);
        message = logout
        
    } else {
        // Alert.alert(this.state.user_name);
        message = login
    }

    return (
      <View style={styles.container}>
        <View style={styles.upperMenu}>
          <View style={styles.upperMenuLeft}>
            <Image source = {require('../images/profile.png')}/>
            <Text style={styles.textGuest}>
              {this.state.user_name == '' ? 'Guest' : this.state.user_name}
            </Text>
          </View>  
          <View style={styles.upperMenuRight}>
              {message}
          </View>
        </View> 
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding:30 }}>
            <View>
              <Text style={styles.menuItemText} onPress={this.navigateToScreen('LandingScreen')}>
                Home
              </Text>
            </View>
            <View style={styles.itemView}>
              <Text style={styles.menuItemText} onPress={this.navigateToScreen('tabDonationScreen')}>
                Donation
              </Text>
            </View>
            <View style={styles.itemView}>
              <Text style={styles.menuItemText} onPress={this.navigateToScreen('LoginScreen')}>
                Campaign
              </Text>
            </View>
            <View style={styles.itemView}>
              <Text style={styles.menuItemText} onPress={this.navigateToScreen('LoginScreen')}>
                Requests
              </Text>
            </View>
            <View style={styles.itemView}>
              <Text style={styles.menuItemText} onPress={this.navigateToScreen('LoginScreen')}>
                Ask For Help
              </Text>
            </View>
            <View style={styles.itemView}>
              <Text style={styles.menuItemText} onPress={this.navigateToScreen('LoginScreen')}>
                Organizations With Us
              </Text>
            </View>
            <View style={styles.itemView}>
              <Text style={styles.menuItemText} onPress={this.navigateToScreen('LoginScreen')}>
                About Us
              </Text>
            </View>
            <View style={styles.itemView}>
              <Text style={styles.menuItemText} onPress={this.navigateToScreen('LoginScreen')}>
                Contact Us
              </Text>
            </View>
        </ScrollView>
      </View>
    );
  }
}

SideMenu.propTypes = {
  navigation: PropTypes.object
};

const styles = StyleSheet.create(
{
  container: {
    flex: 1,
  },
  upperMenu:{
    flexDirection: 'row',
    backgroundColor: '#f42e78',
  },
  upperMenuLeft:{
    marginTop:30,
    marginBottom:30,
    marginLeft:20,
    alignItems:'center'
  },
  upperMenuRight:{
    position: 'absolute',
    top: 30,
    right: 20,
  },
  textGuest:{
    color:'#ffffff',
    fontSize:18,
    fontWeight:'bold',
    marginTop:10,
    width:Platform.OS === 'ios' ? 'auto' : 70,
    textAlign:Platform.OS === 'ios' ? 'auto' : 'center'
  },
  textLogin:{
    color:'#ffffff',
    fontSize:20,
    fontWeight:'bold',
    width:Platform.OS === 'ios' ? 'auto' : 70,
    textAlign:Platform.OS === 'ios' ? 'auto' : 'center'
  },
  scrollViw:{
    padding:30
  },
  itemView:{
    marginTop:30
  },
  menuItemText:{
    fontSize:18,
    color: '#7d7885'
  }
});

