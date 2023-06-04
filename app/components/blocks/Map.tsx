import React from 'react';
import { Button, StyleSheet, View, } from 'react-native';
import MapView, { LatLng, Region, UrlTile, Polyline } from 'react-native-maps';
import { useEffect, useState } from 'react';
import { Point } from "./../../types";

type MapProps = {

    points: Point[],
    lastPoint?: Point,
}

export default function Map(props: MapProps) {
    const [lines, setLines] = useState<Array<Array<LatLng>>>([[]]);

    function createLines(points: Point[]) {
        const newLines: LatLng[][] = [];

        points.forEach(elem => {
            if (newLines[elem.part] == undefined) {
                newLines[elem.part] = [];
            }
            newLines[elem.part].push(elem)
        })
        return newLines;
    }

    useEffect(() => {
        setLines(createLines(props.points));
    }, [props.lastPoint]);

    return (
        <MapView
            style={styles.map}
            showsUserLocation={true}
        >
            {lines.map((elem, index) => {
                return (
                    elem.length > 1 ?
                        <Polyline
                            key={`участок ${index}`}
                            coordinates={elem}
                            strokeColor="#000"
                            strokeWidth={6}
                        />
                        :
                        <></>
                )
            })}
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: {
        width: "100%",
        height: "100%",
    },
});