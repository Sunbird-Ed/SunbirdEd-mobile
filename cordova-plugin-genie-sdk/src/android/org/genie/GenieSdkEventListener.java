package org.genie;

import com.google.gson.Gson;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.ekstep.genieservices.commons.bean.ContentImportResponse;
import org.ekstep.genieservices.commons.bean.DownloadProgress;
import org.ekstep.genieservices.commons.bean.ImportContentProgress;
import org.ekstep.genieservices.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;

/**
 * @author vinayagasundar
 */

public class GenieSdkEventListener {
    private static GenieSdkEventListener instance = null;
    private final CallbackContext mCallback;
    private final Gson mGson;

    private GenieSdkEventListener(CallbackContext mCallback) {
        this.mCallback = mCallback;
        mGson = new Gson();
        register();
    }

    static void init(CallbackContext callbackContext) {
        instance = new GenieSdkEventListener(callbackContext);
    }

    static void destroy() {
        instance.unregister();
    }

    private void register() {
        EventBus.registerSubscriber(this);
    }

    private void unregister() {
        EventBus.unregisterSubscriber(this);
    }

    @Subscribe()
    public void onContentImportResponse(ContentImportResponse contentImportResponse)
            throws InterruptedException {

        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK,
                mGson.toJson(contentImportResponse));
        pluginResult.setKeepCallback(true);

        mCallback.sendPluginResult(pluginResult);
    }

    @Subscribe()
    public void onImportContentProgress(ImportContentProgress importContentProgress)
            throws InterruptedException {

        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK,
                mGson.toJson(importContentProgress));
        pluginResult.setKeepCallback(true);

        mCallback.sendPluginResult(pluginResult);
    }


    @Subscribe()
    public void onDownloadProgress(DownloadProgress downloadProgress)
            throws InterruptedException {
        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK,
                mGson.toJson(downloadProgress));
        pluginResult.setKeepCallback(true);

        mCallback.sendPluginResult(pluginResult);
    }
}
