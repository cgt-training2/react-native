import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Picker,
  ImageBackground,
  Scene,
  Alert,
  AsyncStorage,
  BackHandler,
  Dimensions
} 
from 'react-native';

import Orientation from 'react-native-orientation';

import { Dropdown } from 'react-native-material-dropdown';

import Slideshow from 'react-native-slideshow';

import Modal from "react-native-modal";

import ReusableClass from "./ReusableClass";

type Props = {};

export default class Landing extends Component<Props> {

	static navigationOptions = {
  	title: 'Home Page',
  	headerTintColor: '#f42e78',
    headerStyle: { backgroundColor: '#f8f8f8', borderWidth: 1, borderBottomColor: 'white'},
    headerTitleStyle: { color: '#f42e78', fontSize:20, alignSelf:'center' }
  };

  constructor(props) {
    super(props);
    this.state = {
      screen: Dimensions.get('window'),
      isModal2Visible: false,
      position: 0,
      interval: null,
      dataSource: [
        {
          title: 'Title 1',
          caption: 'Caption 1',
          url: 'https://cdn4.iconfinder.com/data/icons/social-icons-6/40/twitter-64.png',
        }, {
          title: 'Title 2',
          caption: 'Caption 2',
          url: 'https://cdn4.iconfinder.com/data/icons/social-icons-6/40/twitter-64.png',
        }, {
          title: 'Title 3',
          caption: 'Caption 3',
          url: 'https://cdn4.iconfinder.com/data/icons/social-icons-6/40/twitter-64.png',
        },
      ],
    };
    global.user_name = '';
    this.navigateToDonate = this.navigateToDonate.bind(this);
    this.navigateToDonateItem = this.navigateToDonateItem.bind(this);
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
    this.setState({
      interval: setInterval(() => {
        this.setState({
          position: this.state.position === this.state.dataSource.length ? 0 : this.state.position + 1
        });
      }, 2000)
    });
  }

  componentDidMount() {
    // this locks the view to Portrait Mode
    // Orientation.lockToPortrait();

    // this locks the view to Landscape Mode
    // Orientation.lockToLandscape();
    // this unlocks any previous locks to all Orientations
    this.setState({screen: Dimensions.get('window')});
    
    console.log(this.state.screen.width);
    console.log(this.state.screen.height);

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
    clearInterval(this.state.interval);
    BackHandler.removeEventListener('hardwareBackPress', obj.handleBackButton);
  }

