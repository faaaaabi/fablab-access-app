import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Avatar } from "react-native-elements";

export const DeviceAvatar = props => {
  return (
    <View key={props.index} style={styles.base}>
      {props.device ? (
        <Avatar
          size={props.avatarSize}
          overlayContainerStyle={
            props.isBooked ? statusHaloStyle("inUse") : statusHaloStyle("free")
          }
          onPress={() => props.toggleFunction(props.device._id)}
          activeOpacity={0.7}
          icon={{ name: "printer-3d", type: "material-community" }}
        />
      ) : (
        <View style={{ width: props.avatarSize }} />
      )}
      {props.device && (
        <View style={{ width: props.avatarSize, paddingTop: 5 }}>
          <Text
            style={{ fontSize: 14, fontWeight: "bold", textAlign: "center" }}
          >
            {props.device.deviceName}
          </Text>
        </View>
      )}
    </View>
  );
};

const statusHaloStyle = status => {
  const style = {
    borderWidth: 6,
    borderColor: "#000",
    borderRadius: 4
  };

  switch (status) {
    case "inUse":
      style.borderColor = "#EAC787";
      break;
    case "blocked":
      style.borderColor = "#E86E7F";
      break;
    case "free":
      style.borderColor = "#3F9490";
      break;
    default:
      break;
  }

  return style;
};

const styles = StyleSheet.create({
  base: {
    margin: 10
  }
});
