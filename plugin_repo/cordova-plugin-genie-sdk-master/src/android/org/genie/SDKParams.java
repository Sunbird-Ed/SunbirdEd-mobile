package org.genie;

import org.ekstep.genieservices.GenieService;
import org.ekstep.genieservices.commons.IParams;
import org.ekstep.genieservices.commons.utils.StringUtil;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by souvikmondal on 25/4/18.
 */

public class SDKParams implements IParams {

    private Map<String, Object> mValues;

    public SDKParams() {
        this.mValues = new HashMap<>();
    }

    public static void setParams() {
        SDKParams params = new SDKParams();
        String channelId = GenieService.getService().getKeyStore().getString("channelId", "");
        if (StringUtil.isNullOrEmpty(channelId)) {
            channelId = null;
        }
        params.put(SDKParams.Key.CHANNEL_ID, channelId);
        GenieService.setParams(params);
    }

    public void put(String key, Object value) {
        this.mValues.put(key, value);
    }

    public String getString(String key) {
        return (String) this.mValues.get(key);
    }

    public long getLong(String key) {
        return ((Long) this.mValues.get(key)).longValue();
    }

    public int getInt(String key) {
        return ((Integer) this.mValues.get(key)).intValue();
    }

    public boolean getBoolean(String key) {
        return ((Boolean) this.mValues.get(key)).booleanValue();
    }

    public boolean contains(String key) {
        return this.mValues.containsKey(key);
    }

    public void remove(String key) {
        this.mValues.remove(key);
    }

    public void clear() {
        this.mValues.clear();
    }
}
