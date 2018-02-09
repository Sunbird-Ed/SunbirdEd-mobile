import { Injectable } from "@angular/core";

export class CorrelationData {
    id: string; 
    type: string;
}

export class Rollup {
    l1: string;
    l2: string; 
    l3: string; 
    l4: string;
}

export class Visit {
    objid: string;
    objtype: string;
    objver: string;
    section: string;
    index: number;
}

export class Impression {
    type: string; 
    pageId: string; 
    subType: string; 
    uri: string;
    objectId: string;
    correlationData: Array<CorrelationData>;
    objectType: string;
    objectVersion: string;
    rollup?: Rollup
}

@Injectable()
export class TelemetryService {

    impression(impression: Impression) {
        try {
            (<any>window).GenieSDK.telemetry.impression(JSON.stringify(impression));
        } catch (error) {
            console.log(error);
        }
    }

    sync() {
        try {
            (<any>window).GenieSDK.telemetry.sync();
        } catch (error) {
            console.log(error);
        }
    }

}