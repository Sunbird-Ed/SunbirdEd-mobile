package org.genie;

import org.apache.cordova.CallbackContext;
import org.ekstep.genieservices.GenieService;
import org.ekstep.genieservices.commons.IResponseHandler;
import org.ekstep.genieservices.commons.bean.GenieResponse;
import org.ekstep.genieservices.commons.bean.PageAssemble;
import org.ekstep.genieservices.commons.bean.PageAssembleCriteria;
import org.ekstep.genieservices.commons.bean.Session;
import org.ekstep.genieservices.commons.utils.GsonUtil;
import org.json.JSONArray;
import org.json.JSONException;

/**
 * Created by souvikmondal on 9/2/18.
 */

public class PageHandler {

    private static final String TYPE_GET_PAGE_ASSEMBLE = "getPageAssemble";

    public static void handle(JSONArray args, final CallbackContext callbackContext) {

        try {
            String type = args.getString(0);
            if (type.equals(TYPE_GET_PAGE_ASSEMBLE)) {
                getPageAssemble(args, callbackContext);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private static void getPageAssemble(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String requestJson = args.getString(1);
        PageAssembleCriteria criteria = GsonUtil.fromJson(requestJson, PageAssembleCriteria.class);
        GenieService.getAsyncService().getPageService().getPageAssemble(criteria, new IResponseHandler<PageAssemble>() {
            @Override
            public void onSuccess(GenieResponse<PageAssemble> genieResponse) {
                callbackContext.success(GsonUtil.toJson(genieResponse.getResult()));
            }

            @Override
            public void onError(GenieResponse<PageAssemble> genieResponse) {
                callbackContext.error(genieResponse.getError());
            }
        });
    }

}
