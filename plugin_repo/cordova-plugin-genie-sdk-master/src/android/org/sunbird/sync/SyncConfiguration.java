package org.sunbird.sync;

import org.ekstep.genieservices.commons.network.IConnectionInfo;

/**
 * Created by swayangjit on 25/4/18.
 */
public enum SyncConfiguration {
    OFF {
        @Override
        public boolean canSync(IConnectionInfo connectionInfo) {
            return false;
        }
    },
    OVER_WIFI_ONLY {
        @Override
        public boolean canSync(IConnectionInfo connectionInfo) {
            return connectionInfo.isConnectedOverWifi();
        }
    },
    ALWAYS_ON {
        @Override
        public boolean canSync(IConnectionInfo connectionInfo) {
            return connectionInfo.isConnected();
        }
    };


    @Override
    public String toString() {
        return name();
    }

    public abstract boolean canSync(IConnectionInfo connectionInfo);
}
