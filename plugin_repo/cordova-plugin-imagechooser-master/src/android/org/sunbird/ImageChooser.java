package org.sunbird;

import android.content.Intent;
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

import static android.app.Activity.RESULT_OK;

/**
 * Created by souvikmondal on 8/1/18.
 */

public class ImageChooser extends CordovaPlugin {

    public final static int IMAGE_CHOOSER_ID = 865;

    private CallbackContext callbackContext;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("imagechooser")) {
            this.callbackContext = callbackContext;
            Intent intent = ImagePicker.getPickImageIntent(this.cordova.getActivity());
            this.cordova.startActivityForResult(this, intent, IMAGE_CHOOSER_ID);
            PluginResult pluginResult = new PluginResult(PluginResult.Status.NO_RESULT);
            pluginResult.setKeepCallback(true);
        }
        return true;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        if (requestCode == IMAGE_CHOOSER_ID && resultCode == RESULT_OK) {
            String picturePath = ImagePicker.getPath(ImagePicker.getImageUriFromResult(
                    cordova.getActivity(), resultCode, intent),
                    cordova.getActivity().getApplicationContext(), cordova.getActivity());
            PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, picturePath);
            pluginResult.setKeepCallback(true);
            this.callbackContext.sendPluginResult(pluginResult);
        }
        super.onActivityResult(requestCode, resultCode, intent);
    }
}
