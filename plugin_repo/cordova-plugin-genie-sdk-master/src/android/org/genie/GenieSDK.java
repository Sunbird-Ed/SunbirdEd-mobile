package org.genie;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;

/**
 * Created by souvikmondal on 8/1/18.
 */
public class GenieSDK extends CordovaPlugin {

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("telemetry")) {
            TelemetryHandler.handle(args, callbackContext);
        } else if (action.equals("content")) {
            ContentHandler.handle(args, callbackContext);
        } else if (action.equals("auth")) {
            AuthHandler.handle(args, callbackContext);
        } else if (action.equals("event")) {
            GenieEventHandler.handle(args, callbackContext);
        } else if (action.equals("profile")) {
            ProfileHandler.handle(args, callbackContext);
        } else if (action.equals("course")) {
            CourseHandler.handle(args, callbackContext);
        } else if (action.equals("userProfile")) {
            UserProfileHandler.handle(args, callbackContext);
        } else if (action.equals("framework")) {
            FrameworkHandler.handle(args, callbackContext);
        } else if (action.equals("pageAssemble")) {
            PageHandler.handle(args, callbackContext);
        } else if (action.equals("permission")) {
            PermissionHandler.handle(this, args, callbackContext);
        } else if (action.equals("announcement")) {
            AnnouncementHandler.handle(args, callbackContext);
        } else if (action.equals("preferences")) {
            SharedPreferencesHandler.handle(args, callbackContext);
        } else if (action.equals("genieSdkUtil")) {
            GenieSdkUtilHandler.handle(cordova, args, callbackContext);
        } else if (action.equals("share")) {
            ShareHandler.handle(args, cordova, callbackContext);
        } else if (action.equals("form")) {
            FormHandler.handle(args, callbackContext);
        } else if (action.equals("report")) {
            ReportHandler.handle(args, callbackContext);
        } else if (action.equals("dialcode")) {
            DialCodeHandler.handle(args, callbackContext);
        } else if (action.equals("group")) {
            GroupHandler.handle(args, callbackContext);
        }

        return true;
    }


    @Override
    public void onRequestPermissionResult(int requestCode, String[] permissions, int[] grantResults) throws JSONException {
        super.onRequestPermissionResult(requestCode, permissions, grantResults);
        PermissionHandler.onPermissionResult(requestCode, permissions, grantResults);
    }
}
