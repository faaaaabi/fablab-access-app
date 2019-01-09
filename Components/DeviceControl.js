import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    AppRegistry,
    View,
    Text,
    Button,
    Platform,
    TouchableOpacity,
    Linking,
    TextInput,
    Image,
    ScrollView,
} from 'react-native';

import { Avatar } from 'react-native-elements';

class DeviceControl extends Component {
  constructor(props) {
    super(props)
    this.state = {
      devices: [{name: 'teeeeeest1'}, {name: 'test2'}, {name: 'test3'}, {name: 'teeeeeest1'}, {name: 'test2'}, {name: 'test3'}, {name: 'teeeeeest1'}, {name: 'test2'}, {name: 'test3'}, {name: 'teeeeeest1'}, {name: 'test2'}, {name: 'test3'}]
    }
  }

  componentWillMount() {
  }

  async componentDidMount() {
    await this.fetchDevicesToState('Regal1');
  }

  render() {
    return (
      // Try setting `justifyContent` to `center`.
      // Try setting `flexDirection` to `row`.
      <View style={{
        flex: 0.7,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        paddingTop:10
      }}>
        {this.state.devices.map(device =>
                <View key={device.name} style={{
                  width: 60,
                  height: 60,
                  alignItems: 'center',
                  margin: 5,
                }}>
                <Avatar
                  medium
                  onPress={() => this.toggleDevice(device.name)}
                  activeOpacity={0.7}
                  
                />
                <Text style={{ fontSize: 9 }}>{device.name}</Text>
                </View>
        )}
      </View>
    );
  }

  fetchDevicesToState = async (group) => {
    try {
      const response = await fetch(`http://${this.props.host}/devices/${group}/members`);
      const devicesJSON = await response.json();
      this.setState({ devices: devicesJSON.devices });
    } catch (e) {
      console.error(e);
    }
  }
};

toggleDevice = async (deviceName) => {
  if ( this.props.authenticated ) {
      fetch(`http://${this.props.host}/devices/${deviceName}/toggleState`);
  }
}

const mapStateToProps = state => {
  return {
      authenticated: state.authenticated,
      host: state.host,
  };
}

const mapDispatchToProps = dispatch => {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceControl)

