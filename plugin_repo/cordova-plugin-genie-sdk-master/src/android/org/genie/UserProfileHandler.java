package org.genie;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import org.apache.cordova.CallbackContext;
import org.ekstep.genieservices.GenieService;
import org.ekstep.genieservices.commons.IResponseHandler;
import org.ekstep.genieservices.commons.bean.AcceptTermsAndConditionsRequest;
import org.ekstep.genieservices.commons.bean.EndorseOrAddSkillRequest;
import org.ekstep.genieservices.commons.bean.FileUploadResult;
import org.ekstep.genieservices.commons.bean.GenerateOTPRequest;
import org.ekstep.genieservices.commons.bean.GenieResponse;
import org.ekstep.genieservices.commons.bean.LocationSearchCriteria;
import org.ekstep.genieservices.commons.bean.LocationSearchResult;
import org.ekstep.genieservices.commons.bean.ProfileVisibilityRequest;
import org.ekstep.genieservices.commons.bean.TenantInfo;
import org.ekstep.genieservices.commons.bean.TenantInfoRequest;
import org.ekstep.genieservices.commons.bean.UpdateUserInfoRequest;
import org.ekstep.genieservices.commons.bean.UploadFileRequest;
import org.ekstep.genieservices.commons.bean.UserExistRequest;
import org.ekstep.genieservices.commons.bean.UserExistResponse;
import org.ekstep.genieservices.commons.bean.UserProfile;
import org.ekstep.genieservices.commons.bean.UserProfileDetailsRequest;
import org.ekstep.genieservices.commons.bean.UserProfileSkill;
import org.ekstep.genieservices.commons.bean.UserProfileSkillsRequest;
import org.ekstep.genieservices.commons.bean.UserSearchCriteria;
import org.ekstep.genieservices.commons.bean.UserSearchResult;
import org.ekstep.genieservices.commons.bean.VerifyOTPRequest;
import org.ekstep.genieservices.commons.utils.GsonUtil;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by IndrajaMachani on 19/3/18.
 */

public class UserProfileHandler {

    private static final String TYPE_GET_USER_PROFILE_DETAILS = "getUserProfileDetails";
    private static final String TYPE_CREATE_PROFILE = "createProfile";
    private static final String TYPE_GET_TENANT_INFO = "getTenantInfo";
    private static final String TYPE_SEARCH_USER = "searchUser";
    private static final String TYPE_GET_SKILLS = "getSkills";
    private static final String TYPE_ENDORSE_OR_ADD_SKILL = "endorseOrAddSkill";
    private static final String TYPE_SET_PROFILE_VISIBILITY = "setProfileVisibility";
    private static final String TYPE_UPLOAD_FILE = "uploadFile";
    private static final String TYPE_UPDATE_USER_INFO = "updateUserInfo";
    private static final String TYPE_ACCEPT_TERMS_AND_CONDITIONS = "acceptTermsAndConditions";
    private static final String TYPE_IS_ALREADYIN_USE = "isAlreadyInUse";
    private static final String TYPE_GENERATE_OTP = "generateOTP";
    private static final String TYPE_VERIFY_OTP = "verifyOTP";
    private static final String TYPE_SEARCH_LOCATION = "searchLocation";

