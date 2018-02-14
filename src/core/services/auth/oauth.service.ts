import { Injectable } from "@angular/core";
import { Platform } from "ionic-angular";

@Injectable()
export class OAuthService {

    redirect_url = "https://staging.open-sunbird.org/oauth2callback";

    auth_url= "https://staging.open-sunbird.org/auth/realms/" + 
    "sunbird/protocol/openid-connect/auth?redirect_uri=${R}" + 
    "&response_type=code&scope=openid&client_id=${CID}&scope=openid";

    constructor(private platform: Platform) {
        this.auth_url = this.auth_url.replace("${CID}", this.platform.is("android")?"android":"ios");
        this.auth_url = this.auth_url.replace("${R}", this.redirect_url);
    }

    doAuth(): Promise<any> {
        let that = this;
        return new Promise(function(resolve, reject) {
            var browserRef = (<any>window).cordova.InAppBrowser.open(this.auth_url);
            browserRef.addEventListener("loadstart", (event) => {
                if ((event.url).indexOf(that.redirect_url) === 0) {
                    browserRef.removeEventListener("exit", (event) => {});
                    browserRef.close();
                    var responseParameters = ((event.url).split("#")[1]).split("&");
                    var parsedResponse = {};
                    for (var i = 0; i < responseParameters.length; i++) {
                        parsedResponse[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
                    }
                    if (parsedResponse["access_token"] !== undefined 
                        && parsedResponse["access_token"] !== null) {
                        resolve(parsedResponse);
                    } else {
                        reject("Problem authenticating with Sunbird");
                    }
                }
            });
            browserRef.addEventListener("exit", function(event) {
                reject("The Sunbird sign in flow was canceled");
            });
        });
    }

}