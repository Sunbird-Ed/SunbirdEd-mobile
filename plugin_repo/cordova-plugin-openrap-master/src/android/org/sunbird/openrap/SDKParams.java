package org.sunbird.openrap;

import org.ekstep.genieservices.commons.IParams;

import java.util.HashMap;
import java.util.Map;

public class SDKParams implements IParams {

    private Map<String, Object> mValues;

    public SDKParams() {
        this.mValues = new HashMap<>();
    }

    public void put(String key, Object value) {
        this.mValues.put(key, value);
    }

    public String getString(String key) {
        return (String) this.mValues.get(key);
    }

    public long getLong(String key) {
        return (Long) this.mValues.get(key);
    }

    public int getInt(String key) {
        return (Integer) this.mValues.get(key);
    }

    public boolean getBoolean(String key) {
        return (Boolean) this.mValues.get(key);
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
