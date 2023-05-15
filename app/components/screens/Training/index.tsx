import React from 'react';
// import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import Navbar from '../../../navigations/Navbar';
import { PacePerKilometer, Training } from '../../../types';
import MapWithResult from '../../blocks/MapWithResult';
import Requests from '../../../scrypts/request';
import SwipeBox from './SwipeBox';
import BoxContent from './BoxContent';

export default function TrainingView({ route, navigation }: any) {
    const { id, sendTraining } = route.params;
    const [training, setTraining] = useState<Training>();


    async function getFullInfo() {
        try {
            let res = await Requests.getTraining(id);
            if (res.ok) {
                const data = await res.json();
                // console.log("qwe", data.id);
                setTraining(data);
            } else {
                console.log("Не хороший ответ");
            }
        } catch (err) {
            console.log("Не хороший ответ2");
        }
    }

    useEffect(() => {
        setTraining(sendTraining);
        getFullInfo();
    }, []);





    return (
        <>
            <View style={styles.post}>
                {training === undefined ?
                    <ActivityIndicator size={100} />
                    :
                    <>
                        {/* <ScrollView contentContainerStyle={styles.scrollContainer}> */}

                        <View style={styles.map}>
                            <MapWithResult
                                points={training.points}
                                enableMove={true}
                                trainingId={training.id}
                            />
                        </View>
                        <SwipeBox>
                            <View>
                                <BoxContent training={training} />
                            </View>
                        </SwipeBox>
                    </>
                }


                {/* <Text>Пост №{id} от</Text> */}

            </View>
            <Navbar navigation={navigation} />
        </>

    );
}

const styles = StyleSheet.create({
    post: {
        flex: 1,
        backgroundColor: 'white',
        position: "relative",
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    scrollContainer: {
        flex: 1,
        width: "100%",
        // backgroundColor: '#000',
        // height: "100%",
    },
    map: {
        // flex: 1,
        width: "100%",
        height: "100%",
    },
    analysisColumn: {

    },
    analysisRow: {
        flexDirection: "row",
        backgroundColor: "#abb"
    }
});
