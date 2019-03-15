package org.genie;

import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.os.Environment;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.ekstep.genieservices.GenieService;
import org.ekstep.genieservices.commons.IResponseHandler;
import org.ekstep.genieservices.commons.bean.ContentExportRequest;
import org.ekstep.genieservices.commons.bean.ContentExportResponse;
import org.ekstep.genieservices.commons.bean.GenieResponse;
import org.ekstep.genieservices.commons.bean.TelemetryExportRequest;
import org.ekstep.genieservices.commons.bean.TelemetryExportResponse;
import org.ekstep.genieservices.utils.BuildConfigUtil;
import org.json.JSONArray;
import org.json.JSONException;
import org.sunbird.SunbirdApplication;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by souvikmondal on 23/4/18.
 */
public class ShareHandler {

    private static final String TYPE_EXPORT_ECAR = "exportEcar";
    private static final String TYPE_EXPORT_APK = "exportApk";
    private static final String TYPE_EXPORT_TELEMETRY = "exportTelemetry";

    public static void handle(final JSONArray args, final CordovaInterface cordova,
            final CallbackContext callbackContext) {
        try {
            String shareType = args.getString(0);
            switch (shareType) {
            case TYPE_EXPORT_ECAR:
                String contentId = args.getString(1);
                exportEcar(contentId, callbackContext);
                break;

            case TYPE_EXPORT_TELEMETRY:
                exportTelemetry(callbackContext);
                break;

            case TYPE_EXPORT_APK:
                exportApk(cordova, callbackContext);
                break;
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private static int getIdOfResource(CordovaInterface cordova, String name, String resourceType) {
        return cordova.getActivity().getResources().getIdentifier(name, resourceType,
                cordova.getActivity().getApplicationInfo().packageName);
    }

    private static void exportApk(final CordovaInterface cordova, final CallbackContext callbackContext) {
        ApplicationInfo app = cordova.getActivity().getApplicationInfo();
        String filePath = app.sourceDir;
        final Intent intent = new Intent(Intent.ACTION_SEND);

        // MIME of .apk is "application/vnd.android.package-archive".
        // but Bluetooth does not accept this. Let's use "*/*" instead.
        intent.setType("*/*");

        // Append file
        File originalApk = new File(filePath);

        try {
            // Make new directory in new location
            File tempFile = new File(cordova.getActivity().getExternalCacheDir() + "/ExtractedApk");
            // If directory doesn't exists create new
            if (!tempFile.isDirectory())
                if (!tempFile.mkdirs())
                    return;
            // Get application's name and convert to lowercase
            tempFile = new File(tempFile.getPath() + "/"
                    + cordova.getActivity().getString(getIdOfResource(cordova, "_app_name", "string")) + "_"
                    + BuildConfigUtil.getBuildConfigValue(SunbirdApplication.PACKAGE_NAME, "VERSION_NAME") + ".apk");
            // If file doesn't exists create new
            if (!tempFile.exists()) {
                if (!tempFile.createNewFile()) {
                    return;
                }
            }
            // Copy file to new location
            InputStream in = new FileInputStream(originalApk);
            OutputStream out = new FileOutputStream(tempFile);

            byte[] buf = new byte[1024];
            int len;
            while ((len = in.read(buf)) > 0) {
                out.write(buf, 0, len);
            }
            in.close();
            out.close();
            System.out.println("File copied.");
            callbackContext.success(tempFile.getPath());
        } catch (Exception ex) {
            callbackContext.error("failure");
        }
    }

    private static void exportEcar(String contentId, final CallbackContext callbackContext) {
        List<String> ContentIds = new ArrayList<String>();
        ContentIds.add(contentId);
        File directory = new File(Environment.getExternalStorageDirectory() + File.separator + "/Ecars");
        ContentExportRequest.Builder builder = new ContentExportRequest.Builder();
        builder.exportContents(ContentIds).toFolder(String.valueOf(directory));

        GenieService.getAsyncService().getContentService().exportContent(builder.build(),
                new IResponseHandler<ContentExportResponse>() {
                    @Override
                    public void onSuccess(GenieResponse<ContentExportResponse> genieResponse) {
                        ContentExportResponse contentExportResponse = genieResponse.getResult();
                        String ecarPath = contentExportResponse.getExportedFilePath();
                        callbackContext.success(ecarPath);
                    }

                    @Override
                    public void onError(GenieResponse<ContentExportResponse> genieResponse) {
                        callbackContext.error("failure");
                    }
                });
    }

    private static void exportTelemetry(final CallbackContext callbackContext) {
        File directory = new File(Environment.getExternalStorageDirectory() + File.separator + "/Telemetry");
        TelemetryExportRequest.Builder builder = new TelemetryExportRequest.Builder();
        builder.toFolder(String.valueOf(directory));

        GenieService.getAsyncService().getTelemetryService().exportTelemetry(builder.build(),
                new IResponseHandler<TelemetryExportResponse>() {
                    @Override
                    public void onSuccess(GenieResponse<TelemetryExportResponse> genieResponse) {
                        TelemetryExportResponse telemetryExportResponse = genieResponse.getResult();
                        String ecarPath = telemetryExportResponse.getExportedFilePath();
                        callbackContext.success(ecarPath);
                    }

                    @Override
                    public void onError(GenieResponse<TelemetryExportResponse> genieResponse) {
                        callbackContext.error("failure");
                    }
                });
    }

}