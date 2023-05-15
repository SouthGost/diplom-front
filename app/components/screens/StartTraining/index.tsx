import React, { useContext, useEffect, useState } from 'react';
import {
    StyleSheet, Text, View, TouchableOpacity, Image, PermissionsAndroid, Permission, Button, ToastAndroid
} from 'react-native';
import Navbar from '../../../navigations/Navbar';
import Statistic from './Statistic';


export default function StartTraining({ navigation }: any) {
    const [isAllPermissions, setIsAllPermissions] = useState(false);

    async function requestPermission(permission: Permission) {
        const granted = await PermissionsAndroid.request(
            permission,
            {
                title: 'Доступ к геолокации',
                message:
                    'Разрешите приложению доступ к вашей геолокации',
                // buttonNegative: 'Отклонить',
                buttonNeutral: "Отклонить",
                buttonPositive: 'Разрешить',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Разрешил!');
        } else {
            console.log('НЕТ');
        }
    }

    // async function checkPermission(permission: Permission) {
    //     const granted = await PermissionsAndroid.check(
    //         permission
    //     );
    //     if (granted) {
    //         console.log('Есть!');
    //     } else {
    //         console.log('Не разрешино');
    //     }
    // }

    function alert(message: string) {
        ToastAndroid.showWithGravityAndOffset(message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 80);
    }

    async function permissionsLoad() {
        try {
            if (!await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION))
                await requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
            if (!await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION))
                await requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

            if (
                await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION) &&
                await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            ) {
                setIsAllPermissions(true);
            } else {
                alert("Нет разрешений!");
            }
        } catch (err) {
            console.warn(err);
        }
    }



    useEffect(() => {
        permissionsLoad()

    }, []);


    return (
        <>
            <View style={styles.container}>
                {isAllPermissions ?
                    <Statistic />
                    :
                    <View style={styles.messageContainer}>
                        <Text style={styles.message}>
                            Приложению не выданы необходимые разрешения для получения геолокации. Пожалуйста измените настройки и вернитесь
                        </Text>
                        <View style={styles.buttonOuterLayout}>
                            <Button
                                color="black"
                                title='Проверить настройки'
                                onPress={() => {
                                    permissionsLoad();
                                }}
                            />
                        </View>
                    </View>
                }
            </View>
            {/* <Navbar navigation={navigation} /> */}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    messageContainer: {
        paddingHorizontal: 20,
    },
    message: {
        textAlign: "center",
    },
    buttonOuterLayout: {
        marginTop: 20,
        alignItems: 'center',
    },
    button: {
        // width: "fit-content"
    }

});