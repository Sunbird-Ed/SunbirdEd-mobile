/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
*/

package org.sunbird;

import android.widget.Toast;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.ekstep.genieservices.GenieService;
import org.ekstep.genieservices.async.UserService;
import org.ekstep.genieservices.commons.IResponseHandler;
import org.ekstep.genieservices.commons.bean.Content;
import org.ekstep.genieservices.commons.bean.ContentAccess;
import org.ekstep.genieservices.commons.bean.GenieResponse;
import org.ekstep.genieservices.commons.utils.GsonUtil;
import org.ekstep.genieservices.utils.ContentPlayer;
import org.json.JSONArray;
import org.json.JSONException;
import java.util.Map;
public class GenieCanvas extends CordovaPlugin {

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("play")) {
            String playContent = args.getString(0);
            String extraInfo = args.getString(1);
            Content content = GsonUtil.fromJson(playContent, Content.class);
            Map extraInfoMap = GsonUtil.fromJson(extraInfo, Map.class);

            String mimeType = content.getMimeType();
            // if (content.isAvailableLocally()) {
                addContentAccess(content.getIdentifier(),content.getContentType());
            // }
            ContentPlayer.play(cordova.getActivity(), content, extraInfoMap);
        }
        return true;
    }

    /**
     *This will mark the  content played status as PLAYED
     *
     * @param identifier
     */
    public static void addContentAccess(String identifier,String contentType) {
        UserService userService = GenieService.getAsyncService().getUserService();
        if (identifier != null) {
            ContentAccess contentAccess = new ContentAccess();
            contentAccess.setStatus(1);
            contentAccess.setContentId(identifier);
            contentAccess.setContentType(contentType);
            userService.addContentAccess(contentAccess, new IResponseHandler<Void>() {
                @Override
                public void onSuccess(GenieResponse<Void> genieResponse) {
                }

                @Override
                public void onError(GenieResponse<Void> genieResponse) {

                }
            });
        }
    }


}
