/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Button,
  Image,
  TouchableOpacity,
  View
} from 'react-native';
import { HeaderBackButton, StackNavigator, DrawerNavigator, TabNavigator, TabBarBottom } 
  from "react-navigation";
import Login from './src/components/authentication/Login';
import Register from './src/components/authentication/Register';
import RegisterStepOne from './src/components/authentication/RegisterStepOne';
import Landing from './src/components/Landing';
import DonationGuest from './src/components/donation/DonationGuest';
import DonationGuestItem from './src/components/donation/DonationGuestItem';
import DonationNotReceivedList from './src/components/donation/DonationNotReceivedList';
import DonationReceivedList from './src/components/donation/DonationReceivedList';
import DonationDetail from './src/components/donation/DonationDetail';
import SideMenu from './src/components/SideMenu';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class App extends Component {

  render() {    
    return <PrimaryNav />
  }
}

export const TabDonation = TabNavigator(
  {
    donationNot: { screen: DonationNotReceivedList },
    donation: { screen: DonationReceivedList },
  },
  {
    navigationOptions: ({ navigation }) => ({
      // tabBarIcon: ({ focused, tintColor }) => {
      //   const { routeName } = navigation.state;
      //   let iconName;
      //   if (routeName === 'Tab1') {
      //     iconName = `ios-information-circle${focused ? '' : '-outline'}`;
      //   } else if (routeName === 'Tab2') {
      //     iconName = `ios-options${focused ? '' : '-outline'}`;
      //   }
      //   // You can return any component that you like here! We usually use an
      //   // icon component from react-native-vector-icons
      //   return <Ionicons name = {iconName} size={25} color={tintColor} />;
      // },
      tabBarLabel: ()=>{
        const { routeName } = navigation.state;
        
        if (routeName === 'donationNot') {
          
          return 'Not Received';

        } else if (routeName === 'donation') {

          return 'Received';
        }
      }
    }),

    tabBarOptions: {
      activeTintColor: '#ffffff',
      inactiveTintColor: '#f42e78',
      activeBackgroundColor: '#f42e78',
      labelStyle:{ fontSize: 16, paddingBottom:12 },
      style:{
        borderTopWidth:1,
        borderTopColor:'#f42e78',
        height:50,
      }
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    // animationEnabled: false,
    // swipeEnabled: true,
  }
);

// drawer stack
export const DrawerStack = DrawerNavigator({

    LandingScreen: { 
      screen: Landing,
      headerMode: 'float',

      navigationOptions: ({ navigation }) => ({
        headerStyle: { backgroundColor: '#f42e78',width:'auto'},
        headerTitleStyle:{
          color: '#ffffff', 
          fontSize:Platform.OS === 'ios' ? 20 : 20,
          width:Platform.OS === 'ios' ? 'auto' : 180,
          textAlign:Platform.OS === 'ios' ? 'auto' : 'center'
        },
        title: 'Home Page',
      })
    },

    LoginScreen: { 
      screen: Login,
      headerMode: 'float',

      navigationOptions: ({ navigation }) => ({
        headerStyle: { backgroundColor: '#f42e78',width:'auto'},
        headerTitleStyle:{
          color: '#ffffff', 
          fontSize:Platform.OS === 'ios' ? 20 : 20,
          width:Platform.OS === 'ios' ? 'auto' : 180,
          textAlign:Platform.OS === 'ios' ? 'auto' : 'center'
        },
        title: 'Login',
      })
    },

    tabDonationScreen: { 
      screen: TabDonation, 
      headerMode: 'float',
      navigationOptions: ({ navigation }) => ({
        headerStyle: { backgroundColor: '#f42e78',width:'auto'},
        headerTitleStyle:{
          color: '#ffffff', 
          fontSize:Platform.OS === 'ios' ? 20 : 20,
          width:Platform.OS === 'ios' ? 'auto' : 180,
          textAlign:Platform.OS === 'ios' ? 'auto' : 'center'
        },
        title: 'Donation List',
      })
    }
  },
  {
    contentComponent: SideMenu,
    initialRouteName: 'LandingScreen'
  }
);

// Drawer Navigation
export const DrawerNavigation = StackNavigator({
  DrawerStack: { screen: DrawerStack },
  }, {
  headerMode: 'float',
  navigationOptions: ({ navigation }) => ({
    headerStyle: { backgroundColor: '#f42e78',width:'auto'},
    headerTitleStyle:{
      color: '#ffffff', 
      fontSize:Platform.OS === 'ios' ? 20 : 20,
      width:Platform.OS === 'ios' ? 'auto' : 180,
      textAlign:Platform.OS === 'ios' ? 'auto' : 'center'
    },
    headerLeft: 
      <TouchableOpacity style={{marginLeft:20}}
          onPress={() => {
            if (navigation.state.index === 0) {
              navigation.navigate('DrawerOpen')
            } else {
              navigation.navigate('DrawerClose')
            }
          }
      }>
        <Image source={require('./src/images/menu_icon.png')} />
      </TouchableOpacity>,
    headerRight:<View />  
  })
});


// Login Navigator
export const LoginNavigator = StackNavigator({
    // LoginScreen: { screen: Login },
    RegisterScreen: { screen: Register },

    RegisterStepOneScreen: { 
      screen: RegisterStepOne, 
      navigationOptions: ({navigation}) => ({ //don't forget parentheses around the object notation
        headerLeft: <HeaderBackButton style={{color:'#f42e78'}} 
          onPress={() => navigation.navigate('LoginScreen')} />,
        headerTintColor: '#f42e78'
      })
    },
    DonationGuestScreen: { 
      screen: DonationGuest, 
      navigationOptions: ({navigation}) => ({ 
        //don't forget parentheses around the object notation
        headerLeft: <HeaderBackButton style={{color:'#f42e78'}} 
        onPress={() => navigation.navigate('drawerStack')} />,
        headerTintColor: '#f42e78'
      })
    },
    DonationGuestItemScreen: { 
      screen: DonationGuestItem, 
      navigationOptions: ({navigation}) => ({ 
        //don't forget parentheses around the object notation
        headerLeft: <HeaderBackButton style={{color:'#f42e78'}} 
        onPress={() => navigation.navigate('drawerStack')} />,
        headerTintColor: '#f42e78'
      })
    },
    DonationDetailScreen: { 
      screen: DonationDetail, 
      navigationOptions: ({navigation}) => ({ 
        //don't forget parentheses around the object notation
        headerLeft: <HeaderBackButton style={{backgroundColor: '#ffffff'}} 
        onPress={() => navigation.navigate('tabDonationScreen')} />,
        headerTintColor: '#f42e78'
      })
    }
  },
  {
    initialRouteName: 'RegisterStepOneScreen',
    headerMode: 'float',
    navigationOptions: {
      headerStyle: {backgroundColor: 'red'},
      title: 'Without Menu'
    }
  }
);

// Manifest of possible screens
export const PrimaryNav = StackNavigator({
  loginStack: { screen: LoginNavigator },
  drawerStack: { screen: DrawerNavigation }
}, {
  // Default config for all screens
  headerMode: 'none',
  title: 'Main',
  initialRouteName: 'drawerStack'
});





