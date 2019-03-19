package org.genie;

import org.apache.cordova.CallbackContext;
import org.ekstep.genieservices.GenieService;
import org.ekstep.genieservices.commons.IResponseHandler;
import org.ekstep.genieservices.commons.bean.Announcement;
import org.ekstep.genieservices.commons.bean.AnnouncementDetailsRequest;
import org.ekstep.genieservices.commons.bean.AnnouncementList;
import org.ekstep.genieservices.commons.bean.AnnouncementListRequest;
import org.ekstep.genieservices.commons.bean.GenieResponse;
import org.ekstep.genieservices.commons.bean.UpdateAnnouncementStateRequest;
import org.ekstep.genieservices.commons.utils.GsonUtil;
import org.json.JSONArray;
import org.json.JSONException;

/**
 * Created by IndrajaMachani on 04/3/18.
 */

public class AnnouncementHandler {

    private static final String TYPE_GET_ANNOUNCEMENT_DETAILS = "getAnnouncementDetails";
    private static final String TYPE_GET_ANNOUNCEMENT_LIST = "getAnnouncementList";
    private static final String TYPE_UPDATE_ANNOUNCEMENT_STATE = "updateAnnouncementState";

    public static void handle(JSONArray args, final CallbackContext callbackContext) {
        try {
            String type = args.getString(0);
            if (type.equals(TYPE_GET_ANNOUNCEMENT_DETAILS)) {
                getAnnouncementDetails(args, callbackContext);
            } else if (type.equals(TYPE_GET_ANNOUNCEMENT_LIST)) {
                getAnnouncementList(args, callbackContext);
            } else if (type.equals(TYPE_UPDATE_ANNOUNCEMENT_STATE)) {
                updateAnnouncementState(args, callbackContext);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private static void getAnnouncementDetails(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        String requestJson = args.getString(1);
        AnnouncementDetailsRequest.Builder builder = GsonUtil.fromJson(requestJson,
                AnnouncementDetailsRequest.Builder.class);
        GenieService.getAsyncService().getAnnouncementService().getAnnouncementDetails(builder.build(),
                new IResponseHandler<Announcement>() {
                    @Override
                    public void onSuccess(GenieResponse<Announcement> genieResponse) {
                        callbackContext.success(GsonUtil.toJson(genieResponse.getResult()));
                    }

                    @Override
                    public void onError(GenieResponse<Announcement> genieResponse) {
                        callbackContext.error(GsonUtil.toJson(genieResponse.getError()));
                    }
                });
    }

    private static void getAnnouncementList(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String requestJson = args.getString(1);
        AnnouncementListRequest.Builder builder = GsonUtil.fromJson(requestJson,
                AnnouncementListRequest.Builder.class);

        GenieService.getAsyncService().getAnnouncementService().getAnnouncementList(builder.build(),
                new IResponseHandler<AnnouncementList>() {
                    @Override
                    public void onSuccess(GenieResponse<AnnouncementList> genieResponse) {
                        callbackContext.success(GsonUtil.toJson(genieResponse.getResult()));
                    }

                    @Override
                    public void onError(GenieResponse<AnnouncementList> genieResponse) {
                        callbackContext.error(GsonUtil.toJson(genieResponse.getError()));
                    }
                });
    }

    private static void updateAnnouncementState(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String requestJson = args.getString(1);
        UpdateAnnouncementStateRequest.Builder builder = GsonUtil.fromJson(requestJson,
                UpdateAnnouncementStateRequest.Builder.class);

        GenieService.getAsyncService().getAnnouncementService().updateAnnouncementState(builder.build(),
                new IResponseHandler<Void>() {
                    @Override
                    public void onSuccess(GenieResponse<Void> genieResponse) {
                        callbackContext.success(GsonUtil.toJson(genieResponse.getResult()));
                    }

                    @Override
                    public void onError(GenieResponse<Void> genieResponse) {
                        callbackContext.error(GsonUtil.toJson(genieResponse.getError()));
                    }
                });
    }

}