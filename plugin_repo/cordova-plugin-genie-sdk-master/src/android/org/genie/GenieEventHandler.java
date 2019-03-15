package org.genie;

import org.apache.cordova.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;

/**
 * @author vinayagasundar
 */

public class GenieEventHandler {
    private static final String TYPE_REGISTER = "register";
    private static final String TYPE_UN_REGISTER = "unregister";


    public static void handle(JSONArray args, CallbackContext callbackContext)
            throws JSONException {
        String type = args.getString(0);
        if (type.equals(TYPE_REGISTER)) {
            GenieSdkEventListener.init(callbackContext);
        } else if (type.equals(TYPE_UN_REGISTER)) {
            GenieSdkEventListener.destroy();
        }
    }


}
