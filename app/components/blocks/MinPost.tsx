import React from 'react';
import { useState } from 'react';
import { Button, StyleSheet, Text, View, ScrollView, Image, Pressable } from 'react-native';
import { Training } from '../../types';
import MapWithResult from './MapWithResult';
import { convertTime, convertDistance, convertPace } from './../../scrypts/sport';
import defaultStyles from '../../styles/defaultStyles';
import { Tooltip } from 'react-native-paper';
import Requests from '../../scrypts/request';


type post = {
    training: Training,
    navigation: any,
};

export default function MinPost(props: post) {

    function openTreaning(training: Training) {
        props.navigation.navigate('Training', {
            id: training.id,
            sendTraining: training,
        });
    }

    function openProfile(profileId: number) {
        props.navigation.navigate('Profile', {
            profileId,
        });
    }

    return (
        <>
            <View style={styles.post}>
                <View
                    style={styles.head}
                >
                    <View
                        style={styles.userInfo}
                    >
                        <Pressable
                            onPress={() => {
                                openProfile(props.training.user.id)
                            }}
                        >
                            <Image
                                style={styles.avatar}
                                source={{
                                    // uri: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Cat_November_2010-1a.jpg',
                                    uri: Requests.getAvatar(props.training.user.avatar),
                                    //https://reactnative.dev/img/tiny_logo.png
                                    // https://upload.wikimedia.org/wikipedia/commons/4/4d/Cat_November_2010-1a.jpg
                                    //localhost:8000/img/1685108228997.jpg
                                }}
                            />
                        </Pressable>
                        <View style={styles.nameContainer}>
                            <Text style={styles.name}>{props.training.user.name} {props.training.user.surname}</Text>
                        </View>
                        <View style={styles.medalContainer}>
                            {props.training.best_distance ?
                                <Tooltip
                                    title="Длинная тренировка"
                                >
                                    {/* <Button title='qwe' onPress={()=>{}}/> */}
                                    <Image
                                        style={styles.medal}
                                        source={require("../../../assets/distance.png")}
                                    />
                                </Tooltip>
                                :
                                <></>
                            }

                            {props.training.best_pace ?
                                <Tooltip
                                    title="Лучшая скорость"
                                >
                                    <Image
                                        style={styles.medal}
                                        source={require("../../../assets/pace.png")}
                                    />
                                </Tooltip>
                                :
                                <></>
                            }
                        </View>
                    </View>
                    <View
                        style={styles.trainingInfo}
                    >
                        <View>
                            <Text style={styles.text}>Дистанция</Text>
                            <Text style={styles.text}>{convertDistance(props.training.distance)}</Text>
                        </View>
                        <View>
                            <Text style={styles.text}>Время</Text>
                            <Text style={styles.text}>{convertTime(props.training.time)}</Text>
                        </View>
                        <View>
                            <Text style={styles.text}>Темп</Text>
                            <Text style={styles.text}>{convertPace(props.training.pace)}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.map}>
                    <MapWithResult
                        points={props.training.points}
                        enableMove={false}
                        trainingId={props.training.id}
                    />
                    <View style={styles.openButton}>
                        <Button
                            color={defaultStyles.colors.praimaryColor}
                            title="Развернуть"
                            onPress={() => {
                                openTreaning(props.training);
                            }}
                        />
                    </View>
                </View>
            </View>
        </>

    );
}

const styles = StyleSheet.create({
    post: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 10
    },
    head: {
        flexDirection: "column",
        paddingBottom: 5,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginLeft: 10,
    },
    medalContainer: {
        flexGrow: 1,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    medal: {
        width: 40,
        height: 40,
        // backgroundColor: "red",
        marginRight: 10,
    },
    userInfo: {
        flexDirection: "row",
    },
    trainingInfo: {
        flexDirection: "row",
        justifyContent: "space-around"
    },
    text: {
        ...defaultStyles.normalText,
        textAlign: "center",
    },
    hoverText: {
        fontSize: 14,
        textAlign: "center",
    },
    info: {
        alignItems: "baseline",
        overflowWrap: "break-word",
    },
    nameContainer: {
        justifyContent: "center",
    },
    name: {
        ...defaultStyles.h2,
        paddingHorizontal: 20,

    },
    results: {
        flexDirection: "row",
        flexWrap: "wrap",
        width: "100%",
    },
    result: {
        marginLeft: 20,
    },
    map: {
        width: "100%",
        height: 400,
    },
    openButton: {
        position: "absolute",
        bottom: 10,
        right: 10,
    }
});