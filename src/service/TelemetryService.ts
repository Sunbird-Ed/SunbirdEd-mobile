import { Injectable } from "@angular/core";

@Injectable()
export class TelemetryService {


    saveImpression(type: String, pageId: String, subType?: String, correlationData?: Array<{id: String, type: String}>) {
        try {
            (<any>window).GenieSDK.saveImpresseionTelemetry(type, pageId, subType);
        } catch (error) {
            console.log(error);
        }
    }

    sync() {
        try {
            (<any>window).GenieSDK.syncTelemetry();
        } catch (error) {
            console.log(error);
        }
    }

}