package com.diplom;

import android.Manifest;
import android.app.Notification;
import android.app.PendingIntent;
import android.app.Service;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;

import android.app.NotificationManager;
import android.app.NotificationChannel;
import android.os.Build;
import android.widget.Toast;

import com.diplom.Data.DBHelper;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class TrainingService extends Service {

    private static final int SERVICE_NOTIFICATION_ID = 12345;
    private static final String CHANNEL_ID = "Training";
    public static ReactApplicationContext reactContext;

    private Context context;
    private DBHelper dbHelper;
    private LocationManager locationManager;
    private boolean isSetListner = false;
    private int currentPart = 0;

    private LocationListener mylocationListner = new LocationListener() {
        @Override
        public void onLocationChanged(Location location) {
            if (location != null) {
                SQLiteDatabase database = dbHelper.getWritableDatabase();
                ContentValues contentValues = new ContentValues();

                contentValues.put(DBHelper.KEY_PART, currentPart);
                contentValues.put(DBHelper.KEY_TIME, System.currentTimeMillis());
                contentValues.put(DBHelper.KEY_LATITUDE, location.getLatitude());
                contentValues.put(DBHelper.KEY_LONGITUDE, location.getLongitude());
                database.insert(DBHelper.TABLE_POINTS, null, contentValues);
                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("Training_event", null);
            } else {
                toast("Локация null");
            }
        }

        @Override
        public void onStatusChanged(String provider, int status, Bundle extras) {

        }

        @Override
        public void onProviderEnabled(String provider) {

        }

        @Override
        public void onProviderDisabled(String provider) {

        }
    };

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, "Training", importance);
            channel.setDescription("CHANEL DESCRIPTION");
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    private void myStopLocaionUpdate() {
        if (isSetListner) {
            locationManager.removeUpdates(mylocationListner);
            isSetListner = false;
        }
    }

    private void myStopService() {
        this.stopSelf();
    }

    private void myCreateLocationListner() {
        try {
            if (
                    ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED &&
                            ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED &&
                            !isSetListner
            ) {
                locationManager = (LocationManager) getSystemService(context.LOCATION_SERVICE);
                locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000, 0, mylocationListner);
                isSetListner = true;
            } else {
                throw new Exception("Не получен доступ к геолокации");
            }
        } catch (Exception error) {
            myStopService();
        }
    }

    private void toast(String text) {
        Toast toast = Toast.makeText(context, text, Toast.LENGTH_LONG);
        toast.show();
    }


    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        context = this.getApplicationContext();
        dbHelper = new DBHelper(this);
    }

    @Override
    public void onDestroy() {
        myStopLocaionUpdate();
        super.onDestroy();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        SQLiteDatabase database = dbHelper.getWritableDatabase();
        Cursor cursorMaxPart = database.rawQuery("SELECT MAX(part) FROM " + DBHelper.TABLE_POINTS + ";", null);
        if (cursorMaxPart.moveToFirst()) {
            currentPart = cursorMaxPart.getInt(0) + 1;
        } else {
            currentPart = 0;
        }
        myCreateLocationListner();
        createNotificationChannel();
        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent contentIntent = PendingIntent.getActivity(this, 0, notificationIntent, PendingIntent.FLAG_CANCEL_CURRENT);
        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Дневник легкоатлета")
                .setContentText("Пробежка...")
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentIntent(contentIntent)
                .setOngoing(true)
                .build();
        startForeground(SERVICE_NOTIFICATION_ID, notification);
        return START_STICKY;
    }

}