import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { PacePerKilometer, Point, Statistic } from "../../../../types";
import { Training } from "../../../../types";
import { convertTime, convertDistance, convertPace, getStatisticByPoints } from '../../../../scrypts/sport';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import PropTypes from 'prop-types';
import PacePerKilometerView from "./PacePerKilometerView";
import defaultStyles from "../../../../styles/defaultStyles";
import Head from "../../../blocks/Post/Head";

function getTimeBetweenPoints(points: Point[], startIndex: number, finishIndex: number) {
    let startTime = 0;
    let part = 0;
    let i = 1;
    if (startIndex != 0) {
        for (; i < points.length; i++) {
            if (part == points[i].part) {
                startTime += points[i].time - points[i - 1].time;
            } else {
                part = points[i].part
            }
            if (i == startIndex) {
                i++;
                break;
            }
        }
    }
    let finishTime = startTime;
    for (; i < points.length; i++) {
        if (part == points[i].part) {
            finishTime += points[i].time - points[i - 1].time;
        } else {
            part = points[i].part
        }
        if (i == finishIndex) {
            break;
        }
    }

    return [startTime, finishTime];
}

type props = {
    training: Training,
    navigation: any,
}

export default function BoxContent(props: props) {
    const [trainingSegment, setTrainingSegment] = useState(props.training.points);
    const [timeAtSegmentBorder, setTimeAtSegmentBorder] = useState([0, props.training.time]);
    const [statistic, setStatistic] = useState<Statistic>();

    useEffect(() => {
        setStatistic(getStatisticByPoints(trainingSegment));
    }, [trainingSegment]);

    return (
        <View>
            <Head {...props} />
            <View style={styles.result}>
                <Text style={styles.text}>Дистанция</Text>
                <Text style={styles.text}>{convertDistance(props.training.distance)}</Text>
            </View>
            <View style={styles.result}>
                <Text style={styles.text}>Время</Text>
                <Text style={styles.text}>{convertTime(props.training.time)}</Text>
            </View>
            <View style={styles.result}>
                <Text style={styles.text}>Темп </Text>
                <Text style={styles.text}>{convertPace(props.training.pace)}</Text>
            </View>
            <View>
                <Text style={styles.text}>Статистика на участке:</Text>
            </View>
            <View style={styles.segmentBoeders}>
                <Text style={styles.text}>С {convertTime(timeAtSegmentBorder[0])}</Text>
                <Text style={styles.text}>По {convertTime(timeAtSegmentBorder[1])}</Text>
            </View>


            {statistic == undefined ?
                <></>
                :
                <View
                    style={styles.segmentInfo}
                >
                    <View>
                        <Text style={styles.segmentText}>Дистанция</Text>
                        <Text style={styles.segmentText}>{convertDistance(statistic.distance)}</Text>
                    </View>
                    <View>
                        <Text style={styles.segmentText}>Время</Text>
                        <Text style={styles.segmentText}>{convertTime(statistic.time)}</Text>
                    </View>
                    <View>
                        <Text style={styles.segmentText}>Темп</Text>
                        <Text style={styles.segmentText}>{convertPace(statistic.pace)}</Text>
                    </View>
                </View>
            }
            <View style={{
                flexDirection: "row",
                justifyContent: "center",
            }}>
                <MultiSlider
                    min={0}
                    max={props.training.points.length - 1}
                    values={[0, props.training.points.length - 1]}
                    onValuesChange={(event) => {
                        setTrainingSegment(props.training.points.slice(event[0], event[1] + 1))
                        setTimeAtSegmentBorder(getTimeBetweenPoints(
                            props.training.points,
                            event[0],
                            event[1]
                        ));
                    }}
                />

            </View>
            <View>
                <Text style={styles.text}>Темп на каждом километре:</Text>
            </View>
            <PacePerKilometerView pace_per_kilometers={props.training.pace_per_kilometers} />
        </View>
    )
}

const styles = StyleSheet.create({
    result: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    segmentBoeders: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    segmentInfo: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    text: {
        ...defaultStyles.normalText,
        paddingVertical: 5,
    },
    segmentText: {
        ...defaultStyles.normalText,
        textAlign: "center",
    },
});