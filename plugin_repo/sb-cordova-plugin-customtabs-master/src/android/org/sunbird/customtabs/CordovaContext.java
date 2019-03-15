package org.sunbird.customtabs;

import android.app.Activity;

import org.apache.cordova.CallbackContext;

public class CordovaContext {

  private Activity cordovaMainActivity;
  private CallbackContext callbackContext;

  public CordovaContext(Activity cordovaMainActivity, CallbackContext callbackContext) {
    this.cordovaMainActivity = cordovaMainActivity;
    this.callbackContext = callbackContext;
  }

  public CallbackContext getCallbackContext() {
    return callbackContext;
  }

  public Activity getCordovaMainActivity() {
    return cordovaMainActivity;
  }
}
