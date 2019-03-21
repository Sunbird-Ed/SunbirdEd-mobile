package org.genie;

import org.apache.cordova.CallbackContext;
import org.ekstep.genieservices.GenieService;
import org.ekstep.genieservices.commons.IResponseHandler;
import org.ekstep.genieservices.commons.bean.GenieResponse;
import org.ekstep.genieservices.commons.bean.LearnerAssessmentDetails;
import org.ekstep.genieservices.commons.bean.LearnerAssessmentSummary;
import org.ekstep.genieservices.commons.bean.SummaryRequest;
import org.ekstep.genieservices.commons.utils.GsonUtil;
import org.json.JSONArray;
import org.json.JSONException;

import java.util.List;
import java.util.Map;

/**
 * Created by souvikmondal on 12/10/18.
 */

public class ReportHandler {

    private static final String TYPE_GET_REPORT_FOR_USER = "getListOfReports";
    private static final String TYPE_GET_REPORT_DETAIL_FOR_USER = "getDetailReport";
    private static final String TYPE_GET_REPORT_BY_USER = "getReportsByUser";
    private static final String TYPE_GET_REPORT_BY_QUESTION = "getReportsByQuestion";
    private static final String TYPE_GET_DETAILS_PER_QUESTION = "getDetailsPerQuestion";

    public static void handle(JSONArray args, final CallbackContext callbackContext) {

        try {
            String type = args.getString(0);
            if (type.equals(TYPE_GET_REPORT_FOR_USER)) {
                getListOfReports(args, callbackContext);
            } else if (type.equals(TYPE_GET_REPORT_DETAIL_FOR_USER)) {
                getDetailReport(args, callbackContext);
            }else if (type.equals(TYPE_GET_REPORT_BY_USER)) {
                getReportsByUser(args, callbackContext);
            }else if (type.equals(TYPE_GET_REPORT_BY_QUESTION)) {
                getReportsByQuestion(args, callbackContext);
            }else if (type.equals(TYPE_GET_DETAILS_PER_QUESTION)) {
                getDetailsPerQuestion(args, callbackContext);
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private static void getListOfReports(JSONArray args, CallbackContext callbackContext) throws JSONException {
        List<String> uidArray = GsonUtil.fromJson(args.getString(1), List.class);
        SummaryRequest.Builder builder = new SummaryRequest.Builder();
        builder.forUsers(uidArray);
        SummaryRequest request = builder.build();
        GenieService.getAsyncService().getSummarizerService().getSummary(request, new IResponseHandler<List<LearnerAssessmentSummary>>() {
            @Override
            public void onSuccess(GenieResponse<List<LearnerAssessmentSummary>> genieResponse) {
                callbackContext.success(GsonUtil.toJson(genieResponse.getResult()));
            }

            @Override
            public void onError(GenieResponse<List<LearnerAssessmentSummary>> genieResponse) {
                callbackContext.error(genieResponse.getError());
            }
        });
    }

    private static void getDetailReport(JSONArray args, CallbackContext callbackContext) throws JSONException {
        List<String> uidArray = GsonUtil.fromJson(args.getString(1), List.class);
        String contentId = args.getString(2);
        SummaryRequest.Builder builder = new SummaryRequest.Builder();
        builder.forUsers(uidArray);
        builder.contentId(contentId);
        SummaryRequest request = builder.build();
        GenieService.getAsyncService().getSummarizerService().getLearnerAssessmentDetails(request, new IResponseHandler<List<LearnerAssessmentDetails>>() {
            @Override
            public void onSuccess(GenieResponse<List<LearnerAssessmentDetails>> genieResponse) {
                callbackContext.success(GsonUtil.toJson(genieResponse.getResult()));
            }

            @Override
            public void onError(GenieResponse<List<LearnerAssessmentDetails>> genieResponse) {
                callbackContext.error(genieResponse.getError());
            }
        });
    }

    private static void getReportsByUser(JSONArray args, CallbackContext callbackContext) throws JSONException {
        String summaryRequest = args.getString(1);
        SummaryRequest.Builder summaryRequestBuilder=GsonUtil.fromJson(summaryRequest, SummaryRequest.Builder.class);
        GenieService.getAsyncService().getSummarizerService().getReportsByUser(summaryRequestBuilder.build(), new IResponseHandler<List<Map<String,Object>>>() {
            @Override
            public void onSuccess(GenieResponse<List<Map<String,Object>>> genieResponse) {
                callbackContext.success(GsonUtil.toJson(genieResponse.getResult()));
            }

            @Override
            public void onError(GenieResponse<List<Map<String,Object>>> genieResponse) {
                callbackContext.error(genieResponse.getError());
            }
        });
    }

    private static void getReportsByQuestion(JSONArray args, CallbackContext callbackContext) throws JSONException {
        String summaryRequest = args.getString(1);
        SummaryRequest.Builder summaryRequestBuilder=GsonUtil.fromJson(summaryRequest, SummaryRequest.Builder.class);
        GenieService.getAsyncService().getSummarizerService().getReportByQuestions(summaryRequestBuilder.build(), new IResponseHandler<List<Map<String,Object>>>() {
            @Override
            public void onSuccess(GenieResponse<List<Map<String,Object>>> genieResponse) {
                callbackContext.success(GsonUtil.toJson(genieResponse.getResult()));
            }

            @Override
            public void onError(GenieResponse<List<Map<String,Object>>> genieResponse) {
                callbackContext.error(genieResponse.getError());
            }
        });
    }

    private static void getDetailsPerQuestion(JSONArray args, CallbackContext callbackContext) throws JSONException {
        String summaryRequest = args.getString(1);
        SummaryRequest.Builder summaryRequestBuilder=GsonUtil.fromJson(summaryRequest, SummaryRequest.Builder.class);
        GenieService.getAsyncService().getSummarizerService().getDetailsPerQuestion(summaryRequestBuilder.build(), new IResponseHandler<List<Map<String,Object>>>() {
            @Override
            public void onSuccess(GenieResponse<List<Map<String,Object>>> genieResponse) {
                callbackContext.success(GsonUtil.toJson(genieResponse.getResult()));
            }

            @Override
            public void onError(GenieResponse<List<Map<String,Object>>> genieResponse) {
                callbackContext.error(genieResponse.getError());
            }
        });
    }


}
