package org.sunbird;

import org.ekstep.genieproviders.user.AbstractUserProvider;

/**
 * Created by Vinay on 13/06/17.
 */

public class UserProvider extends AbstractUserProvider {
    @Override
    public String getPackageName() {
        return getContext().getApplicationInfo().packageName;
    }
}
