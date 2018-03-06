package org.genie;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import org.apache.cordova.CallbackContext;
import org.ekstep.genieservices.GenieService;
import org.ekstep.genieservices.commons.IResponseHandler;
import org.ekstep.genieservices.commons.bean.GenieResponse;
import org.ekstep.genieservices.commons.bean.SyncStat;
import org.ekstep.genieservices.commons.bean.telemetry.Audit;
import org.ekstep.genieservices.commons.bean.telemetry.End;
import org.ekstep.genieservices.commons.bean.telemetry.Error;
import org.ekstep.genieservices.commons.bean.telemetry.ExData;
import org.ekstep.genieservices.commons.bean.telemetry.Feedback;
import org.ekstep.genieservices.commons.bean.telemetry.Impression;
import org.ekstep.genieservices.commons.bean.telemetry.Interact;
import org.ekstep.genieservices.commons.bean.telemetry.Interrupt;
import org.ekstep.genieservices.commons.bean.telemetry.Log;
import org.ekstep.genieservices.commons.bean.telemetry.Search;
import org.ekstep.genieservices.commons.bean.telemetry.Share;
import org.ekstep.genieservices.commons.bean.telemetry.Start;
import org.ekstep.genieservices.commons.bean.telemetry.Telemetry;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONException;

/**
 * Created by souvikmondal on 8/2/18.
 */

public class TelemetryHandler {

    private static final String TYPE_SAVE_IMPRESSION = "saveImpression";
    private static final String TYPE_SAVE_AUDIT = "saveAudit";
    private static final String TYPE_SAVE_START = "saveStart";
    private static final String TYPE_SAVE_END = "saveEnd";
    private static final String TYPE_SAVE_ERROR = "saveError";
    private static final String TYPE_SAVE_EXDATA = "saveExdata";
    private static final String TYPE_SAVE_FEEDBACK = "saveFeedback";
    private static final String TYPE_SAVE_INTERACT = "saveInteract";
    private static final String TYPE_SAVE_INTERRUPT = "saveInterrupt";
    private static final String TYPE_SAVE_LOG = "saveLog";
    private static final String TYPE_SAVE_SEARCH = "saveSearch";
    private static final String TYPE_SAVE_SHARE = "saveShare";
    private static final String TYPE_SYNC = "sync";

    public static void handle(JSONArray args, final CallbackContext callbackContext) {
        try {
            String type = args.getString(0);
            if (type.equals(TYPE_SAVE_IMPRESSION)) {
                saveImpression(args);
            } else if (type.equals(TYPE_SAVE_AUDIT)) {
                saveAudit(args);
            } else if (type.equals(TYPE_SAVE_START)) {
                saveStart(args);
            } else if (type.equals(TYPE_SAVE_END)) {
                saveEnd(args);
            } else if (type.equals(TYPE_SAVE_ERROR)) {
                saveError(args);
            } else if (type.equals(TYPE_SAVE_EXDATA)) {
                saveExdata(args);
            } else if (type.equals(TYPE_SAVE_FEEDBACK)) {
                saveFeedback(args);
            } else if (type.equals(TYPE_SAVE_INTERACT)) {
                saveInteract(args);
            } else if (type.equals(TYPE_SAVE_INTERRUPT)) {
                saveInterrupt(args);
            } else if (type.equals(TYPE_SAVE_LOG)) {
                saveLog(args);
            } else if (type.equals(TYPE_SAVE_SEARCH)) {
                saveSearch(args);
            } else if (type.equals(TYPE_SAVE_SHARE)) {
                saveShare(args);
            } else if (type.equals(TYPE_SYNC)) {
                sync(callbackContext);
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private static void sync(final CallbackContext callbackContext) {
        final Gson gson = new GsonBuilder().create();

        GenieService.getAsyncService().getSyncService().sync(new IResponseHandler<SyncStat>() {
            @Override
            public void onSuccess(GenieResponse<SyncStat> genieResponse) {
                try {
                    String response = gson.toJson(genieResponse);

                    callbackContext.success(new JSONObject(response));

                } catch (JSONException e) {
                }
            }

            @Override
            public void onError(GenieResponse<SyncStat> genieResponse) {
                callbackContext.error(gson.toJson(genieResponse));
            }
        });
    }

    private static void save(Telemetry telemetry) {
        GenieService.getAsyncService().getTelemetryService().saveTelemetry(telemetry, new IResponseHandler<Void>() {
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

    private static void saveAudit(JSONArray args) throws JSONException {
        String impressionJson = args.getString(1);
        Gson gson = new GsonBuilder().create();
        Audit.Builder builder = gson.fromJson(impressionJson, Audit.Builder.class);
        save(builder.build());
    }

    private static void saveImpression(JSONArray args) throws JSONException {
        String impressionJson = args.getString(1);
        Gson gson = new GsonBuilder().create();
        Impression.Builder builder = gson.fromJson(impressionJson, Impression.Builder.class);
        save(builder.build());
    }

    private static void saveStart(JSONArray args) throws JSONException {
        String startJson = args.getString(1);
        Gson gson = new GsonBuilder().create();
        Start.Builder builder = gson.fromJson(startJson, Start.Builder.class);
        save(builder.build());
    }

    private static void saveEnd(JSONArray args) throws JSONException {
        String endJson = args.getString(1);
        Gson gson = new GsonBuilder().create();
        End.Builder builder = gson.fromJson(endJson, End.Builder.class);
        save(builder.build());
    }

    private static void saveError(JSONArray args) throws JSONException {
        String errorJson = args.getString(1);
        Gson gson = new GsonBuilder().create();
        Error.Builder builder = gson.fromJson(errorJson, Error.Builder.class);
        save(builder.build());
    }

    private static void saveExdata(JSONArray args) throws JSONException {
        String exdataJson = args.getString(1);
        Gson gson = new GsonBuilder().create();
        ExData.Builder builder = gson.fromJson(exdataJson, ExData.Builder.class);
        save(builder.build());
    }

    private static void saveFeedback(JSONArray args) throws JSONException {
        String feedbackJson = args.getString(1);
        Gson gson = new GsonBuilder().create();
        Feedback.Builder builder = gson.fromJson(feedbackJson, Feedback.Builder.class);
        save(builder.build());
    }

    private static void saveInteract(JSONArray args) throws JSONException {
        String interactJson = args.getString(1);
        Gson gson = new GsonBuilder().create();
        Interact.Builder builder = gson.fromJson(interactJson, Interact.Builder.class);
        save(builder.build());
    }

    private static void saveInterrupt(JSONArray args) throws JSONException {
        String interruptJson = args.getString(1);
        Gson gson = new GsonBuilder().create();
        Interrupt.Builder builder = gson.fromJson(interruptJson, Interrupt.Builder.class);
        save(builder.build());
    }

    private static void saveLog(JSONArray args) throws JSONException {
        String logJson = args.getString(1);
        Gson gson = new GsonBuilder().create();
        Log.Builder builder = gson.fromJson(logJson, Log.Builder.class);
        save(builder.build());
    }

    private static void saveSearch(JSONArray args) throws JSONException {
        String searchJson = args.getString(1);
        Gson gson = new GsonBuilder().create();
        Search.Builder builder = gson.fromJson(searchJson, Search.Builder.class);
        save(builder.build());
    }

    private static void saveShare(JSONArray args) throws JSONException {
        String shareJson = args.getString(1);
        Gson gson = new GsonBuilder().create();
        Share.Builder builder = gson.fromJson(shareJson, Share.Builder.class);
        save(builder.build());
    }

}
