import React, {Component} from 'react';
import {View, Platform} from 'react-native';
import {Header, Icon, Input, Button, CheckBox} from "react-native-elements";
import {Navigation} from "react-native-navigation";
import {connect} from "react-redux";
import {requestApiAuthentication} from "../store/actions/authActions";
import {ON_SETTINGS_SAVE} from "../store/actions/actionTypes";

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            host: this.props.host,
            apiKey: this.props.apiKey,
            deviceName: this.props.deviceName,
            debugMode: this.props.debugMode,
        }
    }

    componentDidMount() {
    }

    saveSettings = () => {
        this.props.onSettingsSave({
            host: this.state.host,
            apiKey: this.state.apiKey,
            deviceName: this.state.deviceName,
            debugMode: this.state.debugMode,
        });
    };

    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', backgroundColor: '#fff'}}>
                <Header
                    leftComponent={
                        <Icon
                            name="arrow-left"
                            type='material-community'
                            color='#fff'
                            onPress={() => Navigation.pop(this.props.componentId)}
                            underlayColor={'#64b5f6'}
                        />
                    }
                    centerComponent={{text: 'Fablab Access App - Settings', style: {color: '#fff'}}}
                    containerStyle={{marginTop: Platform.OS === 'ios' ? 0 : -26}}
                />
                <View style={{
                    flex: 1, width: 600,
                    alignItems: 'flex-start',
                    paddingTop: 20
                }}>
                    <Input
                        containerStyle={{paddingBottom: 20}}
                        label='API URL or IP (and Port)'
                        placeholder='API URL or IP (and Port)'
                        errorStyle={{color: 'red'}}
                        onChangeText={(text) => this.setState({host: text})}
                        //errorMessage='ENTER A VALID ERROR HERE'
                    >{this.state.host}</Input>
                    <Input
                        containerStyle={{paddingBottom: 20}}
                        label='API Key'
                        placeholder='API Key'
                        errorStyle={{color: 'red'}}
                        onChangeText={(text) => this.setState({apiKey: text})}
                        //errorMessage='ENTER A VALID ERROR HERE'
                    >{this.state.apiKey}</Input>
                    <Input
                        containerStyle={{paddingBottom: 20}}
                        label='Name/Identifier of this device'
                        placeholder='Name/Identifier'
                        errorStyle={{color: 'red'}}
                        onChangeText={(text) => this.setState({deviceName: text})}
                        //errorMessage='ENTER A VALID ERROR HERE'
                    >{this.state.deviceName}</Input>
                    <CheckBox
                        containerStyle={{paddingBottom: 20}}
                        title='Debug Mode'
                        checked={this.state.debugMode}
                        onPress={() => this.setState({debugMode: !this.state.debugMode})}
                    />
                    <Button
                        title='Save Settings'
                        onPress={() => {
                            this.saveSettings();
                        }}
                    />
                </View>
            </View>
        )
    }

    componentWillUnmount() {
    }
}


const mapStateToProps = state => {
    return {
        host: state.settings.host,
        apiKey: state.settings.apiKey,
        deviceName: state.settings.deviceName,
        debugMode: state.settings.debugMode,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSettingsSave: value =>
            dispatch({
                type: ON_SETTINGS_SAVE,
                value
            }),
    };

};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Settings);