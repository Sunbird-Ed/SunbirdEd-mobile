package org.genie;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import org.apache.cordova.CallbackContext;
import org.ekstep.genieservices.GenieService;
import org.ekstep.genieservices.commons.IResponseHandler;
import org.ekstep.genieservices.commons.bean.ChildContentRequest;
import org.ekstep.genieservices.commons.bean.Content;
import org.ekstep.genieservices.commons.bean.ContentData;
import org.ekstep.genieservices.commons.bean.ContentDeleteRequest;
import org.ekstep.genieservices.commons.bean.ContentDeleteResponse;
import org.ekstep.genieservices.commons.bean.ContentDetailsRequest;
import org.ekstep.genieservices.commons.bean.ContentExportRequest;
import org.ekstep.genieservices.commons.bean.ContentExportResponse;
import org.ekstep.genieservices.commons.bean.ContentFeedback;
import org.ekstep.genieservices.commons.bean.ContentFilterCriteria;
import org.ekstep.genieservices.commons.bean.ContentImport;
import org.ekstep.genieservices.commons.bean.ContentImportRequest;
import org.ekstep.genieservices.commons.bean.ContentImportResponse;
import org.ekstep.genieservices.commons.bean.ContentMarkerRequest;
import org.ekstep.genieservices.commons.bean.DialCodeRequest;
import org.ekstep.genieservices.commons.bean.EcarImportRequest;
import org.ekstep.genieservices.commons.bean.FlagContentRequest;
import org.ekstep.genieservices.commons.bean.GenieResponse;
import org.ekstep.genieservices.commons.bean.SummarizerContentFilterCriteria;
import org.ekstep.genieservices.commons.bean.SunbirdContentSearchCriteria;
import org.ekstep.genieservices.commons.bean.SunbirdContentSearchResult;
import org.ekstep.genieservices.commons.bean.enums.DownloadAction;
import org.ekstep.genieservices.commons.utils.CollectionUtil;
import org.ekstep.genieservices.commons.utils.GsonUtil;
import org.ekstep.genieservices.commons.utils.StringUtil;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Type;
import java.util.List;
import java.util.Map;

/**
 * Created by souvikmondal on 9/2/18.
 */

public class ContentHandler {

    public static final String DEFAULT_CHANNEL_PREF_KEY = "default_channel";
    private static final String TYPE_GET_CONTENT_DETAIL = "getContentDetail";
    private static final String TYPE_IMPORT_ECAR = "importEcar";
    private static final String TYPE_IMPORT_CONTENT = "importContent";
    private static final String TYPE_SEARCH_CONTENT = "searchContent";
    private static final String TYPE_GET_ALL_LOCAL_CONTENTS = "getAllLocalContents";
    private static final String TYPE_GET_CHILD_CONTENTS = "getChildContents";
    private static final String TYPE_GET_IMPORT_STATUS = "getImportStatus";
    private static final String TYPE_CANCEL_DOWNLOAD = "cancelDownload";
    private static final String TYPE_EXPORT_CONTENT = "exportContent";
    private static final String TYPE_SET_DOWNLOAD_ACTION = "setDownloadAction";
    private static final String TYPE_GET_DOWNLOAD_STATE = "getDownloadState";
    private static final String TYPE_DELETE_CONTENTS = "deleteContent";
    private static final String TYPE_GET_SEARCH_CRITERIA_FROM_REQUEST = "getSearchCriteriaFromRequest";
    private static final String TYPE_SEND_FEEDBACK = "sendFeedback";
    private static final String TYPE_FLAG_CONTENT = "flagContent";
    private static final String TYPE_GET_LOCAL_CONTENTS = "getLocalContents";
    private static final String TYPE_SET_CONTENT_MARKER = "setContentMarker";

