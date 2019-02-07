export const DeviceAvatar = props => {
  <View key={index} style={{ margin: 10 }}>
    <Avatar
      xlarge
      overlayContainerStyle={{ backgroundColor: props.device ? 'grey' : 'white' }}
      onPress={() => props.device ? this.toggleDevice(props.device.name) : ''}
      activeOpacity={0.7}
    />
    {props.device && <Text style={{ fontSize: 15 }}>{props.device.name}</Text>}
  </View>
}