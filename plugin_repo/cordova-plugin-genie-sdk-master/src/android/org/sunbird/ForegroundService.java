package org.sunbird;

import android.annotation.TargetApi;
import android.app.Activity;
import android.app.Application;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;

import java.util.LinkedList;

/**
 * Created by swayangjit_gwl on 5/28/2016.
 */
@TargetApi(Build.VERSION_CODES.ICE_CREAM_SANDWICH)
public class ForegroundService implements Application.ActivityLifecycleCallbacks {

    private static final int DELAY_MILLIS = 300;
    /**
     *
     */
    private static final int MSG_PAUSED = 1;
    private static ForegroundService sInstance;
    private boolean mForeground = true;
    private boolean mPaused = false;
    private ForegroundHandler mHandler;
    private LinkedList<OnForegroundChangeListener> mListeners;

    private ForegroundService() {
        mHandler = new ForegroundHandler(Looper.getMainLooper());
        mListeners = new LinkedList<OnForegroundChangeListener>();
    }

    /**
     * ForegroundService
     *
     * @return ForegroundService
     */
    public static ForegroundService getInstance() {
        synchronized (ForegroundService.class) {
            if (sInstance == null) {
                sInstance = new ForegroundService();
            }
        }
        return sInstance;
    }

    /**
     * @return
     */
    public boolean isForeground() {
        return mForeground;
    }

    @Override
    public void onActivityCreated(Activity activity, Bundle bundle) {

    }

    @Override
    public void onActivityStarted(Activity activity) {

    }

    @Override
    public void onActivityResumed(Activity activity) {
        mPaused = false;
        mHandler.removeMessages(MSG_PAUSED);
        if (!mForeground) {
            mForeground = true;
            dispatch(mForeground);
        }
    }

    @Override
    public void onActivityPaused(Activity activity) {
        mPaused = true;
        mHandler.removeMessages(MSG_PAUSED);
        mHandler.sendEmptyMessageDelayed(MSG_PAUSED, DELAY_MILLIS);
    }

    @Override
    public void onActivityStopped(Activity activity) {

    }

    @Override
    public void onActivitySaveInstanceState(Activity activity, Bundle bundle) {

    }

    @Override
    public void onActivityDestroyed(Activity activity) {

    }

    /**
     * @param listener listener
     */
    public void registerListener(OnForegroundChangeListener listener) {
        if (listener == null) {
            return;
        }
        synchronized (ForegroundService.class) {
            if (!mListeners.contains(listener)) {
                mListeners.add(listener);
            }
        }
    }

    /**
     * @param listener listener
     */
    public void unregisterListener(OnForegroundChangeListener listener) {
        if (listener == null) {
            return;
        }
        synchronized (ForegroundService.class) {
            mListeners.remove(listener);
        }
    }

    /**
     * @param foreground foreground
     */
    private void dispatch(boolean foreground) {
        synchronized (ForegroundService.class) {
            for (OnForegroundChangeListener listener : mListeners) {
                if (foreground) {
                    listener.onSwitchForeground();
                } else {
                    listener.onSwitchBackground();
                }
            }
        }
    }

    /**
     * OnForegroundChangeListener
     */
    public static interface OnForegroundChangeListener {

        /**
         * onSwitchForeground
         */
        public void onSwitchForeground();

        /**
         * onSwitchBackground
         */
        public void onSwitchBackground();
    }

    /**
     * foreground handler
     */
    private class ForegroundHandler extends Handler {
        /**
         * ForegroundHandler
         *
         * @param looper looper
         */
        public ForegroundHandler(Looper looper) {
            super(looper);
        }

        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            if (MSG_PAUSED == msg.what) {
                if (mForeground && mPaused) {
                    mForeground = false;
                    dispatch(mForeground);
                }
            }
        }
    }

}
