package org.sunbird;

import org.ekstep.genieproviders.content.AbstractContentProvider;

public class ContentProvider extends AbstractContentProvider {
    @Override
    public String getPackageName() {
        return getContext().getApplicationInfo().packageName;
    }
}
