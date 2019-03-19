package org.sunbird;

import org.ekstep.genieproviders.summarizer.AbstractSummarizerProvider;

/**
 * Created by swayangjit on 19/6/18.
 */
public class SummarizerProvider extends AbstractSummarizerProvider {
    @Override
    public String getPackageName() {
        return getContext().getApplicationInfo().packageName;
    }
}
