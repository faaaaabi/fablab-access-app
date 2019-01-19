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
} from 'react-native';

import { Avatar } from 'react-native-elements';

class DeviceControl extends Component {
  constructor(props) {
    super(props)
    this.state = {
      //devices: [{name: 'teeeeeest1'}, {name: 'test2'}, {name: 'test3'}, {name: 'teeeeeest1'}, {name: 'test2'}, {name: 'test3'}, {name: 'teeeeeest1'}, {name: 'test2'}, {name: 'test3'}, {name: 'teeeeeest1'}, {name: 'test2'}, {name: 'test3'}]
      devices: []
    }
  }

  componentWillMount() {
  }

  async componentDidMount() {
    console.log('moped')
    await this.fetchDevicesAsLocationmapToState('Regal1');
  }

  componentDidUpdate(){
    console.log('update: ', this.props.devices);
  }

  renderItem = (item) => {
    console.log('renderItem item: ', item)
    return(
      <View style={{flexDirection: 'row',}}>
        { item.map( (device) => {
          const color = device ? 'grey' : 'white'
          const backgroundColor = {backgroundColor: color}
            return(
              <View style={{margin: 10}}>
                <Avatar
                  xlarge
                  overlayContainerStyle={backgroundColor}
                  onPress={() => this.toggleDevice(device.name)}
                  activeOpacity={0.7}
                />
                {device && <Text style={{ fontSize: 15 }}>{device.name}</Text>}
              </View>
            ) 
          })
        }
      </View>
    )
    };

render() {
  return (
    // Try setting `justifyContent` to `center`.
    // Try setting `flexDirection` to `row`.
    <View style={{
      flex: 0.7,
      paddingTop:10
    }}>
    <FlatList
      data={this.state.devices}
      renderItem={({item}) => this.renderItem(item)}
    />
    </View>
  );
}


  /*
        <DeviceLocationView devices={this.state.devices} />

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
  */

  fetchDevicesToState = async (group) => {
    try {
      const response = await fetch(`http://${this.props.host}/devices/${group}/members`);
      const devicesJSON = await response.json();
      this.setState({ devices: devicesJSON.devices });
    } catch (e) {
      console.error(e);
    }
  }

  fetchDevicesAsLocationmapToState = async (group) => {
    try {
      const response = await fetch(`http://${this.props.host}/devices/${group}/members/locationmap`);
      const devicesJSON = await response.json();
      this.setState({ devices: devicesJSON.locationMap });
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

DeviceLocationView = (props) => {
  if(props.devices.length > 0) {
    console.log('locationmap:' , props.devices)
    return(
      props.devices.map((row) => {
        return (<View>
          {row.map((element) => {
            return(
            <View 
              style={{
              width: 60,
              height: 60,
              alignItems: 'center',
              margin: 5,
            }}>
              <Avatar
                medium
                onPress={() => this.toggleDevice(element.name)}
                activeOpacity={0.7}
              />
            </View>
            )
          })}
        </View>)
      })  
      );
  }
  return null;
}

/*DeviceLocationViewList = (props) => {
  if(props.devices.length > 0) {
    console.log('locationmap:' , props.devices)
    return(

    );
  }
  return null;
}*/

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

