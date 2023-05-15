package com.diplom.Data;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import androidx.annotation.Nullable;

public class DBHelper extends SQLiteOpenHelper {
    public static final int DATABASE_VERSION = 1;
    public static final String DATABASE_NAME = "athletics_track";
    public static final String TABLE_POINTS = "Points";

    public static final String KEY_PART = "part";
    public static final String KEY_TIME = "time";
    public static final String KEY_LATITUDE = "latitude";
    public static final String KEY_LONGITUDE = "longitude";


    public DBHelper(@Nullable Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL(
                "create table " + TABLE_POINTS + " (" +
                        KEY_PART + " integer ," +
                        KEY_TIME + " integer primary key," +
                        KEY_LATITUDE + " real ," +
                        KEY_LONGITUDE + " real " +
                ")"
        );
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int i, int i1) {
        db.execSQL("drop table if exists " + TABLE_POINTS);

        onCreate(db);
    }
}
