package org.ekstep.genieservices;

import org.apache.cordova.CallbackContext;
import org.ekstep.genieservices.commons.IResponseHandler;
import org.ekstep.genieservices.commons.bean.CourseBatchesRequest;
import org.ekstep.genieservices.commons.bean.CourseBatchesResponse;
import org.ekstep.genieservices.commons.bean.EnrolCourseRequest;
import org.ekstep.genieservices.commons.bean.EnrolledCoursesRequest;
import org.ekstep.genieservices.commons.bean.EnrolledCoursesResponse;
import org.ekstep.genieservices.commons.bean.GenieResponse;
import org.ekstep.genieservices.commons.bean.UpdateContentStateRequest;
import org.ekstep.genieservices.commons.utils.GsonUtil;
import org.json.JSONArray;
import org.json.JSONException;

/**
 * Created on 14/3/18.
 * shriharsh
 */

public class CourseHandler {

    private static final String TYPE_GET_ENROLLED_COURSES = "getEnrolledCourses";
    private static final String TYPE_ENROLL_COURSE = "enrollCourse";
    private static final String TYPE_UPDATE_CONTENT_STATE = "updateContentState";
    private static final String TYPE_GET_COURSE_BATCHES = "getCourseBatches";

    public static void handle(JSONArray args, final CallbackContext callbackContext) {
        try {
            String type = args.getString(0);
            if (type.equals(TYPE_GET_ENROLLED_COURSES)) {
                getEnrolledCourses(args, callbackContext);
            } else if (type.equals(TYPE_ENROLL_COURSE)) {
                enrollCourse(args, callbackContext);
            } else if (type.equals(TYPE_UPDATE_CONTENT_STATE)) {
                updateContentState(args, callbackContext);
            } else if (type.equals(TYPE_GET_COURSE_BATCHES)) {
                getCourseBatches(args, callbackContext);
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private static void getEnrolledCourses(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        String requestJson = args.getString(1);
        EnrolledCoursesRequest request = GsonUtil.fromJson(requestJson, EnrolledCoursesRequest.class);
        GenieService.getAsyncService().getCourseService().getEnrolledCourses(request, new IResponseHandler<EnrolledCoursesResponse>() {
            @Override
            public void onSuccess(GenieResponse<EnrolledCoursesResponse> genieResponse) {
                callbackContext.success(genieResponse.getResult());
            }

            @Override
            public void onError(GenieResponse<EnrolledCoursesResponse> genieResponse) {
                callbackContext.error(genieResponse.getError());
            }
        });
    }

    private static void enrollCourse(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        String requestJson = args.getString(1);
        EnrolCourseRequest request = GsonUtil.fromJson(requestJson, EnrolCourseRequest.class);
        GenieService.getAsyncService().getCourseService().enrollCourse(request, new IResponseHandler<Void>() {
            @Override
            public void onSuccess(GenieResponse<Void> genieResponse) {
                callbackContext.success(genieResponse.getResult());
            }

            @Override
            public void onError(GenieResponse<Void> genieResponse) {
                callbackContext.error(genieResponse.getError());
            }
        });
    }

    private static void updateContentState(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        String requestJson = args.getString(1);
        UpdateContentStateRequest request = GsonUtil.fromJson(requestJson, UpdateContentStateRequest.class);
        GenieService.getAsyncService().getCourseService().updateContentState(request, new IResponseHandler<Void>() {
            @Override
            public void onSuccess(GenieResponse<Void> genieResponse) {
                callbackContext.success(genieResponse.getResult());
            }

            @Override
            public void onError(GenieResponse<Void> genieResponse) {
                callbackContext.error(genieResponse.getError());
            }
        });
    }

    private static void getCourseBatches(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        String requestJson = args.getString(1);
        CourseBatchesRequest request = GsonUtil.fromJson(requestJson, CourseBatchesRequest.class);
        GenieService.getAsyncService().getCourseService().getCourseBatches(request, new IResponseHandler<CourseBatchesResponse>() {
            @Override
            public void onSuccess(GenieResponse<CourseBatchesResponse> genieResponse) {
                callbackContext.success(genieResponse.getResult());
            }

            @Override
            public void onError(GenieResponse<CourseBatchesResponse> genieResponse) {
                callbackContext.error(genieResponse.getError());
            }
        });
    }
}
