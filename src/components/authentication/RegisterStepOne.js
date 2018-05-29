import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  BackHandler,
  ImageBackground,
  Alert,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import Modal from "react-native-modal";

import Orientation from 'react-native-orientation';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import ReusableClass from "../ReusableClass";

type Props = {};

export default class RegisterStepOne extends Component<Props> {

  static navigationOptions = {
  	title: 'Register Step One',
  	headerTintColor: '#f42e78',
  	headerStyle: { 
      backgroundColor: '#f8f8f8', 
      borderWidth: 1, 
      borderBottomColor: 'white' 
    },
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
      isModalVisible: false,
      isModal2Visible: false,
      fname:'',
      addr:'',
      mobile:'',
      token:'',
      loading:false
    };
    this.focusNextField = this.focusNextField.bind(this);
    // this.postModalData = this.postModalData.bind(this);
    this.inputs = {};
    // ScreenOrientation.allow(ScreenOrientation.Orientation.PORTRAIT);
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
    Orientation.lockToPortrait();

    // this locks the view to Landscape Mode
    // Orientation.lockToLandscape();

    // this unlocks any previous locks to all Orientations
    // Orientation.unlockAllOrientations();
    this.setState({loading:false});
    Orientation.addOrientationListener(this._orientationDidChange);

    BackHandler.addEventListener('hardwareBackPress', obj.handleBackButton);
  }

  _orientationDidChange = (orientation) => {
    if (orientation === 'LANDSCAPE') {
      // do something with landscape layout
      // this.showAlert();
    } else {
      // do something with portrait layout
    }
  }

  componentWillUnmount() {
    Orientation.getOrientation((err, orientation) => {
      console.log(`Current Device Orientation: ${orientation}`);
    });
    Orientation.unlockAllOrientations();
    // Remember to remove listener
    Orientation.removeOrientationListener(this._orientationDidChange);

    BackHandler.removeEventListener('hardwareBackPress', obj.handleBackButton);

    Keyboard.dismiss();
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  _keyboardDidShow(){

  }

  _keyboardDidHide(){
    if(this.state.isModal2Visible){
      if(Platform.OS == 'android'){
        // Alert.alert(Platform.OS);
        this.refs.scroll.scrollToPosition(0, 100)
      }
    }
  }

  focusNextField(id) {
    this.inputs[id].focus();
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

	_toggleModal = () =>
  	this.setState({ isModalVisible: !this.state.isModalVisible });

  _toggleModal2 = () =>
    this.setState({ isModal2Visible: !this.state.isModal2Visible });  

  postModalData = () => {

    if(this.state.fname == '' || this.state.addr == '' || this.state.mobile == ''){
      Alert.alert('Please fill all fields');
      return;
    }
    // const url = 'http://192.168.1.59:3000/users/token';
    const url = 'https://shrouded-escarpment-62032.herokuapp.com/users/token';
    var today = new Date();
    this.setState({loading:true});
   
    fetch(url, {
      method:'POST',
      headers:{
        'Accept':'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.fname,
        address: this.state.addr,
        phone: this.state.mobile,
        status:'0',
      })

    }).then(res => res.json())
      .then(res => {
        this.setState({
          fname:'',
          addr:'',
          mobile:'',
          loading:false,
          isModal2Visible: false
        });
        Alert.alert(''+res.message+' Token: '+res.token);
      })
      .catch(error => {
        Alert.alert(error);
      });
    // Alert.alert(this.state.fname);
  }  

  submitToken = () =>{

    if(this.state.token==''){
      Alert.alert('Please enter token');
      return;
    }
    const url = 'http://shrouded-escarpment-62032.herokuapp.com/users/token?token='+this.state.token;
    fetch(url, {
      method:'GET',
      headers:{
        'Accept':'application/json',
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify({
      //   token: this.state.token,
      // })
    }).then(res => {
        Keyboard.dismiss();
        return res.json()
      })
      .then(res => {
        console.log(res);
        this.setState({
          token:'',
          loading:false,          
        });
        // Alert.alert(''+res.message+' Token: '+res.tokenInfo.name);
        // this.props.navigation.navigate('RegisterScreen');
        // this.props.navigation.navigate('RegisterScreen',{token: 'res.tokenInfo'});
        this.props.navigation.navigate('RegisterScreen',{token: JSON.stringify(res.tokenInfo)});
      })
      .catch(error => {
        Alert.alert('Token is not valid please try again');
      });

    // this.props.navigation.navigate('RegisterScreen')
  }

	render(){

		return(
			<View style={styles.container}>

				<Image style={this.getStyle().logo} onLayout = {this.onLayout.bind(this)}
          source={require('../../images/logo_resize.png')}/>
				<Text style={styles.fontRegister}>Register Step One </Text>

				<TextInput style={styles.input}
        	underlineColorAndroid='transparent'
          placeholder="Enter Token"
          placeholderTextColor="rgba(128,128,128,0.9)"
          autoCapitalize="none"
          autoCorrect={false}
          value = {this.state.token}
          onChangeText={(token) => this.setState({token})}
          returnKeyType="done">
        </TextInput>

        <TouchableOpacity style={styles.buttonContainer}
	        onPress={() =>
            this.submitToken()
          }>
	         <Text style={styles.buttonText}>Submit Token</Text>
	      </TouchableOpacity>
        <ImageBackground style={styles.imgBackground} source={require('../../images/background.png')}>
          <View style={styles.viewRow}>
            <TouchableOpacity style={styles.buttonContainerRow}
              onPress={this._toggleModal2}>
                <Text style={styles.buttonText}>Generate Token</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonContainerInfo}
              onPress={this._toggleModal}>
                <Text style={styles.buttonTextI}>i</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <Modal 
          isVisible={this.state.isModalVisible}
          animationIn={'slideInLeft'}
          animationOut={'slideOutRight'}
          backdropTransitionInTiming={1000}
          backdropTransitionOutTiming={1000}
          backdropColor={"#000000"}
          backdropOpacity={.8}>
  				<View style={ styles.modalContainer }>
    				<Text style={styles.fontModalToken}>You need to generate Token before doing registeration. To generate the 
    					  token you need provide following information:{'\n'}{'\n'}
    					  1. Mobile Number {'\n'}
    					  2. Address {'\n'}{'\n'}
    					  Then our volunteer will verify the information provided by you. After that admin will generate the token 
    					  if all the information provided by you is correct.  
    				</Text>
    				<TouchableOpacity style={styles.buttonContainerRow} onPress={this._toggleModal}>
      					<Text style={styles.buttonText}>Hide me!</Text>
    				</TouchableOpacity>
  				</View>
			  </Modal>       
        <Modal 
            isVisible = {this.state.isModal2Visible}
            animationIn = {'slideInUp'}
            animationOut = {'slideOutDown'}
            backdropTransitionInTiming = {1000}
            backdropTransitionOutTiming = {1000}
            backdropColor = {"#000000"}
            backdropOpacity = {.8}  
            style = { styles.bottomModal}>
            <View style ={ styles.modal2Container }>
              <View style={styles.viewRowModal}>
                <TouchableOpacity style={{width:'18%'}} onPress={this._toggleModal2}>
                    <Text style={styles.buttonTextC}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.textRT}>Request Token</Text>
              </View>
              <ActivityIndicator size="large" color="#0000ff" 
                style={{opacity: this.state.loading ? 1.0 : 0.0}} animating={true}/>
              <KeyboardAwareScrollView ref='scroll' enableResetScrollToCoords={ Platform.OS === 'android' ? false : true}
                enableOnAndroid>  
                <View style={{backgroundColor:"#f3f3f3"}}>
                  <TextInput style={styles.input}
                    underlineColorAndroid='transparent'
                    placeholder="Enter Full Name"
                    placeholderTextColor="rgba(128,128,128,0.9)"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    blurOnSubmit={ false }
                    onChangeText={(fname) => this.setState({fname})}
                    value = {this.state.fname}
                    onSubmitEditing = {() => {
                      if(this.state.fname==''){
                        // emailErr = 'Please enter email';
                        Alert.alert('Please enter Full Name')
                      }else{
                        this.focusNextField('addr');     
                      }  
                    }} 
                    ref={ input => {
                      this.inputs['name'] = input;
                    }}
                  ></TextInput>  
                  <TextInput style={styles.input}
                    underlineColorAndroid='transparent'
                    placeholder="Enter Address"
                    placeholderTextColor="rgba(128,128,128,0.9)"
                    autoCapitalize="none"
                    autoCorrect={false}
                    blurOnSubmit={ false }
                    returnKeyType="next"
                    onChangeText={(addr) => this.setState({addr})}
                    value = {this.state.addr}
                    onSubmitEditing={() => {
                      if(this.state.addr==''){
                        // emailErr = 'Please enter email';
                        Alert.alert('Please enter Address')
                      }else{
                        this.focusNextField('mobile')     
                      }
                    }}  
                    ref={ input => {
                      this.inputs['addr'] = input;
                    }}
                  ></TextInput>
                  <TextInput style= {styles.input}
                    underlineColorAndroid = 'transparent'
                    placeholder = "Enter Mobile Number"
                    placeholderTextColor = "rgba(128,128,128,0.9)"
                    autoCapitalize = "none"
                    autoCorrect= {false}
                    blurOnSubmit={ true }
                    returnKeyType="done"   
                    keyboardType="numeric"
                    onChangeText={(mobile) => this.setState({mobile})}                      
                    value = {this.state.mobile}
                    ref={ input => {
                      this.inputs['mobile'] = input;
                    }}
                    onSubmitEditing={() => {
                      if(this.state.mobile==''){
                        Alert.alert('Please enter mobile')
                      }
                    }}
                  ></TextInput>
                  <TouchableOpacity style={styles.buttonContainer}
                    onPress={this.postModalData}>
                    <Text style={styles.buttonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAwareScrollView>
            </View>
        </Modal>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container:{
		flex:1,
		backgroundColor: '#f8f8f8',
		alignItems: 'center'
	},
	logo:{
		display:"flex",
    // width:300,
    // height:180,
    marginTop:20
	},
	fontRegister:{
		marginTop:20,
    fontSize:Dimensions.get('window').width <380 ? 25 : 35,
    color: '#f42e78'
	},
	input: {
      width: 300,
      height: 60,
      marginTop: 30,
      borderWidth:2,
      borderColor: '#e7e7e7',
      borderRadius:8,
      backgroundColor: '#fff',
      paddingLeft: 10
    },
    buttonContainer: {
      width: 300,
      height: 60,
      marginTop: 25,	
      backgroundColor: '#f42e78',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
    },
    buttonContainerRow: {
      width: 220,
      height: 60,	
      backgroundColor: '#f42e78',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
    },
    buttonContainerInfo: {
      width: 50, 
      borderRadius:50, 
      height: 50, 
      marginLeft:30, 
      marginTop: 5, 
      backgroundColor: '#f42e78',
      justifyContent: 'center',
      alignItems: 'center', 
    },
    buttonText: {
      color: '#FFF',
      fontSize: 20,
      fontWeight: 'bold',
      width:Platform.OS === 'ios' ? 'auto' : 150,
      textAlign:Platform.OS === 'ios' ? 'auto' : 'center'
    },
    buttonTextC: {
      color: '#f42e78',
      fontSize: Dimensions.get('window').width <380 ? 15 : 20,
      fontWeight: 'bold',
      width:Platform.OS === 'ios' ? 'auto' : 100,
      // textAlign:Platform.OS === 'ios' ? 'auto' : 'center'
    },
    buttonTextI: {
      color: '#FFF',
      fontSize: 40,
      fontWeight: 'bold',
      fontStyle:'italic'
    },
    imgBackground:{
      flex: 1,
      margin:0,
      alignItems:'center',
      justifyContent:'center',
      width:'100%',
      height:Platform.OS === 'ios' ? 'auto' : 'auto',
      borderRadius:10
    },
    viewRow:{
    	flex: 1, 
    	flexDirection: 'row',
    	marginTop:25
    },
    modalContainer:{
      padding:20,
      height:460,
      backgroundColor: '#f8f8f8',
		  alignItems: 'center',
    },
    modal2Container:{
      
      height:Platform.OS === 'ios' ? 460 : 350,
      backgroundColor: '#f8f8f8',
      alignItems: 'center',
    },
    viewRowModal:{ 
      flexDirection: 'row',
      width:'100%',
      height: 50,
      backgroundColor: '#ffffff',
      alignItems: 'center',
    },
    textRT:{
      color:'#1b1b1b',
      fontSize:Dimensions.get('window').width <380 ? 20 : 30,
      fontWeight: 'bold',
      width:'80%',
      textAlign:'center'
    },
    fontModalToken:{
      fontSize:20,
      color: '#f42e78',
      marginBottom:30
    },
    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0
    }
});

const stylesLandscape = StyleSheet.create(
{
  logo:{
    
    height:0,
  }
});