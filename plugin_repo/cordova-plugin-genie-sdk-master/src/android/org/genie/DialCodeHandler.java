package org.genie;

import org.apache.cordova.CallbackContext;
import org.ekstep.genieservices.GenieService;
import org.ekstep.genieservices.commons.bean.DialCodeRequest;
import org.ekstep.genieservices.commons.IResponseHandler;
import org.ekstep.genieservices.commons.bean.GenieResponse;
import org.ekstep.genieservices.commons.utils.GsonUtil;
import org.json.JSONArray;
import org.json.JSONException;

import java.util.Map;

/**
 * Created by swayangjit on 02/7/18.
 */
public class DialCodeHandler {

    private static final String TYPE_GET_DIALCODE= "getDialCode";

    public static void handle(JSONArray args, final CallbackContext callbackContext) {
        try {
            String type = args.getString(0);

            if (type.equals(TYPE_GET_DIALCODE)) {
                getDialCode(args, callbackContext);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private static void getDialCode(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String requestJson = args.getString(1);

        DialCodeRequest.Builder dialCodeRequest = GsonUtil.fromJson(requestJson, DialCodeRequest.Builder.class);

        GenieService.getAsyncService().getDialCodeService().getDialCode(dialCodeRequest.build(), new IResponseHandler<Map<String,Object>>() {
            @Override
            public void onSuccess(GenieResponse<Map<String,Object>> genieResponse) {
                callbackContext.success(GsonUtil.toJson(genieResponse.getResult()));
            }

            @Override
            public void onError(GenieResponse<Map<String,Object>> genieResponse) {
                callbackContext.error(GsonUtil.toJson(genieResponse));
            }
        });
    }
}
