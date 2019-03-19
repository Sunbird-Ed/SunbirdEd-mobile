package org.sunbird;

import org.ekstep.genieproviders.partner.AbstractPartnerProvider;

public class PartnerProvider extends AbstractPartnerProvider {
    @Override
    public String getPackageName() {
        return getContext().getApplicationInfo().packageName;
    }
}
