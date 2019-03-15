package org.sunbird.util;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.widget.TextView;
import android.widget.Toast;

import org.ekstep.genieservices.GenieService;
import org.ekstep.genieservices.commons.IResponseHandler;
import org.ekstep.genieservices.commons.bean.ContentImportResponse;
import org.ekstep.genieservices.commons.bean.EcarImportRequest;
import org.ekstep.genieservices.commons.bean.GenieResponse;
import org.ekstep.genieservices.commons.bean.ProfileImportRequest;
import org.ekstep.genieservices.commons.bean.ProfileImportResponse;
import org.ekstep.genieservices.commons.bean.TelemetryImportRequest;
import org.ekstep.genieservices.commons.bean.enums.ContentImportStatus;
import org.ekstep.genieservices.commons.utils.CollectionUtil;
import org.ekstep.genieservices.commons.utils.StringUtil;
import org.sunbird.SplashScreen;
import org.sunbird.locales.Locale;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.List;

public final class ImportExportUtil {

    private static final String EXTENSION_CONTENT = "ecar";
    private static final String EXTENSION_PROFILE = "epar";
    private static final String EXTENSION_TELEMETRY = "gsa";

    private static String localeSelected;

    /**
     * Initiate the import file if Genie supported the file for side loading.
     *
     * @param intent
     * @return
     */
    public static boolean initiateImportFile(Activity activity, IImport callback, Intent intent,
            boolean showProgressDialog) {
        Uri uri = intent.getData();

        if (uri == null) {
            return false;
        }

        if (intent.getScheme().equals("content")) {
            return importGenieSupportedFile(activity, callback,
                    getAttachmentFilePath(activity.getApplicationContext(), uri), true, showProgressDialog);
        } else if (intent.getScheme().equals("file")) {
            return importGenieSupportedFile(activity, callback, uri.getPath(), false, showProgressDialog);
        } else {
            return false;
        }

    }

    private static String getRelevantMessage(String localeSelected) {
        String message = null;
        if (localeSelected.equalsIgnoreCase(Locale.HINDI)) {
            message = Locale.Hi.IMPORT_ECAR;
          } else if (localeSelected.equalsIgnoreCase(Locale.MARATHI)) {
            message = Locale.Mr.IMPORT_ECAR;
          } else if (localeSelected.equalsIgnoreCase(Locale.TELUGU)) {
            message = Locale.Te.IMPORT_ECAR;
          } else if (localeSelected.equalsIgnoreCase(Locale.TAMIL)) {
            message = Locale.Ta.IMPORT_ECAR;
          } else {
            message = Locale.En.IMPORT_ECAR;
          }
         return message;

        }

    private static boolean importGenieSupportedFile(Activity activity, final IImport delegate, final String filePath,
            final boolean isAttachment, boolean showProgressDialog) {
        String extension = getFileExtension(filePath);
        localeSelected = GenieService.getService().getKeyStore().getString("sunbirdselected_language_code", "en");

        if (!isValidExtension(filePath)) {
            String message = getRelevantMessage(localeSelected);
            Toast.makeText( activity, message, Toast.LENGTH_SHORT).show();
            return false;
        }

        if (extension.equalsIgnoreCase("ecar")) {
            importContent(activity, filePath, new ImportExportUtil.IImport() {
                @Override
                public void onImportSuccess() {

                    if (isAttachment) {
                        File file = new File(filePath);
                        file.delete();
                    }

                    delegate.onImportSuccess();

                }

                @Override
                public void onImportFailure(ContentImportStatus status) {
                    delegate.onImportFailure(status);
                }

                @Override
                public void onOutDatedEcarFound() {
                    delegate.onOutDatedEcarFound();
                }
            });
        } else if (extension.equalsIgnoreCase("gsa")) {
            TelemetryImportRequest request = new TelemetryImportRequest.Builder().fromFilePath(filePath).build();
            GenieService.getAsyncService().getTelemetryService().importTelemetry(request, new IResponseHandler<Void>() {
                @Override
                public void onSuccess(GenieResponse<Void> genieResponse) {
                    if (isAttachment) {
                        File file = new File(filePath);
                        file.delete();
                    }

                    delegate.onImportSuccess();
                }

                @Override
                public void onError(GenieResponse<Void> genieResponse) {
                    delegate.onImportFailure(ContentImportStatus.ALREADY_EXIST);
                }
            });
        } else if (extension.equalsIgnoreCase("epar")) {
            ProfileImportRequest request = new ProfileImportRequest.Builder().fromFilePath(filePath).build();
            GenieService.getAsyncService().getUserService().importProfile(request,
                    new IResponseHandler<ProfileImportResponse>() {
                        @Override
                        public void onSuccess(GenieResponse<ProfileImportResponse> genieResponse) {
                            if (isAttachment) {
                                File file = new File(filePath);
                                file.delete();
                            }

                            delegate.onImportSuccess();
                        }

                        @Override
                        public void onError(GenieResponse<ProfileImportResponse> genieResponse) {
                            delegate.onImportFailure(ContentImportStatus.ALREADY_EXIST);
                        }
                    });
        } 
        return true;
    }

