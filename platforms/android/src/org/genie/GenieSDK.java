package org.genie;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.ekstep.genieservices.GenieService;
import org.ekstep.genieservices.commons.IResponseHandler;
import org.ekstep.genieservices.commons.bean.GenieResponse;
import org.ekstep.genieservices.commons.bean.SyncStat;
import org.ekstep.genieservices.commons.bean.telemetry.Impression;
import org.json.JSONArray;
import org.json.JSONException;

/**
 * Created by souvikmondal on 8/1/18.
 */

public class GenieSDK extends CordovaPlugin {

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        GenieService.init(cordova.getActivity(), "org.sunbird.app");
    }

    @Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
        if(action.equals("saveImpresseionTelemetry")) {

            System.out.println("saveImpresseionTelemetry::native");

            //String type, String subType, String pageId, List<CorrelationData> cdata
            String type = args.getString(0);
            String subType = args.getString(1);
            String pageId = args.getString(2);
//            JSONArray cdataarray = args.getJSONArray(3);

            Impression impression = new Impression.Builder().type(type).pageId(pageId).build();
            GenieService.getAsyncService().getTelemetryService().saveTelemetry(impression, new IResponseHandler<Void>() {
                @Override
                public void onSuccess(GenieResponse<Void> genieResponse) {
                    //ignore
                }

                @Override
                public void onError(GenieResponse<Void> genieResponse) {
                    //ignore
                }
            });

        } else if (action.equals("syncTelemetry")) {
            System.out.println("syncTelemetry::native");

            GenieService.getAsyncService().getSyncService().sync(new IResponseHandler<SyncStat>() {
                @Override
                public void onSuccess(GenieResponse<SyncStat> genieResponse) {
                    //ignore
                }

                @Override
                public void onError(GenieResponse<SyncStat> genieResponse) {
                    //ignore
                }
            });
        }
        return true;
    }
}
