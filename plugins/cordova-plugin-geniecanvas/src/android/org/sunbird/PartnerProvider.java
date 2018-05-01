package org.sunbird;

import org.ekstep.genieproviders.partner.AbstractPartnerProvider;
import org.sunbird.app.BuildConfig;

/**
 * Created by Vinay on 13/06/17.
 */

public class PartnerProvider extends AbstractPartnerProvider {
    @Override
    public String getPackageName() {
        return BuildConfig.APPLICATION_ID;
    }
}
