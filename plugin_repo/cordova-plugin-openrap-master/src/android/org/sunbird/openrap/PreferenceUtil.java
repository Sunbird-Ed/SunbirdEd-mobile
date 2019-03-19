package org.sunbird.openrap;

import android.content.Context;

import org.ekstep.genieservices.commons.db.cache.PreferenceWrapper;

public class PreferenceUtil {

    private static final String SHARED_PREF_NAME = "openrap";
    private static PreferenceWrapper sPreferenceWrapper;

    public static void initPreference(Context context) {
        if (sPreferenceWrapper == null) {
            sPreferenceWrapper = new PreferenceWrapper(context, SHARED_PREF_NAME);
        }
    }

    public static PreferenceWrapper getPreferenceWrapper() {
        if (sPreferenceWrapper == null) {
            throw new RuntimeException(
                    "Must run initPreference(Application application)" + " before an mInstance can be obtained");
        }
        return sPreferenceWrapper;
    }

}
