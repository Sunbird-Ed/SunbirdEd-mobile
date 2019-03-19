package org.genie;

import org.apache.cordova.CallbackContext;
import org.ekstep.genieservices.GenieService;
import org.ekstep.genieservices.commons.IResponseHandler;
import org.ekstep.genieservices.commons.bean.Batch;
import org.ekstep.genieservices.commons.bean.BatchDetailsRequest;
import org.ekstep.genieservices.commons.bean.ContentStateResponse;
import org.ekstep.genieservices.commons.bean.CourseBatchesRequest;
import org.ekstep.genieservices.commons.bean.CourseBatchesResponse;
import org.ekstep.genieservices.commons.bean.EnrollCourseRequest;
import org.ekstep.genieservices.commons.bean.EnrolledCoursesRequest;
import org.ekstep.genieservices.commons.bean.EnrolledCoursesResponse;
import org.ekstep.genieservices.commons.bean.GenieResponse;
import org.ekstep.genieservices.commons.bean.GetContentStateRequest;
import org.ekstep.genieservices.commons.bean.UnenrolCourseRequest;
import org.ekstep.genieservices.commons.bean.UpdateContentStateRequest;
import org.ekstep.genieservices.commons.utils.GsonUtil;
import org.json.JSONArray;
import org.json.JSONException;

/**
 * Created on 14/3/18. shriharsh
 */

public class CourseHandler {

    private static final String TYPE_GET_ENROLLED_COURSES = "getEnrolledCourses";
    private static final String TYPE_ENROLL_COURSE = "enrollCourse";
    private static final String TYPE_UNENROL_COURSE = "unenrolCourse";
    private static final String TYPE_UPDATE_CONTENT_STATE = "updateContentState";
    private static final String TYPE_GET_COURSE_BATCHES = "getCourseBatches";
    private static final String TYPE_GET_BATCH_DETAILS = "getBatchDetails";
    private static final String TYPE_GET_COURSE_CONTENT_STATE = "getContentState";

    public static void handle(JSONArray args, final CallbackContext callbackContext) {
        try {
            String type = args.getString(0);
            if (type.equals(TYPE_GET_ENROLLED_COURSES)) {
                getEnrolledCourses(args, callbackContext);
            } else if (type.equals(TYPE_ENROLL_COURSE)) {
                enrollCourse(args, callbackContext);
            } else if (type.equals(TYPE_UNENROL_COURSE)) {
                unenrolCourse(args, callbackContext);
            } else if (type.equals(TYPE_UPDATE_CONTENT_STATE)) {
                updateContentState(args, callbackContext);
            } else if (type.equals(TYPE_GET_COURSE_BATCHES)) {
                getCourseBatches(args, callbackContext);
            } else if (type.equals(TYPE_GET_BATCH_DETAILS)) {
                getBatchDetails(args, callbackContext);
            } else if (type.equals(TYPE_GET_COURSE_CONTENT_STATE)) {
                getContentState(args, callbackContext);
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private static void getEnrolledCourses(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        String requestJson = args.getString(1);

        EnrolledCoursesRequest.Builder builder = GsonUtil.fromJson(requestJson, EnrolledCoursesRequest.Builder.class);

        GenieService.getAsyncService().getCourseService().getEnrolledCourses(builder.build(),
                new IResponseHandler<EnrolledCoursesResponse>() {
                    @Override
                    public void onSuccess(GenieResponse<EnrolledCoursesResponse> genieResponse) {
                        callbackContext.success(GsonUtil.toJson(genieResponse));
                    }

                    @Override
                    public void onError(GenieResponse<EnrolledCoursesResponse> genieResponse) {
                        callbackContext.error(GsonUtil.toJson(genieResponse));
                    }
                });
    }

    private static void enrollCourse(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        String requestJson = args.getString(1);

        EnrollCourseRequest.Builder builder = GsonUtil.fromJson(requestJson, EnrollCourseRequest.Builder.class);

        GenieService.getAsyncService().getCourseService().enrollCourse(builder.build(), new IResponseHandler<Void>() {
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

    private static void unenrolCourse(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        String requestJson = args.getString(1);

        UnenrolCourseRequest.Builder builder = GsonUtil.fromJson(requestJson, UnenrolCourseRequest.Builder.class);

        GenieService.getAsyncService().getCourseService().unenrolCourse(builder.build(), new IResponseHandler<Void>() {
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

    private static void updateContentState(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        String requestJson = args.getString(1);

        UpdateContentStateRequest.Builder builder = GsonUtil.fromJson(requestJson,
                UpdateContentStateRequest.Builder.class);

        GenieService.getAsyncService().getCourseService().updateContentState(builder.build(),
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

    private static void getCourseBatches(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        String requestJson = args.getString(1);

        CourseBatchesRequest.Builder builder = GsonUtil.fromJson(requestJson, CourseBatchesRequest.Builder.class);

        GenieService.getAsyncService().getCourseService().getCourseBatches(builder.build(),
                new IResponseHandler<CourseBatchesResponse>() {
                    @Override
                    public void onSuccess(GenieResponse<CourseBatchesResponse> genieResponse) {
                        callbackContext.success(GsonUtil.toJson(genieResponse));
                    }

                    @Override
                    public void onError(GenieResponse<CourseBatchesResponse> genieResponse) {
                        callbackContext.error(GsonUtil.toJson(genieResponse));
                    }
                });
    }

    private static void getBatchDetails(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        String requestJson = args.getString(1);

        BatchDetailsRequest.Builder builder = GsonUtil.fromJson(requestJson, BatchDetailsRequest.Builder.class);

        GenieService.getAsyncService().getCourseService().getBatchDetails(builder.build(),
                new IResponseHandler<Batch>() {
                    @Override
                    public void onSuccess(GenieResponse<Batch> genieResponse) {
                        callbackContext.success(GsonUtil.toJson(genieResponse));
                    }

                    @Override
                    public void onError(GenieResponse<Batch> genieResponse) {
                        callbackContext.error(GsonUtil.toJson(genieResponse));
                    }
                });
    }

    private static void getContentState(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        String requestJson = args.getString(1);

        GetContentStateRequest.Builder builder = GsonUtil.fromJson(requestJson, GetContentStateRequest.Builder.class);

        GenieService.getAsyncService().getCourseService().getContentState(builder.build(),
                new IResponseHandler<ContentStateResponse>() {
                    @Override
                    public void onSuccess(GenieResponse<ContentStateResponse> genieResponse) {
                        callbackContext.success(GsonUtil.toJson(genieResponse));
                    }

                    @Override
                    public void onError(GenieResponse<ContentStateResponse> genieResponse) {
                        callbackContext.error(GsonUtil.toJson(genieResponse));
                    }
                });
    }

}
