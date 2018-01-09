import { Injectable } from "@angular/core";

@Injectable()
export class TelemetryService {


    saveImpression(type: String, pageId: String, subType?: String, correlationData?: Array<{id: String, type: String}>) {
        (<any>window).GenieSDK.saveImpresseionTelemetry(type, pageId, subType);
    }

    sync() {
        (<any>window).GenieSDK.syncTelemetry();
    }

}