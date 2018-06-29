import { Injectable, NgZone } from '@angular/core';
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
import { AppGlobalService } from '../../service/app-global.service';

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
        private appGlobalService: AppGlobalService
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

    fetchNextCategory(req: CategoryRequest): Promise<any> {
        return new Promise((resolve, reject) => {
            this.framework.getCategoryData(req,
                (res: any) => {
                    const resposneArray: Array<any> = JSON.parse(res);
                    resolve(resposneArray);
                },
                (err: any) => {
                    reject(err);
                });
        });
    }
}