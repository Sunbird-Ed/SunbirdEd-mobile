package org.sunbird.openrap.nsd;

import android.content.Context;
import android.net.nsd.NsdManager;
import android.net.nsd.NsdManager.DiscoveryListener;
import android.net.nsd.NsdServiceInfo;
import android.util.Log;

import org.sunbird.openrap.asynctask.ConnectToOpenrapAsyncTask;

import java.net.InetAddress;

import static android.net.nsd.NsdManager.PROTOCOL_DNS_SD;
import static android.net.nsd.NsdManager.ResolveListener;

public class OpenrapDiscoveryHelper {

    private static final String TAG = "OpenrapDiscoveryHelper";

    private final NsdManager mNsdManager;
    private InetAddress mHostAddress;
    private int mHostPort;
    private Context mContext;
    private String mDiscoveryServiceType;
    private boolean mDiscoveryStarted = false;
    private OpenrapDiscoveryListener mNsdListener; 

    private ResolveListener mResolveListener = new ResolveListener() {

        @Override
        public void onResolveFailed(NsdServiceInfo serviceInfo, int errorCode) {

        }

        @Override
        public void onServiceResolved(NsdServiceInfo serviceInfo) {
            mHostAddress = serviceInfo.getHost();
            mHostPort = serviceInfo.getPort();

            if (mNsdListener != null) {
                mNsdListener.onNsdServiceResolved(serviceInfo);
            }

            connectToHost(serviceInfo);
        }
    };

    private DiscoveryListener mDiscoveryListener = new DiscoveryListener() {

        @Override
        public void onStartDiscoveryFailed(String serviceType, int errorCode) {
            stopDiscovery();
        }

        @Override
        public void onStopDiscoveryFailed(String serviceType, int errorCode) {

        }

        @Override
        public void onDiscoveryStarted(String serviceType) {

        }

        @Override
        public void onDiscoveryStopped(String serviceType) {

        }

        @Override
        public void onServiceFound(final NsdServiceInfo serviceInfo) {
            Log.d(TAG, "onServiceFound: ");

            if (mNsdListener != null) {
                mNsdListener.onNsdServiceFound(serviceInfo);
            }

            resolveService(serviceInfo);
        }

        @Override
        public void onServiceLost(NsdServiceInfo serviceInfo) {
            if (mNsdListener != null) {
                mNsdListener.onNsdServiceLost(serviceInfo);
            }
        }
    };

    public OpenrapDiscoveryHelper(Context context, OpenrapDiscoveryListener nsdListener) {
        this.mContext = context;
        this.mNsdManager = (NsdManager) mContext.getSystemService(Context.NSD_SERVICE);
        this.mNsdListener = nsdListener;
    }

    public void startDiscovery(String serviceType, String serviceName) {
        if (!mDiscoveryStarted) {
            mDiscoveryStarted = true;
            mDiscoveryServiceType = serviceType;
            mNsdManager.discoverServices(mDiscoveryServiceType, PROTOCOL_DNS_SD, mDiscoveryListener);
        }
    }

    private void stopDiscovery() {

        if (mDiscoveryStarted) {
            mDiscoveryStarted = false;
            mNsdManager.stopServiceDiscovery(mDiscoveryListener);
        }

        if (mNsdListener != null) {
            mNsdListener.onNsdDiscoveryFinished();
        }
    }

    private void resolveService(NsdServiceInfo nsdServiceInfo) {
        mNsdManager.resolveService(nsdServiceInfo, mResolveListener);
    }

    private void connectToHost(final NsdServiceInfo nsdServiceInfo) {
        new ConnectToOpenrapAsyncTask(mHostAddress, mHostPort, new ConnectToOpenrapAsyncTask.OnConnectionCompleted() {
            @Override
            public void onConnectionCompleted(boolean isConnectionDone) {
                mNsdListener.onConnectedToService(nsdServiceInfo);
            }

        }).execute();
    }

}
