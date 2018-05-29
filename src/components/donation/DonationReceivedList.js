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
  Dimensions,
  FlatList,
  ActivityIndicator
} 
from 'react-native';

import Orientation from 'react-native-orientation';

import { Dropdown } from 'react-native-material-dropdown';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import ReusableClass from "../ReusableClass";

import ImagePicker from 'react-native-image-picker';

import { List, ListItem, SearchBar } from 'react-native-elements';

type Props = {};

export default class DonationReceivedList extends Component<Props> {

  static navigationOptions = {
      title: 'Tab1',
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
      loading: false,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false
    };

    this.focusNextField = this.focusNextField.bind(this);
    this.handleDayChange = this.handleDayChange.bind(this);
    this.loginFunction = this.loginFunction.bind(this);
    this.imgPicker = this.imgPicker.bind(this);
    this.makeRemoteRequest = this.makeRemoteRequest.bind(this);
    this.renderSeparator = this.renderSeparator.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.navigateDetail = this.navigateDetail.bind(this);
    this.inputs = {};
    this.options ={};
    obj = new ReusableClass();
  }

  focusNextField(id) {
    this.inputs[id].focus();
  }

  loginFunction(){
    const email = this.state.password;
    // const password = this.state.password;
    Alert.alert(email);
  }

  handleDayChange(text){
    // Alert.alert(text);
    this.setState({ avlday: text });
    Alert.alert(this.state.avlday);
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
      // else if (response.customButton) {
      //   console.log('User tapped custom button: ', response.customButton);
      // }
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

  makeRemoteRequest = () => {
    this.setState({ loading: true });
    const { page, seed } = this.state;
    const url = 'https://randomuser.me/api/?seed=${seed}&page=${page}&results=20';
    

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: page === 1 ? res.results : [...this.state.data, ...res.results],
          error: res.error || null,
          loading: false,
          refreshing: false
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 20,
          width: "100%",
          backgroundColor: "#f1f3f4",
        }}>
      </View>
    );
  };

  renderHeader = () => {
    return <SearchBar placeholder="Type Here..." lightTheme round />;
  };

  navigateDetail = (item) => {

    this.props.navigation.navigate('DonationDetailScreen', { list: item });
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

    this.makeRemoteRequest();

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

  onLayout(){
    this.setState({screen: Dimensions.get('window')});
  }

  render() {

    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" animating={this.state.loading}/>
        <List containerStyle={{borderTopColor:'#ffffff', width: '100%'}}>
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <ListItem
                roundAvatar
                title={`${item.name.first} ${item.name.last}`}
                subtitle={item.email}
                avatar={{ uri: item.picture.thumbnail }}
                containerStyle={{ borderBottomWidth: 0, marginTop:10, 
                  marginBottom:10 }}
                onPress={() => this.navigateDetail(item)}/>
            )}
            keyExtractor={item => item.email}
            ItemSeparatorComponent={this.renderSeparator}
          >
          </FlatList>
        </List>

      </View>
    );
  } 
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#f1f3f4',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding:20,
      paddingTop:0
    },
    logo: {
      marginTop: 10,
      width:120,
      height:120
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
    pickerStyle:{
      marginTop: 30
    },
    scroll:{
      marginTop: 20
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
