import { Navigation } from "react-native-navigation";

export const goToSettings = (componentId) => Navigation.push(componentId,{
    component: {
        name: 'SettingsScreen',
        passProps: {
            text: 'Pushed screen'
        },
        options: {
            topBar: {
                visible: false,
                height: 0
            }
        }
    }
});