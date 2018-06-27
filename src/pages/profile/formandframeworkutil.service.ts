import { Injectable, NgZone } from '@angular/core';
import * as _ from 'lodash';
import { Events } from 'ionic-angular';

import {
    FrameworkService,
    CategoryRequest,
    FrameworkDetailsRequest,
    ProfileService,
    Profile,
    SharedPreferences,
    FormRequest,
    FormService
} from 'sunbird';
import { resolve } from 'path';
import { MyApp } from '../../app/app.component';
import { AppGlobalService } from '../../service/app-global.service';
import { AppVersion } from "@ionic-native/app-version";


@Injectable()
export class FormAndFrameworkUtilService {

    /**
     * This variable is used to store the language selected, which is required when getting form related details.
     * 
     */
    selectedLanguage: string;


    constructor(
        private framework: FrameworkService,
        private profileService: ProfileService,
        public events: Events,
        public zone: NgZone,
        private preference: SharedPreferences,
        private formService: FormService,
        private appGlobalService: AppGlobalService,
        private appVersion: AppVersion,

    ) {


        //Get language selected
        this.preference.getString('selected_language_code', (val: string) => {
            if (val && val.length) {
                this.selectedLanguage = val;
            }
        });
    }

    /**
     * This method gets the form related details.
     * 
     */
    getSyllabusList(): Promise<any> {
        return new Promise((resolve, reject) => {
            let syllabusList: Array<any> = [];

            //get cached form details
            syllabusList = this.appGlobalService.getCachedSyllabusList()

            if (syllabusList !== undefined && syllabusList.length > 0) {
                resolve(syllabusList);
            } else {
                this.callSyllabusListApi(syllabusList, resolve, reject);
            }
        })

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
        let req: FormRequest = {
            type: 'user',
            subType: 'instructor',
            action: 'onboarding',
        };
        //form api call
        this.formService.getForm(req, (res: any) => {
            let response: any = JSON.parse(res);
            console.log("Form Result - " + response.result);
            let frameworks: Array<any> = [];
            let fields: Array<any> = response.result.fields;
            fields.forEach(field => {
                if (field.language === this.selectedLanguage) {
                    frameworks = field.range;
                }
            });

            //this condition will be executed when selected language is not present in the frameworks
            //then it will be defaulted to English
            if (frameworks.length === 0) {
                fields.forEach(field => {
                    if (field.language === 'en') {
                        frameworks = field.range;
                    }
                });
            }

            if (frameworks != null && frameworks.length > 0) {
                frameworks.forEach(frameworkDetails => {
                    let value = { 'name': frameworkDetails.name, 'frameworkId': frameworkDetails.frameworkId };
                    syllabusList.push(value);
                });
                //store the framework list in the app component, so that when getFormDetails() gets called again
                //in the same session of app, then we can get this details, without calling the api
                this.appGlobalService.setSyllabusList(syllabusList);
            }
            resolve(syllabusList);
        }, (error: any) => {
            console.log("Error - " + error);
            reject(syllabusList);
        });
    }

