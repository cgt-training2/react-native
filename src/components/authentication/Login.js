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
  Dimensions,
  ActivityIndicator,
  AsyncStorage,
  BackHandler
} from 'react-native';

import ResponsiveStylesheet from "react-native-responsive-stylesheet";

import Orientation from 'react-native-orientation';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import ReusableClass from "../ReusableClass";

// type Props = {};

export default class Login extends Component {

	static navigationOptions = {
    title: 'Registeration',
    headerTintColor: '#f42e78',
    headerStyle: { backgroundColor: '#f8f8f8', borderWidth: 1, borderBottomColor: 'white' },
    headerTitleStyle: { color: '#f42e78', fontSize: 20 }
  };

  constructor(props){
    super(props);
    this.state = {
      screen: Dimensions.get('window'),
      email: '',
      password:'',
      param:this.props.navigation.getParam('email'),
      loading:false  
    };
    obj = new ReusableClass();
  }

  componentWillMount() {
    // The getOrientation method is async. It happens sometimes that
    // you need the orientation at the moment the JS runtime starts running on device.
    // `getInitialOrientation` returns directly because its a constant set at the
    // beginning of the JS runtime.
    const initial = Orientation.getInitialOrientation();
    if (initial === 'PORTRAIT') {
      // do something
    } else {
      // do something else
    }
  }

  componentDidMount() {
    // this locks the view to Portrait Mode
    // Orientation.lockToPortrait();

    // this locks the view to Landscape Mode
    // Orientation.lockToLandscape();
    console.log(this.state.param);
    if(this.state.param !== ''){
      // this.state.email = this.state.param;
      // console.log(this.state.tokenObj.phone);
      this.setState({
        email: this.state.param,
      });
    }

    // this unlocks any previous locks to all Orientations
    Orientation.unlockAllOrientations();

    Orientation.addOrientationListener(this._orientationDidChange);

    BackHandler.addEventListener('hardwareBackPress', obj.handleBackButton);
  }

  componentWillUnmount() {
    Orientation.getOrientation((err, orientation) => {
      console.log(`Current Device Orientation: ${orientation}`);
    });
    // Orientation.unlockAllOrientations();
    // Remember to remove listener
    Orientation.removeOrientationListener(this._orientationDidChange);

    BackHandler.removeEventListener('hardwareBackPress', obj.handleBackButton);
  }

  _orientationDidChange = (orientation) => {
    if (orientation === 'LANDSCAPE') {
      // do something with landscape layout
    } else {
      // do something with portrait layout
    }
  }


  onLayout(){
    this.setState({screen: Dimensions.get('window')});
  }

