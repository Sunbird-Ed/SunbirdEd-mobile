package org.sunbird.customtabs;

import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

public class CustomTabsPlugin extends CordovaPlugin {

    private static final String ACTION_IS_AVAILABLE = "isAvailable";
    private static final String ACTION_LAUNCH = "launch";
    private static final String ACTION_LAUNCH_BROWSER = "launchInBrowser";
    private static final String ACTION_CLOSE = "close";

    private static CordovaContext tokenCallbackContext;

    private CustomTabsHelper customTabsHelper;
    private boolean isCustomTabsAvailable;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        customTabsHelper = new CustomTabsHelper();
        isCustomTabsAvailable = customTabsHelper.initCustomTabs(cordova.getActivity());
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        boolean handled = false;
        switch (action) {
            case ACTION_IS_AVAILABLE:
                if (isCustomTabsAvailable) {
                    callbackContext.success();
                } else {
                    callbackContext.error("Custom tabs not available.");
                }
                handled = true;
                break;
            case ACTION_LAUNCH:
                tokenCallbackContext = new CordovaContext(cordova.getActivity(), callbackContext);
                customTabsHelper.launchUrl(args.getString(0), cordova.getActivity());
                handled = true;
                break;
            case ACTION_LAUNCH_BROWSER:
                tokenCallbackContext = new CordovaContext(cordova.getActivity(), callbackContext);
                launchUrlInBrowser(args.getString(0));
                handled = true;
                break;
            case ACTION_CLOSE:
                handled = true;
                break;
        }
        return handled;
    }

    private void launchUrlInBrowser(String url) {
        Intent intent=new Intent(Intent.ACTION_VIEW, Uri.parse(url));
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.setPackage("com.android.chrome");
        try {
            cordova.getActivity().startActivity(intent);
        } catch (ActivityNotFoundException ex) {
            // Chrome browser presumably not installed so allow user to choose instead
            intent.setPackage(null);
            cordova.getActivity().startActivity(intent);
        }
    }

    public static void onTokenRecieved(String token, Context context) {
        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, token);
        pluginResult.setKeepCallback(true);
        tokenCallbackContext.getCallbackContext().sendPluginResult(pluginResult);
        context.startActivity(new Intent(context, tokenCallbackContext.getCordovaMainActivity().getClass()));
    }
}