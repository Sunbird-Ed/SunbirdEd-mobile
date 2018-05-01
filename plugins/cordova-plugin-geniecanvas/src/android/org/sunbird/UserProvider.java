package org.sunbird;

import org.ekstep.genieproviders.user.AbstractUserProvider;
import org.sunbird.app.BuildConfig;

/**
 * Created by Vinay on 13/06/17.
 */

public class UserProvider extends AbstractUserProvider {
    @Override
    public String getPackageName() {
        return BuildConfig.APPLICATION_ID;
    }
}
