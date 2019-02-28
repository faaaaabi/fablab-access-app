import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  Text,
  Platform,
  Linking,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import NfcManager, { Ndef } from "react-native-nfc-manager";
import { Icon } from "react-native-elements";
import {
  AUTHENTICATED,
  HOST_CHANGED,
  DEVICE_CHANGED
} from "../store/actions/actionTypes";

const RtdType = {
  URL: 0,
  TEXT: 1
};

function buildUrlPayload(valueToWrite) {
  return Ndef.encodeMessage([Ndef.uriRecord(valueToWrite)]);
}

function buildTextPayload(valueToWrite) {
  return Ndef.encodeMessage([Ndef.textRecord(valueToWrite)]);
}

class NfcComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      supported: true,
      enabled: false,
      isWriting: false,
      urlToWrite: "https://www.google.com",
      rtdType: RtdType.URL,
      parsedText: null,
      tag: {},
      isAuthRequestPending: false
    };
  }

  componentDidMount() {
    NfcManager.isSupported().then(supported => {
      this.setState({ supported });
      if (supported) {
        this._startNfc();
      }
    });
  }

  componentWillUnmount() {
    if (this._stateChangedSubscription) {
      this._stateChangedSubscription.remove();
    }
  }

  render() {
    let {
      supported,
      enabled,
      tag,
      isWriting,
      urlToWrite,
      parsedText,
      rtdType,
      isAuthRequestPending
    } = this.state;
    return (
      <View
        style={{
          flex: 0.3,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#dbdbdb"
        }}
      >
        {
          <View style={{}}>
            {!this.props.authenticated && !isAuthRequestPending && (
              <View>
                <View style={styles.circle}>
                  <Icon name="lock" type="evilicon" color="#4f4f4f" size={250} />
                </View>
              </View>
            )}
            {this.props.authenticated && !isAuthRequestPending && (
              <View style={styles.circle}>
                <Icon name="unlock" type="evilicon" color="#C3C3C3" size={250} />
              </View>
            )}
            {isAuthRequestPending && (
              <ActivityIndicator size="large" color="#green" />
            )}
          </View>
        }
      </View>
    );
  }
  _requestFormat = () => {
    let { isWriting } = this.state;
    if (isWriting) {
      return;
    }

    this.setState({ isWriting: true });
    NfcManager.requestNdefWrite(null, { format: true })
      .then(() => console.log("format completed"))
      .catch(err => console.warn(err))
      .then(() => this.setState({ isWriting: false }));
  };

  _requestNdefWrite = () => {
    let { isWriting, urlToWrite, rtdType } = this.state;
    if (isWriting) {
      return;
    }

    let bytes;

    if (rtdType === RtdType.URL) {
      bytes = buildUrlPayload(urlToWrite);
    } else if (rtdType === RtdType.TEXT) {
      bytes = buildTextPayload(urlToWrite);
    }

    this.setState({ isWriting: true });
    NfcManager.requestNdefWrite(bytes)
      .then(() => console.log("write completed"))
      .catch(err => console.warn(err))
      .then(() => this.setState({ isWriting: false }));
  };

  _cancelNdefWrite = () => {
    this.setState({ isWriting: false });
    NfcManager.cancelNdefWrite()
      .then(() => console.log("write cancelled"))
      .catch(err => console.warn(err));
  };

  _startNfc() {
    NfcManager.start({
      onSessionClosedIOS: () => {
        console.log("ios session closed");
      }
    })
      .then(result => {
        console.log("start OK", result);
      })
      .catch(error => {
        console.warn("start fail", error);
        this.setState({ supported: false });
      });

    if (Platform.OS === "android") {
      NfcManager.getLaunchTagEvent()
        .then(tag => {
          console.log("launch tag", tag);
          if (tag) {
            this.setState({ tag });
          }
        })
        .catch(err => {
          console.log(err);
        });
      NfcManager.isEnabled()
        .then(enabled => {
          this.setState({ enabled });
          this._startDetection();
        })
        .catch(err => {
          console.log(err);
        });
      NfcManager.onStateChanged(event => {
        if (event.state === "on") {
          this.setState({ enabled: true });
        } else if (event.state === "off") {
          this.setState({ enabled: false });
        } else if (event.state === "turning_on") {
          // do whatever you want
        } else if (event.state === "turning_off") {
          // do whatever you want
        }
      })
        .then(sub => {
          this._stateChangedSubscription = sub;
          // remember to call this._stateChangedSubscription.remove()
          // when you don't want to listen to this anymore
        })
        .catch(err => {
          console.warn(err);
        });
    }
  }

  _onTagDiscovered = tag => {
    console.log("Tag Discovered", tag);
    this.setState({ tag });
    let url = this._parseUri(tag);
    if (url) {
      Linking.openURL(url).catch(err => {
        console.warn(err);
      });
    }

    let text = this._parseText(tag);
    this.setState({ parsedText: text });
    this._checkAccess(tag.id);
  };

  _startDetection = () => {
    NfcManager.registerTagEvent(this._onTagDiscovered)
      .then(result => {
        console.log("registerTagEvent OK", result);
      })
      .catch(error => {
        console.warn("registerTagEvent fail", error);
      });
  };

  _stopDetection = () => {
    NfcManager.unregisterTagEvent()
      .then(result => {
        console.log("unregisterTagEvent OK", result);
      })
      .catch(error => {
        console.warn("unregisterTagEvent fail", error);
      });
  };

  _clearMessages = () => {
    this.setState({ tag: null });
  };

  _goToNfcSetting = () => {
    if (Platform.OS === "android") {
      NfcManager.goToNfcSetting()
        .then(result => {
          console.log("goToNfcSetting OK", result);
        })
        .catch(error => {
          console.warn("goToNfcSetting fail", error);
        });
    }
  };

  _parseUri = tag => {
    try {
      if (Ndef.isType(tag.ndefMessage[0], Ndef.TNF_WELL_KNOWN, Ndef.RTD_URI)) {
        return Ndef.uri.decodePayload(tag.ndefMessage[0].payload);
      }
    } catch (e) {
      console.log(e);
    }
    return null;
  };

  _parseText = tag => {
    try {
      if (Ndef.isType(tag.ndefMessage[0], Ndef.TNF_WELL_KNOWN, Ndef.RTD_TEXT)) {
        return Ndef.text.decodePayload(tag.ndefMessage[0].payload);
      }
    } catch (e) {
      console.log(e);
    }
    return null;
  };

  _checkAccess = async id => {
    try {
      this.setState({ isAuthRequestPending: true });
      const headers = new Headers();
      headers.set("Authorization", `Bearer ${this.props.token}`);
      const response = await fetch(
        `http://${this.props.host}/users/${id}/checkMachinePermission`,
        {
          method: "GET",
          headers
        }
      );
      const responseJSON = await response.json();

      if (responseJSON.isAllowed) {
        this.props.onAuthenticated(true);
      } else {
        this.props.onAuthenticated(false);
      }
      this.setState({ isAuthRequestPending: false });
    } catch (e) {
      console.log("_checkAccess Error:", e);
      this.setState({ isAuthRequestPending: false });
    }
  };

  _toggleDevice = async deviceName => {
    if (this.props.authenticated) {
      fetch(`http://${this.props.host}/devices/${deviceName}/toggleState`);
    }
  };
}

const styles = StyleSheet.create({
  circle: {
    width: 250,
    height: 250,
    borderRadius: 250 / 2,
    backgroundColor: "grey",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
    borderWidth: 6,
    borderColor: '#4f4f4f',
  }
});

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    authenticated: state.auth.authenticated,
    host: state.settings.host,
    deviceName: state.settings.deviceName
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuthenticated: value =>
      dispatch({
        type: AUTHENTICATED,
        value
      }),
    onHostChange: value =>
      dispatch({
        type: HOST_CHANGED,
        value
      }),
    onDeviceChange: value =>
      dispatch({
        type: DEVICE_CHANGED,
        value
      })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NfcComponent);
//AppRegistry.registerComponent('NfcComponent', () => NfcComponent)
