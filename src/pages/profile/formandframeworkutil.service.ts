import {
    Injectable
} from '@angular/core';
import {
    FrameworkService,
    CategoryRequest,
    FrameworkDetailsRequest,
    SharedPreferences,
    FormRequest,
    FormService,
    Profile,
    ProfileService
} from 'sunbird';
import { AppGlobalService } from '../../service/app-global.service';
import { AppVersion } from '@ionic-native/app-version';
import {
    FrameworkConstant,
    FormConstant,
    PreferenceKey
} from '../../app/app.constant';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { Events } from 'ionic-angular';
@Injectable()
export class FormAndFrameworkUtilService {

    /**
     * This variable is used to store the language selected, which is required when getting form related details.
     *
     */
    selectedLanguage: string;
    profile: Profile;

    constructor(
        private framework: FrameworkService,
        private preference: SharedPreferences,
        private formService: FormService,
        private appGlobalService: AppGlobalService,
        private appVersion: AppVersion,
        private translate: TranslateService,
        private profileService: ProfileService,
        private events: Events
    ) {
        // Get language selected
        this.preference.getString(PreferenceKey.SELECTED_LANGUAGE_CODE)
            .then(val => {
                if (val && val.length) {
                    this.selectedLanguage = val;
                }
            });
    }

    /**
     * This method gets the form related details.
     *
     */
    getSupportingBoardList(): Promise<any> {
        return new Promise((resolve, reject) => {
            let syllabusList: Array<any> = [];

            // get cached form details
            syllabusList = this.appGlobalService.getCachedSyllabusList();

            if ((syllabusList === undefined || syllabusList.length === 0)
                || (syllabusList !== undefined && syllabusList.length === 1)) {
                syllabusList = [];
                this.callSyllabusListApi(syllabusList, resolve, reject);
            } else {
                resolve(syllabusList);
            }
        });
    }

    /**
     * This method gets the Library filter config.
     *
     */
    getLibraryFilterConfig(): Promise<any> {
        return new Promise((resolve, reject) => {
            let libraryFilterConfig: Array<any> = [];

            // get cached library config
            libraryFilterConfig = this.appGlobalService.getCachedLibraryFilterConfig();

            if (libraryFilterConfig === undefined || libraryFilterConfig.length === 0) {
                libraryFilterConfig = [];
                this.invokeLibraryFilterConfigFormApi(libraryFilterConfig, resolve, reject);
            } else {
                resolve(libraryFilterConfig);
            }
        });
    }

    /**
     * This method gets the course filter config.
     *
     */
    getCourseFilterConfig(): Promise<any> {
        return new Promise((resolve, reject) => {
            let courseFilterConfig: Array<any> = [];

            // get cached course config
            courseFilterConfig = this.appGlobalService.getCachedCourseFilterConfig();

            if (courseFilterConfig === undefined || courseFilterConfig.length === 0) {
                courseFilterConfig = [];
                this.invokeCourseFilterConfigFormApi(courseFilterConfig, resolve, reject);
            } else {
                resolve(courseFilterConfig);
            }
        });
    }

    /**
     * Network call to form api
     *
     * @param syllabusList
     * @param resolve
     * @param reject
     */
    private callSyllabusListApi(syllabusList: any[], resolve: (value?: any) => void, reject: (reason?: any) => void) {
        // form api request
        const req: FormRequest = {
            type: 'user',
            subType: 'instructor',
            action: 'onboarding_v2',
            filePath: FormConstant.DEFAULT_SUPPORTED_BOARDS_PATH
        };
        // form api call
        this.formService.getForm(req).then((res: any) => {
            const response: any = JSON.parse(res);
            console.log('Form Result - ' + response.result);
            let frameworks: Array<any> = [];
            const fields: Array<any> = response.result.fields;
            fields.forEach(field => {
                // if (field.language === this.selectedLanguage) {
                frameworks = field.range;
                // }
            });

            // this condition will be executed when selected language is not present in the frameworks
            // then it will be defaulted to English
            if (frameworks.length === 0) {
                fields.forEach(field => {
                    if (field.language === 'en') {
                        frameworks = field.range;
                    }
                });
            }
            if (frameworks != null && frameworks.length > 0) {
                frameworks.forEach(frameworkDetails => {
                    // const value = { 'name': frameworkDetails.name, 'frameworkId': frameworkDetails.frameworkId };
                    syllabusList.push(frameworkDetails);
                });

                // store the framework list in the app component, so that when getFormDetails() gets called again
                // in the same session of app, then we can get this details, without calling the api
                this.appGlobalService.setSyllabusList(syllabusList);
            }
            resolve(syllabusList);
        }).catch((error: any) => {
            console.log('Error - ' + error);
            // Adding default framework into the list
            const defaultFramework = {
                name: FrameworkConstant.DEFAULT_FRAMEWORK_NAME,
                frameworkId: FrameworkConstant.DEFAULT_FRAMEWORK_ID
            };

            syllabusList.push(defaultFramework);
            resolve(syllabusList);
        });
    }


