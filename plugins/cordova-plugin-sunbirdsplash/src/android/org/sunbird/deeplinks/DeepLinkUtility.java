package org.sunbird.deeplinks;

import android.net.Uri;

public class DeepLinkUtility {

    public static boolean isDeepLink(Uri intentData){
        if (intentData.getScheme().equalsIgnoreCase("ekstep")) {
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
}