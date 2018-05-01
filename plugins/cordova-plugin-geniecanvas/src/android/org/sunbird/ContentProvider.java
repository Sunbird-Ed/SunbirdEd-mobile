package org.sunbird;

import org.ekstep.genieproviders.content.AbstractContentProvider;
import org.sunbird.app.BuildConfig;

/**
 * Created by Vinay on 13/06/17.
 */

public class ContentProvider extends AbstractContentProvider {
    @Override
    public String getPackageName() {
        return BuildConfig.APPLICATION_ID;
    }
}
