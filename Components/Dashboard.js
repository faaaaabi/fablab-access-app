/**
 * Sample React Native Dashboard
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from "react";
import {Platform, View} from "react-native";
import {Header, Icon} from "react-native-elements/src/index";
import NfcComponent from "./NfcComponent";
import DeviceControl from "./DeviceControl";


import {goToSettings} from "../navigation";

type
Props = {};

export default class Dashboard extends Component<Props> {
    render() {
        return (
                    <View style={{flex: 1}}>
                        <Header
                            leftComponent={
                                <Icon
                                    name="settings"
                                    color='#fff'
                                    onPress={() => goToSettings(this.props.componentId)}
                                    underlayColor={'#64b5f6'}
                                />
                            }
                            centerComponent={{text: 'Fablab Access App', style: {color: '#fff'}}}
                            containerStyle={{marginTop: Platform.OS === 'ios' ? 0 : - 26}}
                        />
                        <View style={{flexDirection: "row", flex: 1}}>
                            <DeviceControl/>
                            <NfcComponent/>
                        </View>
                    </View>
        );
    }
}
