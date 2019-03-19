package org.sunbird.utm;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import com.google.android.gms.analytics.CampaignTrackingReceiver;
import com.google.gson.Gson;

import org.ekstep.genieservices.commons.bean.GenericEvent;
import org.ekstep.genieservices.eventbus.EventBus;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.LinkedHashMap;
import java.util.Map;


public class ReferrerReceiver extends BroadcastReceiver {

    private static final String TAG = "ReferrerReceiver";

    private static final String UTM_CAMPAIGN = "utm_campaign";
    private static final String UTM_SOURCE = "utm_source";
    private static final String UTM_MEDIUM = "utm_medium";
    private static final String UTM_TERM = "utm_term";
    private static final String UTM_CONTENT = "utm_content"; 


    private final String[] sources = {
            UTM_CAMPAIGN, UTM_SOURCE, UTM_MEDIUM, UTM_TERM, UTM_CONTENT
    };

    public static JSONObject utmInfo = new JSONObject();


    private static Map<String, String> getHashMapFromQuery(String query) throws UnsupportedEncodingException {

        Map<String, String> query_pairs = new LinkedHashMap<>();

        String[] pairs = query.split("&");
        for (String pair : pairs) {
            int idx = pair.indexOf("=");
            query_pairs.put(URLDecoder.decode(pair.substring(0, idx), "UTF-8"), URLDecoder.decode(pair.substring(idx + 1), "UTF-8"));
        }

        return query_pairs;
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        Bundle extras = intent.getExtras();


        if (extras == null) {
            return;
        }

        String referrerString = extras.getString("referrer");

        //LogUtil.i(TAG, "referrerString: " + referrerString);
        if (referrerString != null || referrerString.length() != 0) {

            try {
                Map<String, String> getParams = getHashMapFromQuery(referrerString);
                int i;
                UTMData utmData = new UTMData();
                utmData.setAction("INSTALL");

                for (i = 0; i < sources.length; i++) {
                    String sourceType = sources[i];
                    String source = getParams.get(sourceType);

                    if (source != null) {
                        if (sourceType.equalsIgnoreCase(UTM_CAMPAIGN)) {
                            utmData.setUtmcampaign(source);
                        } else if (sourceType.equalsIgnoreCase(UTM_SOURCE)) {
                            utmData.setUtmsource(source);
                        } else if (sourceType.equalsIgnoreCase(UTM_MEDIUM)) {
                            utmData.setUtmmedium(source);
                        } else if (sourceType.equalsIgnoreCase(UTM_TERM)) {
                            utmData.setUtmterm(source);
                        } else if (sourceType.equalsIgnoreCase(UTM_CONTENT)) {
                            utmData.setUtmcontent(source);
                        }
                    }
                }
                if (i == sources.length) {
                    Gson gson = new Gson();
                    String info = gson.toJson(utmData);
                    try {
                        utmInfo.put("actionType","utmInfo");
                        utmInfo.put("utmInformation",info);
                        EventBus.postEvent(new GenericEvent(utmInfo.toString()));
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
                //        TODO: (s)to be implemented
//                TelemetryHandler.saveTelemetry(TelemetryBuilder.buildGEUpdate(utmData));

            } catch (UnsupportedEncodingException e) {
                //LogUtil.e(TAG, "Referrer Error: " + e.getMessage());
            } finally {
                // Pass along to google
                CampaignTrackingReceiver receiver = new CampaignTrackingReceiver();
                receiver.onReceive(context, intent);
            }
        }

    }

}