    public static void handle(JSONArray args, final CallbackContext callbackContext) {
        try {
            String type = args.getString(0);
            if (type.equals(TYPE_GET_USER_PROFILE_DETAILS)) {
                getUserProfileDetails(args, callbackContext);
            } else if (type.equals(TYPE_GET_TENANT_INFO)) {
                getTenantInfo(args, callbackContext);
            } else if (type.equals(TYPE_SEARCH_USER)) {
                searchUser(args, callbackContext);
            } else if (type.equals(TYPE_GET_SKILLS)) {
                getSkills(args, callbackContext);
            } else if (type.equals(TYPE_ENDORSE_OR_ADD_SKILL)) {
                endorseOrAddSkill(args, callbackContext);
            } else if (type.equals(TYPE_SET_PROFILE_VISIBILITY)) {
                setProfileVisibility(args, callbackContext);
            } else if (type.equals(TYPE_UPLOAD_FILE)) {
                uploadFile(args, callbackContext);
            } else if (type.equalsIgnoreCase(TYPE_UPDATE_USER_INFO)) {
                updateUserInfo(args, callbackContext);
            } else if (type.equalsIgnoreCase(TYPE_ACCEPT_TERMS_AND_CONDITIONS)) {
                acceptTermsAndConditions(args, callbackContext);
            } else if (TYPE_IS_ALREADYIN_USE.equals(type)) {
                isAlreadyInUse(args, callbackContext);
            } else if (TYPE_GENERATE_OTP.equals(type)) {
                generateOTP(args, callbackContext);
            } else if (TYPE_VERIFY_OTP.equals(type)) {
                verifyOTP(args, callbackContext);
            } else if (TYPE_SEARCH_LOCATION.equals(type)) {
                searchLocation(args, callbackContext);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private static void updateUserInfo(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        String requestJson = args.getString(1);

        UpdateUserInfoRequest.Builder request = GsonUtil.fromJson(requestJson, UpdateUserInfoRequest.Builder.class);
        GenieService.getAsyncService().getUserProfileService().updateUserInfo(request.build(),
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

    private static void getUserProfileDetails(JSONArray args, final CallbackContext callbackContext)
            throws JSONException {
        String requestJson = args.getString(1);
        UserProfileDetailsRequest.Builder request = GsonUtil.fromJson(requestJson,
                UserProfileDetailsRequest.Builder.class);
        GenieService.getAsyncService().getUserProfileService().getUserProfileDetails(request.build(),
                new IResponseHandler<UserProfile>() {
                    @Override
                    public void onSuccess(GenieResponse<UserProfile> genieResponse) {
                        String userProfile = genieResponse.getResult().getUserProfile();
                        try {
                            JSONObject jsonObject = new JSONObject(userProfile);
                            String channelId = jsonObject.getJSONObject("rootOrg").getString("hashTagId");
                            GenieService.getService().getKeyStore().putString("channelId", channelId);
                            SDKParams.setParams();
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                        callbackContext.success(userProfile);
                    }

                    @Override
                    public void onError(GenieResponse<UserProfile> genieResponse) {
                        callbackContext.error(genieResponse.getError());
                    }
                });
    }

    /**
     * get TenantInfo
     */
    private static void getTenantInfo(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String requestJson = args.getString(1);
        final Gson gson = new GsonBuilder().create();

        TenantInfoRequest.Builder builder = gson.fromJson(requestJson, TenantInfoRequest.Builder.class);

        GenieService.getAsyncService().getUserProfileService().getTenantInfo(builder.build(),
                new IResponseHandler<TenantInfo>() {
                    @Override
                    public void onSuccess(GenieResponse<TenantInfo> genieResponse) {
                        callbackContext.success(GsonUtil.toJson(genieResponse.getResult()));
                    }

                    @Override
                    public void onError(GenieResponse<TenantInfo> genieResponse) {
                        callbackContext.error(GsonUtil.toJson(genieResponse.getError()));
                    }
                });
    }

    /**
     * searchUser
     */
    private static void searchUser(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String requestJson = args.getString(1);
        final Gson gson = new GsonBuilder().create();

        UserSearchCriteria.SearchBuilder builder = gson.fromJson(requestJson, UserSearchCriteria.SearchBuilder.class);

        GenieService.getAsyncService().getUserProfileService().searchUser(builder.build(),
                new IResponseHandler<UserSearchResult>() {
                    @Override
                    public void onSuccess(GenieResponse<UserSearchResult> genieResponse) {
                        callbackContext.success(GsonUtil.toJson(genieResponse.getResult()));
                    }

                    @Override
                    public void onError(GenieResponse<UserSearchResult> genieResponse) {
                        callbackContext.error(GsonUtil.toJson(genieResponse.getError()));
                    }
                });
    }

    /**
     * getSkills
     */
    private static void getSkills(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String requestJson = args.getString(1);
        final Gson gson = new GsonBuilder().create();

        UserProfileSkillsRequest.Builder builder = gson.fromJson(requestJson, UserProfileSkillsRequest.Builder.class);

        GenieService.getAsyncService().getUserProfileService().getSkills(builder.build(),
                new IResponseHandler<UserProfileSkill>() {
                    @Override
                    public void onSuccess(GenieResponse<UserProfileSkill> genieResponse) {
                        callbackContext.success(GsonUtil.toJson(genieResponse.getResult()));
                    }

                    @Override
                    public void onError(GenieResponse<UserProfileSkill> genieResponse) {
                        callbackContext.error(GsonUtil.toJson(genieResponse.getError()));
                    }
                });
    }

    /**
     * endorseOrAddSkill
     */
    private static void endorseOrAddSkill(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String requestJson = args.getString(1);
        final Gson gson = new GsonBuilder().create();

        EndorseOrAddSkillRequest.Builder builder = gson.fromJson(requestJson, EndorseOrAddSkillRequest.Builder.class);

        GenieService.getAsyncService().getUserProfileService().endorseOrAddSkill(builder.build(),
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

    /**
     * setProfileVisibility
     */
    private static void setProfileVisibility(JSONArray args, final CallbackContext callbackContext)
            throws JSONException {
        final String requestJson = args.getString(1);
        final Gson gson = new GsonBuilder().create();

        ProfileVisibilityRequest.Builder builder = gson.fromJson(requestJson, ProfileVisibilityRequest.Builder.class);

        GenieService.getAsyncService().getUserProfileService().setProfileVisibility(builder.build(),
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

    /**
     * uploadFile
     */
    private static void uploadFile(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String requestJson = args.getString(1);

        UploadFileRequest.Builder builder = GsonUtil.fromJson(requestJson, UploadFileRequest.Builder.class);

        GenieService.getAsyncService().getUserProfileService().uploadFile(builder.build(),
                new IResponseHandler<FileUploadResult>() {
                    @Override
                    public void onSuccess(GenieResponse<FileUploadResult> genieResponse) {
                        callbackContext.success(GsonUtil.toJson(genieResponse.getResult()));
                    }

                    @Override
                    public void onError(GenieResponse<FileUploadResult> genieResponse) {
                        callbackContext.error(GsonUtil.toJson(genieResponse.getError()));
                    }
                });
    }

    /**
     * acceptTermsAndConditions
     */
    private static void acceptTermsAndConditions(JSONArray args, final CallbackContext callbackContext)
            throws JSONException {
        final String requestJson = args.getString(1);

        AcceptTermsAndConditionsRequest.Builder builder = GsonUtil.fromJson(requestJson,
                AcceptTermsAndConditionsRequest.Builder.class);

        GenieService.getAsyncService().getUserProfileService().acceptTermsAndConditions(builder.build(),
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

    private static void isAlreadyInUse(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String requestJson = args.getString(1);

        UserExistRequest.Builder builder = GsonUtil.fromJson(requestJson, UserExistRequest.Builder.class);

        GenieService.getAsyncService().getUserProfileService().isAlreadyInUse(builder.build(),
                new IResponseHandler<UserExistResponse>() {
                    @Override
                    public void onSuccess(GenieResponse<UserExistResponse> genieResponse) {
                        callbackContext.success(GsonUtil.toJson(genieResponse));
                    }

                    @Override
                    public void onError(GenieResponse<UserExistResponse> genieResponse) {
                        callbackContext.error(GsonUtil.toJson(genieResponse));
                    }
                });
    }

    private static void generateOTP(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String requestJson = args.getString(1);

        GenerateOTPRequest.Builder builder = GsonUtil.fromJson(requestJson, GenerateOTPRequest.Builder.class);

        GenieService.getAsyncService().getUserProfileService().generateOTP(builder.build(),
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

    private static void verifyOTP(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String requestJson = args.getString(1);

        VerifyOTPRequest.Builder builder = GsonUtil.fromJson(requestJson, VerifyOTPRequest.Builder.class);

        GenieService.getAsyncService().getUserProfileService().verifyOTP(builder.build(), new IResponseHandler<Void>() {
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

    private static void searchLocation(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String requestJson = args.getString(1);

        LocationSearchCriteria.SearchBuilder builder = GsonUtil.fromJson(requestJson,
                LocationSearchCriteria.SearchBuilder.class);

        GenieService.getAsyncService().getUserProfileService().searchLocation(builder.build(),
                new IResponseHandler<LocationSearchResult>() {
                    @Override
                    public void onSuccess(GenieResponse<LocationSearchResult> genieResponse) {
                        callbackContext.success(GsonUtil.toJson(genieResponse));
                    }

                    @Override
                    public void onError(GenieResponse<LocationSearchResult> genieResponse) {
                        callbackContext.error(GsonUtil.toJson(genieResponse));
                    }
                });
    }

}
