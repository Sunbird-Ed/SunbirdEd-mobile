package org.sunbird;

import org.ekstep.genieproviders.telemetry.AbstractTelemetryProvider;
import org.sunbird.app.BuildConfig;

/**
 * Created by Vinay on 13/06/17.
 */

public class TelemetryProvider extends AbstractTelemetryProvider {
    @Override
    public String getPackageName() {
        return BuildConfig.APPLICATION_ID;
    }
}
