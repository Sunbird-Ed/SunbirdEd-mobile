import { Injectable } from "@angular/core";

@Injectable()
export class CourseUtilService {

    /**
     * 
     */
    constructor() {
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
}