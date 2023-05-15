import { LatLng } from "react-native-maps";

export function getDistanceFromLatLon(location1: LatLng, location2: LatLng) {
    let R = 6371210; // Radius of the earth in km
    let dLat = deg2rad(location2.latitude - location1.latitude);  // deg2rad below
    let dLon = deg2rad(location2.longitude - location1.longitude);
    let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(location1.latitude)) * Math.cos(deg2rad(location2.latitude)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
    return Math.floor(d);
}

export function deg2rad(deg: number) {
    return deg * (Math.PI / 180)
}