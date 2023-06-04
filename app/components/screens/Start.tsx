import React from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Image, Button, ToastAndroid } from 'react-native';
import Requests from '../../scrypts/request';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import checkRefreshToken from '../../scrypts/checkRefreshToken';

export default function Start({ navigation }: any) {
    const { setUser } = useContext<any>(AuthContext);

    function alert(message: string) {
        ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.TOP);
    }

    async function checkRefreshKey() {
        try {
            const data = await checkRefreshToken(setUser);
            if (data) {
                navigation.navigate('Home');
                return;

            }
            navigation.navigate('Login');
        } catch (error) {
            alert("Приложение недоступно. Попробуйте позже")
        }
    }

    useEffect(() => {
        checkRefreshKey();
    }, []);

    return (
        <View style={styles.root}>
            <Text style={styles.title}>Дневник</Text>
            <Text style={styles.title}>легкоатлета</Text>
            <Image
                source={require("../../../assets/logo.png")}
                style={{ width: 200, height: 200 }}
            />
            <ActivityIndicator size={100} />
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 50,
        justifyContent: 'center',
    },
    title: {
        fontSize: 35,
        fontWeight: 'bold'
    }
});