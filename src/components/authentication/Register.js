import React, { Component } from 'react';
import {
  Platform,
  ReactNative,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Picker,
  Alert,
  findNodeHandle,
  ActivityIndicator,
  BackHandler,
  Keyboard,
  Dimensions
} 
from 'react-native';

import Orientation from 'react-native-orientation';

import { Dropdown } from 'react-native-material-dropdown';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import ReusableClass from "../ReusableClass";

import ImagePicker from 'react-native-image-picker';

export default class Register extends Component {

  static navigationOptions = {
    	title: 'Registration',
    	headerTintColor: '#f42e78',
      headerStyle: { backgroundColor: '#f8f8f8', borderWidth: 1, borderBottomColor: 'white' },
      headerTitleStyle: { 
        color: '#f42e78', 
        fontSize:20,
        width:Platform.OS === 'ios' ? 'auto' : 180,
        textAlign:Platform.OS === 'ios' ? 'auto' : 'center'
      },
      headerRight:<View />
  };

  constructor(props) {
    super(props);
    this.state = {
      screen: Dimensions.get('window'),
      language:'',
      avatarSource: null,
      fname:'',
      loading:false,
      email:'',
      password:'',
      avlday:'',
      tokenInfo: this.props.navigation.getParam('token'),
      tokenObj:{}, 
      mobile:'',
      address:'',
      volN: '',
    };
    this.focusNextField = this.focusNextField.bind(this);
    this.handleDayChange = this.handleDayChange.bind(this);
    // this.loginFunction = this.loginFunction.bind(this);
    this.imgPicker = this.imgPicker.bind(this);
    this.inputs = {};
    this.options ={};
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
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this))
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this))
  }

  componentDidMount() {
    // this locks the view to Portrait Mode
    // Orientation.lockToPortrait();

    // this locks the view to Landscape Mode
    // Orientation.lockToLandscape();

    // this unlocks any previous locks to all Orientations
    
    if(this.state.tokenInfo !== undefined){
      this.state.tokenObj = JSON.parse(this.state.tokenInfo);
      // console.log(this.state.tokenObj.phone);
      this.setState({
        mobile: ''+this.state.tokenObj.phone,
        address: this.state.tokenObj.address,
        volN: 'Vol'+this.state.tokenObj.token
      });
    }

    Orientation.unlockAllOrientations();

    Orientation.addOrientationListener(this._orientationDidChange);

    BackHandler.addEventListener('hardwareBackPress', obj.handleBackButton);
  }

  _orientationDidChange = (orientation) => {
    if (orientation === 'LANDSCAPE') {
      // do something with landscape layout
    } else {
      // do something with portrait layout
    }
  }

  componentWillUnmount() {
    Orientation.getOrientation((err, orientation) => {
      console.log(`Current Device Orientation: ${orientation}`);
    });
    // Orientation.unlockAllOrientations();
    // Remember to remove listener
    Orientation.removeOrientationListener(this._orientationDidChange);
    BackHandler.removeEventListener('hardwareBackPress', obj.handleBackButton);
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }


  _keyboardDidShow(){

  }

  _keyboardDidHide(){
    // Alert.alert(Platform.OS)
    if(Platform.OS == 'android'){
      // Alert.alert(Platform.OS);
      this.refs.scroll.scrollToPosition(0, 200, true)
    }else{
      this.refs.scroll.scrollToPosition(0, 150, true)
    }
  }

  focusNextField(id) {
    this.inputs[id].focus();
  }

  registerFunction = () =>{

    if(this.state.fname=='' || this.state.email=='' || this.state.password==''){
      Alert.alert('Please fill the required fields');
      return;
    }else if(this.state.avlday == ''){
      Alert.alert('Please provide Availability Day');
      return;
    }else if(this.state.avatarSource == null){
      Alert.alert('Please upload a photo');
      return;
    }

    this.setState({loading:true});
    let photo = this.state.avatarSource;

    // FormData is used to create bundle of multipart/form-data.
    let formdata = new FormData();
    formdata.append("name", this.state.fname)
    formdata.append("email", this.state.email)
    formdata.append("avl_day", 2)
    formdata.append("phone", this.state.mobile)
    formdata.append("password", this.state.password)
    formdata.append("addr", this.state.address)
    formdata.append("status", 0)
    formdata.append("profile", 
      {uri: photo.uri, name: 'image.jpg', type: 'multipart/form-data'})

    fetch('https://shrouded-escarpment-62032.herokuapp.com/users/register',{
    // fetch('http://192.168.1.59:3000/users/register',{
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formdata
      })
      .then(res =>res.json())
      .then(res =>
        {
          this.setState({            
            loading:false            
          });
          Alert.alert(
            'Success',
            res.message,
            [
              {text: 'Login', onPress: () => this.props.navigation.navigate('LoginScreen', 
                {email: this.state.email})},
              {text: 'Go to Home', onPress: () => this.props.navigation.navigate('drawerStack')},
            ],
            { 
              cancelable: true 
          })
          
        }
      )
      .catch(err => {
        console.log(err)
      })      
  }

  handleDayChange(text){
    // Alert.alert(text);
    if(Platform.OS=='ios'){
      this.refs.scroll.scrollToPosition(0, 350, true)
    }else{
      this.refs.scroll.scrollToPosition(0, 380, true)
    }
    this.setState({ avlday: text });
    // Alert.alert(this.state.avlday);
  }

  imgPicker(){
    ImagePicker.showImagePicker({title: 'Select Avatar'}, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else {
        let source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          avatarSource: source
        });
      }
    });
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

  render() {
    const resizeMode = 'center';
    const text = 'I am some centered text';

    let data = [
      {
        value: 'Any Day',
      }, {
        value: 'Monday',
      }, {
        value: 'Tuesday',
      },{
        value: 'Wednesday',
      },{
        value: 'Thursday',
      },{
        value: 'Friday',
      },{
        value: 'Saturday',
      },{
        value: 'Sunday',
      }
    ];

    return (
      <View style={styles.container}>
        <Image style={this.getStyle().logo} onLayout = {this.onLayout.bind(this)}
          source={this.state.avatarSource === null ? require('../../images/imageThumbnail.png'): this.state.avatarSource}/>

        <TouchableOpacity style={styles.buttonContainerThumbnail}
          onPress = {this.imgPicker}>
            <Text style = {styles.buttonTextThumbnail}>Add Photo</Text>
        </TouchableOpacity>  
        <ActivityIndicator size="large" color="#0000ff" 
          style={{opacity: this.state.loading ? 1.0 : 0.0}} animating={true}/>
          
        <KeyboardAwareScrollView ref = 'scroll' enableResetScrollToCoords = {false} 
          enableOnAndroid keyboardShouldPersistTaps = 'always' style={this.getStyle().scroll} 
          onLayout = {this.onLayout.bind(this)}>

          <TextInput style={this.getStyle().inputTop} onLayout = {this.onLayout.bind(this)}
            underlineColorAndroid='transparent'
            placeholderTextColor="rgba(128,128,128,0.7)"
            editable={false}
            value={this.state.volN}/>
             
          <TextInput style={this.getStyle().input1} onLayout = {this.onLayout.bind(this)}
            underlineColorAndroid='transparent'
            placeholder="Enter Full Name"
            placeholderTextColor="rgba(128,128,128,0.7)"
            autoCapitalize="none"
            autoCorrect = {false}
            onChangeText = {(fname) => this.setState({fname})}
            returnKeyType = "next"
            blurOnSubmit = { false }
            value = {this.state.fname}
            onSubmitEditing = {() => {
              if(this.state.fname==''){
                // emailErr = 'Please enter email';
                Alert.alert('Please enter Full Name')
              }else{
                this.focusNextField('three');     
              }
            }}  
            ref={ input => {
              this.inputs['two'] = input;
            }}>
          </TextInput>

          <TextInput style={this.getStyle().input1} onLayout = {this.onLayout.bind(this)}
            underlineColorAndroid='transparent'
            placeholder="Enter email address"
            placeholderTextColor="rgba(128,128,128,0.7)"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            returnKeyType="next"
            onChangeText={(email) => this.setState({email})}
            blurOnSubmit={ false }
            value = {this.state.email}
            onSubmitEditing={() => {
              if(this.state.email==''){
                // emailErr = 'Please enter email';
                Alert.alert('Please enter Email Address')
              }else if(!this.validateEmail(this.state.email)){
                // emailErr = 'Please enter valid email';
                Alert.alert('Please enter valid email')
              }
              else if(this.validateEmail(this.state.email)){
                this.focusNextField('four');     
              }
            }}
            ref={ input => {
              this.inputs['three'] = input;
            }}
          >
          </TextInput>

          <TextInput style={this.getStyle().input1} onLayout = {this.onLayout.bind(this)}
            underlineColorAndroid='transparent'
            placeholder = "Enter password"
            placeholderTextColor = "rgba(128,128,128,0.7)"
            autoCapitalize = "none"
            autoCorrect = {false}
            returnKeyType = "done"
            value = {this.state.password}
            onChangeText = {(password) => this.setState({password})}
            blurOnSubmit = {this.validatePassword(this.state.password) ? false : true }
            ref={ input => {
              this.inputs['four'] = input;
            }}
            onSubmitEditing={() => {
              if(this.state.password==''){
                Alert.alert('Please enter Password')
              }else if(this.validatePassword(this.state.password)){
                Alert.alert('password should be more than six characters')
              }
            }}
            secureTextEntry/>  

          <Dropdown 
            label='Availability Day'
            data={data}
            onChangeText={(value, index, data) => this.handleDayChange(data[index].value)}
          ></Dropdown>    
            
          <TextInput style = {this.getStyle().input1} onLayout = {this.onLayout.bind(this)}
              underlineColorAndroid = 'transparent'
              placeholder = "Enter MobileNo"
              placeholderTextColor = "rgba(128,128,128,0.7)"
              autoCapitalize = "none"
              autoCorrect = {false}
              keyboardType = "email-address"
              returnKeyType = "next"
              value = {this.state.mobile}
              editable = {false} /> 

          <TextInput style={this.getStyle().input1} onLayout = {this.onLayout.bind(this)}
              underlineColorAndroid='transparent'
              placeholder="Enter Address"
              placeholderTextColor="rgba(128,128,128,0.7)"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="next"
              value={this.state.address}
              editable={false} />  

          <TouchableOpacity style={this.getStyle().buttonContainer} 
            onLayout = {this.onLayout.bind(this)} onPress={this.registerFunction} >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>    
        </KeyboardAwareScrollView>
      </View>
    );
  } 
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#f8f8f8',
      flex: 1,
      alignItems: 'center',
      padding:20
    },
    logo: {
      marginTop: 10,
      width:120,
      height:120
    },
    inputTop: {
      width: 300,
      height: 60,
      marginTop: 5,
      borderWidth:2,
      borderColor: '#e7e7e7',
      borderRadius:8,
      backgroundColor: '#fff',
    },
    input1: {
      width: 300,
      height: 60,
      marginTop: 30,
      borderWidth:2,
      borderColor: '#e7e7e7',
      borderRadius:8,
      backgroundColor: '#fff',
    },
    buttonContainer: {
      width: 300,
      height: 60,
      marginTop: 30,	
      backgroundColor: '#f42e78',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      marginBottom: 30
    },
    buttonText: {
      color: '#FFF',
      fontSize: 20,
      fontWeight: 'bold',
      width:Platform.OS === 'ios' ? 'auto' : 120,
      textAlign:Platform.OS === 'ios' ? 'auto' : 'center'
    },
    buttonContainerThumbnail: {
      width: 300,
      height: 20,
      marginTop: 0,  
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8
    },
    buttonTextThumbnail: {
      color: '#f42e78',
      fontSize: 20,
      fontWeight: 'bold',
      width: Platform.OS === 'ios' ? 'auto' : 180,
      textAlign: Platform.OS === 'ios' ? 'auto' : 'center'
    },
    scroll:{
      marginTop: 5
    }
});

const stylesLandscape = StyleSheet.create(
{
  container: {
    backgroundColor: '#f8f8f8',
    flex: 1,
    alignItems: 'center',
    padding: 20
  },
  logo: { 
    marginTop: 10,
    width: 80,
    height: 80
  },
  viewBtn: {
    flexDirection: 'row',
  },
  input: {
    width: '100%',
    height: 60,
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#e7e7e7',
    borderRadius: 8,
    backgroundColor: '#fff',
  }, 
  buttonContainer: {
    width: '100%',
    height: 60,
    marginTop: 30,  
    backgroundColor: '#f42e78',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 30
  },
  scroll: {
    width: '100%'
  }
});
