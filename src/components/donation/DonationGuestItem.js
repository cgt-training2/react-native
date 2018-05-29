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
  BackHandler,
  ActivityIndicator,
  Dimensions
} 
from 'react-native';

import Orientation from 'react-native-orientation';

import { Dropdown } from 'react-native-material-dropdown';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import ReusableClass from "../ReusableClass";

import ImagePicker from 'react-native-image-picker';

import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 
'react-native-simple-radio-button';


type Props = {};

export default class DonationGuestItem extends Component<Props> {

  static navigationOptions = {
    	title: 'Donation Item',
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
      language: '',
      loading: false,
      avatarSource: null,
      uploadPic:0,
      fname: '',
      mobile: '',
      organizationTo: '',
      donationType:'',
      value: 0,
      description:'',
      value3: 0,
      value3Index: 0
    };

    this.inputs = {};
    this.radio_props = [
      {label: 'Paytm', value: 0 },
      {label: 'Debit/Credit Card', value: 1 },
      {label: 'Net Banking', value: 2 }
    ];

    this.options ={};

    obj = new ReusableClass();

    this.focusNextField = this.focusNextField.bind(this);
    this.handleDonateTo = this.handleDonateTo.bind(this);
    this.submitDonation = this.submitDonation.bind(this);
    this.imgPicker = this.imgPicker.bind(this);
  }

  focusNextField(id) {
    this.inputs[id].focus();
  }


  imgPicker = () => {

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

  submitDonation(){
    if(this.state.fname =='' || this.state.mobile == '' || this.state.description==''){
      Alert.alert('please fill all the fields to continue');
      return;
    }else if(this.state.organizationTo== ''){
      Alert.alert('Please select organization to donate');
      return;
    }else if(this.state.donationType== ''){
      Alert.alert('Please select type of donation');
      return;
    }else if(this.state.avatarSource == null && this.state.uploadPic==0){
      this.state.uploadPic = 1;
      Alert.alert(
        'Upload Photo',
        'Are You sure you don\'t want to upload your photo' ,
        [
          {text: 'Yes'},
          {text: 'Upload Photo', onPress: this.imgPicker}
        ],
        { cancelable: true }
      )
      return;
    }
    // Alert.alert(this.state.fname +' '+ this.state.mobile +' '+ this.state.description 
    //   +' '+ this.state.donationType +' '+ this.state.organizationTo);      
    this.setState({loading:true});
    let photo = this.state.avatarSource == null ? 
    'http://192.168.1.59:3000/uploads/profile.png':this.state.avatarSource.uri;
    // FormData is used to create bundle of multipart/form-data.
    let formdata = new FormData();
    formdata.append("name", this.state.fname)
    formdata.append("donateTo", this.state.organizationTo)
    formdata.append("phone", this.state.mobile)
    formdata.append("donateItem", this.state.donationType)
    formdata.append("description", this.state.description)
    formdata.append("profile", 
      {uri: photo, name: 'image.jpg', type: 'multipart/form-data'})

    // fetch('https://shrouded-escarpment-62032.herokuapp.com/users/register',{
    fetch('http://192.168.1.59:3000/donate/donate_item',{
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
            avatarSource: null,
            fname:'',
            loading:false,
            mobile:'',
            donationType:'',
            description:'',
            value3:0
          });
          // Alert.alert(res.message);
          Alert.alert(
            'Received',
            res.message,
            [
              {text: 'OK', onPress: () => this.props.navigation.navigate('tabDonationScreen')},
            ],
            { cancelable: true })
        }
      )
      .catch(err => {
        console.log(err)
      })
  }

  handleDonateTo(text){
    this.setState({ organizationTo: text });
  }

  handleDonateType(text){
    // Alert.alert(text)
    this.setState({ donationType: text });
  }

  onLayout(){
    this.setState({screen: Dimensions.get('window')});
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

    // this unlocks any previous locks to all Orientations
    // this.inputs['two'].focus();

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

    let data = [{
      value: 'Charity Navigator',
    }, {
      value: 'Bal Basera',
    }, {
      value: 'Charity Foundation',
    },{
      value: 'Helping Hand',
    },{
      value: 'Habitat For Humanity',
    }];

    let dataDonateType = [{
      value: 'Blankets',
    }, {
      value: 'Books',
    }, {
      value: 'Clothes',
    },{
      value: 'Groceries Items',
    }];

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
        <KeyboardAwareScrollView ref='scroll'
          enableOnAndroid enableResetScrollToCoords={false} style={this.getStyle().scroll} 
          onLayout = {this.onLayout.bind(this)}>
           
          <TextInput style={this.getStyle().input1} onLayout = {this.onLayout.bind(this)}
            underlineColorAndroid = 'transparent'
            placeholder = "Enter Full Name"
            placeholderTextColor = "rgba(128,128,128,0.7)"
            autoCapitalize = "none"
            autoCorrect = {false}
            onChangeText = {(fname) => this.setState({fname})}
            returnKeyType = "next"
            blurOnSubmit={false}
            keyboardType = "default"
            value={this.state.fname}
            onSubmitEditing = {() => {
              if(this.state.fname==''){
                Alert.alert('Please enter Full Name')
              }else{
                this.focusNextField('three');     
              }
            }}  
            ref = { input => {
              this.inputs['two'] = input;
            }}>
          </TextInput>

          <TextInput style = {this.getStyle().input1} onLayout = {this.onLayout.bind(this)}
            underlineColorAndroid = 'transparent'
            placeholder = "Enter Mobile Number"
            placeholderTextColor = "rgba(128,128,128,0.9)"
            autoCapitalize = "none"
            autoCorrect = {false}
            returnKeyType = "done"
            value = {this.state.mobile}
            onChangeText = {(mobile) => this.setState({mobile})}
            blurOnSubmit ={(this.state.mobile=='' || this.state.mobile.length != 10) ? false : true }            
            keyboardType = {Platform.OS === 'ios' ? "phone-pad" : "numeric"}                      
            ref= { input => {
              this.inputs['three'] = input;
            }}
            onSubmitEditing = {() => {
              if(this.state.mobile==''){
                Alert.alert('Please enter mobile Number')
              }else if(this.state.mobile.length != 10){
                Alert.alert('Mobile Number is not valid')
              }
            }}>
          </TextInput>

          <Dropdown 
            label = 'Donate To'
            data = {data}
            onChangeText = {(value, index, data) => this.handleDonateTo(data[index].value)}
          ></Dropdown>

          <Dropdown 
            label = 'Donation Type'
            data = {dataDonateType}
            onChangeText = {(value, index, data) => this.handleDonateType(data[index].value)}
          ></Dropdown>  

          <TextInput style = {this.getStyle().input1} onLayout = {this.onLayout.bind(this)}
            underlineColorAndroid = 'transparent'
            placeholder = "Description"
            placeholderTextColor = "rgba(128,128,128,0.7)"
            autoCapitalize = "none"
            autoCorrect = {false}
            value = {this.state.description}
            blurOnSubmit={ (this.state.description=='') ? false : true }
            onChangeText = {(description) => this.setState({description})}
            ref = { input => {
              this.inputs['five'] = input;
            }}
            onSubmitEditing = {() => {
              if(this.state.description==''){
                Alert.alert('Please enter description')
              }else{
                this.refs.scroll.scrollToPosition(0, 140)
              }
            }}
            returnKeyType = "done"> 
          </TextInput>   

          <TouchableOpacity style={this.getStyle().buttonContainer} onLayout = {this.onLayout.bind(this)} 
            onPress={this.submitDonation} >
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
      padding: 20
    },
    logo: {
      marginTop: 10,
      width: 120,
      height: 120
    },
    input1: {
      width: 300,
      height: 60,
      marginTop: 30,
      borderWidth: 2,
      borderColor: '#e7e7e7',
      borderRadius: 8,
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
      // marginBottom: 30
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
    pickerStyle: {
      marginTop: 30
    },
    scroll: {
      marginTop: 20
    },
    payOption:{
      color: '#000000',
      fontSize: 20,
      fontWeight: 'bold',
      marginTop:20
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
  input1: {
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
