import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Avatar } from "react-native-elements";

export const DeviceAvatar = props => {
  console.log("Tüdelü");
  return (
    <View key={props.index} style={styles.base}>
      {props.device ? (
        <Avatar
          size={props.avatarSize}
          overlayContainerStyle={statusHaloStyle('free')} 
          onPress={() =>
            props.device ? props.toggleFunction(props.device.name) : ""
          }
          activeOpacity={0.7}
        />
      ) : (
        <View style={{ width: props.avatarSize }} />
      )}
      {props.device && (
        <View style={{ width: props.avatarSize }}>
          <Text style={{ fontSize: 12 }}>{props.device.name}</Text>
        </View>
      )}
    </View>
  );
};

const statusHaloStyle = status => {
  const style = {
    borderWidth: 8,
    borderColor: '#000',
  };

  switch (status) {
    case 'inUse':
      style.borderColor = "yellow";
      break;
    case 'blocked':
      style.borderColor = "red";
      break
    case 'free':
      style.borderColor = "#3abc38";
      break
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
