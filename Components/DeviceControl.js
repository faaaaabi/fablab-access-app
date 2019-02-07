import React, { Component } from 'react';
import { FlatList, NetInfo, Text, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { connect } from 'react-redux';
import SocketIOClient from 'socket.io-client';
import { 
  CONNECTION_STATE_CHANGED, 
  TOKEN_RECEIVED 
} from '../store/actions/actionTypes' 
import requestApiAuthentication from '../store/actions/authActions';

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
    const dispatchConnected = isConnected => this.props.onConnectionChanged(isConnected);

    NetInfo.isConnected.fetch().then().done(() => {
      NetInfo.isConnected.addEventListener('connectionChange', dispatchConnected);
    });

    await this.requestApiAuthentication();
    await this.fetchDevicesAsLocationmapToState('Regal1');
    this.doSocketConnection();
  }

  componentDidUpdate() {
  }

  keyExtractor = (item, index) => item.index;

  renderItem = (item) => (
    <View key={item} style={{ flexDirection: 'row', }}>
      {item.reverse().map((device, index) => (
        <View key={index} style={{ margin: 10 }}>
          <Avatar
            xlarge
            overlayContainerStyle={{ backgroundColor: device ? 'grey' : 'white' }}
            onPress={() => device ? this.toggleDevice(device.name) : ''}
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
      const headers = new Headers();
      //headers.append('Content-Type', 'application/json');
      headers.set('Authorization', `Bearer ${this.props.token}`);
      console.log('token:', this.props.token);

      const response = await fetch(`http://${this.props.host}/devices/${group}/members/locationmap`, {
        method: 'GET',
        headers
      });
      if (response.status > 299) {
        alert(`Error fetching devices. Statuscode: ${response.status}`)
      } else {
        try {
          const responseText = await response.text();
          const responseJSON = JSON.parse(responseText);
          if (!responseJSON.error || !response.status > 299) {
            this.setState({ devices: responseJSON.locationMap });
          }
          else {
            alert(`Error fetching devicemap: ${responseJSON.error}, Status-Code: ${response.status}`)
          }
        } catch (e) {
          alert(e);
        }
      }
    } catch (e) {
      alert('Could not load devices. Check your network connection');
    }
  }

  toggleDevice = async (deviceName) => {
    if (this.props.authenticated) {
      try {
        fetch(`http://${this.props.host}/devices/${deviceName}/toggleState`);
      } catch (e) {
        alert('Could not change device state.');
      }

    }
  }

  doAuthentication = async () => {
    try {
      const authResponse = await fetch(`http://${this.props.host}/auth/app`, {
        method: 'POST',
        headers: {
          "content-type": "application/x-www-form-urlencoded"
        },
        body: `deviceID=AccessDevice1&apiKey=${this.props.apiKey}`
      })
      const authResponseJSON = await authResponse.json()
      console.log('authresponse: ', authResponseJSON)
      if (authResponseJSON) {
        console.log("tüdelü");
        this.props.onTokenReceived(authResponseJSON.token);
      }
    } catch (e) {
      alert(e);
    }
  }

  doSocketConnection = () => {
    const connectionConfig = {
      jsonp: false,
      reconnection: true,
      reconnectionDelay: 100,
      reconnectionAttempts: 100000,
      transports: ['websocket'], // you need to explicitly tell it to use websockets
    };

    this.socket = SocketIOClient('http://192.168.0.10:8000', connectionConfig);
    this.socket.on('connect', () => {
      this.socket
        .emit('authenticate', { token: this.props.token }) //send the jwt
        .on('authenticated', function () {
          //do other things
        })
        .on('unauthorized', function (msg) {
          console.log("unauthorized: " + JSON.stringify(msg.data));
          alert(`Error connection to realtime API: ${msg.data.type}`);
        })
    });
    this.socket.on('message', this.onReceivedMessage);
  }

  render() {
    return (
      // Try setting `justifyContent` to `center`.
      // Try setting `flexDirection` to `row`.
      <View style={{
        flex: 0.7,
        paddingTop: 10
      }}>
        {this.state.devices &&
          <FlatList
            data={this.state.devices.reverse()}
            renderItem={({ item }) => this.renderItem(item)}
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
    isConnected: state.isConnected,
    apiKey: state.apiKey,
    token: state.token,
  };
}

const mapDispatchToProps = {
  requestApiAuthentication
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceControl)

