import React from 'react';
import { Button, StyleSheet, View, } from 'react-native';
import MapView, { LatLng, Region, UrlTile, Polyline } from 'react-native-maps';
// import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Point } from "./../../types";

type MapProps = {

    points: Point[],
    lastPoint?: Point,
}

export default function Map(props: MapProps) {
    // const [initialRegion, setIntervalRegion] = useState<Region>();
    const [lines, setLines] = useState<Array<Array<LatLng>>>([[]]);

    // useEffect(() => {
    //     (async () => {
    //         let location = await Location.getCurrentPositionAsync({});
    //         setIntervalRegion({
    //             latitude: location.coords.latitude,
    //             longitude: location.coords.longitude,
    //             latitudeDelta: 0.0922,
    //             longitudeDelta: 0.0421,
    //         });
    //     })();
    // }, []);

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
            // initialRegion={initialRegion}
            showsUserLocation={true}
        >
            {lines.map((elem, index) => {
                return (
                    elem.length > 1 ?
                        <Polyline
                            key={`участок ${index}`}
                            coordinates={elem}
                            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
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