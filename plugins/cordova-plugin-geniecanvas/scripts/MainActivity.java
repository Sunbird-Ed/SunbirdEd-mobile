package org.sunbird.app;

import android.os.Bundle;
import org.apache.cordova.*;
import org.xmlpull.v1.XmlPullParser;

public class MainActivity extends CordovaActivity
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);

        // enable Cordova apps to be started in the background
        Bundle extras = getIntent().getExtras();
        if (extras != null && extras.getBoolean("cdvStartInBackground", false)) {
            moveTaskToBack(true);
        }

        // Set by <content src="index.html" /> in config.xml
        loadUrl(launchUrl);
    }

    @Override
    protected void loadConfig() {
        ConfigXmlParser parser = new ConfigXmlParser();
        parser.parse(parseResult());
        preferences = parser.getPreferences();
        preferences.setPreferencesBundle(getIntent().getExtras());
        launchUrl = parser.getLaunchUrl();
        pluginEntries = parser.getPluginEntries();
        Util.setParser(parser);
    }
    
    private XmlPullParser parseResult() {
        int id =  getResources().getIdentifier("sunbird_config", "xml",  getClass().getPackage().getName());
        if (id == 0) {
            // If we couldn't find config.xml there, we'll look in the namespace from AndroidManifest.xml
            id =  getResources().getIdentifier("sunbird_config", "xml",  getPackageName());
            if (id == 0) {
                LOG.e(TAG, "res/xml/config.xml is missing!");
                return null;
            }
        }
        return getResources().getXml(id);
    }
}
