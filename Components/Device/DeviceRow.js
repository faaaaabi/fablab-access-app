import React from 'react';
import { View } from 'react-native';

import { DeviceAvatar } from './DeviceAvatar'

export const DeviceRow = props => {
  return (
    <View key={props.item} style={{ flexDirection: 'row', }}>
    {props.item.reverse().map((device, index) => (
      <DeviceAvatar device={device} toggleFunction={props.toggleFunction(props.device.name)} key={index} />
    ))}
  </View>
  )
}