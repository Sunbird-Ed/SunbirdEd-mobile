package org.genie;

import android.content.Context;

import org.apache.cordova.CallbackContext;
import org.ekstep.genieservices.GenieService;
import org.ekstep.genieservices.ServiceConstants;
import org.ekstep.genieservices.auth.AbstractAuthSessionImpl;
import org.ekstep.genieservices.commons.GenieResponseBuilder;
import org.ekstep.genieservices.commons.bean.GenieResponse;
import org.ekstep.genieservices.commons.bean.Session;
import org.ekstep.genieservices.commons.utils.Base64Util;
import org.ekstep.genieservices.commons.utils.GsonUtil;
import org.ekstep.genieservices.eventbus.EventBus;
import org.ekstep.genieservices.utils.BuildConfigUtil;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.sunbird.SunbirdApplication;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import okhttp3.FormBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;


/**
 * Created by swayangjit on 23/3/18.
 */
public class KeycloakOAuthSessionService extends AbstractAuthSessionImpl {

    private static String END_POINT = "/auth/realms/sunbird/protocol/openid-connect/token";

    private JSONArray args;
    private CallbackContext callbackContext;

    public KeycloakOAuthSessionService() {

    }

    public static String decodeBase64(String data) throws UnsupportedEncodingException {
        byte[] dataText = Base64Util.decode(data, Base64Util.URL_SAFE);
        String text = new String(dataText, "UTF-8");
        return text;
    }

    private Map<String, String> getCreateSessionFormData(String userToken) {
        Map<String, String> requestMap = new HashMap<>();
        try {
            Context context = (Context) mAppContext.getContext();
            requestMap.put("redirect_uri", BuildConfigUtil.getBuildConfigValue(SunbirdApplication.PACKAGE_NAME, "OAUTH_REDIRECT_URL"));
            requestMap.put("code", userToken);
            requestMap.put("grant_type", "authorization_code");
            requestMap.put("client_id", "android");

        } catch (Exception e) {

        }

        return requestMap;
    }

    private Map<String, String> getRefreshSessionFormData(String refreshToken) {
        Map<String, String> requestMap = new HashMap<>();
        requestMap.put("client_id", "android");
        requestMap.put("grant_type", "refresh_token");
        requestMap.put("refresh_token", refreshToken);
        return requestMap;
    }

    @Override
    public GenieResponse<Map<String, Object>> createSession(String userToken) {
        GenieResponse<Map<String, Object>> genieResponse;
        try {
            Map<String, String> formData = getCreateSessionFormData(userToken);
            Map<String, Object> response = invokeAPI(formData);
            genieResponse = GenieResponseBuilder.getSuccessResponse(ServiceConstants.SUCCESS_RESPONSE);
            genieResponse.setResult(response);
        } catch (Exception e) {
            genieResponse = GenieResponseBuilder.getErrorResponse("SERVER_ERROR", e.getMessage(), KeycloakOAuthSessionService.class.getName());
        }

        return genieResponse;
    }

    @Override
    public GenieResponse<Map<String, Object>> refreshSession(String refreshToken) {
        GenieResponse<Map<String, Object>> genieResponse;
        try {
            Map<String, String> formData = getRefreshSessionFormData(refreshToken);
            Map<String, Object> response = invokeAPI(formData);
            if (response != null) {
                Session session = GsonUtil.fromMap(response, Session.class);
                session.setUserToken(parseUserTokenFromAccessToken(session.getAccessToken()));
                GenieService.getService().getAuthSession().startSession(session);
                genieResponse = GenieResponseBuilder.getSuccessResponse(ServiceConstants.SUCCESS_RESPONSE);
                genieResponse.setResult(new HashMap<>());
            } else {
                EventBus.postEvent("LOGOUT");
                genieResponse = GenieResponseBuilder.getErrorResponse("SERVER_ERROR", "SERVER_ERROR", KeycloakOAuthSessionService.class.getName());
            }
        } catch (Exception e) {
            EventBus.postEvent("LOGOUT");
            genieResponse = GenieResponseBuilder.getErrorResponse("SERVER_ERROR", e.getMessage(), KeycloakOAuthSessionService.class.getName());
        }

        return genieResponse;
    }

    public String parseUserTokenFromAccessToken(String userAccessToken) {
        String value = userAccessToken.substring(userAccessToken.indexOf("."), userAccessToken.lastIndexOf("."));
        String userToken = null;
        JSONObject jo = null;
        try {
            jo = new JSONObject(decodeBase64(value));
            userToken = jo.get("sub").toString();
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        return userToken;
    }

    private Map<String, Object> invokeAPI(Map<String, String> formData) throws IOException {
        OkHttpClient.Builder builder = new OkHttpClient.Builder();
        builder.readTimeout(10, TimeUnit.SECONDS);
        builder.connectTimeout(10, TimeUnit.SECONDS);
        OkHttpClient httpClient = builder.build();
        Context context = (Context) mAppContext.getContext();
        Request request = new Request.Builder()
                .url(BuildConfigUtil.getBuildConfigValue(SunbirdApplication.PACKAGE_NAME, "BASE_URL") + END_POINT)
                .post(createRequestBody(formData))
                .build();
        Response response = httpClient.newCall(request).execute();
        if (response.isSuccessful()) {
            Map<String, Object> responseMap = GsonUtil.fromJson(response.body().string(), Map.class);
            return responseMap;
        } else {
            return null;
        }
    }

    private RequestBody createRequestBody(Map<String, String> formData) {
        FormBody.Builder builder = new FormBody.Builder();
        Iterator<String> iterator = formData.keySet().iterator();
        while (iterator.hasNext()) {
            String key = iterator.next();
            String value = formData.get(key);
            builder.add(key, value);
        }
        return builder.build();
    }
}
