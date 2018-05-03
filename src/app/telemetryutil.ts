import { Impression, Interact, Start, Mode, Environment, End } from "sunbird";

export function generateImpressionEvent(type, pageid, env, objectId, objectType, objectVersion): Impression {
    let impression = new Impression();
    impression.type = type;
    impression.pageId = pageid;
    impression.env = env;
    impression.objId = objectId;
    impression.objType = objectType;
    impression.objVer = objectVersion;
    return impression;
}

export function generateInteractEvent(interactType, subType, env, pageId,values:Map ): Interact {
    let interact = new Interact();
    interact.type = interactType;
    interact.subType = subType;
    interact.pageId = pageId;
    interact.id = pageId;
    interact.env = env;
    if(values!== undefined){
        interact.valueMap=values;
    }
    return interact;
}

export function generateStartEvent(pageId,objectId, objectType, objectVersion): Start {
    let start = new Start();
    start.type = objectType;
    start.pageId = pageId;
    start.env = Environment.HOME;
    start.mode = Mode.PLAY;
    start.objId = objectId;
    start.objType = objectType;
    start.objVer = objectVersion;
    return start;
}

export function generateEndEvent(type,mode,pageId,objectId, objectType, objectVersion): End {
    let end = new End();
    end.type = type;
    end.pageId = pageId;
    end.env = Environment.HOME;
    end.mode = mode;
    end.objId = objectId;
    end.objType = objectType;
    end.objVer = objectVersion;
    return end;
}

export class Map {
    [key: string]: any
  }
