import { Injectable } from '@angular/core';
import { FileUtil } from 'sunbird';
import * as _ from 'lodash';

@Injectable()
export class CourseUtilService {

    constructor(private fileUtil: FileUtil) {
    }

    getCourseProgress(leafNodeCount: any, progress: number) {
        if (leafNodeCount === 0 || leafNodeCount === '0' || leafNodeCount === undefined) {
            return 0;
        }

        const returnData = ((progress / leafNodeCount) * 100);

        if (isNaN(returnData)) {
            return 0;
        } else if (returnData > 100) {
            return 100;
        } else {
            const cProgress = String(returnData);
            return cProgress.split('.')[0];
        }
    }

    getImportContentRequestBody(identifiers, isChild: boolean) {
        const requestParams = [];
        _.forEach(identifiers, (value, key) => {
            requestParams.push({
                isChildContent: isChild,
                destinationFolder: this.fileUtil.internalStoragePath(),
                contentId: value,
                correlationData: []
            });
        });

        return _.extend({}, requestParams);
    }
}
