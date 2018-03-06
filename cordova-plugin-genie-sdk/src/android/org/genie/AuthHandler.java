package org.genie;

import org.apache.cordova.CallbackContext;
import org.ekstep.genieservices.GenieService;
import org.ekstep.genieservices.commons.IResponseHandler;
import org.ekstep.genieservices.commons.bean.GenieResponse;
import org.ekstep.genieservices.commons.bean.Session;
import org.ekstep.genieservices.commons.utils.GsonUtil;
import org.json.JSONArray;
import org.json.JSONException;

/**
 * Created by souvikmondal on 9/2/18.
 */

public class AuthHandler {

    private static final String TYPE_GET_BEARER_TOKEN = "getMobileDeviceBearerToken";
    private static final String TYPE_VALID_SESSION = "isValidSession";
    private static final String TYPE_START_SESSION = "startSession";
    private static final String TYPE_END_SESSION = "endSession";

    public static void handle(JSONArray args, final CallbackContext callbackContext) {

        try {
            String type = args.getString(0);
            if (type.equals(TYPE_GET_BEARER_TOKEN)) {
                getBearerToken(callbackContext);
            } else if (type.equals(TYPE_START_SESSION)) {
                startSession(args);
            } else if (type.equals(TYPE_END_SESSION)) {
                endSession();
            } else if (type.equals(TYPE_VALID_SESSION)) {
                isValidSession(callbackContext);
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }


    }

    private static void isValidSession(final CallbackContext callbackContext) {
        if (GenieService.getService().getAuthSession().getSessionData() != null) {
            callbackContext.success();
        } else {
            callbackContext.error(0);
        }
    }

    private static void endSession() {
        GenieService.getService().getAuthSession().endSession();
    }

    private static void startSession(JSONArray args) throws JSONException {
        String sessionJson = args.getString(1);
        Session session = GsonUtil.fromJson(sessionJson, Session.class);
        GenieService.getService().getAuthSession().startSession(session);
    }

    private static void getBearerToken(final CallbackContext callbackContext) {
        GenieService.getAsyncService().getAuthService().getMobileDeviceBearerToken(new IResponseHandler<String>() {
            @Override
            public void onSuccess(GenieResponse<String> genieResponse) {
                callbackContext.success(genieResponse.getResult());
            }

            @Override
            public void onError(GenieResponse<String> genieResponse) {
                callbackContext.error(genieResponse.getError());
            }
        });
    }
}
