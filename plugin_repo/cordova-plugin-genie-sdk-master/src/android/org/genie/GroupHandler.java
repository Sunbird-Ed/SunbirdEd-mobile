package org.genie;

import org.apache.cordova.CallbackContext;
import org.ekstep.genieservices.GenieService;
import org.ekstep.genieservices.commons.IResponseHandler;
import org.ekstep.genieservices.commons.bean.AddUpdateProfilesRequest;
import org.ekstep.genieservices.commons.bean.GenieResponse;
import org.ekstep.genieservices.commons.bean.Group;
import org.ekstep.genieservices.commons.bean.GroupRequest;
import org.ekstep.genieservices.commons.utils.GsonUtil;
import org.json.JSONArray;
import org.json.JSONException;

import java.util.List;

public class GroupHandler {

    private static final String TYPE_CREATE_GROUP = "createGroup";
    private static final String TYPE_UPDATE_GROUP = "updateGroup";
    private static final String TYPE_GET_ALL_GROUP = "getAllGroup";
    private static final String TYPE_DELETE_GROUP = "deleteGroup";
    private static final String TYPE_SET_CURRENT_GROUP = "setCurrentGroup";
    private static final String TYPE_GET_CURRENT_GROUP = "getCurrentGroup";
    private static final String TYPE_ADD_UPDATE_PROFILES_TO_GROUP = "addUpdateProfilesToGroup";

    public static void handle(JSONArray args, CallbackContext callbackContext) {
        try {
            String type = args.getString(0);

            switch (type) {
                case TYPE_CREATE_GROUP:
                    createGroup(args, callbackContext);
                    break;

                case TYPE_UPDATE_GROUP:
                    updateGroup(args, callbackContext);
                    break;

                case TYPE_DELETE_GROUP:
                    deleteGroup(args, callbackContext);
                    break;

                case TYPE_GET_ALL_GROUP:
                    getAllGroup(args, callbackContext);
                    break;

                case TYPE_SET_CURRENT_GROUP:
                    setCurrentGroup(args, callbackContext);
                    break;
                case TYPE_GET_CURRENT_GROUP:
                    getCurrentGroup(args, callbackContext);
                    break;

                case TYPE_ADD_UPDATE_PROFILES_TO_GROUP:
                    addUpdateProfilesToGroup(args, callbackContext);
                    break;
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private static void addUpdateProfilesToGroup(JSONArray args, CallbackContext callbackContext) throws JSONException {
        String requestGson = args.getString(1);
        AddUpdateProfilesRequest addUpdateProfilesRequest = GsonUtil.fromJson(requestGson, AddUpdateProfilesRequest.class);
        GenieService.getAsyncService().getGroupService().addUpdateProfilesToGroup(addUpdateProfilesRequest, new IResponseHandler<Void>() {
            @Override
            public void onSuccess(GenieResponse<Void> genieResponse) {
                callbackContext.success(GsonUtil.toJson(genieResponse));
            }

            @Override
            public void onError(GenieResponse<Void> genieResponse) {
                callbackContext.error(GsonUtil.toJson(genieResponse));
            }
        });

    }

    private static void createGroup(JSONArray args, final CallbackContext callbackContext)
            throws JSONException {
        String requestGson = args.getString(1);
        Group group = GsonUtil.fromJson(requestGson, Group.class);
        GenieService.getAsyncService().getGroupService().createGroup(group, new IResponseHandler<Group>() {
            @Override
            public void onSuccess(GenieResponse<Group> genieResponse) {
                callbackContext.success(GsonUtil.toJson(genieResponse));
            }

            @Override
            public void onError(GenieResponse<Group> genieResponse) {
                callbackContext.error(GsonUtil.toJson(genieResponse));
            }
        });
    }

    private static void updateGroup(JSONArray args, CallbackContext callbackContext)
            throws JSONException {
        String requestGson = args.getString(1);
        Group group = GsonUtil.fromJson(requestGson, Group.class);
        GenieService.getAsyncService().getGroupService().updateGroup(group, new IResponseHandler<Group>() {
            @Override
            public void onSuccess(GenieResponse<Group> genieResponse) {
                callbackContext.success(GsonUtil.toJson(genieResponse));
            }

            @Override
            public void onError(GenieResponse<Group> genieResponse) {
                callbackContext.error(GsonUtil.toJson(genieResponse));
            }
        });
    }

    private static void deleteGroup(JSONArray args, CallbackContext callbackContext)
            throws JSONException {
        String gid = args.getString(1);
        GenieService.getAsyncService().getGroupService().deleteGroup(gid, new IResponseHandler<Void>() {
            @Override
            public void onSuccess(GenieResponse<Void> genieResponse) {
                callbackContext.success(GsonUtil.toJson(genieResponse));
            }

            @Override
            public void onError(GenieResponse<Void> genieResponse) {
                callbackContext.error(GsonUtil.toJson(genieResponse));
            }
        });
    }

    private static void getAllGroup(JSONArray args, CallbackContext callbackContext)
            throws JSONException {
        String requestGson = args.getString(1);
        GroupRequest groupRequest = GsonUtil.fromJson(requestGson, GroupRequest.class);
        GenieService.getAsyncService().getGroupService().getAllGroup(groupRequest, new IResponseHandler<List<Group>>() {
            @Override
            public void onSuccess(GenieResponse<List<Group>> genieResponse) {
                callbackContext.success(GsonUtil.toJson(genieResponse));
            }

            @Override
            public void onError(GenieResponse<List<Group>> genieResponse) {
                callbackContext.error(GsonUtil.toJson(genieResponse));
            }
        });
    }


    private static void setCurrentGroup(JSONArray args, CallbackContext callbackContext)
            throws JSONException {
        String groupId = args.getString(1);
        GenieService.getAsyncService().getGroupService()
                .setCurrentGroup(groupId.equalsIgnoreCase("null") ? null : groupId, new IResponseHandler<Void>() {
                    @Override
                    public void onSuccess(GenieResponse<Void> genieResponse) {
                        callbackContext.success(GsonUtil.toJson(genieResponse));
                    }

                    @Override
                    public void onError(GenieResponse<Void> genieResponse) {
                        callbackContext.error(GsonUtil.toJson(genieResponse));
                    }
                });

    }


    private static void getCurrentGroup(JSONArray args, CallbackContext callbackContext)
            throws JSONException {
        GenieService.getAsyncService().getGroupService()
                .getCurrentGroup(new IResponseHandler<Group>() {
                    @Override
                    public void onSuccess(GenieResponse<Group> genieResponse) {
                        callbackContext.success(GsonUtil.toJson(genieResponse));
                    }

                    @Override
                    public void onError(GenieResponse<Group> genieResponse) {
                        callbackContext.error(GsonUtil.toJson(genieResponse));
                    }
                });
    }


}