    /**
     * Get all categories using framework api
     */
    getFrameworkDetails(frameworkId: string): Promise<any> {

        return new Promise((resolve, reject) => {
            let req: FrameworkDetailsRequest = {
                defaultFrameworkDetails: true
            };

            if (frameworkId !== undefined && frameworkId.length) {
                req.defaultFrameworkDetails = false;
                req.frameworkId = frameworkId;
            }

            this.framework.getFrameworkDetails(req,
                (res: any) => {
                    // let categories = JSON.parse(JSON.parse(res).result.framework).categories;
                    resolve(res);
                },
                (err: any) => {
                    reject(err);
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

            let categoryList: Array<any> = [];

            this.framework.getCategoryData(req,
                (res: any) => {
                    const resposneArray = JSON.parse(res);
                    let value = {};
                    resposneArray.forEach(element => {

                        value = { 'name': element.name, 'code': element.code };

                        categoryList.push(value);
                    });

                    resolve(categoryList);
                },
                (err: any) => {
                    reject(err);
                });

        });
    }

    /**
     * This method checks if the newer version of the available and respectively shows the dialog with relevant contents
     */
    checkNewAppVersion(): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log("checkNewAppVersion Called");

            this.appVersion.getVersionCode()
                .then((versionCode: any) => {
                    console.log("checkNewAppVersion Current app version - " + versionCode);

                    let result: any;

                    // form api request
                    let req: FormRequest = {
                        type: 'app',
                        subType: 'install',
                        action: 'upgrade',
                    };
                    //form api call
                    this.formService.getForm(req, (res: any) => {
                        //do changes here once the DEV server is up

                        resolve(result);
                    }, (error: any) => {
                        let response: any = this.getStaticResponse();

                        let fields: Array<any> = [];
                        let ranges: Array<any> = [];
                        let upgradeTypes: Array<any> = [];

                        if (response && response.result && response.result.data && response.result.data.fields) {
                            fields = response.result.data.fields;

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
                                ranges.forEach(element => {
                                    if (versionCode === element.minVersionCode ||
                                        (versionCode > element.minVersionCode && versionCode < element.maxVersionCode) ||
                                        versionCode === element.maxVersionCode) {
                                        console.log("App needs a upgrade of type - " + element.type)

                                        upgradeTypes.forEach(upgradeElement => {
                                            if (element.type === upgradeElement.type) {
                                                result = upgradeElement
                                            }
                                        });
                                    }
                                });
                            }
                        }

                        resolve(result);
                    });
                });
        });
    }

    getStaticResponse(): any {
        let result =
            {
                "id": "api.form.read",
                "ver": "1.0",
                "ts": "2018-06-08T11:12:08.806Z",
                "params": {
                    "resmsgid": "c8d63060-6b0c-11e8-ad67-591f448b63dd",
                    "msgid": "c8d19c80-6b0c-11e8-a37c-876542ad886c",
                    "status": "successful",
                    "err": null,
                    "errmsg": null
                },
                "responseCode": "OK",
                "result": {
                    "type": "app",
                    "subType": "install",
                    "action": "upgrade",
                    "data": {
                        "templateName": "defaultAppUpgradeTemplate",
                        "action": "upgrade",
                        "fields": [
                            {
                                "code": "upgrade",
                                "name": "Upgrade of app",
                                "language": "en",
                                "range": [
                                    {
                                        "minVersionCode": "10",
                                        "maxVersionCode": "15",
                                        "versionName": "",
                                        "type": "force"
                                    },
                                    {
                                        "minVersionCode": "0",
                                        "maxVersionCode": "9",
                                        "versionName": "",
                                        "type": "optional"
                                    }
                                ],
                                "upgradeTypes": [
                                    {
                                        "type": "force",
                                        "title": "Upgrade App",
                                        "desc": "Upgarde app",
                                        "actionButtons": [
                                            {
                                                "key": "Upgrade",
                                                "link": "https://play.google.com/store/apps/details?id=in.gov.diksha.app"
                                            }
                                        ]

                                    },
                                    {
                                        "type": "optional",
                                        "title": "Upgrade App",
                                        "desc": "Upgarde app",
                                        "actionButtons": [
                                            {
                                                "key": "Upgrade",
                                                "link": "https://play.google.com/store/apps/details?id=in.gov.diksha.app"
                                            },
                                            {
                                                "key": "Cancel",
                                                "link": ""
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "code": "upgrade",
                                "name": "Upgrade of app",
                                "language": "hi",
                                "range": [
                                    {
                                        "minVersionCode": "10",
                                        "maxVersionCode": "15",
                                        "versionName": "",
                                        "type": "force"
                                    },
                                    {
                                        "minVersionCode": "0",
                                        "maxVersionCode": "9",
                                        "versionName": "",
                                        "type": "optional"
                                    }
                                ],
                                "upgradeTypes": [
                                    {
                                        "type": "force",
                                        "title": "Upgrade App",
                                        "desc": "Upgarde app",
                                        "actionButtons": [
                                            {
                                                "key": "Upgrade",
                                                "link": "https://play.google.com/store/apps/details?id=in.gov.diksha.app"
                                            }
                                        ]

                                    },
                                    {
                                        "type": "optional",
                                        "title": "Upgrade App",
                                        "desc": "Upgarde app",
                                        "actionButtons": [
                                            {
                                                "key": "Upgrade",
                                                "link": "https://play.google.com/store/apps/details?id=in.gov.diksha.app"
                                            },
                                            {
                                                "key": "Cancel",
                                                "link": ""
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                }
            }

        return result;
    }

}