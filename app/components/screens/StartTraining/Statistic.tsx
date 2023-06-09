import React, { useContext, useEffect, useState } from 'react';
import { SQLiteDatabase } from 'react-native-sqlite-storage';
import {
    StyleSheet, Text, View, TouchableOpacity, Image, PermissionsAndroid, Permission, ToastAndroid
} from 'react-native';
import { clearPoints, getDBConnection, getPoints } from '../../../scrypts/db';
import Map from '../../blocks/Map';
import { Point, Statistic } from '../../../types';
import defaultStyles from '../../../styles/defaultStyles';
import { AuthContext } from '../../../context/AuthContext';
import Requests from '../../../scrypts/request';
import checkRefreshToken, { requestWithToken } from '../../../scrypts/checkRefreshToken';
import { convertDistance, convertPace, convertTime, getStatisticByPoints } from '../../../scrypts/sport';
import { NativeEventEmitter, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



const { Training } = NativeModules;

const trainingManagerEmitter = new NativeEventEmitter(Training);

function alert(message: string) {
    ToastAndroid.showWithGravityAndOffset(message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 80);
}


export default function StatisticView({ navigation }: any) {
    const { accessToken, setUser } = useContext<any>(AuthContext);
    const [points, setPoints] = useState<Array<Point>>([]);
    const [lastPoint, setLastPoint] = useState<Point>();
    const [statistic, setStatistic] = useState<Statistic>();
    const [isRunning, setIsRunning] = useState(false);
    const [isWaitAnswer, setIsWaitAnswer] = useState(false);

    async function updateInfo(db: SQLiteDatabase) {
        const newPoints = await getPoints(db);
        setPoints(newPoints);
        setStatistic(getStatisticByPoints(newPoints));
        setLastPoint(newPoints[newPoints.length - 1]);

    }

    async function createTrainingEventListner() {
        const db = await getDBConnection();
        updateInfo(db);

        trainingManagerEmitter.removeAllListeners('Training_event');

        trainingManagerEmitter.addListener('Training_event', async () => {
            updateInfo(db);
            setIsRunning(true);
        });
    }


    useEffect(() => {
        createTrainingEventListner();

    }, []);


    async function startTrack() {
        Training.startService();
        console.log("Начало")
        setIsRunning(true);
    }

    async function pauseTrack() {
        Training.stopService();
        console.log("Остановка")
        setIsRunning(false);
    }


    async function saveTrack() {
        setIsWaitAnswer(true);
        console.log("Сохранение");
        const db = await getDBConnection();
        await requestWithToken(
            (accessToken_) => Requests.finishTraining(points, accessToken_),
            async (res) => {
                const data = await res.json();
                await clearPoints(db);
                navigation.navigate('Training', {
                    id: data.id,
                });
            },
            () => {
                alert("Не удалось сохранить тренировку. попробуйте позже")
            },
            setUser,
            accessToken,
        );
        setIsWaitAnswer(false);
    }

    return (
        <>
            <Map
                points={points}
                lastPoint={lastPoint}
            />
            {statistic !== undefined ?
                <View style={styles.statisticContainer}>
                    <Text style={styles.text}>Дистанция {convertDistance(statistic.distance)}</Text>
                    <Text style={styles.text}>Время {convertTime(statistic.time, isRunning)}</Text>
                    <Text style={styles.text}>Темп {convertPace(statistic.pace)}</Text>
                </View>
                :
                <></>
            }
            <View style={styles.buttonContainer}>
                {!isWaitAnswer ?
                    isRunning ?
                        <TouchableOpacity
                            onPress={
                                () => {
                                    pauseTrack();
                                }
                            }
                            style={styles.roundButton
                            }
                        >
                            <Text style={styles.buttonText}>Стоп</Text>
                        </TouchableOpacity>
                        :
                        points.length == 0 ?
                            <TouchableOpacity
                                onPress={() => {
                                    startTrack();
                                }}
                                style={styles.roundButton}
                            >
                                <Text style={styles.buttonText}>Старт</Text>
                            </TouchableOpacity>
                            :
                            <>
                                <TouchableOpacity
                                    onPress={() => {
                                        startTrack();
                                    }}
                                    style={styles.roundButton}
                                >
                                    <Text style={styles.buttonText}>Продолжить</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (!isWaitAnswer) {
                                            saveTrack();
                                        }
                                    }}
                                    style={styles.roundButton}
                                >
                                    <Text style={styles.buttonText}>Сохранить</Text>
                                </TouchableOpacity>
                            </>

                    :
                    <></>
                }
            </View >
        </>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        position: "absolute",
        bottom: 10,
        flexDirection: "row",
        width: 220,
        justifyContent: "space-around",
    },
    statisticContainer: {
        position: "absolute",
        top: 50,
        left: 20,
        justifyContent: "flex-start",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderStyle: "solid",
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 10,
        padding: 20,
    },
    roundButton: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        backgroundColor: defaultStyles.colors.praimaryColor,

    },
    text: {
        ...defaultStyles.normalText,
    },
    buttonText: {
        color: "white",
    }
});