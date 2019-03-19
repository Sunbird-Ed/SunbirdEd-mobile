package org.sunbird.sync;

import org.ekstep.genieservices.GenieService;
import org.ekstep.genieservices.ServiceConstants;
import org.ekstep.genieservices.async.TelemetryService;
import org.ekstep.genieservices.commons.IResponseHandler;
import org.ekstep.genieservices.commons.bean.GenieResponse;
import org.ekstep.genieservices.commons.bean.SyncStat;
import org.ekstep.genieservices.commons.bean.TelemetryStat;
import org.ekstep.genieservices.commons.bean.telemetry.Error;
import org.ekstep.genieservices.commons.bean.telemetry.Telemetry;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Created by swayangjit on 25/4/18.
 */
public class TelemetrySyncOperation {
    private static final String TAG = TelemetrySyncOperation.class.getSimpleName();
    private static boolean mIsSyncInProgress = false;
    private static long mSyncInterval=30;
    private static ScheduledExecutorService mExecutor;
    private static int mInitialDelay = 2;

    /**
     * This method starts syncing telemetry with the specified time
     * <p>
     * Default Sync time is 30secs
     */
    public static void startSyncingTelemetry() {
        shutDownSchedulers();
        mExecutor = Executors.newScheduledThreadPool(1);
        mExecutor.scheduleAtFixedRate(new Runnable() {
            @Override
            public void run() {
                if (!mIsSyncInProgress) {
                    syncBasedOnNumberOfUnsyncedEvents();
                }
            }
        }, getInitialDelay(), mSyncInterval, TimeUnit.SECONDS);
    }


    /**
     * This method checks the number of unsynced events and only if the unsynced events are more than 3 from last synct time,
     * then it syncs
     */
    private static void syncBasedOnNumberOfUnsyncedEvents() {
        final TelemetryService telemetryService = GenieService.getAsyncService().getTelemetryService();
        telemetryService.getTelemetryStat(new IResponseHandler<TelemetryStat>() {
            @Override
            public void onSuccess(GenieResponse<TelemetryStat> genieResponse) {
                TelemetryStat telemetryStat = genieResponse.getResult();
                if (telemetryStat != null) {
                    if (telemetryStat.getUnSyncedEventCount() >= 3) {
                        mIsSyncInProgress = true;
                        autoSync();
                    }
                }
            }

            @Override
            public void onError(GenieResponse<TelemetryStat> genieResponse) {

            }
        });
    }

    private static void autoSync() {
        if (getConfiguration().canSync(GenieService.getService().getConnectionInfo())) {

            GenieService.getAsyncService().getSyncService().sync(new IResponseHandler<SyncStat>() {
                @Override
                public void onSuccess(GenieResponse<SyncStat> genieResponse) {
                    mIsSyncInProgress = false;
                }

                @Override
                public void onError(GenieResponse<SyncStat> genieResponse) {
                    mIsSyncInProgress = false;
                    String error = genieResponse.getError();
                    if (error != null && !error.equalsIgnoreCase(ServiceConstants.ErrorCode.THRESHOLD_LIMIT_NOT_REACHED)) {
                        saveTelemetry(buildErrorEvent("auto-sync-failed", "auto-sync-failed"));
                    }

                }
            });
        }
    }

    public static Error buildErrorEvent(String errorCode, String stackTrace) {
        Error error = new Error.Builder().environment("app").errorCode(errorCode).
                errorType(Error.Type.MOBILE_APP).stacktrace(stackTrace).build();
        return error;
    }

    public static void saveTelemetry(Telemetry telemetry) {
        GenieService.getAsyncService().getTelemetryService().saveTelemetry(telemetry, new IResponseHandler<Void>() {
            @Override
            public void onSuccess(GenieResponse<Void> genieResponse) {

            }

            @Override
            public void onError(GenieResponse<Void> genieResponse) {

            }
        });
    }

    public static SyncConfiguration getConfiguration() {
        String syncConfig = GenieService.getService().getKeyStore().getString("sunbirdsync_config", SyncConfiguration.ALWAYS_ON.toString());
        return SyncConfiguration.valueOf(syncConfig);
    }


    /**
     * This method shuts down all the threads
     */
    public static void shutDownSchedulers() {
        if (mExecutor != null) {
            mExecutor.shutdown();
        }
    }

    public static int getInitialDelay() {
        return mInitialDelay;
    }

    public static void setInitialDelay(int delay) {
        mInitialDelay = delay;
    }
}
