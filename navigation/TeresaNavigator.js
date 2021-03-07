import React from 'react';
import { Platform } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Entypo, MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import AuthLoadingScreen from '../screens/auth/AuthLoadingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import SignUpVerifyScreen from '../screens/auth/SignUpVerifyScreen';
import ForgotPassScreen from '../screens/auth/ForgotPassScreen';
import ForgotPassVerifyScreen from '../screens/auth/ForgotPassVerifyScreen';
import ResetPassScreen from '../screens/auth/ResetPassScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import ActiveReminderScreen from '../screens/Reminder/ActiveReminderScreen';
import MyPrescriptionScreen from '../screens/Prescription/MyPrescriptionScreen';
import NotificationScreen from '../screens/Notification/NotificationScreen';
import MenuScreen from '../screens/Menu/MenuScreen';
import SetReminderScreen from '../screens/Reminder/SetReminderScreen';
import UploadPrescriptionScreen from '../screens/Prescription/UploadPrescriptionScreen';
import MyProfileScreen from '../screens/Profile/MyProfileScreen';
import UpdateReminderScreen from '../screens/Reminder/UpdateReminderScreen';
import OrderDetailsScreen from '../screens/Order/OrderDetails';
import OrderListScreen from '../screens/Order/OrderList';

const defaultNavOptions = {
    headerShown: true,
    headerStyle: {
        backgroundColor: Platform.OS === 'android' ? Colors.funBlue : ''
    },
    headerTintColor: Platform.OS === 'android' ? 'white' : Colors.funBlue
}

const AuthNavigator = createStackNavigator({
        Login: LoginScreen,
        SignUp: SignUpScreen,
        SignUpVerify: SignUpVerifyScreen,
        ForgotPass: ForgotPassScreen,
        ForgotPassVerify: ForgotPassVerifyScreen,
        ResetPass: ResetPassScreen
    }, {
        defaultNavigationOptions: {
            headerShown: false
        }
    }
)

const HomeNavigator = createStackNavigator({
        Home: HomeScreen,
        SetReminder: SetReminderScreen,
        UploadPrescription: UploadPrescriptionScreen
    }, {
        defaultNavigationOptions: defaultNavOptions
    }
)

const ReminderNavigator = createStackNavigator({
        ActiveReminder: ActiveReminderScreen,
        SetReminder: SetReminderScreen,
        UpdateReminder: UpdateReminderScreen
    }, {
        defaultNavigationOptions: defaultNavOptions
    }
)

const PrescriptionNavigator = createStackNavigator({
        MyPrescription: MyPrescriptionScreen,
        UploadPrescription: UploadPrescriptionScreen
    }, {
        defaultNavigationOptions: defaultNavOptions
    }
)

const MenuNavigator = createStackNavigator({
        Menu: MenuScreen,
        SetReminder: SetReminderScreen,
        UploadPrescription: UploadPrescriptionScreen,
        MyProfile: MyProfileScreen,
        OrderDetails: OrderDetailsScreen,
        OrderList: OrderListScreen
    }, {
        defaultNavigationOptions: defaultNavOptions
    }
)

const TeresaTabNavigator =  createBottomTabNavigator({
    Home: {
        screen: HomeNavigator,
        navigationOptions: {
            tabBarLabel: 'Home',
            tabBarIcon: (tabInfo) => {
                return <Entypo name="home" size={24} color={Colors.funBlue} />
            }
        }
    },
    Reminder: {
        screen: ReminderNavigator,
        navigationOptions: {
            tabBarLabel: 'My Reminders',
            tabBarIcon: (tabInfo) => {
                return <MaterialIcons name="access-alarms" size={24} color={Colors.danube} />
            }
        }
    },
    Prescription: {
        screen: PrescriptionNavigator,
        navigationOptions: {
            tabBarLabel: 'My Prescriptions',
            tabBarIcon: (tabInfo) => {
                return <FontAwesome5 name="notes-medical" size={24} color={Colors.funBlue} />
            }
        }
    },
    Notification: {
        screen: NotificationScreen,
        navigationOptions: {
            tabBarLabel: 'Notification',
            tabBarIcon: (tabInfo) => {
                return <Ionicons name="notifications" size={24} color={Colors.funBlue} />
            }
        }
    },
    Menu: {
        screen: MenuNavigator,
        navigationOptions: {
            tabBarLabel: 'Menu',
            tabBarIcon: (tabInfo) => {
                return <Feather name="menu" size={24} color={Colors.funBlue} />
            }
        }
    }
}, {
    tabBarOptions: {
        activeBackgroundColor: Colors.blackSqueeze,
        style: {
            borderWidth: 2,
            borderColor: Colors.vanillaIce,
            borderTopWidth: 2,
            borderTopColor: Colors.vanillaIce
        },
        labelStyle: {
            color: Colors.funBlue
        }
    }
});

const MainNavigator = createSwitchNavigator({
        AuthLoading: AuthLoadingScreen,  
        Auth: AuthNavigator,
        Teresa: TeresaTabNavigator
    }
)

export default createAppContainer(MainNavigator)