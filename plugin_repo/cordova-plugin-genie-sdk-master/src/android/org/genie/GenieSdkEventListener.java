package org.genie;

import com.google.gson.Gson;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.ekstep.genieservices.commons.bean.ContentImportResponse;
import org.ekstep.genieservices.commons.bean.ContentUpdateAvailable;
import org.ekstep.genieservices.commons.bean.DownloadProgress;
import org.ekstep.genieservices.commons.bean.GenericEvent;
import org.ekstep.genieservices.commons.bean.ImportContentProgress;
import org.ekstep.genieservices.commons.bean.StreamingUrlAvailable;
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
                mGson.toJson(new EventResponse(EventResponse.TYPE_CONTENT_IMPORT_RESPONSE, contentImportResponse)));
        pluginResult.setKeepCallback(true);

        mCallback.sendPluginResult(pluginResult);
    }

    @Subscribe()
    public void onImportContentProgress(ImportContentProgress importContentProgress)
            throws InterruptedException {

        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK,
                mGson.toJson(new EventResponse(EventResponse.TYPE_CONTENT_IMPORT_PROGRESS, importContentProgress)));
        pluginResult.setKeepCallback(true);

        mCallback.sendPluginResult(pluginResult);
    }


    @Subscribe()
    public void onDownloadProgress(DownloadProgress downloadProgress)
            throws InterruptedException {
        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK,
                mGson.toJson(new EventResponse(EventResponse.TYPE_DOWNLOAD_PRGORESS, downloadProgress)));
        pluginResult.setKeepCallback(true);

        mCallback.sendPluginResult(pluginResult);
    }

    @Subscribe()
    public void onContentUpdateAvailable(ContentUpdateAvailable contentUpdateAvailable)
            throws InterruptedException {
        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK,
                mGson.toJson(new EventResponse(EventResponse.TYPE_CONTENT_UPDATE_AVAILALE, contentUpdateAvailable)));
        pluginResult.setKeepCallback(true);

        mCallback.sendPluginResult(pluginResult);
    }

    @Subscribe()
    public void onStreamingUrlAvailable(StreamingUrlAvailable streamingUrlAvailable)
            throws InterruptedException {
        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK,
                mGson.toJson(new EventResponse(EventResponse.TYPE_STREAMING_URL_AVAILALE, streamingUrlAvailable)));
        pluginResult.setKeepCallback(true);

        mCallback.sendPluginResult(pluginResult);
    }    

    @Subscribe()
    public void onGenericEvent(GenericEvent genericEvent)
            throws InterruptedException {
        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK,
                mGson.toJson(new EventResponse(EventResponse.TYPE_GENERIC_EVENT, genericEvent)));
        pluginResult.setKeepCallback(true);

        mCallback.sendPluginResult(pluginResult);
    }

    public class EventResponse {
        public static final String TYPE_CONTENT_IMPORT_RESPONSE = "contentImport";
        public static final String TYPE_CONTENT_IMPORT_PROGRESS = "contentImportProgress";
        public static final String TYPE_DOWNLOAD_PRGORESS = "downloadProgress";
        public static final String TYPE_CONTENT_UPDATE_AVAILALE = "contentUpdateAvailable";
        public static final String TYPE_STREAMING_URL_AVAILALE = "streamingUrlAvailable";
        public static final String TYPE_GENERIC_EVENT = "genericEvent";

        public final String type;
        public final Object data;

        public EventResponse(String type, Object data) {
            this.type = type;
            this.data = data;
        }

    }
}
