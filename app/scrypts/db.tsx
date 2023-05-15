import { enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';
import { Point } from '../types';

enablePromise(true);


export const getDBConnection = async ():Promise<SQLiteDatabase> => {
    return openDatabase({ name: 'athletics_track', location: 'default' });
};

export const getPoints = async (db: SQLiteDatabase): Promise<Point[]> => {
    try {
        const Points: Point[] = [];
        const results = await db.executeSql(`SELECT * FROM Points`);
        results.forEach(result => {
            for (let index = 0; index < result.rows.length; index++) {
                Points.push(result.rows.item(index))
            }
        });
        return Points;
    } catch (error) {
        console.error(error);
        throw Error('Failed to get Points!!!');
    }
};

export const clearPoints = async (db: SQLiteDatabase): Promise<void> => {
    await db.executeSql(`DELETE FROM Points`);
}

