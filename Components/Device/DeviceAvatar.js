import React from 'react';
import { Text, View, Dimensions } from 'react-native';
import { Avatar } from 'react-native-elements';

export const DeviceAvatar = props => {
  console.log('Tüdelü')
  return (
    <View key={props.index} style={{ margin: 10 }}>
      { props.device ? <Avatar
        size={props.avatarSize}
        overlayContainerStyle={{ backgroundColor: props.device ? 'grey' : 'white' }}
        onPress={() => props.device ? props.toggleFunction(props.device.name) : ''}
        activeOpacity={0.7}
      /> : <View style={{width: props.avatarSize}}></View>}
      {props.device && <View style={{ width: props.avatarSize }}><Text style={{fontSize: 12}}>{props.device.name}</Text></View>}
    </View>
  )
}