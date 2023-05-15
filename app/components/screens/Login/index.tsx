import React from 'react';
// import { StatusBar } from 'expo-status-bar';
import { useState, useContext } from 'react';
import { Button, StyleSheet, Text, View, ScrollView, TextInput, ToastAndroid } from 'react-native';
import MyInput from '../../ui/MyInput';
import Request from '../../../scrypts/request';
import { AuthContext } from '../../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({ navigation }: any) {
    const { setUser } = useContext<any>(AuthContext);

    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isWaitAnswer, setIsWaitAnswer] = useState(false);

    function alert(message: string) {
        ToastAndroid.showWithGravityAndOffset(message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 80);
    }

    async function signIn() {
        try {
            if (login == "") {
                alert("Не введен логин");

                return;
            }
            if (password == "") {
                alert("Не введен пароль");

                return;
            }
            setIsWaitAnswer(true);
            const response = await Request.loginReq(login, password);
            if (response.ok) {
                const result = await response.json();

                AsyncStorage.setItem('refresh_key', result.refreshToken);
                setUser(result.accessToken, result.id);
                navigation.navigate('Home');
                return;
            }
            alert("Не верный логин или пароль");
        } catch (error) {
            alert("Не получилось войти сейчас. Попробуйте  позже");
        }
        setIsWaitAnswer(false);
    }

    return (
        <View style={styles.root}>
            <Text style={styles.title}>Вход</Text>
            <MyInput
                placeholder="Логин"
                value={login}
                onChange={setLogin}
            />
            <MyInput
                placeholder='Пароль'
                secureTextEntry
                value={password}
                onChange={setPassword}
            />
            <View
                style={styles.button}
            >
                <Button
                    onPress={() => {
                        signIn();
                    }}
                    disabled={isWaitAnswer}
                    title="Войти"
                />
            </View>
            <View
                style={styles.button}
            >
                <Button
                    onPress={() => {
                        navigation.navigate('Register');
                    }}
                    color={"#e50000"}
                    disabled={isWaitAnswer}
                    title="Регистрация"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20,
        height: "100%",
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold'
    },
    button: {
        width: "100%",
        paddingVertical: 5
    }
});