  validateEmail = (email) => {
    
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  validatePassword = (password) => {
    
    var txtLength = password.length;
    if(txtLength<6){
      return true;
    }else{
      return false;
    }
  };

  loginFunction = () =>{
    const email = this.state.email;
    const password = this.state.password;

    this.setState({loading:true});

    if(this.state.email=='' || this.state.password==''){
      Alert.alert('Either Email or password is blank'); 
      return;
    }

    fetch('https://shrouded-escarpment-62032.herokuapp.com/users/login',{
    // fetch('http://192.168.1.59:3000/users/login',{
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'email': this.state.email,
          'password': this.state.password          
        })
      })
      .then(res => res.json())
      .then( async (res) =>
        {
          if(res.message == 'Login Successfull'){
            try {
              await AsyncStorage.setItem('@User', JSON.stringify(res.user));
              this.setState({            
                email:'',                                    
                password:'',
                loading:false
              });
              this.props.navigation.navigate('drawerStack');
            } catch (error) {
              // Error saving data
              Alert.alert(error);
            }            
          }else if(res.message == 'Please give correct password'){            
            Alert.alert(
              'Error',
              res.message,
              [
                {text: 'OK', onPress: () => this.passwordInput.focus()},
              ],
              { cancelable: true }
            )
            this.setState({            
              password:'',
              loading:false
            });
            return;
          }else if(res.message == 'User doesn\'t exist'){            
            Alert.alert(
            'Error',
            res.message,
            [
              {text: 'OK', onPress: () => this.emailInput.focus()},
            ],
            { cancelable: true })
            this.setState({            
              password:'',
              loading:false
            });
            return;
          }
          // Alert.alert(res.message);
      })
      .catch(err => {
        Alert.alert("There may be internet connection problem")
      })
  }

  getOrientation(){
    if (this.state.screen.width > this.state.screen.height) {
      return 'LANDSCAPE';
    }else {
      return 'PORTRAIT';
    }
  }

  getStyle(){
    if (this.getOrientation() === 'LANDSCAPE') {
      return stylesLandscape;
    } else {
      return styles;
    }
  }

  render() {
  	const resizeMode = 'center';
    const text = 'I am some centered text';
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#349ede" barStyle="light-content"/>
        <Image style={this.getStyle().logo} onLayout = {this.onLayout.bind(this)}
          source={require('../../images/logo_resize.png')}/>
          
        <Text style={styles.fontWelcome}>Welcome to Cure Life </Text>

        <ActivityIndicator size="large" color="#0000ff" 
          style={{opacity: this.state.loading ? 1.0 : 0.0}} animating={true}/>
    
        <KeyboardAwareScrollView enableResetScrollToCoords={false} contentContainerStyle={styles.scroll} enableOnAndroid={true}>          	
            <TextInput 
              style = {this.getStyle().inputFirst} 
              onLayout = {this.onLayout.bind(this)}
              underlineColorAndroid = 'transparent'
              placeholder = "Enter Email"
              placeholderTextColor = "rgba(128,128,128,0.7)"
              autoCapitalize = "none"
              autoCorrect = {false}
              onChangeText = {(email) => this.setState({email})}
              blurOnSubmit = {this.validateEmail(this.state.email) ? true : false }
              value = {this.state.email}
              keyboardType = "email-address"
              returnKeyType = "next"
              ref={(input) => this.emailInput = input}
              onSubmitEditing = {() => {
                  if(this.state.email == ''){
                    // emailErr = 'Please enter email';
                    Alert.alert('Please enter email')
                  }else if(!this.validateEmail(this.state.email)){
                    // emailErr = 'Please enter valid email';
                    Alert.alert('Please enter valid email')
                  }
                  else if(this.validateEmail(this.state.email)){
                    this.passwordInput.focus()     
                  }  
              }
            }>
            </TextInput>
          	<TextInput 
              style={this.getStyle().input} 
              onLayout = {this.onLayout.bind(this)}
              underlineColorAndroid='transparent'
              placeholder="Enter password"
              placeholderTextColor="rgba(128,128,128,0.7)"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
              returnKeyType="done"
              value={this.state.password}
              onChangeText={(password) => this.setState({password})}
              ref={(input) => this.passwordInput = input}
              blurOnSubmit ={this.validatePassword(this.state.password) ? false : true }
              onSubmitEditing ={()=>{
                if(this.validatePassword(this.state.password)){
                  Alert.alert('password less than six characters')
                }
              }}
            secureTextEntry>
            </TextInput>

            <View style={this.getStyle().viewBtn} onLayout = {this.onLayout.bind(this)}>  
            	<TouchableOpacity style={styles.buttonContainer}
                onPress={this.loginFunction}>
                  <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonContainer}
                onPress={() =>
                  this.props.navigation.navigate('RegisterStepOneScreen')
              }>
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>                
            </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create(
{
  container: {
    backgroundColor: '#f8f8f8',
    flex: 1,
    alignItems: 'center',
  },
  logo:{
    display:"flex",
    // width:300,
    // height:180,
    marginTop:20
  },
  inputFirst:{
    width: 300,
    height: 60,
    borderWidth:2,
    borderColor: '#e7e7e7',
    borderRadius:8,
    backgroundColor: '#fff',
    paddingLeft: 10
  },
  input: {
    width: 300,
    height: 60,
    marginTop: 30,
    borderWidth:2,
    borderColor: '#e7e7e7',
    borderRadius:8,
    backgroundColor: '#fff',
    paddingLeft: 10,
    alignItems:'center',
    justifyContent: 'center',
  },
  fontWelcome:{
    marginTop:20,
    fontSize:Dimensions.get('window').width <380 ? 25 : 35,
    color: '#f42e78'
  },
  buttonContainer: {
    width: 300,
    height: 60,
    marginTop: 30,  
    backgroundColor: '#f42e78',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    width:Platform.OS === 'ios' ? 'auto' : 100,
    textAlign:Platform.OS === 'ios' ? 'auto' : 'center'
  },
  scroll:{
    flexGrow: 1,
    paddingTop:Platform.OS === 'ios' ? 'auto' : 10,
  },
  viewBtn:{
    flexDirection: 'column',
  }
});

const stylesLandscape = StyleSheet.create(
{
  logo:{  
    height:0,
  },
  viewBtn:{
    flexDirection: 'row',
  },
  input: {
    width: '100%',
    height: 60,
    marginTop: 30,
    borderWidth:2,
    borderColor: '#e7e7e7',
    borderRadius:8,
    backgroundColor: '#fff',
    paddingLeft: 10
  }
});
