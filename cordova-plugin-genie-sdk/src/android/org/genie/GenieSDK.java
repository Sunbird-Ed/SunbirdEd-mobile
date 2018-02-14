package org.genie;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.ekstep.genieservices.GenieService;
import org.ekstep.genieservices.commons.IResponseHandler;
import org.ekstep.genieservices.commons.bean.GenieResponse;
import org.ekstep.genieservices.commons.bean.SyncStat;
import org.ekstep.genieservices.commons.bean.telemetry.Impression;
import org.json.JSONArray;
import org.json.JSONException;

/**
 * Created by souvikmondal on 8/1/18.
 */

public class GenieSDK extends CordovaPlugin {

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        GenieService.init(cordova.getActivity(), "org.sunbird.app");
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext)
            throws JSONException {
        if (action.equals("telemetry")) {
            TelemetryHandler.handle(args);
        } else if (action.equals("content")) {
            ContentHandler.handle(args, callbackContext);
        } else if (action.equals("auth")) {
            AuthHandler.handle(callbackContext);
        } else if (action.equals("event")) {
            GenieEventHandler.handle(args, callbackContext);
        }
        return true;
    }
}
