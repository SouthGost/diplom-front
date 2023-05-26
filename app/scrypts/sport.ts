import { Point, Statistic } from "../types";
import { getDistanceFromLatLon } from "./geo";

function div(val: number, div: number) {
    return Math.floor(val / div);
}

function add0(val: number, count: number) {
    let newVal = val.toString();
    while (newVal.length < count) {
        newVal = `0${newVal}`;
    }
    return newVal;
}


export function convertDistance(value: number) {
    let distance = "";


    if (value >= 1000) {
        const km = div(value, 1000);
        let m;
        if (value >= 10000) {
            m = div((value % 1000), 100);
        } else {
            m = div((value % 1000), 10);
            m = add0(m, 2);
        }

        distance = `${km}.${m} км`;
    } else {
        distance = `${value} м`;
    }

    return distance;
}

export function convertPace(value: number, hideMeasurementSystem?: boolean) {
    let pace = "";

    if (value != 0) {
        const min = div(value, 60);
        const sec = value % 60;
        pace = `${add0(min, 2)}:${add0(sec, 2)}`;
    } else {
        pace = `--:--`;
    }

    return `${pace}${!hideMeasurementSystem ? " мин/км" : ''}`;
}

export function convertTime(value: number, hideMillisecond?: boolean) {
    let time = "";

    const hour = add0(div(value, 3600000), 2);
    const min = add0(div(value % 3600000, 60000), 2);
    const sec = add0(div(value % 60000, 1000), 2);

    if (value >= 3600000) {
        time = `${hour}:${min}:${sec}`;
    } else if (value >= 60000) {
        time = `${min}:${sec}`;
    } else {
        time = sec;
        if (!hideMillisecond) {
            const sotih = add0(div(value % 1000, 10), 2);
            time += `.${sotih}`;
        }
        time += " с";
    }

    return time;
}

export function getStatisticByPoints(points: Point[]): Statistic {
    let distance = 0;
    let time = 0;
    let pace = 0;

    // let lastPoint = points[0];
    let part = 0;

    console.log("длинна в методе ",points.length);

    for (let i = 1; i < points.length; i++) {
        if (part == points[i].part) {

            time += points[i].time - points[i-1].time;
            distance += getDistanceFromLatLon(points[i-1], points[i]);


        } else {
            part = points[i].part;
        }
        // lastPoint = points[i];
    }

    if (distance != 0) {
        pace = Math.floor(time / distance);
    }

    return {
        distance,
        time,
        pace,
    }
}