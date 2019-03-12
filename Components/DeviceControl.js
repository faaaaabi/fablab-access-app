import React, { Component } from "react";
import { FlatList, NetInfo, View, Text, Alert } from "react-native";
import { Avatar } from "react-native-elements";
import { connect } from "react-redux";
import SocketIOClient from "socket.io-client";
import {
  CONNECTION_STATE_CHANGED,
  TOKEN_RECEIVED
} from "../store/actions/actionTypes";
import { requestApiAuthentication } from "../store/actions/authActions";
import { Separator } from "./Device/Separator";
import { DeviceAvatar } from "./Device/DeviceAvatar";
import { getDevicesAsLocationMap } from "../services/deviceService";
// see https://github.com/facebook/react-native/issues/14796
import { Buffer } from "buffer";
global.Buffer = Buffer;

// see https://github.com/facebook/react-native/issues/16434
import { URL, URLSearchParams } from "whatwg-url";
import { extendDevicesObjectWithBookings } from "../libs/extendDevicesObjectWithBookings";
global.URL = URL;
global.URLSearchParams = URLSearchParams;

class DeviceControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      deviceBookings: [],
      x: "",
      y: "",
      width: "",
      height: "",
      viewHeight: 100
    };
  }

  measureView(event) {
    this.setState({
      x: event.nativeEvent.layout.x,
      y: event.nativeEvent.layout.y,
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height
    });
  }

  async componentDidMount() {
    const dispatchConnected = isConnected =>
      this.props.onConnectionChanged(isConnected);

    NetInfo.isConnected
      .fetch()
      .then()
      .done(() => {
        NetInfo.isConnected.addEventListener(
          "connectionChange",
          dispatchConnected
        );
      });

    await this.props.requestApiAuthentication();
    await this.fetchDevicesAsLocationmapToState("Regal1");
    await this.fetchDeviceBookings();
    /*setInterval(() => {
        this.fetchDevicesAsLocationmapToState('Regal1');
        this.fetchDeviceBookings();
    }, 5000);*/
    this.doSocketConnection();
  }

  fetchDevicesAsLocationmapToState = async group => {
    console.log("fetching devices");
    try {
      const deviceLocationMap = await getDevicesAsLocationMap(
        this.props.token,
        this.props.host,
        group
      );
      this.setState({ devices: deviceLocationMap });
    } catch (e) {
      alert(e);
    }
  };

  fetchDeviceBookings = async () => {
    console.log("fetching bookings");
    try {
      const headers = new Headers();
      headers.set("Authorization", `Bearer ${this.props.token}`);
      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");
      try {
        var url = new URL(`http://${this.props.host}/bookings/`);
        const devicesArray = [];
        this.state.devices.forEach(row => {
          row.forEach(element => {
            if(element) {
              devicesArray.push(element);
            }
          })
        })

        var params = { ids: devicesArray.map((device) => {
          return device.name
        }) };

        url.search = new URLSearchParams(params);
        const request = await fetch(url, {
          method: "GET",
          headers
        });
        const deviceBookings = await request.json();
        this.setState({ deviceBookings });
      } catch (e) {
        alert("Could not get device bookings");
        console.log(e);
      }
    } catch (e) {
      alert(e);
    }
  };

  bookDevice = async deviceName => {
    const headers = new Headers();
    headers.set("Authorization", `Bearer ${this.props.token}`);
    headers.set("Accept", "application/json");
    headers.set("Content-Type", "application/json");
    if (this.props.authenticated) {
      /*if(this.isDeviceBooked(deviceName)) {
        const booker = this.getBooker(deviceName, this.state.deviceBookings)
        if(booker.userUID === this.props.userUID) {
          const response = await fetch(`http://${this.props.host}/bookings/`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            deviceName: deviceName,
            userUID: this.props.userUID
          })
        });
        }
      }*/
      try {
        console.log('intermadiate token:', this.props.intermediateToken);
        const response = await fetch(`http://${this.props.host}/bookings/`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            deviceName: deviceName,
            userUID: this.props.userUID,
            intermediateToken: this.props.intermediateToken
          })
        });
        if (!response.ok) {
          const responeJSON = await response.json();
          Alert.alert(
            "Booking Error",
            `There was an error booking this device. Error: ${
              responeJSON.error
            }`
          );
        } else {
          this.fetchDeviceBookings();
        }
      } catch (e) {
        alert(`Could not book device. Error: ${e}`);
      }
    }
  };

  doSocketConnection = () => {
    const connectionConfig = {
      jsonp: false,
      reconnection: true,
      reconnectionDelay: 100,
      reconnectionAttempts: 100000,
      transports: ["websocket"] // you need to explicitly tell it to use websockets
    };

    let advertisementInvocations = 0;

    const socket = SocketIOClient(
      "http://192.168.122.1:8000",
      connectionConfig
    );
    socket.on("connect", () => {
      socket.emit("authenticate", { token: this.props.token }); //send the jwt
    });
    socket
      .on("authenticated", () => {
        socket.emit("advertise", {
          accessDeviceName: "TestAccessDevice1",
          location: "Regal1",
          invocations: advertisementInvocations
        });
        advertisementInvocations += 1;
      })
      .on("unauthorized", msg => {
        alert(`Error connection to realtime API: ${msg.data.type}`);
      });
    socket.on("connect_failed", function() {
      console.log("Connection Failed");
    });
    socket.on("connect", function() {
      console.log("Connected");
    });
    socket.on("disconnect", function() {
      //socket.close();
    });
  };

  DeviceRow = (item, index) => {
    const AvatarSize = parseInt(this.state.width / 8);
    return (
      <View
        key={item}
        style={{
          flexDirection: "row",
          backgroundColor: "#f7f7f7",
          marginBottom: 10
        }}
      >
        <View
          style={{
            flex: 0.1,
            justifyContent: "center",
            alignItems: "center",
            transform: [{ rotate: "-90deg" }]
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Fach {index}
          </Text>
        </View>
        <View style={{ flex: 0.9, flexDirection: "row" }}>
          {item.map((device, index) => (
            <DeviceAvatar
              avatarSize={AvatarSize}
              device={device}
              isBooked={device ? this.isDeviceBooked(device.name) : false}
              toggleFunction={this.bookDevice}
              key={index}
            />
          ))}
        </View>
      </View>
    );
  };

  isDeviceBooked = deviceName => {
    return this.state.deviceBookings.some(booking => {
      return booking.deviceName === deviceName;
    });
  };

  getBooker = (devicName, bookings) => {
    return this.state.deviceBookings.find(booking => {
      return booking.deviceName === devicName 
    })
  }

  render() {
    const reversedDevices = this.state.devices.slice();
    reversedDevices.reverse();

    return (
      <View
        style={{
          flex: 0.7,
          paddingTop: 10,
          backgroundColor: "#FFF"
        }}
      >
        {reversedDevices && (
          <FlatList
            onLayout={event => this.measureView(event)}
            key={1}
            data={this.state.devices}
            renderItem={({ item, index }) => this.DeviceRow(item, index)}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.auth.authenticated,
    userUID: state.auth.userUID,
    host: state.settings.host,
    isConnected: state.status.isConnected,
    apiKey: state.auth.apiKey,
    token: state.auth.token,
    intermediateToken: state.auth.intermediateToken
  };
};

const actions = {
  requestApiAuthentication
};

export default connect(
  mapStateToProps,
  actions
)(DeviceControl);
