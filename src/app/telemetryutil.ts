import { Impression, Interact, Start, Mode, Environment, End, Rollup, CorrelationData } from "sunbird";


export function generateImpressionTelemetry(type, subtype, pageid, env, objectId, objectType, objectVersion, rollup: Rollup, corRelationList: Array<CorrelationData>): Impression {
    let impression = new Impression();
    impression.type = type;
    impression.subType = subtype;
    impression.pageId = pageid;
    impression.env = env;
    impression.objId = objectId;
    impression.objType = objectType;
    impression.objVer = objectVersion;

    if (rollup !== undefined) {
        impression.rollup = rollup;
    }
    if (corRelationList !== undefined) {
        impression.correlationData = corRelationList;
    }
    return impression;
}

export function generateInteractTelemetry(interactType, subType, env, pageId, values: Map,rollup: Rollup, corRelationList: Array<CorrelationData>): Interact {
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
    return interact;
}

export function generateStartTelemetry(pageId, objectId, objectType, objectVersion,rollup: Rollup, corRelationList: Array<CorrelationData>): Start {
    let start = new Start();
    start.type = objectType;
    start.pageId = pageId;
    start.env = Environment.HOME;
    start.mode = Mode.PLAY;
    start.objId = objectId;
    start.objType = objectType;
    start.objVer = objectVersion;
    if (rollup !== undefined) {
        start.rollup = rollup;
    }
    if (corRelationList !== undefined) {
        start.correlationData = corRelationList;
    }

    return start;
}

export function generateEndTelemetry(type, mode, pageId, objectId, objectType, objectVersion,rollup: Rollup, corRelationList: Array<CorrelationData>): End {
    let end = new End();
    end.type = type;
    end.pageId = pageId;
    end.env = Environment.HOME;
    end.mode = mode;
    end.objId = objectId;
    end.objType = objectType;
    end.objVer = objectVersion;
    if (rollup !== undefined) {
        end.rollup = rollup;
    }
    if (corRelationList !== undefined) {
        end.correlationData = corRelationList;
    }
    return end;
}
export class Map {
    [key: string]: any
}
