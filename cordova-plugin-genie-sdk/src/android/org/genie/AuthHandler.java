package org.genie;

import org.apache.cordova.CallbackContext;
import org.ekstep.genieservices.GenieService;
import org.ekstep.genieservices.commons.IResponseHandler;
import org.ekstep.genieservices.commons.bean.GenieResponse;

/**
 * Created by souvikmondal on 9/2/18.
 */

public class AuthHandler {

    public static void handle(final CallbackContext callbackContext) {
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
