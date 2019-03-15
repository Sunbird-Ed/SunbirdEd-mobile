package org.genie;

import org.apache.cordova.CallbackContext;
import org.ekstep.genieservices.GenieService;
import org.json.JSONArray;
import org.json.JSONException;

/**
 * Created by souvikmondal on 19/4/18.
 */

public class SharedPreferencesHandler {

    private static final String KEY_PREFIX = "sunbird";

    public static void handle(JSONArray args, CallbackContext callbackContext) {
        try {
            String type = args.getString(0);
            if (type.equals("putString")) {
                String key = KEY_PREFIX + args.getString(1);
                String value = args.getString(2);
                GenieService.getService().getKeyStore().putString(key, value);
            } else if (type.equals("getString")) {
                String key = KEY_PREFIX + args.getString(1);
                String value = GenieService.getService().getKeyStore().getString(key,"");
                callbackContext.success(value);
            } else if (type.equals("getStringWithoutPrefix")) {
                String key = args.getString(1);
                String value = GenieService.getService().getKeyStore().getString(key,"");
                callbackContext.success(value);
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

}
