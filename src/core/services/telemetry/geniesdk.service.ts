import { Injectable } from "@angular/core";
import { TelemetryServiceFactory } from "./factory";

@Injectable()
export class GenieSDKServiceFactory extends TelemetryServiceFactory {

    getService(): any {
        return (<any>window).GenieSDK.telemetry;
    }

}