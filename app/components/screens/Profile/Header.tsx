import React from 'react';
import { StyleSheet, Text, View, Image, Button, Pressable } from 'react-native';
import Result from '../../ui/Result';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../../context/AuthContext';
import { useContext, useEffect, useState } from 'react';
import Requests from '../../../scrypts/request';
import { User } from '../../../types';
import defaultStyles from '../../../styles/defaultStyles';

type props = {
    profileInfo?: User,
}


export default function Header(props: props) {
    const { setUser } = useContext<any>(AuthContext);



    return (
        <View style={styles.header}
        >
            <View style={styles.main}>
                <Image
                    style={styles.avatar}
                    source={{
                        uri: 'https://reactnative.dev/img/tiny_logo.png',
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
                    <View style={styles.followButton}>
                        <Button
                            onPress={() => {
                                
                            }}
                            title="Подписаться"
                        />
                    </View>
                </View>
                {/* <View>
                    <Button
                        onPress={() => {
                            exit();
                        }}
                        title="Выход"
                    />
                </View> */}

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
        // borderBottomWidth: 1,
        borderStyle: "solid",
    },
    main: {
        flexDirection: "row",
    },
    exitButton: {
        // height: 40
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
        // fontWeight: "800",
        // fontSize: 30,
        // width: "100%",
        textAlign: "center",
        // backgroundColor: "red",
    },
    followButton:{
        alignItems: 'center',
    },
    results: {
        flexDirection: "row",
        flexWrap: "wrap",
    }

});