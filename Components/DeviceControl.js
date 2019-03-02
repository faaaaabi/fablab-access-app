import React, { Component } from "react";
import { FlatList, NetInfo, View, Dimensions } from "react-native";
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

class DeviceControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      x: "",
      y: "",
      width: "",
      height: "",
      viewHeight: 100
    };
  }

  measureView(event) {
    console.log("event peroperties: ", event);
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

  toggleDevice = async deviceName => {
    const headers = new Headers();
    headers.set("Authorization", `Bearer ${this.props.token}`);
    headers.set("Accept", "application/json");
    headers.set("Content-Type", "application/json");
    if (this.props.authenticated) {
      try {
        fetch(`http://${this.props.host}/devices/${deviceName}/toggleState`, {
          method: "POST",
          headers,
          body: JSON.stringify({userUID: this.props.userUID})
        });
      } catch (e) {
        alert("Could not change device state.");
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

    this.socket = SocketIOClient("http://192.168.0.10:8000", connectionConfig);
    this.socket.on("connect", () => {
      this.socket
        .emit("authenticate", { token: this.props.token }) //send the jwt
        .on("authenticated", function() {
          //do other things
        })
        .on("unauthorized", function(msg) {
          alert(`Error connection to realtime API: ${msg.data.type}`);
        });
    });
    this.socket.on("message", this.onReceivedMessage);
  };

  DeviceRow = item => {
    const AvatarSize = parseInt(this.state.width / 6);
    return (
      <View
        key={item}
        style={{ flexDirection: "row" }}
      >
        {item.reverse().map((device, index) => (
          <DeviceAvatar
            avatarSize={AvatarSize}
            device={device}
            toggleFunction={this.toggleDevice}
            key={index}
          />
        ))}
      </View>
    );
  };

  render() {
    const reversedDevices = this.state.devices.slice();
    reversedDevices.reverse();

    return (
      <View
        style={{
          flex: 0.7,
          paddingTop: 10,
          backgroundColor: "#CCCCCC"
        }}
      >
        {this.state.devices && (
          <FlatList
            onLayout={event => this.measureView(event)}
            key={1}
            data={reversedDevices}
            renderItem={({ item }) => this.DeviceRow(item)}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={Separator}
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
    token: state.auth.token
  };
};

const actions = {
  requestApiAuthentication
};

export default connect(
  mapStateToProps,
  actions
)(DeviceControl);
