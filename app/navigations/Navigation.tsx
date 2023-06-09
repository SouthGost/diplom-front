import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Profile from '../components/screens/Profile';
import Home from '../components/screens/Home';
import StartTraining from '../components/screens/StartTraining';
import Training from '../components/screens/Training';
import Start from '../components/screens/Start';
import Login from '../components/screens/Login';
import Register from '../components/screens/Register';
import Search from '../components/screens/Search';
import EditProfile from '../components/screens/EditProfile';

const Stack = createNativeStackNavigator();


export default function Navigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Start"// Home  Login  Start  Temp
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="Start" component={Start} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="StartTraining" component={StartTraining} />
                <Stack.Screen name="Profile" component={Profile} />
                <Stack.Screen name="Training" component={Training} />
                <Stack.Screen name="Search" component={Search} />
                <Stack.Screen name="EditProfile" component={EditProfile} />
                
            </Stack.Navigator>
        </NavigationContainer>
    );
};