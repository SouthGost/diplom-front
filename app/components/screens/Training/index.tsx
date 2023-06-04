import React from 'react';
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
    }, [id, sendTraining]);





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
                                <BoxContent navigation={navigation} training={training} />
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
    },
    scrollContainer: {
        flex: 1,
        width: "100%",
    },
    map: {
        width: "100%",
        height: "100%",
    },
    analysisRow: {
        flexDirection: "row",
        backgroundColor: "#abb"
    }
});
