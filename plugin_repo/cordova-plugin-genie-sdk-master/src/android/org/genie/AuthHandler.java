package org.genie;

import org.apache.cordova.CallbackContext;
import org.ekstep.genieservices.GenieService;
import org.ekstep.genieservices.commons.IResponseHandler;
import org.ekstep.genieservices.commons.bean.GenieResponse;
import org.ekstep.genieservices.commons.bean.Session;
import org.ekstep.genieservices.commons.utils.GsonUtil;
import org.json.JSONArray;
import org.json.JSONException;

import java.util.Map;

/**
 * Created by souvikmondal on 9/2/18.
 */

public class AuthHandler {

    private static final String TYPE_GET_BEARER_TOKEN = "getMobileDeviceBearerToken";
    private static final String TYPE_VALID_SESSION = "getSessionData";
    private static final String TYPE_START_SESSION = "startSession";
    private static final String TYPE_END_SESSION = "endSession";
    private static final String TYPE_CREATE_SESSION = "createSession";
    private static final String TYPE_REFRESH_SESSION = "refreshSession";

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
                getSessionData(callbackContext);
            } else if (type.equals(TYPE_CREATE_SESSION)) {
                createSession(args, callbackContext);
            } else if (type.equals(TYPE_REFRESH_SESSION)) {
                createSession(args, callbackContext);
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private static void getSessionData(final CallbackContext callbackContext) {
        Session session = GenieService.getService().getAuthSession().getSessionData();
        callbackContext.success(GsonUtil.toJson(session));
    }

    private static void endSession() {
        GenieService.getService().getAuthSession().endSession();

        String defaultChannel = GenieService.getService().getKeyStore().getString(ContentHandler.DEFAULT_CHANNEL_PREF_KEY, null);
        GenieService.getService().getKeyStore().putString("channelId", defaultChannel);

        SDKParams.setParams();
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

    private static void createSession(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        String userToken = args.getString(1);
        GenieService.getAsyncService().getAuthSessionService().createSession(userToken, new IResponseHandler<Map<String, Object>>() {
            @Override
            public void onSuccess(GenieResponse<Map<String, Object>> genieResponse) {
                callbackContext.success(GsonUtil.toJson(genieResponse.getResult()));
            }

            @Override
            public void onError(GenieResponse<Map<String, Object>> genieResponse) {
                callbackContext.error(genieResponse.getMessage());
            }
        });
    }
}
