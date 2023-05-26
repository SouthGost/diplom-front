export type User = {
    id: number,
    name: string,
    surname: string,
    avatar: string | null,
}

export type Point = {
    latitude: number,
    longitude: number,
    time: number,
    part: number,
};

export type Statistic = {
    distance: number,
    time: number,
    pace: number,
}

export type PacePerKilometer = {
    kilometer: number,
    pace: number
}

export type Training = Statistic &{
    id: number,
    user: User,
    points: Point[],
    start_time: number,
    pace_per_kilometers?: PacePerKilometer[],
    best_pace: boolean,
    best_distance: boolean,
}