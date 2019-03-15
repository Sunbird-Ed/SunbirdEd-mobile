package org.genie;

import android.content.pm.PackageManager;
import android.util.SparseArray;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.ekstep.genieservices.commons.GenieResponseBuilder;
import org.ekstep.genieservices.commons.bean.GenieResponse;
import org.ekstep.genieservices.commons.utils.GsonUtil;
import org.json.JSONArray;
import org.json.JSONException;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

/**
 * @author vinayagasundar
 */

public class PermissionHandler {

    private static final String TYPE_HAS_PERMISSION = "hasPermission";
    private static final String TYPE_REQUEST_PERMISSION = "requestPermission";


    private static final SparseArray<CallbackContext> sPermissionCallback = new SparseArray<>();

    public static void handle(CordovaPlugin plugin,
                              JSONArray args, CallbackContext callbackContext) {

        String action;
        try {
            action = args.getString(0);
            JSONArray permissionJSONArray = new JSONArray(args.getString(1));

            if (permissionJSONArray.length() > 0) {

                String[] permissionArray = new String[permissionJSONArray.length()];
                for (int index = 0; index < permissionJSONArray.length(); index++) {
                    permissionArray[index] = permissionJSONArray.getString(index);
                }


                switch (action) {
                    case TYPE_HAS_PERMISSION:
                        checkPermission(plugin, callbackContext, permissionArray);
                        break;

                    case TYPE_REQUEST_PERMISSION:
                        requestPermission(plugin, callbackContext, permissionArray);
                        break;
                }
            }

        } catch (JSONException e) {
            callbackContext.error(GsonUtil.toJson(GenieResponseBuilder
                    .getErrorResponse("error", e.toString(), "PermissionHandler")));
        }
    }

    private static void requestPermission(CordovaPlugin plugin,
                                          CallbackContext callbackContext,
                                          String[] permissionArray) {
        Random random = new Random();
        int requestId = random.nextInt(1000);
        sPermissionCallback.put(requestId, callbackContext);
        plugin.cordova.requestPermissions(plugin, requestId, permissionArray);
    }

    private static void checkPermission(CordovaPlugin plugin,
                                        CallbackContext callbackContext,
                                        String[] permissionArray) throws JSONException {

        Map<String, Boolean> responseMap = new HashMap<>();

        for (String permission : permissionArray) {
             responseMap.put(permission, plugin.cordova.hasPermission(permission));
        }

        GenieResponse<Map> response = GenieResponseBuilder
                .getSuccessResponse("success", Map.class);
        response.setResult(responseMap);
        callbackContext.success(GsonUtil.toJson(response));
    }


    public static void onPermissionResult(int requestCode, String[] permissions,
                                          int[] grantResults) {
        if (grantResults.length > 0) {
            if (sPermissionCallback.get(requestCode, null) != null) {
                Map<String, Boolean> responseMap = new HashMap<>();


                for (int index = 0; index < permissions.length; index++) {
                    responseMap.put(permissions[index],
                            grantResults[index] == PackageManager.PERMISSION_GRANTED);
                }

                GenieResponse<Map> response = GenieResponseBuilder
                        .getSuccessResponse("success", Map.class);
                response.setResult(responseMap);

                sPermissionCallback.get(requestCode).success(GsonUtil.toJson(response));
                sPermissionCallback.remove(requestCode);
            }
        }
    }
}
