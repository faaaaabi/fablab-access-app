import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    AppRegistry,
    View,
    FlatList,
    Text,
    Button,
    Platform,
    TouchableOpacity,
    Linking,
    TextInput,
    Image,
    ScrollView,
    NetInfo
} from 'react-native';

import { Avatar } from 'react-native-elements';
const axios = require('axios');

class DeviceControl extends Component {
  constructor(props) {
    super(props)
    this.state = {
      devices: []
    }
  }

  componentWillMount() {
  }

  async componentDidMount() {
    console.log('moped')
    const dispatchConnected = isConnected => this.props.dispatch(onConnectionChanged(isConnected));

    NetInfo.isConnected.fetch().then().done(() => {
      NetInfo.isConnected.addEventListener('connectionChange', dispatchConnected);
    });

    this.fetchDevicesAsLocationmapToState('Regal1');
  }

  componentDidUpdate(){
    console.log('update: ', this.props.devices);
  }

  keyExtractor = (item, index) => item.index;

  renderItem = (item) => (
      <View key={item} style={{flexDirection: 'row',}}>
        { item.reverse().map( (device, index) => (
              <View key={index} style={{margin: 10}}>
                <Avatar
                  xlarge
                  overlayContainerStyle={{backgroundColor: device ? 'grey' : 'white'}}
                  onPress={() => device ? this.toggleDevice(device.name) : '' }
                  activeOpacity={0.7}
                />
                {device && <Text style={{ fontSize: 15 }}>{device.name}</Text>}
              </View>
            ) 
          )
        }
      </View>
    )

    renderSeparator = () => {
      return (
        <View
          style={{
            height: 1,
            width: "86%",
            backgroundColor: "#CED0CE",
            marginLeft: "1%"
          }}
        />
      );
    };

    fetchDevicesToState = async (group) => {
      try {
        const response = await fetch(`http://${this.props.host}/devices/${group}/members`)
        const responseJSON = await response.json();
        this.setState({ devices: responseJSON.devices });
      } catch (e) {
        alert('Could not load devices. Check your network connection');
        console.error(e);
      }
    }
  
    fetchDevicesAsLocationmapToState = async (group) => {
      /*if(this.props.isConnected) {*/
        try {
          const response = await fetch(`http://${this.props.host}/devices/${group}/members/locationmap`);
          const responseJSON = await response.json();
          console.log('responseJSON:', responseJSON);
          if(!responseJSON.error || !response.status > 299) {
            this.setState({ devices: responseJSON.locationMap });
          } 
          else {
              alert(`Error fetching devicemap: ${responseJSON.error}, Status-Code: ${response.status}`)
          }
        } catch (e) {
          alert('Could not load devices. Check your network connection');
          console.error(e);
        }
    }
  
    toggleDevice = async (deviceName) => {
      if ( this.props.authenticated ) {
        try {
          fetch(`http://${this.props.host}/devices/${deviceName}/toggleState`);
        } catch (e) {
          alert('Could not change device state.');
          console.error(e)
        }
          
      }
    }
  
  render() {
    return (
      // Try setting `justifyContent` to `center`.
      // Try setting `flexDirection` to `row`.
      <View style={{
        flex: 0.7,
        paddingTop:10
      }}>
      { this.state.devices &&
          <FlatList
            data={this.state.devices.reverse()}
            renderItem={({item}) => this.renderItem(item)}
            keyExtractor={this.keyExtractor}
            ItemSeparatorComponent={this.renderSeparator}
          />
      }
      </View>
    );
  }
  
  };
  

const mapStateToProps = state => {
  return {
      authenticated: state.authenticated,
      host: state.host,
      isConnected : state.isConnected
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onConnectionChanged: (value) => dispatch({
      type: 'CONNECTION_STATE_CHANGED',
      value
  }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceControl)