    /**
     * Network call to form api
     *
     * @param courseFilterConfig
     * @param resolve
     * @param reject
     */
    private invokeCourseFilterConfigFormApi(courseFilterConfig: Array<any>,
        resolve: (value?: any) => void,
        reject: (reason?: any) => void) {

        const req: FormRequest = {
            type: 'pageAssemble',
            subType: 'course',
            action: 'filter',
            filePath: FormConstant.DEFAULT_PAGE_COURSE_FILTER_PATH
        };
        // form api call
        this.formService.getForm(req).then((res: any) => {
            const response: any = JSON.parse(res);
            courseFilterConfig = response.result.fields;
            this.appGlobalService.setCourseFilterConfig(courseFilterConfig);
            resolve(courseFilterConfig);
        }).catch((error: any) => {
            console.log('Error - ' + error);
            resolve(courseFilterConfig);
        });
    }

    /**
     * Network call to form api
     *
     * @param libraryFilterConfig
     * @param resolve
     * @param reject
     */
    private invokeLibraryFilterConfigFormApi(libraryFilterConfig: Array<any>,
        resolve: (value?: any) => void,
        reject: (reason?: any) => void) {
        const req: FormRequest = {
            type: 'pageAssemble',
            subType: 'library',
            action: 'filter',
            filePath: FormConstant.DEFAULT_PAGE_LIBRARY_FILTER_PATH
        };
        // form api call
        this.formService.getForm(req).then((res: any) => {
            const response: any = JSON.parse(res);
            libraryFilterConfig = response.result.fields;
            this.appGlobalService.setLibraryFilterConfig(libraryFilterConfig);
            resolve(libraryFilterConfig);
        }).catch((error: any) => {
            console.log('Error - ' + error);
            resolve(libraryFilterConfig);
        });
    }

