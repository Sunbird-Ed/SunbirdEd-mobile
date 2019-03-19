package org.sunbird.openrap;

import android.net.nsd.NsdServiceInfo;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.ekstep.genieservices.GenieService;
import org.ekstep.genieservices.commons.bean.GenericEvent;
import org.ekstep.genieservices.eventbus.EventBus;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.sunbird.openrap.nsd.OpenrapDiscoveryHelper;
import org.sunbird.openrap.nsd.OpenrapDiscoveryListener;


public class OpenrapPlugin extends CordovaPlugin implements OpenrapDiscoveryListener {

    private static final String KEY_OPEN_RAP_HOST = "open_rap_host";
    private static final String KEY_OPEN_RAP_PORT = "open_rap_port";
    private static String openRapHost;

    public static JSONObject jsonObject = new JSONObject();

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (args.get(0).equals("startDiscovery")) {
            this.startDiscovery(callbackContext);

        }
        return true;
    }

    private void startDiscovery(CallbackContext callbackContext) {
        PreferenceUtil.initPreference(this.cordova.getActivity());
        new OpenrapDiscoveryHelper(this.cordova.getActivity(), this).startDiscovery("_openrap._tcp",
                "Open Resource Access Point");
    }

    @Override
    public void onNsdServiceFound(NsdServiceInfo foundServiceInfo) {

    }

    @Override
    public void onNsdDiscoveryFinished() {

    }

    @Override
    public void onNsdServiceResolved(NsdServiceInfo resolvedNsdServiceInfo) {

    }

    @Override
    public void onConnectedToService(NsdServiceInfo connectedServiceInfo) {
        PreferenceUtil.getPreferenceWrapper().putString(KEY_OPEN_RAP_HOST, connectedServiceInfo.getHost().toString());
        PreferenceUtil.getPreferenceWrapper().putInt(KEY_OPEN_RAP_PORT, connectedServiceInfo.getPort());
        setParams();

       try {
            jsonObject.put("actionType","connected");
            jsonObject.put("ip",openRapHost);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        EventBus.postEvent(new GenericEvent(jsonObject.toString()));

    }

    @Override
    public void onNsdServiceLost(NsdServiceInfo nsdServiceInfo) {
        GenieService.setParams(null);

        try {
            jsonObject.put("actionType","disconnected");
            jsonObject.put("ip",openRapHost);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        EventBus.postEvent(new GenericEvent(jsonObject.toString()));

    }

    public void setParams() {
        SDKParams sdkParams = new SDKParams();

        openRapHost = PreferenceUtil.getPreferenceWrapper().getString(KEY_OPEN_RAP_HOST, null);

        // int port = PreferenceUtil.getPreferenceWrapper().getInt(KEY_OPEN_RAP_PORT,0);
        openRapHost = openRapHost.replace("/", "http://");


        String telemetryBaseurl = openRapHost + "/api/data/v1";
        sdkParams.put(SDKParams.Key.TELEMETRY_BASE_URL, telemetryBaseurl);

        String contentBaseUrl = openRapHost + "/api/content/v1";
        sdkParams.put(SDKParams.Key.CONTENT_BASE_URL, contentBaseUrl);

        String searchBaseUrl = openRapHost + "/api/composite/v1";
        sdkParams.put(SDKParams.Key.SEARCH_BASE_URL, searchBaseUrl);

        String pageServiceBaseUrl = openRapHost + "/api/data/v1";
        sdkParams.put(SDKParams.Key.PAGE_SERVICE_BASE_URL, pageServiceBaseUrl);

        GenieService.setParams(sdkParams);
    }

}
