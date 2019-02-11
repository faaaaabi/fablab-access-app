import React from 'react';
import { Text, View } from 'react-native';
import { Avatar } from 'react-native-elements';

export const DeviceAvatar = props => {
  return (
    <View key={props.index} style={{ margin: 10 }}>
      <Avatar
        xlarge
        overlayContainerStyle={{ backgroundColor: props.device ? 'grey' : 'white' }}
        onPress={() => props.device ? props.toggleFunction(props.device.name) : ''}
        activeOpacity={0.7}
      />
      {props.device && <Text style={{ fontSize: 15 }}>{props.device.name}</Text>}
    </View>
  )
}