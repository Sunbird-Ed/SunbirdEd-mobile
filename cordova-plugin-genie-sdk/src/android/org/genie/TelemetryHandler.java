package org.genie;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import org.ekstep.genieservices.GenieService;
import org.ekstep.genieservices.commons.IResponseHandler;
import org.ekstep.genieservices.commons.bean.GenieResponse;
import org.ekstep.genieservices.commons.bean.SyncStat;
import org.ekstep.genieservices.commons.bean.telemetry.Impression;
import org.json.JSONArray;
import org.json.JSONException;

/**
 * Created by souvikmondal on 8/2/18.
 */

public class TelemetryHandler {

    private static final String TYPE_SAVE_IMPRESSION = "saveImpression";
    private static final String TYPE_SYNC = "sync";

    public static void handle(JSONArray args) {
        try {
            String type = args.getString(0);
            if (type.equals(TYPE_SAVE_IMPRESSION)) {
                saveImpression(args);
            } else if (type.equals(TYPE_SYNC)) {
                sync();
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private static void sync() {
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

    private static void saveImpression(JSONArray args) throws JSONException {
        String impressionJson = args.getString(1);
        Gson gson = new GsonBuilder().create();
        Impression.Builder builder = gson.fromJson(impressionJson, Impression.Builder.class);
        GenieService.getAsyncService().getTelemetryService().saveTelemetry(builder.build(), new IResponseHandler<Void>() {
            @Override
            public void onSuccess(GenieResponse<Void> genieResponse) {
                //ignore
            }

            @Override
            public void onError(GenieResponse<Void> genieResponse) {
                //ignore
            }
        });
    }

}
