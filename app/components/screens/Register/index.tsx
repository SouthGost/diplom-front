import React, { useContext } from 'react';
// import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, StyleSheet, Text, View, ScrollView, TextInput, ToastAndroid } from 'react-native';
import MyInput from '../../ui/MyInput';
import { AuthContext } from '../../../context/AuthContext';
import Requests from '../../../scrypts/request';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Register({ navigation }: any) {
    const { setUser } = useContext<any>(AuthContext);

    const [login, setLogin] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [password2, setPassword2] = useState<string>("");
    const [isWaitAnswer, setIsWaitAnswer] = useState(false);

    function alert(message: string) {
        ToastAndroid.showWithGravityAndOffset(message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 80);
    }

    async function signUp() {

        try {
            if (
                login == "" ||
                name == "" ||
                surname == "" ||
                password == "" ||
                password2 == ""
            ) {
                alert("Данные введены не полностью");

                return;
            }
            if (password != password2) {
                alert("Допущенна ошибка в пароле");

                return;
            }
            setIsWaitAnswer(true);
            const response = await Requests.registerReq(login, name, surname, password);
            if (response.ok) {
                const result = await response.json();

                AsyncStorage.setItem('refresh_key', result.refreshToken);
                setUser(result.accessToken, result.id);
                navigation.navigate('Home');
                return;
            }
            alert("Такой пользователь уже занят");
        } catch (error) {
            alert("Не получилось зарегистрироваться сейчас. Попробуйте  позже");
        }
        setIsWaitAnswer(false);
    }

    return (
        <View style={styles.root}>
            <Text style={styles.title}>Регистрация</Text>
            <MyInput
                placeholder="Логин"
                value={login}
                onChange={setLogin}
            />
            <MyInput
                placeholder="Имя"
                value={name}
                onChange={setName}
            />
            <MyInput
                placeholder="Фамилия"
                value={surname}
                onChange={setSurname}
            />
            <MyInput
                placeholder='Пароль'
                secureTextEntry
                value={password}
                onChange={setPassword}
            />
            <MyInput
                placeholder='Повтор паролья'
                secureTextEntry
                value={password2}
                onChange={setPassword2}
            />
            <View
                style={styles.button}
            >
                <Button
                    onPress={() => {
                        signUp();
                    }}
                    disabled={isWaitAnswer}
                    title="Зарегистрироваться"
                />
            </View>
            <View
                style={styles.button}
            >
                <Button
                    onPress={() => {
                        navigation.navigate('Login');
                    }}
                    color={"#e50000"}
                    disabled={isWaitAnswer}
                    title="Уже есть аккаунт"
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