package org.genie;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import org.apache.cordova.CallbackContext;
import org.ekstep.genieservices.GenieService;
import org.ekstep.genieservices.commons.IResponseHandler;
import org.ekstep.genieservices.commons.bean.Content;
import org.ekstep.genieservices.commons.bean.ContentDetailsRequest;
import org.ekstep.genieservices.commons.bean.GenieResponse;
import org.json.JSONArray;
import org.json.JSONException;

/**
 * Created by souvikmondal on 9/2/18.
 */

public class ContentHandler {

    private static final String TYPE_GET_CONTENT_DETAIL = "getContentDetail";

    public static void handle(JSONArray args, final CallbackContext callbackContext) {
        try {
            String type = args.getString(0);
            if (type.equals(TYPE_GET_CONTENT_DETAIL)) {
                getContentDetail(args, callbackContext);
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private static void getContentDetail(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String requestJson = args.getString(1);
        final Gson gson = new GsonBuilder().create();
        ContentDetailsRequest request =
                gson.fromJson(requestJson, ContentDetailsRequest.class);
        GenieService.getAsyncService().getContentService().getContentDetails(request,
                new IResponseHandler<Content>() {
            @Override
            public void onSuccess(GenieResponse<Content> genieResponse) {
                callbackContext.success(gson.toJson(genieResponse));
            }

            @Override
            public void onError(GenieResponse<Content> genieResponse) {
                callbackContext.error(gson.toJson(genieResponse));

            }
        });
    }
}

