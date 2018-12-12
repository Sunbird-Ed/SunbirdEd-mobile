import { Injectable } from '@angular/core';
import {
    TelemetryService,
    Interact,
    Rollup,
    CorrelationData,
    TelemetryObject,
    Impression,
    Log,
    Start,
    Environment,
    Mode,
    End,
    ExData,
    Error,
    InteractType,
    InteractSubtype,
    ImpressionType,
    PageId
} from 'sunbird';
import { Map } from '../app/telemetryutil';

@Injectable()
export class TelemetryGeneratorService {
    constructor(private telemetryService: TelemetryService) {
    }

    generateInteractTelemetry(interactType, subType, env, pageId, object?: TelemetryObject, values?: Map,
        rollup?: Rollup, corRelationList?: Array<CorrelationData>) {
        const interact = new Interact();
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

    generateImpressionTelemetry(type, subtype, pageid, env, objectId?: string, objectType?: string,
        objectVersion?: string, rollup?: Rollup, corRelationList?: Array<CorrelationData>) {
        const impression = new Impression();
        impression.type = type;
        impression.subType = subtype;
        impression.pageId = pageid;
        impression.env = env;
        impression.objId = objectId ? objectId : '';
        impression.objType = objectType ? objectType : '';
        impression.objVer = objectVersion ? objectVersion : '';

        if (rollup !== undefined) {
            impression.rollup = rollup;
        }
        if (corRelationList !== undefined) {
            impression.correlationData = corRelationList;
        }
        this.telemetryService.impression(impression);
    }

    generateEndTelemetry(type, mode, pageId, env, object?: TelemetryObject, rollup?: Rollup, corRelationList?: Array<CorrelationData>) {
        const end = new End();
        end.type = type;
        end.pageId = pageId;
        end.env = env;
        end.mode = mode;
        if (object && object.id) {
            end.objId = object.id;
        }

        if (object && object.type) {
            end.objType = object.type;
        }

        if (object && object.version) {
            end.objVer = object.version;
        }
        if (rollup) {
            end.rollup = rollup;
        }
        if (corRelationList) {
            end.correlationData = corRelationList;
        }
        this.telemetryService.end(end);
    }

    generateStartTelemetry(pageId, object?: TelemetryObject, rollup?: Rollup, corRelationList?: Array<CorrelationData>) {
        const start = new Start();
        start.type = object.type;
        start.pageId = pageId;
        start.env = Environment.HOME;
        start.mode = Mode.PLAY;
        if (object && object.id) {
            start.objId = object.id;
        }

        if (object && object.type) {
            start.objType = object.type;
        }

        if (object && object.version) {
            start.objVer = object.version;
        }
        if (rollup !== undefined) {
            start.rollup = rollup;
        }
        if (corRelationList !== undefined) {
            start.correlationData = corRelationList;
        }

        this.telemetryService.start(start);
    }

    generateLogEvent(logLevel, message, env, type, params: Array<any>) {
        const log = new Log();
        log.level = logLevel;
        log.message = message;
        log.env = env;
        log.type = type;
        log.params = params;
        this.telemetryService.log(log);
    }

    generateExDataTelemetry(type, data) {
        const exData = new ExData();
        exData.type = type;
        exData.data = data;
        this.telemetryService.exdata(exData);
    }

    generateErrorTelemetry(env, errCode, errorType, pageId, stackTrace) {
        const error = new Error();
        error.env = env;
        error.errorCode = errCode;
        error.errorType = errorType;
        error.pageId = pageId;
        error.stacktrace = stackTrace;
        this.telemetryService.error(error);
    }

    generateBackClickedTelemetry(pageId, env, isNavBack: boolean, identifier?: string, corRelationList?) {
        const values = new Map();
        if (identifier) {
            values['identifier'] = identifier;
        }
        this.generateInteractTelemetry(
            InteractType.TOUCH,
            isNavBack ? InteractSubtype.NAV_BACK_CLICKED : InteractSubtype.DEVICE_BACK_CLICKED,
            env,
            pageId,
            undefined,
            values,
            corRelationList);

    }

    generatePageViewTelemetry(pageId, env, subType?) {
        this.generateImpressionTelemetry(ImpressionType.VIEW, subType ? subType : '',
            pageId,
            env);
    }

    generateSpineLoadingTelemetry(content: any, isFirstTime) {
        const values = new Map();
        values['isFirstTime'] = isFirstTime;
        values['size'] = content.size;
        const telemetryObject: TelemetryObject = new TelemetryObject();
        telemetryObject.id = content.identifier || content.contentId;
        telemetryObject.type = content.contentType;
        telemetryObject.version = content.pkgVersion;
        this.generateInteractTelemetry(
            InteractType.OTHER,
            InteractSubtype.LOADING_SPINE,
            Environment.HOME,
            PageId.DOWNLOAD_SPINE,
            telemetryObject,
            values);
    }

    generateCancelDownloadTelemetry(content: any) {
        const values = new Map();
        const telemetryObject: TelemetryObject = new TelemetryObject();
        telemetryObject.id = content.identifier || content.contentId;
        telemetryObject.type = content.contentType;
        telemetryObject.version = content.pkgVersion;
        this.generateInteractTelemetry(
            InteractType.TOUCH,
            InteractSubtype.CANCEL_CLICKED,
            Environment.HOME,
            PageId.DOWNLOAD_SPINE,
            telemetryObject,
            values);
    }

    generateDownloadAllClickTelemetry(pageId, content, downloadingIdentifier, childrenCount) {
        const values = new Map();
        values['downloadingIdentifers'] = downloadingIdentifier;
        values['childrenCount'] = childrenCount;
        const telemetryObject: TelemetryObject = new TelemetryObject();
        telemetryObject.id = content.identifier || content.contentId;
        telemetryObject.type = content.contentType;
        telemetryObject.version = content.pkgVersion;
        this.generateInteractTelemetry(
            InteractType.TOUCH,
            InteractSubtype.DOWNLOAD_ALL_CLICKED,
            Environment.HOME,
            pageId,
            telemetryObject,
            values);
    }

    generatePullToRefreshTelemetry(pageId, env) {
        this.generateInteractTelemetry(
            InteractType.TOUCH,
            InteractSubtype.PULL_TO_REFRESH,
            env,
            pageId
        );
    }

    /**
   * method generates telemetry on click Read less or Read more
   * @param {string} param string as read less or read more
   * @param {object} objRollup object roll up
   * @param corRelationList corelationList
   */
  readLessOrReadMore(param, objRollup, corRelationList, telemetryObject) {
    this.generateInteractTelemetry(InteractType.TOUCH,
        param === 'READ_MORE' ? InteractSubtype.READ_MORE_CLICKED : InteractSubtype.READ_LESS_CLICKED,
        Environment.HOME,
        PageId.COLLECTION_DETAIL,
        undefined,
        telemetryObject,
        objRollup,
        corRelationList);
    }

    generateProfilePopulatedTelemetry(pageId, frameworkId, mode) {
        const values = new Map();
        values['frameworkId'] = frameworkId;
        values['mode'] = mode;
        this.generateInteractTelemetry(
            InteractType.OTHER,
            InteractSubtype.PROFILE_ATTRIBUTE_POPULATION,
            Environment.HOME,
            pageId,
            undefined,
            values);
    }

    generateExtraInfoTelemetry(values: Map, pageId) {
        this.generateInteractTelemetry(
            InteractType.OTHER,
            InteractSubtype.EXTRA_INFO,
            Environment.HOME,
            pageId,
            undefined,
            values);
    }

    generateContentCancelClickedTelemetry(content: any, downloadProgress) {
        const values = new Map();
        values['size'] = this.transform(content.size);
        if (content.size && downloadProgress) {
            const kbsofar = (content.size / 100) * Number(downloadProgress);
            values['downloadedSoFar'] = this.transform(kbsofar);
        }
        const telemetryObject: TelemetryObject = new TelemetryObject();
        telemetryObject.id = content.identifier || content.contentId;
        telemetryObject.type = content.contentType;
        telemetryObject.version = content.pkgVersion;
        this.generateInteractTelemetry(
            InteractType.TOUCH,
            InteractSubtype.CANCEL_CLICKED,
            Environment.HOME,
            PageId.CONTENT_DETAIL,
            telemetryObject,
            values);
    }

    transform(size: any, roundOf: number = 2) {
        if (size || size === 0) {
          if (isNaN(size)) {
            size = 0;
          }
          size /= 1024;
          if (size < 1024) {
            return size.toFixed(roundOf) + ' KB';
          }
          size /= 1024;
          if (size < 1024) {
            return size.toFixed(roundOf) + ' MB';
          }
          size /= 1024;
          if (size < 1024) {
            return size.toFixed(roundOf) + ' GB';
          }
          size /= 1024;
          return size.toFixed(roundOf) + ' TB';
        } else {
          return '0 KB';
        }
      }

}