    public static void handle(JSONArray args, final CallbackContext callbackContext) {
        try {
            String type = args.getString(0);
            if (type.equals(TYPE_GET_CONTENT_DETAIL)) {
                getContentDetail(args, callbackContext);
            } else if (type.equals(TYPE_IMPORT_ECAR)) {
                importEcar(args, callbackContext);
            } else if (type.equals(TYPE_IMPORT_CONTENT)) {
                importContent(args, callbackContext);
            } else if (type.equals(TYPE_SEARCH_CONTENT)) {
                searchContent(args, callbackContext);
            } else if (type.equals(TYPE_GET_ALL_LOCAL_CONTENTS)) {
                getAllLocalContents(args, callbackContext);
            } else if (type.equals(TYPE_GET_CHILD_CONTENTS)) {
                getChildContents(args, callbackContext);
            } else if (type.equals(TYPE_DELETE_CONTENTS)) {
                deleteContent(args, callbackContext);
            } else if (type.equals(TYPE_GET_IMPORT_STATUS)) {
                getImportStatus(args, callbackContext);
            } else if (type.equals(TYPE_CANCEL_DOWNLOAD)) {
                cancelDownload(args, callbackContext);
            } else if (type.equals(TYPE_EXPORT_CONTENT)) {
                exportContent(args, callbackContext);
            } else if (type.equals(TYPE_SET_DOWNLOAD_ACTION)) {
                setDownloadAction(args, callbackContext);
            } else if (type.equals(TYPE_GET_DOWNLOAD_STATE)) {
                getDownloadState(callbackContext);
            } else if (type.equals(TYPE_GET_SEARCH_CRITERIA_FROM_REQUEST)) {
                getSearchCriteriaFromRequest(args, callbackContext);
            } else if (type.equals(TYPE_SEND_FEEDBACK)) {
                sendFeedback(args, callbackContext);
            } else if (type.equals(TYPE_FLAG_CONTENT)) {
                flagContent(args, callbackContext);
            } else if (type.equals(TYPE_GET_LOCAL_CONTENTS)) {
                getLocalContents(args, callbackContext);
            } else if (type.equals(TYPE_SET_CONTENT_MARKER)) {
                setContentMarker(args, callbackContext);
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private static void getContentDetail(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String requestJson = args.getString(1);
        final Gson gson = new GsonBuilder().create();
        ContentDetailsRequest request = gson.fromJson(requestJson, ContentDetailsRequest.class);
        GenieService.getAsyncService().getContentService().getContentDetails(request, new IResponseHandler<Content>() {
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

    private static void importEcar(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String requestJson = args.getString(1);
        final Gson gson = new GsonBuilder().create();

        EcarImportRequest.Builder builder = gson.fromJson(requestJson, EcarImportRequest.Builder.class);

        GenieService.getAsyncService().getContentService().importEcar(builder.build(),
                new IResponseHandler<List<ContentImportResponse>>() {
                    @Override
                    public void onSuccess(GenieResponse<List<ContentImportResponse>> genieResponse) {
                        callbackContext.success(gson.toJson(genieResponse));
                    }

                    @Override
                    public void onError(GenieResponse<List<ContentImportResponse>> genieResponse) {
                        callbackContext.error(gson.toJson(genieResponse));
                    }
                });
    }

    private static void importContent(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String requestJson = args.getString(1);
        final Gson gson = new GsonBuilder().create();

        JSONObject contentImportRequestBuilder = new JSONObject(requestJson);
        Type contentImportMapType = new TypeToken<Map<String, ContentImport>>() {
        }.getType();

        Map<String, ContentImport> contentImportMap = gson
                .fromJson(contentImportRequestBuilder.optString("contentImportMap"), contentImportMapType);

        ContentImportRequest.Builder builder = new ContentImportRequest.Builder();

        for (String key : contentImportMap.keySet()) {
            builder.add(contentImportMap.get(key));
        }

        GenieService.getAsyncService().getContentService().importContent(builder.build(),
                new IResponseHandler<List<ContentImportResponse>>() {
                    @Override
                    public void onSuccess(GenieResponse<List<ContentImportResponse>> genieResponse) {
                        callbackContext.success(gson.toJson(genieResponse));
                    }

                    @Override
                    public void onError(GenieResponse<List<ContentImportResponse>> genieResponse) {
                        callbackContext.error(gson.toJson(genieResponse));
                    }
                });
    }

    private static void searchContent(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String requestJson = args.getString(1);
        final boolean isFilterApplied = args.getBoolean(2);
        final boolean isDialCodeSearch = args.getBoolean(3);
        final boolean isGuestUser = args.getBoolean(4);

        SunbirdContentSearchCriteria criteria;
        if (isFilterApplied) {
            SunbirdContentSearchCriteria.FilterBuilder builder = GsonUtil.fromJson(requestJson,
                    SunbirdContentSearchCriteria.FilterBuilder.class);
            criteria = builder.build();
        } else {
            SunbirdContentSearchCriteria.SearchBuilder builder = GsonUtil.fromJson(requestJson,
                    SunbirdContentSearchCriteria.SearchBuilder.class);
            criteria = builder.build();
        }

        GenieService.getAsyncService().getContentService().searchSunbirdContent(criteria,
                new IResponseHandler<SunbirdContentSearchResult>() {
                    @Override
                    public void onSuccess(GenieResponse<SunbirdContentSearchResult> genieResponse) {
                        String defaultChannel = GenieService.getService().getKeyStore().getString(DEFAULT_CHANNEL_PREF_KEY, null);
                        if (StringUtil.isNullOrEmpty(defaultChannel) && isDialCodeSearch && isGuestUser) {
                            if (genieResponse.getResult() != null) {
                                List<ContentData> contentDataList = genieResponse.getResult().getContentDataList();
                                if (!CollectionUtil.isNullOrEmpty(contentDataList)) {
                                    ContentData contentData = contentDataList.get(0);
                                    String channel = contentData.getChannel();
                                    if (!StringUtil.isNullOrEmpty(channel)) {
                                        GenieService.getService().getKeyStore().putString("channelId", channel);
                                        GenieService.getService().getKeyStore().putString(DEFAULT_CHANNEL_PREF_KEY, channel);
                                        SDKParams.setParams();
                                    } else {
                                        DialCodeRequest dialCodeRequest = new DialCodeRequest.Builder().
                                                dialCode(criteria.getDialCodes()[0]).build();
                                        getDialCode(dialCodeRequest);
                                    }

                                    callbackContext.success(GsonUtil.toJson(genieResponse));
                                } else {
                                    DialCodeRequest dialCodeRequest = new DialCodeRequest.Builder().
                                            dialCode(criteria.getDialCodes()[0]).build();
                                    getDialCode(dialCodeRequest);
                                    callbackContext.success(GsonUtil.toJson(genieResponse));
                                }
                            } else {
                                callbackContext.success(GsonUtil.toJson(genieResponse));
                            }

                        } else {
                            callbackContext.success(GsonUtil.toJson(genieResponse));
                        }
                    }

                    @Override
                    public void onError(GenieResponse<SunbirdContentSearchResult> genieResponse) {
                        callbackContext.error(GsonUtil.toJson(genieResponse));
                    }
                });
    }

    private static void getDialCode(DialCodeRequest dialCodeRequest) {
        GenieService.getAsyncService().getDialCodeService().getDialCode(dialCodeRequest, new IResponseHandler<Map<String, Object>>() {
            @Override
            public void onSuccess(GenieResponse<Map<String, Object>> genieResponse) {
                Map<String, Object> result = genieResponse.getResult();
                if (result != null && result.get("dialcode") != null) {
                    Map<String, Object> dialcode = (Map<String, Object>) result.get("dialcode");
                    String channel = String.valueOf(dialcode.get("channel"));
                    if (!StringUtil.isNullOrEmpty(channel)) {
                        GenieService.getService().getKeyStore().putString("channelId", channel);
                        GenieService.getService().getKeyStore().putString(DEFAULT_CHANNEL_PREF_KEY, channel);
                        SDKParams.setParams();
                    }
                }
            }

            @Override
            public void onError(GenieResponse<Map<String, Object>> genieResponse) {

            }
        });
    }


    private static void getAllLocalContents(JSONArray args, final CallbackContext callbackContext)
            throws JSONException {
        final String requestJson = args.getString(1);

        ContentFilterCriteria.Builder builder = GsonUtil.fromJson(requestJson, ContentFilterCriteria.Builder.class);

        GenieService.getAsyncService().getContentService().getAllLocalContent(builder.build(),
                new IResponseHandler<List<Content>>() {
                    @Override
                    public void onSuccess(GenieResponse<List<Content>> genieResponse) {
                        callbackContext.success(GsonUtil.toJson(genieResponse));
                    }

                    @Override
                    public void onError(GenieResponse<List<Content>> genieResponse) {
                        callbackContext.error(GsonUtil.toJson(genieResponse));
                    }
                });
    }

    private static void getChildContents(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String requestJson = args.getString(1);

        ChildContentRequest.Builder builder = GsonUtil.fromJson(requestJson, ChildContentRequest.Builder.class);

        GenieService.getAsyncService().getContentService().getChildContents(builder.build(),
                new IResponseHandler<Content>() {
                    @Override
                    public void onSuccess(GenieResponse<Content> genieResponse) {
                        callbackContext.success(GsonUtil.toJson(genieResponse));
                    }

                    @Override
                    public void onError(GenieResponse<Content> genieResponse) {
                        callbackContext.error(GsonUtil.toJson(genieResponse));
                    }
                });
    }

    private static void deleteContent(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String requestJson = args.getString(1);

        ContentDeleteRequest.Builder builder = GsonUtil.fromJson(requestJson, ContentDeleteRequest.Builder.class);

        GenieService.getAsyncService().getContentService().deleteContent(builder.build(),
                new IResponseHandler<List<ContentDeleteResponse>>() {
                    @Override
                    public void onSuccess(GenieResponse<List<ContentDeleteResponse>> genieResponse) {
                        callbackContext.success(GsonUtil.toJson(genieResponse));
                    }

                    @Override
                    public void onError(GenieResponse<List<ContentDeleteResponse>> genieResponse) {
                        callbackContext.error(GsonUtil.toJson(genieResponse));
                    }
                });
    }

    private static void getImportStatus(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String requestJson = args.getString(1);

        List<String> contentIdList = GsonUtil.fromJson(requestJson, List.class);

        GenieService.getAsyncService().getContentService().getImportStatus(contentIdList,
                new IResponseHandler<List<ContentImportResponse>>() {
                    @Override
                    public void onSuccess(GenieResponse<List<ContentImportResponse>> genieResponse) {
                        callbackContext.success(GsonUtil.toJson(genieResponse));
                    }

                    @Override
                    public void onError(GenieResponse<List<ContentImportResponse>> genieResponse) {
                        callbackContext.error(GsonUtil.toJson(genieResponse));
                    }
                });
    }

    private static void cancelDownload(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String requestJson = args.getString(1);

        String contentId = GsonUtil.fromJson(requestJson, String.class);

        GenieService.getAsyncService().getContentService().cancelDownload(contentId, new IResponseHandler<Void>() {
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

    private static void exportContent(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String requestJson = args.getString(1);

        ContentExportRequest.Builder builder = GsonUtil.fromJson(requestJson, ContentExportRequest.Builder.class);

        GenieService.getAsyncService().getContentService().exportContent(builder.build(),
                new IResponseHandler<ContentExportResponse>() {
                    @Override
                    public void onSuccess(GenieResponse<ContentExportResponse> genieResponse) {
                        callbackContext.success(GsonUtil.toJson(genieResponse));
                    }

                    @Override
                    public void onError(GenieResponse<ContentExportResponse> genieResponse) {
                        callbackContext.error(GsonUtil.toJson(genieResponse));
                    }
                });
    }

    private static void setDownloadAction(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String requestJson = args.getString(1);

        DownloadAction downloadAction = GsonUtil.fromJson(requestJson, DownloadAction.class);

        GenieService.getAsyncService().getContentService().setDownloadAction(downloadAction,
                new IResponseHandler<Void>() {
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

    private static void getDownloadState(final CallbackContext callbackContext) {
        GenieService.getAsyncService().getContentService().getDownloadState(new IResponseHandler<DownloadAction>() {
            @Override
            public void onSuccess(GenieResponse<DownloadAction> genieResponse) {
                callbackContext.success(GsonUtil.toJson(genieResponse));
            }

            @Override
            public void onError(GenieResponse<DownloadAction> genieResponse) {
                callbackContext.error(GsonUtil.toJson(genieResponse));
            }
        });
    }

    private static void getSearchCriteriaFromRequest(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String requestJson = args.getString(1);

        Map<String, Object> requestMap = null;
        if (!StringUtil.isNullOrEmpty(requestJson) && !requestJson.equals("null")) {
            requestMap = GsonUtil.fromJson((requestJson).replace("\\", ""), Map.class);
        }

        Map<String, Object> searchMap = null;
        if (requestMap != null && !requestMap.isEmpty()) {
            searchMap = (Map<String, Object>) requestMap.get("request");
        }

        SunbirdContentSearchCriteria searchCriteria = org.ekstep.genieservices.content.ContentHandler.getSearchCriteria(searchMap);
        if (searchCriteria != null) {
            callbackContext.success(GsonUtil.toJson(searchCriteria));
        } else {
            callbackContext.error("No search criteria.");
        }
    }

    private static void sendFeedback(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String requestJson = args.getString(1);

        ContentFeedback contentFeedback = GsonUtil.fromJson(requestJson, ContentFeedback.class);

        GenieService.getAsyncService().getContentService().sendFeedback(contentFeedback, new IResponseHandler<Void>() {
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

    private static void flagContent(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String requestJson = args.getString(1);

        FlagContentRequest.Builder builder = GsonUtil.fromJson(requestJson, FlagContentRequest.Builder.class);

        GenieService.getAsyncService().getContentService().flagContent(builder.build(),
                new IResponseHandler<Void>() {
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

    private static void getLocalContents(JSONArray args, final CallbackContext callbackContext)
            throws JSONException {
        final String requestJson = args.getString(1);

        SummarizerContentFilterCriteria.Builder builder = GsonUtil.fromJson(requestJson, SummarizerContentFilterCriteria.Builder.class);

        GenieService.getAsyncService().getContentService().getLocalContents(builder.build(),
                new IResponseHandler<List<Content>>() {
                    @Override
                    public void onSuccess(GenieResponse<List<Content>> genieResponse) {
                        callbackContext.success(GsonUtil.toJson(genieResponse));
                    }

                    @Override
                    public void onError(GenieResponse<List<Content>> genieResponse) {
                        callbackContext.error(GsonUtil.toJson(genieResponse));
                    }
                });
    }

    private static void setContentMarker(JSONArray args, CallbackContext callbackContext) throws JSONException {
        final String requestJson = args.getString(1);

        ContentMarkerRequest.Builder builder = GsonUtil.fromJson(requestJson, ContentMarkerRequest.Builder.class);

        GenieService.getAsyncService().getContentService().setContentMarker(builder.build(), new IResponseHandler<Void>() {
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

}
