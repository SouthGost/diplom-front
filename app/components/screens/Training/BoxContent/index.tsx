import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { PacePerKilometer, Statistic } from "../../../../types";
import { Training } from "../../../../types";
import { convertTime, convertDistance, convertPace, getStatisticByPoints } from '../../../../scrypts/sport';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import PropTypes from 'prop-types';
import PacePerKilometerView from "./PacePerKilometerView";
import defaultStyles from "../../../../styles/defaultStyles";

type props = {
    training: Training,
}

export default function BoxContent(props: props) {
    const [trainingSegment, settrainingSegment] = useState(props.training.points);
    const [statistic, setStatistic] = useState<Statistic>();

    useEffect(() => {
        setStatistic(getStatisticByPoints(trainingSegment));
        console.log("длинна в компоненте ", props.training.points.length);
    }, [trainingSegment]);


    return (
        <View>
            <Text style={styles.text}>Дистанция {convertDistance(props.training.distance)}</Text>
            <Text style={styles.text}>Время {convertTime(props.training.time)}</Text>
            <Text style={styles.text}>Темп {convertPace(props.training.pace)}</Text>
            {statistic == undefined ?
                <></>
                :
                <>

                    <Text style={styles.text}>Дистанция  {convertDistance(statistic.distance)}</Text>
                    <Text style={styles.text}>Время  {convertTime(statistic.time)}</Text>
                    <Text style={styles.text}>Темп  {convertPace(statistic.pace)}</Text>
                </>
            }
            <View style={{
                flexDirection: "row",
                // padding: 10,
                justifyContent: "center",
                // backgroundColor: "#abb"
            }}>
                <MultiSlider
                    min={0}
                    max={props.training.points.length - 1}
                    values={[0, props.training.points.length - 1]}
                    onValuesChange={(event) => {
                        settrainingSegment(props.training.points.slice(event[0], event[1] + 1))
                    }}
                />

            </View>
            <PacePerKilometerView pace_per_kilometers={props.training.pace_per_kilometers} />
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        ...defaultStyles.normalText,
    }
});