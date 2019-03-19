package org.genie;

import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.ekstep.genieservices.GenieService;
import org.ekstep.genieservices.commons.utils.Base64Util;
import org.ekstep.genieservices.utils.BuildConfigUtil;
import org.json.JSONArray;
import org.json.JSONException;
import org.sunbird.SunbirdApplication;

import java.io.UnsupportedEncodingException;

public class GenieSdkUtilHandler {

    private static final String TYPE_GET_DEVICE_ID = "getDeviceID";
    private static final String TYPE_GET_LOCATION = "getLocation";
    private static final String TYPE_IS_CONNECTED = "isConnected";
    private static final String TYPE_IS_CONNECTED_OVER_WIFI = "isConnectedOverWifi";
    private static final String TYPE_GET_BUILD_CONFIG_PARAM = "getBuildConfigParam";
    private static final String TYPE_DECODE = "decode";
    private static final String TYPE_OPEN_PLAY_STORE = "openPlayStore";
    private static final String TYPE_GET_DEVICE_API_LEVEL = "getDeviceAPILevel";
    private static final String TYPE_CHECK_APP_AVAILABILITY = "checkAppAvailability";
    private static final String TYPE_GET_DOWNLOAD_DIRECTORY_PATH = "getDownloadDirectoryPath";

    public static void handle(CordovaInterface cordova, JSONArray args, final CallbackContext callbackContext) {
        try {
            String type = args.getString(0);

            if (type.equals(TYPE_GET_DEVICE_ID)) {
                getDeviceID(callbackContext);
            } else if (type.equals(TYPE_GET_LOCATION)) {
                getLocation(callbackContext);
            } else if (type.equals(TYPE_IS_CONNECTED)) {
                isConnected(callbackContext);
            } else if (type.equals(TYPE_IS_CONNECTED_OVER_WIFI)) {
                isConnectedOverWifi(callbackContext);
            } else if (type.equals(TYPE_GET_BUILD_CONFIG_PARAM)) {
                getBuildConfigParam(cordova, args, callbackContext);
            } else if (type.equals(TYPE_DECODE)) {
                decode(callbackContext, args);
            } else if (type.equals(TYPE_OPEN_PLAY_STORE)) {
                String appId = args.getString(1);
                openGooglePlay(cordova, appId);
                callbackContext.success();
            } else if (type.equals(TYPE_GET_DEVICE_API_LEVEL)){
                getDeviceAPILevel(callbackContext);
            } else if (type.equals(TYPE_CHECK_APP_AVAILABILITY)){
                checkAppAvailability(cordova,args,callbackContext);
            }else if (type.equals(TYPE_CHECK_APP_AVAILABILITY)){
                checkAppAvailability(cordova,args,callbackContext);
            }else if (type.equals(TYPE_GET_DOWNLOAD_DIRECTORY_PATH)){
                getDownloadDirectoryPath(callbackContext);
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private static void getDeviceID(CallbackContext callbackContext) {
        String did = GenieService.getService().getDeviceInfo().getDeviceID();
        callbackContext.success(did);
    }

    private static void getLocation(CallbackContext callbackContext) {
        String location = GenieService.getService().getLocationInfo().getLocation();
        callbackContext.success(location);
    }

    private static void isConnected(CallbackContext callbackContext) {
        boolean isConnected = GenieService.getService().getConnectionInfo().isConnected();
        callbackContext.success(Boolean.toString(isConnected));
    }

    private static void isConnectedOverWifi(CallbackContext callbackContext) {
        boolean isConnectedOverWifi = GenieService.getService().getConnectionInfo().isConnectedOverWifi();
        callbackContext.success(Boolean.toString(isConnectedOverWifi));
    }

    private static void getBuildConfigParam(CordovaInterface cordova, JSONArray args, CallbackContext callbackContext) throws JSONException {
        String param = args.getString(1);
        String value = BuildConfigUtil.getBuildConfigValue(SunbirdApplication.PACKAGE_NAME, param).toString();
        callbackContext.success(value);
    }

    private static void decode(CallbackContext callbackContext, JSONArray args) throws JSONException {
        String encodedData = args.getString(1);
        int flag = args.getInt(2);
        try {
            byte[] decodedByteArray = Base64Util.decode(encodedData.getBytes("UTF-8"), flag);
            String decodedString = new String(decodedByteArray);
            callbackContext.success(decodedString);
        } catch (UnsupportedEncodingException e) {
            callbackContext.error("FAILED");
        }
    }

    /**
     * Open the appId details on Google Play .
     *
     * @param appId Application Id on Google Play.
     *              E.g.: com.google.earth
     */
    private static void openGooglePlay(CordovaInterface cordova, String appId) {
        try {
            Context context = cordova.getActivity().getApplicationContext();
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=" + appId));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);
        } catch (ActivityNotFoundException ex) {
            ex.printStackTrace();
        }
    }

    public static void getDeviceAPILevel(CallbackContext callbackContext){
        int apiLevel =  Build.VERSION.SDK_INT;
        callbackContext.success(apiLevel);
    }

    private static void checkAppAvailability(CordovaInterface cordova, JSONArray args, CallbackContext callbackContext) throws JSONException {
        try {
            String packageName = args.getString(1);
            cordova.getActivity().getApplicationContext().getPackageManager().getApplicationInfo(packageName, 0);
            callbackContext.success("true");
        }
        catch (PackageManager.NameNotFoundException e) {
            callbackContext.success("false");
        }

    }

    public static void getDownloadDirectoryPath(CallbackContext callbackContext){
        callbackContext.success("file://"+String.valueOf(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS))+"/");
    }

}
