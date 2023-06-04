import React, { useState, useContext, useEffect } from "react"
import { Button, ToastAndroid, StyleSheet, Text, View, Image, BackHandler } from "react-native"
import MyInput from "../../ui/MyInput";
import DocumentPicker from 'react-native-document-picker'
import { AuthContext } from "../../../context/AuthContext";
import { requestWithToken } from "../../../scrypts/checkRefreshToken";
import Requests from "../../../scrypts/request";

export default function EditProfile({ route }: any) {
    const { profile } = route.params;
    const { setUser, accessToken } = useContext<any>(AuthContext);

    const [isWaitAnswer, setIsWaitAnswer] = useState(false);
    const [avatar, setAvatar] = useState(profile.avatar);
    const [name, setName] = useState(profile.name);
    const [surname, setSurname] = useState(profile.surname);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPassword2, setNewPassword2] = useState("");


    function alert(message: string) {
        ToastAndroid.showWithGravityAndOffset(message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 80);
    }

    async function loadImage() {
        const newImageFile = await DocumentPicker.pickSingle({ type: DocumentPicker.types.images });
        setIsWaitAnswer(true);
        await requestWithToken(
            (accessToken_) => Requests.loadImage(newImageFile, accessToken_),
            async (res) => {
                const data = await res.json();
                setAvatar(data.newAvatar);
                alert("Новая ава!!");
            },
            () => {
                alert("Ошибка. Фото не обновлено");
            },
            setUser,
            accessToken,
        );
        setIsWaitAnswer(false);
    }

    async function changeName() {
        if (
            name == "" ||
            surname == ""
        ) {
            alert("Данные введены не полностью");

            return;
        }
        setIsWaitAnswer(true);
        await requestWithToken(
            (accessToken_) => Requests.changeName(name, surname, accessToken_),
            async (res) => {
                alert("Успех")
            },
            () => {
                alert("Ошибка. Имя не обновлено");
            },
            setUser,
            accessToken,
        );
        setIsWaitAnswer(false);
    }

    
    async function changePassword() {
        if (
            oldPassword == "" ||
            newPassword == "" ||
            newPassword == ""
        ) {
            alert("Данные введены не полностью");

            return;
        }
        if (newPassword != newPassword) {
            alert("Допущенна ошибка в пароле");

            return;
        }
        setIsWaitAnswer(true);
        await requestWithToken(
            (accessToken_) => Requests.changePassword(oldPassword, newPassword, accessToken_),
            async (res) => {
                setOldPassword("");
                setNewPassword("");
                setNewPassword2("");
                alert("Пароль изменен")
            },
            () => {
                alert("Ошибка. Пароль не поменялся");
            },
            setUser,
            accessToken,
        );
        setIsWaitAnswer(false);
    }

    return (
        <View style={styles.root}>


            <Text style={styles.title}>Редактирование</Text>
            <View style={styles.avatarContainer}>
                <Image
                    style={styles.avatar}
                    source={{
                        uri: Requests.getAvatar(avatar),
                    }}
                />
                <View
                    style={styles.avatarLoadButton}
                >

                    <Button
                        onPress={() => {
                            loadImage();
                        }}
                        disabled={isWaitAnswer}
                        title="Изменить"
                    />
                </View>
            </View>
            <MyInput
                placeholder="Имя"
                value={name}
                onChange={setName}
            />
            <MyInput
                placeholder="фамилия"
                value={surname}
                onChange={setSurname}
            />
            <View
                style={styles.button}
            >
                <Button
                    onPress={() => {
                        changeName();
                    }}
                    disabled={isWaitAnswer}
                    title="Сохранить"
                />
            </View>
            <MyInput
                placeholder='Старый пароль'
                secureTextEntry
                value={oldPassword}
                onChange={setOldPassword}
            />
            <MyInput
                placeholder='Новый пароль'
                secureTextEntry
                value={newPassword}
                onChange={setNewPassword}
            />
            <MyInput
                placeholder='Повтор пароля'
                secureTextEntry
                value={newPassword2}
                onChange={setNewPassword2}
            />
            <View
                style={styles.button}
            >
                <Button
                    onPress={() => {
                        changePassword();
                    }}
                    disabled={isWaitAnswer}
                    title="Поменять"
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20,
        height: "100%",
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    avatarContainer: {
        flexDirection: "row",
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    avatarLoadButton: {
        marginLeft: 20,
        justifyContent: "center"
    },
    button: {
        width: "100%",
        paddingVertical: 5
    }
});