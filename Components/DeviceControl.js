import React, { Component } from 'react';
import { FlatList, NetInfo, View, Text, Alert, TouchableOpacity, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { Input } from 'react-native-elements';
import { connect } from 'react-redux';
import SocketIOClient from 'socket.io-client';
import { requestApiAuthentication } from '../store/actions/authActions';
import { DeviceAvatar } from './Device/DeviceAvatar';
import { getPlace, getDevicesAsLocationMap } from '../services/deviceService';
import { fetchDeviceBookings, startBooking, endBooking } from '../services/bookingService';
// see https://github.com/facebook/react-native/issues/14796
import { Buffer } from 'buffer';
global.Buffer = Buffer;

class DeviceControl extends Component {
	constructor(props) {
		super(props);
		this.state = {
			devices: [],
			deviceBookings: [],
			place: {},
			x: '',
			y: '',
			width: '',
			height: '',
			viewHeight: 100,
		};
	}

	setLayoutParameters(event) {
			this.setState({
				x: event.nativeEvent.layout.x,
				y: event.nativeEvent.layout.y,
				width: event.nativeEvent.layout.width,
				height: event.nativeEvent.layout.height,
			});
	}

	async componentDidMount() {
		const dispatchConnected = isConnected => this.props.onConnectionChanged(isConnected);

		NetInfo.isConnected
			.fetch()
			.then()
			.done(() => {
				NetInfo.isConnected.addEventListener('connectionChange', dispatchConnected);
			});

		await this.props.requestApiAuthentication();
		await this.fetchPlace('5c9c63fe85c19400095d7d7b');
		await this.fetchDevicesAsLocationmapToState();
		await this.fetchDeviceBookings();
		/*setInterval(() => {
        this.fetchDevicesAsLocationmapToState('Regal1');
        this.fetchDeviceBookings();
    }, 5000);*/
	}

	fetchDevicesAsLocationmapToState = async () => {
		console.log('fetching devices');
		try {
			const deviceLocationMap = await getDevicesAsLocationMap(this.props.token, this.props.host, this.state.place);
			this.setState({ devices: deviceLocationMap });
		} catch (e) {
			alert(e);
		}
	};

	fetchPlace = async placeID => {
		console.log('fetching place');
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
			const deviceBookings = await fetchDeviceBookings(this.state.place.positions, this.props.token, this.props.host);
			this.setState({ deviceBookings: deviceBookings });
		} catch (e) {
			alert(e);
		}
	};

	bookDevice = async deviceID => {
		const booking = this.findBooking(deviceID, this.state.deviceBookings);
		if (!this.props.authenticated) {
			Alert.alert('Action forbidden', 'You are not authenticated. Please authenticate with your ID card');
			return;
		}

		try {
			if (booking) {
				if (booking.userUID !== this.props.userUID) {
					Alert.alert('Action forbidden', 'You are not the owner of this booking');
					return;
				}

				await endBooking(booking, this.props.token, this.props.intermediateToken, this.props.host);
				const deviceBookings = await fetchDeviceBookings(this.state.place.positions, this.props.token, this.props.host)
				this.setState({ deviceBookings: deviceBookings });

				return;
			}

			await startBooking(deviceID, this.props.userUID, this.props.token, this.props.intermediateToken, this.props.host);
			const deviceBookings = await fetchDeviceBookings(this.state.place.positions, this.props.token, this.props.host)
			this.setState({ deviceBookings: deviceBookings });
		} catch (e) {
			Alert.alert('Booking Error', `Following error occured: ${e}`);
		}
	};

	DeviceRow = (item, index, deviceBoookings) => {
		console.log('Device Row')
		const AvatarSize = parseInt((Dimensions.get('window').width * 0.7) / 8);
		return (
			<View
				key={item}
				style={{
					flexDirection: 'row',
					backgroundColor: '#f7f7f7',
					marginBottom: 10,
				}}
			>
				<View
					style={{
						flex: 0.1,
						justifyContent: 'center',
						alignItems: 'center',
						transform: [{ rotate: '-90deg' }],
					}}
				>
					<Text style={{ fontSize: 20, fontWeight: 'bold' }}>Fach {index}</Text>
				</View>
				<View style={{ flex: 0.9, flexDirection: 'row' }}>
					{item ? (
						item.map((device, index) => (
							<DeviceAvatar
								avatarSize={AvatarSize}
								device={device}
								isBooked={device ? this.isDeviceBooked(device._id, deviceBoookings) : false}
								toggleFunction={this.bookDevice}
								key={index}
							/>
						))
					) : (
						<View style={{ height: AvatarSize }} />
					)}
				</View>
			</View>
		);
	};

	isDeviceBooked = (deviceID, deviceBookings) => {
		return deviceBookings.some(booking => {
			return booking.deviceID === deviceID;
		});
	};

	findBooking = deviceID => {
		return this.state.deviceBookings.find(booking => {
			return booking.deviceID === deviceID;
		});
	};

  _renderModalContent = contentDescriptor => {
		switch (contentDescriptor) {
			case 'instructions':
				return (
					<View>
						<Input placeholder="PIN" secureTextEntry={true} />
					</View>
				);
			case 'identification':
				return (
					<View>
						<Input placeholder="PIN" secureTextEntry={true} />
					</View>
				);
			default:
				break;
		}
	};

	render() {
		console.log('render');
		console.log('state device bookings:', this.state.deviceBookings);
		const deviceBookings = this.state.deviceBookings;
		return (
			<View
				style={{
					flex: 0.7,
					paddingTop: 10,
					backgroundColor: '#FFF',
				}}
			>
				{this.state.devices && 
					<FlatList
						//onLayout={event => this.setLayoutParameters(event)}
						key={1}
						data={this.state.devices}
						renderItem={({ item, index }) => this.DeviceRow(item, index, deviceBookings)}
						extraData={this.state.deviceBookings}
						keyExtractor={(item, index) => index.toString()}
					/>
				}
				<View style={{ flex: 1 }}>
					<Modal isVisible={false} alignSelf="center">
						<View
							style={{
								backgroundColor: '#FFF',
								alignItems: 'center',
								justifyContent: 'center',
								padding: 20,
							}}
						>
							<Text style={{ width: 200 }}>asdas</Text>
							<Input placeholder="PIN" secureTextEntry={true} />
						</View>
					</Modal>
				</View>
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
		intermediateToken: state.auth.intermediateToken,
	};
};

const actions = {
	requestApiAuthentication,
};

export default connect(
	mapStateToProps,
	actions
)(DeviceControl);
