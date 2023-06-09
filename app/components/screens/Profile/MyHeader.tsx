import React from 'react';
import { StyleSheet, Text, View, Image, Button, Pressable } from 'react-native';
import Result from '../../ui/Result';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../../context/AuthContext';
import { useContext, useEffect, useState } from 'react';
import Requests from '../../../scrypts/request';
import { User } from '../../../types';
import defaultStyles from '../../../styles/defaultStyles';
import { Appbar, Menu } from 'react-native-paper';

type props = {
    navigation: any,
    profileInfo?: User,
}


export default function MyHeader(props: props) {
    const { setUser } = useContext<any>(AuthContext);
    const [isShowMenu, setIsShowMenu] = useState(false);



    async function exit() {
        setIsShowMenu(false)
        await AsyncStorage.removeItem("refresh_key");
        setUser(undefined, undefined);
        props.navigation.navigate('Login');
    }

    async function openEditPage() {
        setIsShowMenu(false)
        props.navigation.navigate('EditProfile', {
            profile: props.profileInfo
        });
    }



    return (
        <View style={styles.header}>
            <View style={styles.main}>
                <Image
                    style={styles.avatar}
                    source={{
                        uri: Requests.getAvatar(props.profileInfo!.avatar),
                    }}
                />
                <View style={styles.column}>
                    <Text style={styles.name}>
                        {props.profileInfo === undefined ?
                            "Загрузка"
                            :
                            `${props.profileInfo.name} ${props.profileInfo.surname}`
                        }
                    </Text>
                </View>

                <Menu
                    visible={isShowMenu}
                    onDismiss={() => { setIsShowMenu(false) }}
                    anchor={
                        <Pressable
                            style={styles.menuButtonContainer}
                            onPress={() => {
                                setIsShowMenu(!isShowMenu);
                            }}
                        >
                            <Image
                                style={styles.menuIcon}
                                source={require("../../../../assets/3dots.png")}
                            />
                        </Pressable>
                    }
                >
                    <Menu.Item
                        title="Редактировать"
                        onPress={() => { openEditPage() }}
                    />
                    <Menu.Item
                        title="Выход"
                        titleStyle={[
                            styles.menuText,
                            { color: "#e50000" }
                        ]}
                        onPress={() => {
                            exit()
                        }}
                    />
                </Menu>


                {/* <View>
                    <View style={styles.menuButtonContainer}>

                        <Pressable
                            onPress={() => {
                                setIsShowMenu(!isShowMenu);
                            }}
                        >
                            <Image
                                style={styles.menuIcon}
                                source={require("../../../../assets/3dots.png")}
                            />
                        </Pressable>
                        {isShowMenu ?
                            <View style={styles.menuContainer}>
                                <Pressable
                                    style={styles.menuItem}
                                    onPress={() => {
                                        exit()
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.menuText,
                                            { color: "#e50000" }
                                        ]}
                                    >
                                        Выход
                                    </Text>
                                </Pressable>
                            </View>
                            :
                            <></>
                        }

                    </View> */}
                {/* <Button
                        onPress={() => {
                            exit();
                        }}
                        title="Выход"
                    /> */}
                {/* </View> */}

            </View>
            {/* <View style={styles.results}>
                <Result name={"Тренировок"} value={"15 шт."} />
                <Result name={"Средний темп"} value={"6:01 мин/км"} />
                <Result name={"Преодалено"} value={"100,4 км"} />
            </View> */}
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 10,
        paddingTop: 10,
        borderBottomColor: "black",
        borderStyle: "solid",
    },
    main: {
        flexDirection: "row",
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    column: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 5,
    },
    name: {
        ...defaultStyles.title,
        textAlign: "center",
    },
    menuButtonContainer: {
        marginTop: 5,
        marginEnd: 5,
        position: "relative",
    },
    menuIcon: {
        width: 30,
        height: 30,
    },
    menuContainer: {
        position: "absolute",
        backgroundColor: "white",
        width: 150,
        right: 0,
        top: 30,
        borderRadius: 5,
        borderColor: "black",
        borderWidth: 1,
        borderStyle: "solid",
        zIndex: 10000
    },
    menuItem: {
        padding: 5
    },
    menuText: {
        ...defaultStyles.normalText,
    },
    results: {
        flexDirection: "row",
        flexWrap: "wrap",
    }

});