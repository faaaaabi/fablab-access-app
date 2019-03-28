import React, { Component } from "react";
import { FlatList, NetInfo, View, Text, Alert } from "react-native";
import { connect } from "react-redux";
import SocketIOClient from "socket.io-client";
import { requestApiAuthentication } from "../store/actions/authActions";
import { DeviceAvatar } from "./Device/DeviceAvatar";
import { getPlace, getDevicesAsLocationMap } from "../services/deviceService";
import {
  fetchDeviceBookings,
  startBooking,
  endBooking
} from "../services/bookingService";
// see https://github.com/facebook/react-native/issues/14796
import { Buffer } from "buffer";
global.Buffer = Buffer;

class DeviceControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      deviceBookings: [],
      place: {},
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
    await this.fetchPlace("5c9c63fe85c19400095d7d7b");
    await this.fetchDevicesAsLocationmapToState();
    await this.fetchDeviceBookings();
    /*setInterval(() => {
        this.fetchDevicesAsLocationmapToState('Regal1');
        this.fetchDeviceBookings();
    }, 5000);*/
    //this.doSocketConnection();
  }

  fetchDevicesAsLocationmapToState = async () => {
    console.log("fetching devices");
    try {
      const deviceLocationMap = await getDevicesAsLocationMap(
        this.props.token,
        this.props.host,
        this.state.place
      );
      this.setState({ devices: deviceLocationMap });
    } catch (e) {
      alert(e);
    }
  };

  fetchPlace = async placeID => {
    console.log("fetching place");
    try {
      const place = await getPlace(this.props.token, this.props.host, placeID);
      this.setState({ place });
      return place;
    } catch (e) {
      alert(e);
    }
  };

  fetchDeviceBookings = async () => {
    try {
      const deviceBookings = await fetchDeviceBookings(
        this.state.place.positions,
        this.props.token,
        this.props.host
      );
      this.setState({ deviceBookings });
    } catch (e) {
      alert(e);
    }
  };

  bookDevice = async deviceID => {
    const booking = this.findBooking(deviceID, this.state.deviceBookings);
    if (!this.props.authenticated) {
      Alert.alert("Action forbidden", "You are not authenticated. Please authenticate with your ID card");
      return;
    }

    try {
      if (booking) {
        if (booking.userUID !== this.props.userUID) {
          Alert.alert(
            "Action forbidden",
            "You are not the owner of this booking"
          );
          return;
        }

        await endBooking(
          booking,
          this.props.token,
          this.props.intermediateToken,
          this.props.host
        );
        this.fetchDeviceBookings();

        return;
      }

      await startBooking(
        deviceID,
        this.props.userUID,
        this.props.token,
        this.props.intermediateToken,
        this.props.host
      );
      this.fetchDeviceBookings();
    } catch (e) {
      Alert.alert("Booking Error", `Following error occured: ${e}`);
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
    console.log("item: ", item);
    console.log("state device:", this.state.devices);
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
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Fach {index}</Text>
        </View>
        <View style={{ flex: 0.9, flexDirection: "row" }}>
          {item
            ? item.map((device, index) => (
                <DeviceAvatar
                  avatarSize={AvatarSize}
                  device={device}
                  isBooked={device ? this.isDeviceBooked(device._id) : false}
                  toggleFunction={this.bookDevice}
                  key={index}
                />
              ))
            : <View style={{ height: AvatarSize }}></View>}
        </View>
      </View>
    );
  };

  isDeviceBooked = deviceID => {
    return this.state.deviceBookings.some(booking => {
      return booking.deviceID === deviceID;
    });
  };

  findBooking = deviceID => {
    return this.state.deviceBookings.find(booking => {
      return booking.deviceID === deviceID;
    });
  };

  render() {
    return (
      <View
        style={{
          flex: 0.7,
          paddingTop: 10,
          backgroundColor: "#FFF"
        }}
      >
        {this.state.devices && (
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
