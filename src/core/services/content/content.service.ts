import { Injectable } from "@angular/core";

import { ContentDetailRequest, ContentImportRequest } from "./bean";

@Injectable()
export class ContentService {


    getContentDetail(request: {ContentDetailRequest},
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


  importContent(request: ContentImportRequest,
    successCallback: (response: string) => void,
    errorCallback: (error: string) => void) {
    try {
      (<any>window).GenieSDK.content.importContent(
        JSON.stringify(request),
        successCallback, errorCallback);
    } catch (error) {
      console.log(error);
    }
  }

}
