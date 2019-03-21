package org.sunbird.support;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.ekstep.genieservices.utils.BuildConfigUtil;
import org.json.JSONArray;
import org.json.JSONException;
import org.sunbird.SunbirdApplication;

import java.io.IOException;

/**
 * Created on 4/4/18. shriharsh
 * Edited by Subranil on 31/10/18.
 */
public class SunbirdSupport extends CordovaPlugin {

    private CallbackContext callbackContext;
    private CordovaInterface cordova;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        this.cordova = cordova;
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (args.get(0).equals("makeEntryInSunbirdSupportFile")) {
            this.callbackContext = callbackContext;
            String filePath = null;
            final Gson gson = new GsonBuilder().create();
            try {
                final String packageName = this.cordova.getActivity().getPackageName();
                PackageInfo packageInfo = this.cordova.getActivity().getPackageManager().getPackageInfo(packageName, 0);
                final String versionName = packageInfo.versionName;
                final String appFlavor = BuildConfigUtil.getBuildConfigValue(SunbirdApplication.PACKAGE_NAME, "FLAVOR");
                String appName = cordova.getActivity().getString(getIdOfResource(cordova, "_app_name", "string"));
                filePath = SunbirdFileHandler.makeEntryInSunbirdSupportFile(packageName, versionName, appName,
                        appFlavor);
                callbackContext.success(gson.toJson(filePath));
            } catch (PackageManager.NameNotFoundException e) {
                e.printStackTrace();
                callbackContext.error(gson.toJson(filePath));
            } catch (IOException e) {
                e.printStackTrace();
                callbackContext.error(gson.toJson(filePath));
            }
        }
        if (args.get(0).equals("shareSunbirdConfigurations")) {
            this.callbackContext = callbackContext;
            String filePath = null;
            final Gson gson = new GsonBuilder().create();
            try {
                final String packageName = this.cordova.getActivity().getPackageName();
                PackageInfo packageInfo = this.cordova.getActivity().getPackageManager().getPackageInfo(packageName, 0);
                final String versionName = packageInfo.versionName;
                final String appFlavor = BuildConfigUtil.getBuildConfigValue(SunbirdApplication.PACKAGE_NAME, "FLAVOR");
                String appName = cordova.getActivity().getString(getIdOfResource(cordova, "_app_name", "string"));
                filePath = SunbirdFileHandler.shareSunbirdConfigurations(packageName, versionName, appName, appFlavor,
                        cordova.getContext());
                callbackContext.success(gson.toJson(filePath));
            } catch (PackageManager.NameNotFoundException e) {
                e.printStackTrace();
                callbackContext.error(gson.toJson(filePath));
            } catch (IOException e) {
                e.printStackTrace();
                callbackContext.error(gson.toJson(filePath));
            }
        }
        if (args.get(0).equals("removeFile")) {
            this.callbackContext = callbackContext;
            final String appFlavor = BuildConfigUtil.getBuildConfigValue(SunbirdApplication.PACKAGE_NAME, "FLAVOR");
            String appName = cordova.getActivity().getString(getIdOfResource(cordova, "_app_name", "string"));
            SunbirdFileHandler.removeFile(appName, appFlavor);
        }
        return true;
    }

    private int getIdOfResource(CordovaInterface cordova, String name, String resourceType) {
        return cordova.getActivity().getResources().getIdentifier(name, resourceType,
                cordova.getActivity().getApplicationInfo().packageName);
    }
}