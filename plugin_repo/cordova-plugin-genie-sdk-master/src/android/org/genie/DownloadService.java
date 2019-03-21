package org.genie;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import org.apache.cordova.CallbackContext;
import org.ekstep.genieservices.GenieService;
import org.ekstep.genieservices.commons.bean.DownloadProgress;
import org.ekstep.genieservices.commons.bean.DownloadRequest;
import org.json.JSONArray;
import org.json.JSONException;

/**
 * Created on 16/2/18.
 * shriharsh
 */

public class DownloadService {

    private static final String TYPE_GET_DOWNLOAD_REQUEST = "getDownloadRequest";
    private static final String TYPE_GET_DOWNLOAD_PROGRESS = "getDownloadProgress";
    private static final String TYPE_CANCEL = "cancel";
    private static final String TYPE_ENQUEUE = "enqueue";
    private static final String TYPE_DOWNLOAD_COMPLETE = "downloadComplete";
    private static final String TYPE_DOWNLOAD_FAILED = "downloadFailed";
    private static final String TYPE_RESUME_DOWNLOADS = "resumeDownloads";
    private static final String TYPE_REMOVE_DOWNLOAD_FILE = "removeDownloadFile";

    public static void handle(JSONArray args, CallbackContext callbackContext) {
        try {
            String type = args.getString(0);
            if (type.equals(TYPE_GET_DOWNLOAD_REQUEST)) {
                getDownloadRequest(args, callbackContext);
            } else if (type.equals(TYPE_GET_DOWNLOAD_PROGRESS)) {
                getDownloadProgress(args, callbackContext);
            } else if (type.equals(TYPE_CANCEL)) {
                cancelDownload(args, callbackContext);
            } else if (type.equals(TYPE_ENQUEUE)) {
                enqueue(args, callbackContext);
            } else if (type.equals(TYPE_DOWNLOAD_COMPLETE)) {
                downloadComplete(args, callbackContext);
            } else if (type.equals(TYPE_DOWNLOAD_FAILED)) {
                downloadFailed(args, callbackContext);
            } else if (type.equals(TYPE_RESUME_DOWNLOADS)) {
                resumeDownloads(args, callbackContext);
            } else if (type.equals(TYPE_REMOVE_DOWNLOAD_FILE)) {
                removeDownloadFile(args, callbackContext);
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private static void getDownloadRequest(JSONArray args, CallbackContext callbackContext) throws JSONException {
        String requestJson = args.getString(1);
        Gson gson = new GsonBuilder().create();
        String identifier = gson.fromJson(requestJson, String.class);
        downloadRequest(identifier, callbackContext);
    }

    private static void getDownloadProgress(JSONArray args, CallbackContext callbackContext) throws JSONException {
        String requestJson = args.getString(1);
        Gson gson = new GsonBuilder().create();
        String identifier = gson.fromJson(requestJson, String.class);
        downloadProgress(identifier, callbackContext);
    }

    private static void cancelDownload(JSONArray args, CallbackContext callbackContext) throws JSONException {
        String requestJson = args.getString(1);
        Gson gson = new GsonBuilder().create();
        String identifier = gson.fromJson(requestJson, String.class);
        cancel(identifier, callbackContext);
    }

    private static void cancel(String identifier, CallbackContext callbackContext) {
        GenieService.getService().getDownloadService()
                .cancel(identifier);
    }

    private static void enqueue(JSONArray args, CallbackContext callbackContext) throws JSONException {
        String requestJson = args.getString(1);
        Gson gson = new GsonBuilder().create();
        DownloadRequest request = gson.fromJson(requestJson, DownloadRequest.class);
        GenieService.getService().getDownloadService()
                .enqueue(request);
    }

    private static void downloadComplete(JSONArray args, CallbackContext callbackContext) throws JSONException {
        String requestJson = args.getString(1);

        GenieService.getService().getDownloadService()
                .onDownloadComplete(requestJson);
    }

    private static void downloadFailed(JSONArray args, CallbackContext callbackContext) throws JSONException {
        String requestJson = args.getString(1);

        GenieService.getService().getDownloadService()
                .onDownloadFailed(requestJson);
    }

    private static void resumeDownloads(JSONArray args, CallbackContext callbackContext) throws JSONException {
        GenieService.getService().getDownloadService()
                .resumeDownloads();
    }

    private static void removeDownloadFile(JSONArray args, CallbackContext callbackContext) throws JSONException {
        String requestJson = args.getString(1);

        long identifier = Long.parseLong(requestJson);

        GenieService.getService().getDownloadService()
                .removeDownloadedFile(identifier);
    }

    private static void downloadProgress(String identifier, CallbackContext callbackContext) {
        final Gson gson = new GsonBuilder().create();

        DownloadProgress downloadProgress = GenieService.getService().getDownloadService()
                .getProgress(identifier);

        callbackContext.success(gson.toJson(downloadProgress));
    }

    private static void downloadRequest(String identifier, CallbackContext callbackContext) {
        final Gson gson = new GsonBuilder().create();

        DownloadRequest downloadRequest = GenieService.getService().getDownloadService()
                .getDownloadRequest(identifier);

        callbackContext.success(gson.toJson(downloadRequest));
    }

}