    private static String getAttachmentFilePath(Context context, Uri uri) {

        InputStream is = null;
        FileOutputStream os = null;
        String fullPath = null;
        String name = null;

        try {
            Cursor cursor = context.getContentResolver().query(uri,
                    new String[] { MediaStore.MediaColumns.DISPLAY_NAME }, null, null, null);
            cursor.moveToFirst();
            int nameIndex = cursor.getColumnIndex(MediaStore.MediaColumns.DISPLAY_NAME);
            if (nameIndex >= 0) {
                name = cursor.getString(nameIndex);
            }
            fullPath = Environment.getExternalStorageDirectory() + "/" + name;
            is = context.getContentResolver().openInputStream(uri);
            os = new FileOutputStream(fullPath);

            byte[] buffer = new byte[4096];
            int count;
            while ((count = is.read(buffer)) > 0) {
                os.write(buffer, 0, count);
            }
            os.close();
            is.close();
        } catch (Exception e) {
            if (is != null) {
                try {
                    is.close();
                } catch (Exception e1) {
                    e1.printStackTrace();
                }
            }
            if (os != null) {
                try {
                    os.close();
                } catch (Exception e1) {
                    e1.printStackTrace();
                }
            }
            if (fullPath != null) {
                File f = new File(fullPath);
                f.delete();
            }
        }

        return fullPath;
    }

    private static void importContent(Activity activity, String filePath, IImport iImport) {
        EcarImportRequest.Builder builder = new EcarImportRequest.Builder();
        builder.fromFilePath(filePath);

        builder.toFolder("/storage/emulated/0/Android/data/org.sunbird.app/files");
        GenieService.getAsyncService().getContentService().importEcar(builder.build(),
                new IResponseHandler<List<ContentImportResponse>>() {
                    @Override
                    public void onSuccess(GenieResponse<List<ContentImportResponse>> genieResponse) {

                        List<ContentImportResponse> contentImportResponseList = genieResponse.getResult();
                        if (!CollectionUtil.isNullOrEmpty(contentImportResponseList)) {
                            ContentImportStatus importStatus = contentImportResponseList.get(0).getStatus();
                            switch (importStatus) {
                            case NOT_COMPATIBLE:
                                iImport.onImportFailure(ContentImportStatus.NOT_COMPATIBLE);
                                break;
                            case CONTENT_EXPIRED:
                                iImport.onImportFailure(ContentImportStatus.CONTENT_EXPIRED);
                                break;
                            case ALREADY_EXIST:
                                iImport.onImportFailure(ContentImportStatus.ALREADY_EXIST);
                                break;
                            default:
                                iImport.onImportSuccess();
                                break;

                            }
                        } else {
                            iImport.onImportSuccess();
                        }
                    }

                    @Override
                    public void onError(GenieResponse<List<ContentImportResponse>> genieResponse) {
                        iImport.onImportFailure(ContentImportStatus.IMPORT_FAILED);
                    }
                });
    }

    public static boolean isValidExtension(String filePath) {
        if (StringUtil.isNullOrEmpty(filePath)) {
            return false;
        }

        String fileExtension = getFileExtension(filePath);

        return (fileExtension.equalsIgnoreCase(EXTENSION_CONTENT) || fileExtension.equalsIgnoreCase(EXTENSION_TELEMETRY)
                || fileExtension.equalsIgnoreCase(EXTENSION_PROFILE));
    }

    public static String getFileExtension(String filePath) {
        if (filePath.lastIndexOf(".") != -1 && filePath.lastIndexOf(".") != 0) {
            return filePath.substring(filePath.lastIndexOf(".") + 1);
        } else {
            return "";
        }
    }

    public interface IImport {
        void onImportSuccess();

        void onImportFailure(ContentImportStatus status);

        void onOutDatedEcarFound();
    }
}