    /**
     * Get all categories using framework api
     */
    getFrameworkDetails(frameworkId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const req: FrameworkDetailsRequest = {
                defaultFrameworkDetails: true
            };

            if (frameworkId !== undefined && frameworkId.length) {
                req.defaultFrameworkDetails = false;
                req.frameworkId = frameworkId;
            }

            this.framework.getFrameworkDetails(req)
                .then(res => {
                    resolve(res);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    /**
     *
     * This gets the categoy data according to current and previously selected values
     *
     * @param req
     * @param frameworkId
     */
    getCategoryData(req: CategoryRequest, frameworkId?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (frameworkId !== undefined && frameworkId.length) {
                req.frameworkId = frameworkId;
            }

            const categoryList: Array<any> = [];

            this.framework.getCategoryData(req)
                .then(res => {
                    const category = JSON.parse(res);
                    const resposneArray = category.terms;
                    let value = {};
                    resposneArray.forEach(element => {

                        value = { 'name': element.name, 'code': element.code };

                        categoryList.push(value);
                    });

                    resolve(categoryList);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    /**
     * This method checks if the newer version of the available and respectively shows the dialog with relevant contents
     */
    checkNewAppVersion(): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log('checkNewAppVersion Called');

            this.appVersion.getVersionCode()
                .then((versionCode: any) => {
                    console.log('checkNewAppVersion Current app version - ' + versionCode);

                    let result: any;

                    // form api request
                    const req: FormRequest = {
                        type: 'app',
                        subType: 'install',
                        action: 'upgrade'
                    };
                    // form api call
                    this.formService.getForm(req).then((res: any) => {
                        const response: any = JSON.parse(res);

                        let fields: Array<any> = [];
                        let ranges: Array<any> = [];
                        let upgradeTypes: Array<any> = [];

                        if (response && response.result && response.result.fields) {
                            fields = response.result.fields;

                            fields.forEach(element => {
                                if (element.language === this.selectedLanguage) {
                                    if (element.range) {
                                        ranges = element.range;
                                    }

                                    if (element.upgradeTypes) {
                                        upgradeTypes = element.upgradeTypes;
                                    }
                                }
                            });

                            if (ranges && ranges.length > 0 && upgradeTypes && upgradeTypes.length > 0) {
                                let type: string;
                                const forceType = 'force';

                                ranges.forEach(element => {
                                    if (versionCode >= element.minVersionCode && versionCode <= element.maxVersionCode) {
                                        console.log('App needs a upgrade of type - ' + element.type);
                                        type = element.type;

                                        if (type === forceType) {
                                            return true; // this is to stop the foreach loop
                                        }
                                    }
                                });

                                upgradeTypes.forEach(upgradeElement => {
                                    if (type === upgradeElement.type) {
                                        result = upgradeElement;
                                    }
                                });
                            }
                        }

                        resolve(result);
                    }).catch((error: any) => {
                        reject(error);
                    });
                });
        });
    }

    updateLoggedInUser(profileRes, profileData) {
        return new Promise((resolve, reject) => {
            const profile = {
                board: [],
                grade: [],
                medium: [],
                subject: [],
                syllabus: [],
                gradeValueMap: {}
            };
            if (profileRes.framework && Object.keys(profileRes.framework).length) {
                const categoryKeysLen = Object.keys(profileRes.framework).length;
                let keysLength = 0;
                for (const categoryKey in profileRes.framework) {
                    if (profileRes.framework[categoryKey].length) {
                        const request: CategoryRequest = {
                            selectedLanguage: this.translate.currentLang,
                            currentCategory: categoryKey
                        };
                        this.getCategoryData(request)
                            .then((categoryList) => {
                                console.log('categoryList in updateLoggedInUser', categoryList);
                                keysLength++;
                                profileRes.framework[categoryKey].forEach(element => {
                                    if (categoryKey === 'gradeLevel') {
                                        const codeObj = _.find(categoryList, (category) => category.name === element);
                                        if (codeObj) {
                                            profile['grade'].push(codeObj.code);
                                            profile['gradeValueMap'][codeObj.code] = element;
                                        }
                                    } else {
                                        const codeObj = _.find(categoryList, (category) => category.name === element);
                                        if (codeObj) {
                                            profile[categoryKey].push(codeObj.code);
                                        }
                                    }
                                });
                                if (categoryKeysLen === keysLength) {
                                    const req: Profile = new Profile();
                                    if (profile.board && profile.board.length > 1) {
                                      profile.board.splice(1, profile.board.length);
                                    }
                                    req.board = profile.board;
                                    req.grade = profile.grade;
                                    req.medium = profile.medium;
                                    req.subject = profile.subject;
                                    req.gradeValueMap = profile.gradeValueMap;
                                    req.uid = profileData.uid;
                                    req.handle = profileData.uid;
                                    req.profileType = profileData.profileType;
                                    req.source = profileData.source;
                                    req.createdAt = profileData.createdAt || this.formatDate();
                                    this.preference.getString('current_framework_id')
                                    .then(value => {
                                        req.syllabus = [value];
                                        this.profileService.updateProfile(req)
                                        .then((res: any) => {
                                            const updateProfileRes = JSON.parse(res);
                                            this.events.publish('refresh:loggedInProfile');
                                            if (updateProfileRes.board  && updateProfileRes.grade && updateProfileRes.medium &&
                                                updateProfileRes.board.length && updateProfileRes.grade.length
                                                && updateProfileRes.medium.length
                                            ) {
                                                resolve({status: true});
                                            } else {
                                                resolve({status: false, profile: updateProfileRes});
                                            }
                                        })
                                        .catch((err: any) => {
                                            console.error('Err', err);
                                            resolve({status: false});
                                        });
                                    });
                                }
                            });
                    } else {
                        keysLength++;
                    }
                }
            } else {
                resolve({status: false});
            }
        });

    }

    formatDate() {
        const options = {
            day: '2-digit', year: 'numeric', month: 'short', hour: '2-digit',
            minute: '2-digit', second: '2-digit', hour12: true
        };
        const date = new Date().toLocaleString('en-us', options);
        return (date.slice(0, 12) + date.slice(13, date.length));
    }
}
