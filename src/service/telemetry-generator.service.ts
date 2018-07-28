import { Injectable } from "@angular/core";
import { TelemetryService, Interact, Rollup, CorrelationData, TelemetryObject, Impression } from "sunbird";
import { Map } from "../app/telemetryutil";

@Injectable()
export class TelemetryGeneratorService {
    constructor(private telemetryService: TelemetryService) {

    }

    generateInteractTelemetry(interactType, subType, env, pageId, object?: TelemetryObject, values?: Map, rollup?: Rollup, corRelationList?: Array<CorrelationData>) {
        let interact = new Interact();
        interact.type = interactType;
        interact.subType = subType;
        interact.pageId = pageId;
        interact.id = pageId;
        interact.env = env;
        if (values !== null) {
            interact.valueMap = values;
        }
        if (rollup !== undefined) {
            interact.rollup = rollup;
        }
        if (corRelationList !== undefined) {
            interact.correlationData = corRelationList;
        }

        if (object && object.id) {
            interact.objId = object.id;
        }

        if (object && object.type) {
            interact.objType = object.type;
        }

        if (object && object.version) {
            interact.objVer = object.version;
        }
        this.telemetryService.interact(interact);
    }


    generateImpressionTelemetry(type, subtype, pageid, env, objectId?: string, objectType?: string, objectVersion?: string, rollup?: Rollup, corRelationList?: Array<CorrelationData>) {
        let impression = new Impression();
        impression.type = type;
        impression.subType = subtype;
        impression.pageId = pageid;
        impression.env = env;
        impression.objId = objectId ? objectId : "";
        impression.objType = objectType ? objectType : "";
        impression.objVer = objectVersion ? objectVersion : "";

        if (rollup !== undefined) {
            impression.rollup = rollup;
        }
        if (corRelationList !== undefined) {
            impression.correlationData = corRelationList;
        }
        this.telemetryService.impression(impression);
    }

}