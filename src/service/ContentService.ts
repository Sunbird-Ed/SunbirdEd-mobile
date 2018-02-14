import {Injectable} from '@angular/core';

@Injectable()
export class ContentService {

    importContent(contentId: String, destinationFolder: String, 
        isChildContent?: Boolean, correlationData?: Array<{id: String, type: String}>) {

            try {
                (<any>window).GenieSDK.importContent(contentId, destinationFolder, isChildContent, correlationData);
            } catch (error) {
                console.log(error);
            }
    }
}