  _orientationDidChange = (orientation) => {

    if (orientation === 'LANDSCAPE') {
      // do something with landscape layout
    } else {
      // do something with portrait layout
    }
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

  _toggleModal2 = () =>
    this.setState({ isModal2Visible: !this.state.isModal2Visible });  

  onLayout() {
    this.setState({screen: Dimensions.get('window')});
    Alert.alert('Width: '+this.state.screen.width+' '+'Height: '+this.state.screen.height);
    console.log(this.state.screen.width);
    console.log(this.state.screen.height);
  }

  navigateToDonate(props) {
    
    this.setState({ isModal2Visible: !this.state.isModal2Visible });    
    setTimeout(function(){
      //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
      props.navigation.navigate('DonationGuestScreen')
    }, 200);
  }

  navigateToDonateItem(props) {

    this.setState({ isModal2Visible: !this.state.isModal2Visible });

    setTimeout(function(){
      //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
      props.navigation.navigate('DonationGuestItemScreen')
    }, 200);
  }

// Render Method
  render() {
    const resizeMode = 'center';
    const text = 'I am some centered text';  
    return (
      <View style={styles.container}>
        <Slideshow 
          dataSource={this.state.dataSource}
          position={this.state.position}
          onPositionChanged={position => this.setState({ position })}> 
        </Slideshow>
        <ScrollView style={styles.scroll}>
          <View style={styles.viewTiles}>
            <ImageBackground style={styles.imgBackground} source={require('../images/donation.png')}>
              <TouchableOpacity style={styles.buttonContainer}
                onPress={this._toggleModal2}>
                  <Text style={styles.buttonText}>Donation</Text>
              </TouchableOpacity>  
            </ImageBackground>
            <ImageBackground style={styles.imgBackground} source={require('../images/start_campaign.png')}>
              <TouchableOpacity style={styles.buttonContainer}
                onPress={() => this.props.navigation.navigate('LoginScreen')}>
                  <Text style={styles.buttonText}>Start Campaign</Text>
              </TouchableOpacity>    
            </ImageBackground>
          </View>
          <View style={styles.viewTiles}>
            <ImageBackground style={styles.imgBackground} source={require('../images/add_request.png')}>
              <TouchableOpacity style={styles.buttonContainer}
                onPress={() => this.props.navigation.navigate('LoginScreen')}>
                  <Text style={styles.buttonText}>Add Request</Text>
              </TouchableOpacity>    
            </ImageBackground>
            <ImageBackground style={styles.imgBackground} source={require('../images/ask_help.png')}>
              <TouchableOpacity style={styles.buttonContainer}
                onPress={() => this.props.navigation.navigate('LoginScreen')}>
                  <Text style={styles.buttonText}>Ask Help</Text>
              </TouchableOpacity>    
            </ImageBackground>
          </View>
        </ScrollView>
        <Modal 
          isVisible={this.state.isModal2Visible}
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}
          backdropTransitionInTiming={1000}
          backdropTransitionOutTiming={1000}
          backdropColor={"#000000"}
          backdropOpacity={.8}  
          style=
          {styles.bottomModal}>
          <View style={ styles.modal2Container }>
            <View style={styles.viewRowModal}>
              <TouchableOpacity style={{width:'18%'}} onPress={this._toggleModal2}>
                  <Text style={styles.buttonTextC}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.textRT}>Select Option</Text>
            </View>
            <View style={styles.mViewRow}>
              <View style={styles.viewDonateImg}>
                <TouchableOpacity 
                  onPress={() => this.navigateToDonate(this.props)}>
                  <Image 
                    source={require('../images/donate_money.png')}/>
                </TouchableOpacity>
              </View>
              <View style={styles.viewDonateImg}>
                <TouchableOpacity 
                  onPress={() => this.navigateToDonateItem(this.props)}>
                  <Image 
                    source={require('../images/donate_items.png')}/>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>  
    );
  }
}

// Stylesheet starts
const styles = StyleSheet.create({
    container: {
      backgroundColor: '#f8f8f8',
      flex: 1,
      alignItems: 'center',
      padding: 20
    },
    viewTiles: {
      flexDirection: 'row',
      flex: 1,
      marginTop:0
    },
    viewDonateImg:{
      alignItems: 'center',
      justifyContent:'center',
      width:'50%'
    },
    imgBackground:{
      flex: 1,
      alignItems: 'center',
      justifyContent:'center',
      margin:10,
      width:100,
      height:180,
      borderRadius:10
    },
    buttonContainer: {
      width: 120,
      height: 40,
      marginTop: 30,	
      backgroundColor: 'rgba(52, 52, 52, 0.4)',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      marginBottom: 30
    },
    buttonText: {
      color: '#fff',
      fontSize: 14,
      width:Platform.OS === 'ios' ? 'auto' : 120,
      textAlign:Platform.OS === 'ios' ? 'auto' : 'center',
      fontWeight: 'bold'
    },
    scroll:{
      width:'100%',
      marginTop:30
    },
    mViewRow:{
      backgroundColor:"#f3f3f3",
      flexDirection:'row',
      flex: 1,
    },

    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0
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

    buttonTextC: {
      color: '#f42e78',
      fontSize: Dimensions.get('window').width <380 ? 15 : 20,
      fontWeight: 'bold',
      width:Platform.OS === 'ios' ? 'auto' : 100,
      // textAlign:Platform.OS === 'ios' ? 'auto' : 'center'
    },

    modal2Container:{   
      height:Platform.OS === 'ios' ? 300 : 300,
      backgroundColor: '#f8f8f8',
      // alignItems: 'center',
    }
});

const stylesLandscape = StyleSheet.create(
{
  container: {
      backgroundColor: '#f8f8f8',
      flex: 1,
      alignItems: 'center',
      padding:20
  },
  viewBtn: {
    flexDirection: 'row',
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
    width:'100%'
  }
});
