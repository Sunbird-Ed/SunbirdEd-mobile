package org.genie;

import org.apache.cordova.CallbackContext;
import org.ekstep.genieservices.GenieService;
import org.ekstep.genieservices.commons.IResponseHandler;
import org.ekstep.genieservices.commons.bean.FormRequest;
import org.ekstep.genieservices.commons.bean.GenieResponse;
import org.ekstep.genieservices.commons.utils.GsonUtil;
import org.json.JSONArray;
import org.json.JSONException;

import java.util.Map;

/**
 * Created by swayangjit on 29/5/18.
 */
public class FormHandler {

    private static final String TYPE_GET_FORM = "getForm";

    public static void handle(JSONArray args, final CallbackContext callbackContext) {
        try {
            String type = args.getString(0);

            if (type.equals(TYPE_GET_FORM)) {
                getForm(args, callbackContext);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private static void getForm(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String requestJson = args.getString(1);

        FormRequest.Builder formRequest = GsonUtil.fromJson(requestJson, FormRequest.Builder.class);
        FormRequest request = formRequest.build();
        formRequest.fromFilePath(Constants.DEFAULT_ASSET_PATH + request.getFilePath());

        GenieService.getAsyncService().getFormService().getForm(formRequest.build(),
                new IResponseHandler<Map<String, Object>>() {
                    @Override
                    public void onSuccess(GenieResponse<Map<String, Object>> genieResponse) {
                        callbackContext.success(GsonUtil.toJson(genieResponse));
                    }

                    @Override
                    public void onError(GenieResponse<Map<String, Object>> genieResponse) {
                        callbackContext.error(GsonUtil.toJson(genieResponse));
                    }
                });
    }
}
