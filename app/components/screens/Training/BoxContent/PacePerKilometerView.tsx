import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { PacePerKilometer } from "../../../../types";
import { Training } from "../../../../types";
import { convertTime, convertDistance, convertPace } from '../../../../scrypts/sport';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import PropTypes from 'prop-types';
import defaultStyles from "../../../../styles/defaultStyles";

type props = {
    pace_per_kilometers?: PacePerKilometer[],
}

export default function PacePerKilometerView(props: props) {
    const [analysisView, srtAnalysisView] = useState<JSX.Element>();

    function getAnalysisViewElement(pace_per_kilometer: PacePerKilometer, width: number, key?: string) {
        return <View
            style={[
                styles.analysisRow,
                {
                    width: `${width}%`,
                }
            ]}
            key={key}
        >
            <Text style={styles.text}>
                {`${pace_per_kilometer.kilometer}) ${convertPace(pace_per_kilometer.pace, true)} мин/км`}
            </Text>
        </View>
    }

    useEffect(() => {
        let analysisView_

        if (props.pace_per_kilometers === undefined) {
            analysisView_ = <ActivityIndicator size={40} />;
        } else {
            if (props.pace_per_kilometers.length === 0) {
                analysisView_ = <></>;
            } else {
                if (props.pace_per_kilometers.length === 1) {
                    analysisView_ = <View>
                        {getAnalysisViewElement(props.pace_per_kilometers[0], 100)}
                    </View>
                } else {
                    let bestPace = props.pace_per_kilometers[0].pace;
                    let worstPace = props.pace_per_kilometers[0].pace;

                    for (let i = 1; i < props.pace_per_kilometers.length; i++) {
                        if (bestPace > props.pace_per_kilometers[i].pace) {
                            bestPace = props.pace_per_kilometers[i].pace
                        }
                        if (worstPace < props.pace_per_kilometers[i].pace) {
                            worstPace = props.pace_per_kilometers[i].pace
                        }
                    }

                    let chartStep = 5;
                    let maxPaceDifference = worstPace - bestPace;
                    if (maxPaceDifference * 5 > 50) {
                        chartStep = 50 / maxPaceDifference;
                    }

                    const getWidth = (pace: number) => {

                        return Math.round(50 + (pace - bestPace) * chartStep);
                    }

                    analysisView_ = <View>
                        {props.pace_per_kilometers.map((elem) =>
                            getAnalysisViewElement(elem, getWidth(elem.pace), `pace per kilometer ${elem.kilometer}`)
                        )}
                    </View>
                }
            }
        }

        srtAnalysisView(analysisView_);
    }, [props.pace_per_kilometers]);


    return (
        <>
            {analysisView === undefined ?
                <></>
                :
                analysisView
            }
        </>

    )
}

const styles = StyleSheet.create({
    analysisRow: {
        flexDirection: "row",
        backgroundColor: "#abb",
        marginBottom: 2,
    },
    text: {
        ...defaultStyles.normalText,
        paddingVertical: 5,
    },
});