import React from 'react';
import { useState } from 'react';
import { Button, StyleSheet, Text, View, ScrollView, Image, Pressable } from 'react-native';
import { Training } from '../../../types';
import MapWithResult from '../MapWithResult';
import { convertTime, convertDistance, convertPace } from '../../../scrypts/sport';
import defaultStyles from '../../../styles/defaultStyles';
import { Tooltip } from 'react-native-paper';
import Requests from '../../../scrypts/request';
import Head from './Head';


type post = {
    training: Training,
    navigation: any,
};

export default function Post(props: post) {

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
                    style={styles.statistic}
                >
                    <Head {...props} />
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
    statistic: {
        flexDirection: "column",
        paddingBottom: 5,
        paddingHorizontal: 15,
    },
    trainingInfo: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    text: {
        ...defaultStyles.normalText,
        textAlign: "center",
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