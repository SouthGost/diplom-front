import React from 'react';
import { Button, StyleSheet, View, } from 'react-native';
import MapView, { LatLng, Region, UrlTile, Polyline, Polygon, Marker } from 'react-native-maps';
import { useEffect, useState } from 'react';
import { Point } from "./../../types";

type MapProps = {
    trainingId: number,
    points: Point[],
    enableMove: boolean
}

export default function MapWithResult(props: MapProps) {
    const [lines, setLines] = useState<Array<Array<LatLng>>>([[]]);
    const [initialRegion, setInitialRegion] = useState<Region>();

    function findInitialRegion(points: Point[]) {
        let minLat = points[0].latitude;
        let maxLat = points[0].latitude;
        let minLon = points[0].longitude;
        let maxLon = points[0].longitude;

        for (let i = 1; i < points.length; i++) {
            if (points[i].latitude < minLat) {
                minLat = points[i].latitude;
            } else if (points[i].latitude > maxLat) {
                maxLat = points[i].latitude;
            }
            if (points[i].longitude < minLon) {
                minLon = points[i].longitude;
            } else if (points[i].longitude > maxLon) {
                maxLon = points[i].longitude;
            }
        }

        const initReg = {
            latitude: (maxLat + minLat) / 2,
            longitude: (minLon + maxLon) / 2,
            latitudeDelta: maxLat - minLat + 0.01,
            longitudeDelta: maxLon - minLon + 0.05
        }

        return initReg;
    }

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
        setInitialRegion(findInitialRegion(props.points));
        setLines(createLines(props.points));
    }, []);

    return (
        <MapView
            style={styles.map}
            initialRegion={initialRegion}
            showsUserLocation={false}
            zoomEnabled={props.enableMove}
            rotateEnabled={props.enableMove}
            scrollEnabled={props.enableMove}
        >
            {lines.map((elem, index) => {
                
                return (
                    elem.length > 1 ?
                        <Polyline
                            key={`тренировка ${props.trainingId} участок ${index}`}
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