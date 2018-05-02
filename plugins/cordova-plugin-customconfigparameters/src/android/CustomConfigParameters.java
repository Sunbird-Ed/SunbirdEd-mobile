package org.apache.cordova.customconfigparameters;

import java.util.Locale;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


public class CustomConfigParameters extends CordovaPlugin {


    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
    	JSONObject options = new JSONObject();
        if (action.equals("get")) {
        	try{
				
                for(int i=0;i<args.length();i++){
					
        	        String key=args.getString(i);
                    String keyvalue = preferences.getString(key,null);      
                    if (keyvalue != null) {
                        options.put(key, keyvalue);
                    }
					
                }
                callbackContext.success(options);
        	} catch (Exception ex) {
            	callbackContext.error(0);
            }
            return true;
        }
        return false;
    }
}
