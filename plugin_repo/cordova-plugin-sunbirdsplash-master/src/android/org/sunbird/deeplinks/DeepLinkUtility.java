package org.sunbird.deeplinks;

import android.content.Context;
import android.net.Uri;

public class DeepLinkUtility {

    public static boolean isDeepLink(Context context, Uri intentData) {
        if (intentData.getScheme().equalsIgnoreCase(getStringResourceByName(context, "deeplink_base_url"))) {
            return true;
        }

        return false;
    }

    public static boolean isDeepLinkSetTag(Uri intentData) {
        if (intentData.getHost().equalsIgnoreCase("settag")) {
            return true;
        }

        return false;
    }

    public static boolean isDeepLinkHttp(Uri intentData) {
        if (intentData.getScheme().equalsIgnoreCase("http")) {
            return true;
        }

        return false;
    }

    public static boolean isDeepLinkHttps(Uri intentData) {
        if (intentData.getScheme().equalsIgnoreCase("https")) {
            return true;
        }

        return false;
    }

    private static String getStringResourceByName(Context context, String string) {
        if (context == null) {
            return null;
        } else {
            String packageName = context.getPackageName();
            int resId = context.getResources().getIdentifier(string, "string", packageName);
            return context.getString(resId);
        }
    }
}