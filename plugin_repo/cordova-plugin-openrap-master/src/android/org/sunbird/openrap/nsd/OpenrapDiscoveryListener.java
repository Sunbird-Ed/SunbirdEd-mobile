package org.sunbird.openrap.nsd;

import android.net.nsd.NsdServiceInfo;

public interface OpenrapDiscoveryListener {

    void onNsdServiceFound(NsdServiceInfo foundServiceInfo);

    void onNsdDiscoveryFinished();

    void  onNsdServiceResolved(NsdServiceInfo resolvedNsdServiceInfo);

    void onConnectedToService(NsdServiceInfo connectedServiceInfo);

    void onNsdServiceLost(NsdServiceInfo nsdServiceInfo);
}
