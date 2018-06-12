import { Injectable } from "@angular/core";
import { FileUtil } from "sunbird";
import * as _ from 'lodash';

@Injectable()
export class CourseUtilService {

    /**
     * 
     */
    constructor(private fileUtil: FileUtil) {
    }

    getCourseProgress(leafNodeCount: any, progress: number) {
        if (leafNodeCount === 0 || leafNodeCount === '0' || leafNodeCount === undefined) {
            console.log('Invalid value of leafNodeCount  found:', leafNodeCount);
            return 0;
        }

        let returnData = ((progress / leafNodeCount) * 100);

        if (isNaN(returnData)) {
            console.log('NaN found');
            return 0;
        } else if (returnData > 100) {
            console.log('Course progress more than 100% found:', returnData);
            return 100;
        } else {
            console.log('Course progress:', returnData);
            let cProgress = String(returnData)
            return cProgress.split(".")[0];
        }
    }

    getImportContentRequestBody(identifiers, isChild: boolean) {
        let requestParams = [];
        _.forEach(identifiers, (value, key) => {
          requestParams.push({
            isChildContent: isChild,
            destinationFolder: this.fileUtil.internalStoragePath(),
            contentId: value,
            correlationData: []
          })
        });

        return _.extend({}, requestParams);
    }
}