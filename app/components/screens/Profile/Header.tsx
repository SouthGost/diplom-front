import React from 'react';
import { StyleSheet, Text, View, Image, Button, Pressable } from 'react-native';
import Result from '../../ui/Result';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../../context/AuthContext';
import { useContext, useEffect, useState } from 'react';
import Requests from '../../../scrypts/request';
import { User } from '../../../types';
import defaultStyles from '../../../styles/defaultStyles';
import { requestWithToken } from '../../../scrypts/checkRefreshToken';

type props = {
    profileInfo?: User,
}

export default function Header(props: props) {
    const { setUser, accessToken } = useContext<any>(AuthContext);
    const [isSubscribe, setIsSubscribe] = useState<boolean>();
    const [isWaitAnswer, setIsWaitAnswer] = useState(false);

    useEffect(() => {
        if (props.profileInfo !== undefined) {
            requestWithToken(
                (accessToken_) => Requests.getIsSubscribe(props.profileInfo!.id, accessToken_),
                async (res) => {
                    const data = await res.json();
                    setIsSubscribe(data.isSubscribe);
                },
                () => {
                    console.log("Не подис");
                },
                setUser,
                accessToken,
            );
        }
    }, [props.profileInfo])

    function subscribe() {
        requestWithToken(
            (accessToken_) => Requests.subscribe(props.profileInfo!.id, accessToken_),
            async (res) => {
                setIsSubscribe(true);
            },
            () => {
                console.log("Не получилось подписаться");
            },
            setUser,
            accessToken,
        );
    }

    function unsubscribe() {
        requestWithToken(
            (accessToken_) => Requests.unsubscribe(props.profileInfo!.id, accessToken_),
            async (res) => {
                setIsSubscribe(false);
            },
            () => {
                console.log("Не получилось отписаться");
            },
            setUser,
            accessToken,
        );
    }

    return (
        <View style={styles.header}
        >
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
                    <View style={styles.followButton}>
                        {isSubscribe !== undefined ?
                            <Button
                                disabled={isWaitAnswer}
                                color={isSubscribe ? "#A9A9A9" : "#1E90FF"}
                                onPress={async () => {
                                    setIsWaitAnswer(true);
                                    if (isSubscribe) {
                                        await unsubscribe()
                                    } else {
                                        await subscribe()
                                    }
                                    setIsWaitAnswer(false);
                                }}
                                title={isSubscribe ? "Отписаться" : "Подписаться"}
                            />
                            :
                            <Button
                                disabled={true}
                                color={"#A9A9A9"}
                                title={"Загрузка"}
                            />
                        }

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
    followButton: {
        alignItems: 'center',
    },
    results: {
        flexDirection: "row",
        flexWrap: "wrap",
    }

});