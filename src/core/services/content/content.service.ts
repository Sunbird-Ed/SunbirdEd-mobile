import { Injectable } from "@angular/core";

import { ContentDetailRequest } from "./bean";

@Injectable()
export class ContentService {

    getContentDetail(request: ContentDetailRequest, 
        successCallback: (response: string) => void, 
        errorCallback: (error: string) => void) {
        try {
            (<any>window).GenieSDK.content.getContentDetail(
                JSON.stringify(request),
                successCallback, errorCallback);
        } catch (error) {
            console.log(error);
        }
    }

}
