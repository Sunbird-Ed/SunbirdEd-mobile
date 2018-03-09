package org.genie;

import org.apache.cordova.CallbackContext;
import org.ekstep.genieservices.GenieService;
import org.ekstep.genieservices.commons.IResponseHandler;
import org.ekstep.genieservices.commons.bean.GenieResponse;
import org.ekstep.genieservices.commons.bean.UserProfile;
import org.ekstep.genieservices.commons.bean.UserProfileDetailsRequest;
import org.ekstep.genieservices.commons.utils.GsonUtil;
import org.json.JSONArray;
import org.json.JSONException;

/**
 * Created by souvikmondal on 6/3/18.
 */

public class ProfileHandler {

    private static final String TYPE_GET_PROFILE = "getProfileById";

    public static void handle(JSONArray args, final CallbackContext callbackContext) {
        try {
            String type = args.getString(0);
            if (type.equals(TYPE_GET_PROFILE)) {
                getProfileById(args, callbackContext);
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private static void getProfileById(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        String requestJson = args.getString(1);
        UserProfileDetailsRequest request = GsonUtil.fromJson(requestJson, UserProfileDetailsRequest.class);
        GenieService.getAsyncService().getUserProfileService().getUserProfileDetails(request, new IResponseHandler<UserProfile>() {
            @Override
            public void onSuccess(GenieResponse<UserProfile> genieResponse) {
                callbackContext.success(genieResponse.getResult().getUserProfile());
            }

            @Override
            public void onError(GenieResponse<UserProfile> genieResponse) {
                callbackContext.error(genieResponse.getError());
            }
        });
    }

}
