package org.sunbird.deeplinks;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.LinkedHashMap;

public class DeepLinkNavigation {

    public static final String DEEPLINK_EXPLORE_CONTENT_IDENTIFIER = "landing";
    public static final String DEEPLINK_SEARCH_RESULT_IDENTIFIER = "l";
    private static final String TAG = "DeepLinkNavigation";
    private static final String TAG_NAME = "k";
    private static final String TAG_DESCRIPTION = "d";
    private static final String TAG_SDATE = "s";
    private static final String TAG_ENDDATE = "e";
    private static final String DEEPLINK_SORT_QUERY = "sort";
    private static final String DEEPLINK_TYPE = "type";

    private Activity mActivity;


    private Intent mIntent;

    public DeepLinkNavigation(Activity activity) {
        mActivity = activity;
    }

    private HashMap<String, String> splitQuery(URL url) throws UnsupportedEncodingException {
        HashMap<String, String> query_pairs = null;
        String query = url.getQuery();
        if (query != null) {
            String[] pairs = query.split("&");
            query_pairs = new LinkedHashMap<>();

            for (String pair : pairs) {
                int idx = pair.indexOf("=");
                query_pairs.put(URLDecoder.decode(pair.substring(0, idx), "UTF-8"),
                        URLDecoder.decode(pair.substring(idx + 1), "UTF-8"));
            }
        }

        return query_pairs;
    }

    public void validateAndHandleDeepLink(Intent intent, IValidateDeepLink iValidateDeepLink) {
        mIntent = intent;
        if (intent != null && intent.getData() != null) {
            validateAndHandleDeepLink(intent.getData(), iValidateDeepLink);
        } else {
            // Not a valid deep link
            if (iValidateDeepLink != null) {
                iValidateDeepLink.notAValidDeepLink();
            }
        }
    }

    public void validateAndHandleDeepLink(Uri intentData, IValidateDeepLink iValidateDeepLink) {
        if (intentData != null) {
            if (DeepLinkUtility.isDeepLink(mActivity,intentData)) { // If deeplink clicked from content's last page.
                if (iValidateDeepLink != null) {
                    iValidateDeepLink.validLocalDeepLink();
                }
                if (DeepLinkUtility.isDeepLinkSetTag(intentData)) {
                    iValidateDeepLink.onTagDeepLinkFound(intentData.getQueryParameter(TAG_NAME),
                            intentData.getQueryParameter(TAG_DESCRIPTION),
                            intentData.getQueryParameter(TAG_SDATE),
                            intentData.getQueryParameter(TAG_ENDDATE));
                } else {
                    handleLocalDeepLink(intentData);
                }


            } else if ((DeepLinkUtility.isDeepLinkHttp(intentData)
                    || DeepLinkUtility.isDeepLinkHttps(intentData))
                    && !new File(intentData.toString()).exists()) {    // Server deep link
                if (iValidateDeepLink != null) {
                    iValidateDeepLink.validServerDeepLink();
                }

                handleServerDeepLink(intentData.toString(), iValidateDeepLink);
            } else {
                // Not a valid deep link
                if (iValidateDeepLink != null) {
                    iValidateDeepLink.notAValidDeepLink();
                }
            }
        } else {
            // Not a valid deep link
            if (iValidateDeepLink != null) {
                iValidateDeepLink.notAValidDeepLink();
            }
        }
    }

    private void handleLocalDeepLink(Uri intentData) {
//        if (mIStartUp != null) {
//            mIStartUp.handleLocalDeepLink(mIntent);
//        }
    }


    private void handleServerDeepLink(String url, IValidateDeepLink iValidateDeepLink) {
        try {
            HashMap<String, String> parameters = splitQuery(new URL(url));
            if (parameters != null) {
                if (parameters.get(TAG_NAME) != null) {
                    if (iValidateDeepLink != null) {
                        iValidateDeepLink.onTagDeepLinkFound(parameters.get(TAG_NAME),
                                parameters.get(TAG_DESCRIPTION),
                                parameters.get(TAG_SDATE),
                                parameters.get(TAG_ENDDATE));
                    }
                }
            } else {
//                if (mIStartUp != null) {
//                    mIStartUp.handleServerDeepLink(mIntent);
//                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public interface IValidateDeepLink {
        void validLocalDeepLink();

        void validServerDeepLink();

        void notAValidDeepLink();

        void onTagDeepLinkFound(String tagName, String description, String startDate, String endDate);
    }
}