import React from 'react';
import { useState } from 'react';
import { Button, StyleSheet, Text, View, ScrollView, Image, Pressable } from 'react-native';
import { Training } from '../../types';
import MapWithResult from './MapWithResult';
import { convertTime, convertDistance, convertPace } from './../../scrypts/sport';
import defaultStyles from '../../styles/defaultStyles';
// import DistanceText from './DistanceText';
// import PaceText from './PaceText';
// import TimeText from './TimeText';

type post = {
    training: Training,
    navigation: any,
};

export default function MinPost(props: post) {

    function openTreaning(training: Training){
        props.navigation.navigate('Training', {
            id: training.id,
            sendTraining: training,
        });
    }

    function openProfile(profileId: number){
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
                                    uri: 'https://reactnative.dev/img/tiny_logo.png',
                                }}
                            />
                        </Pressable>
                        <Text style={styles.name}>{props.training.user.name} {props.training.user.surname}</Text>
                    </View>
                    <View
                        style={styles.trainingInfo}
                    >
                        {/* <DistanceText style={styles.result} value={props.training.distance} />
                        <TimeText style={styles.result} value={props.training.time} />
                        <PaceText style={styles.result} value={props.training.pace} /> */}
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


                    {/* <View style={styles.info}>

                        <View style={styles.results}>

                        </View>
                    </View> */}
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
    userInfo: {
        flexDirection: "row",
    },
    trainingInfo: {
        flexDirection: "row",
        justifyContent: "space-around"
    },
    text:{
        ...defaultStyles.normalText,
        textAlign: "center", 
    },
    info: {
        alignItems: "baseline",
        overflowWrap: "break-word",
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