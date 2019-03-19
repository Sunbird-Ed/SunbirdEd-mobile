package org.sunbird;

import org.ekstep.genieproviders.telemetry.AbstractTelemetryProvider;

/**
 * Created by Vinay on 13/06/17.
 */

public class TelemetryProvider extends AbstractTelemetryProvider {
    @Override
    public String getPackageName() {
        return getContext().getApplicationInfo().packageName;
    }
}
