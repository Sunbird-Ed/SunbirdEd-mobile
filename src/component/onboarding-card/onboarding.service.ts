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

@Injectable()
export class OnboardingService {
    userId: string;
    profile: any = {};
    onBoardingSlides: any[];
    isOnBoardingCardCompleted: boolean = false;
    currentIndex: number = 0;
    selectedLanguage: string;
    categories: Array<any> = [];
    syllabusList: Array<any> = [];
    boardList: Array<string> = [];
    gradeList: Array<string> = [];
    subjectList: Array<string> = [];
    mediumList: Array<string> = [];
    frameworks: Array<any> = [];
    frameworkId: string = '';

    constructor(
        private framework: FrameworkService,
        private profileService: ProfileService,
        public events: Events,
        public zone: NgZone,
        private preference: SharedPreferences,
        private formService: FormService
    ) {

        //fetch language code
        this.preference.getString('selected_language_code', (val: string) => {
            if (val && val.length) {
                this.selectedLanguage = val;
            }
        });

    }

    initializeCard(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getFrameworkDetails()
                .then(catagories => {
                    this.categories = catagories;
                    this.initializeSlides();
                    return this.getCurrentUser();
                })
                .then(index => {
                    resolve(index);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    initializeSlides() {
        this.onBoardingSlides = [
            {
                'id': 'syllabusList',
                'title': 'SYLLABUS_QUESTION',
                'desc': 'SYLLABUS_OPTION_TEXT',
                'options': [],
                'selectedOptions': '',
                'selectedCode': []
            },
            {
                'id': 'boardList',
                'title': 'BOARD_QUESTION',
                'desc': 'BOARD_OPTION_TEXT',
                'options': [],
                'selectedOptions': '',
                'selectedCode': []
            },
            {
                'id': 'gradeList',
                'title': 'GRADE_QUESTION',
                'desc': 'GRADE_OPTION_TEXT',
                'options': [],
                'selectedOptions': '',
                'selectedCode': []
            },
            {
                'id': 'subjectList',
                'title': 'SUBJECT_QUESTION',
                'desc': 'SUBJECT_OPTION_TEXT',
                'options': [],
                'selectedOptions': '',
                'selectedCode': []
            },
            {
                'id': 'mediumList',
                'title': 'MEDIUM_QUESTION',
                'desc': 'MEDIUM_OPTION_TEXT',
                'options': [],
                'selectedOptions': '',
                'selectedCode': []
            }
        ];

        this.onBoardingSlides[0].options = this.syllabusList;
        this.onBoardingSlides[1].options = this.boardList;
        this.onBoardingSlides[2].options = this.gradeList;
        this.onBoardingSlides[3].options = this.subjectList;
        this.onBoardingSlides[4].options = this.mediumList;

        console.log("Initialized", this.onBoardingSlides);
    }
    /**
     * Method user to fetch Current Guest User
     */
    getCurrentUser(): Promise<any> {

        return new Promise((resolve, reject) => {
            this.profileService.getCurrentUser((res: any) => {
                let index = 0;
                this.profile = JSON.parse(res);
                this.currentIndex = 0;
                if (this.profile.syllabus && this.profile.syllabus[0] !== '') {
                    //this.onBoardingSlides[0].selectedOptions = this.getDisplayValues(0, this.profile.syllabus);
                    let displayValues = [];

                    this.syllabusList.forEach(element => {
                        if (_.includes(this.profile.syllabus, element.value)) {
                            displayValues.push(element.text);
                        }
                    });
                    this.onBoardingSlides[0].selectedOptions = this.arrayToString(displayValues);

                    // this.onBoardingSlides[0].selectedOptions = this.profile.syllabus[0];
                    this.currentIndex = 20;
                    index = 1;
                }
                if (this.profile.board && this.profile.board[0] !== '') {
                    console.log("Categories", this.categories);
                    this.onBoardingSlides[1].selectedOptions = this.getDisplayValues(0, this.profile.board);
                    this.currentIndex = 40;
                    index = 2;
                }
                if (this.profile.grade && this.profile.grade[0] !== '') {
                    //this.onBoardingSlides[1].selectedOptions = this.profile.grade;
                    this.onBoardingSlides[2].selectedOptions = this.getDisplayValues(1, this.profile.grade);
                    this.currentIndex = 60;
                    index = 3;
                }
                if (this.profile.subject && this.profile.subject[0] !== '') {
                    //this.onBoardingSlides[2].selectedOptions = this.profile.subject;
                    this.onBoardingSlides[3].selectedOptions = this.getDisplayValues(2, this.profile.subject);
                    this.currentIndex = 80;
                    index = 4;
                }
                if (this.profile.medium && this.profile.medium[0] !== '') {
                    //this.onBoardingSlides[3].selectedOptions = this.profile.medium;
                    this.onBoardingSlides[4].selectedOptions = this.getDisplayValues(3, this.profile.medium);
                    this.currentIndex = 100;
                    index = 5;
                }
                resolve(index);
            },
                (err: any) => {
                    console.log("Err1", err);
                    reject(err);
                });
        });
    }

    getDisplayValues(index: number, field) {
        let displayValues = [];
        this.categories[index].terms.forEach(element => {
            if (_.includes(field, element.code)) {
                displayValues.push(element.name);
            }
        });
        return this.arrayToString(displayValues.sort());
    }

    /**
     * It fetches all the categories using Framework API
     */
    getFrameworkDetails(frameworkId?: string): Promise<any> {

        return new Promise((resolve, reject) => {
            let req: FrameworkDetailsRequest = {
                defaultFrameworkDetails: true
            };

            if (frameworkId !== undefined && frameworkId.length) {
                req.defaultFrameworkDetails = false;
                req.frameworkId = frameworkId[0];
                this.frameworkId = frameworkId[0];
            }

            this.framework.getFrameworkDetails(req,
                (res: any) => {
                    let categories = JSON.parse(JSON.parse(res).result.framework).categories;
                    resolve(categories);
                },
                (err: any) => {
                    reject(err);
                });
        });
    }

    /**
     * This will internally call framework API to get latest list of item, wont call API if list is already present locally
     * @param {string} currentCategory - request Parameter passing to the framework API
     * @param {string} list - Local variable name to hold the list data
     */
    getCategoryData(req: CategoryRequest, list): void {

        if (this.frameworkId !== undefined && this.frameworkId.length) {
            req.frameworkId = this.frameworkId;
        }

        //if (!this[list].length) {
        this.framework.getCategoryData(req,
            (res: any) => {
                // { text: 'Lang1', value: 'Lang1', checked: true }
                const resposneArray = JSON.parse(res);
                this[list] = [];
                let value = {};
                resposneArray.forEach(element => {
                    if (list === "boardList" && this.profile.board && this.profile.board.length && this.profile.board.indexOf(element.code) > -1) {
                        this.onBoardingSlides[1].selectedCode.push(element.code);
                        value = { 'text': element.name, 'value': element.code, 'checked': true };
                    } else if (list === "gradeList" && this.profile.grade && this.profile.grade.length && this.profile.grade.indexOf(element.code) > -1) {
                        this.onBoardingSlides[2].selectedCode.push(element.code);
                        value = { 'text': element.name, 'value': element.code, 'checked': true };
                    } else if (list === "subjectList" && this.profile.subject && this.profile.subject.length && this.profile.subject.indexOf(element.code) > -1) {
                        this.onBoardingSlides[3].selectedCode.push(element.code);
                        value = { 'text': element.name, 'value': element.code, 'checked': true };
                    } else if (list === "mediumList" && this.profile.medium && this.profile.medium.length && this.profile.medium.indexOf(element.code) > -1) {
                        this.onBoardingSlides[4].selectedCode.push(element.code);
                        value = { 'text': element.name, 'value': element.code, 'checked': true };
                    } else {
                        value = { 'text': element.name, 'value': element.code, 'checked': false };
                    }

                    this[list].push(value);
                });
                if (list !== 'gradeList') {
                    this[list] = _.orderBy(this[list], ['text'], ['asc']);
                }

                this.getListArray(list);
                console.log(list + " Category Response: " + this[list]);
            },
            (err: any) => {
                console.log("Subject Category Response: ", err);
            });
        //}
    }

    getSyllabusDetails() {
        return new Promise((resolve, reject) => {
            let req: FormRequest = {
                type: 'user',
                subType: 'instructor',
                action: 'onboarding',
            };

            this.formService.getForm(req,
                (res: any) => {
                    let response: any = JSON.parse(res);
                    console.log("Form Result - " + response.result);
                    let fields: Array<any> = response.result.fields;

                    fields.forEach(field => {
                        if (field.language === this.selectedLanguage) {
                            this.frameworks = field.range;
                        }
                    });

                    if (this.frameworks != null && this.frameworks.length > 0) {
                        this.frameworks.forEach(frameworkDetails => {
                            let value = { 'text': frameworkDetails.name, 'value': frameworkDetails.frameworkId, 'checked': false };
                            this.syllabusList.push(value);
                        });
                    }

                    resolve(true);
                },
                (error: any) => {
                    console.log("Error - " + error);
                    reject(false);
                })
        });
    }

    /**
     * It checks whether Previous Field is filled or not
     * @param {number} index
     * @param {any}    currentField
     * @param {string} prevSelectedValue
     */
    checkPrevValue(index: number = 0, currentField, prevSelectedValue = []) {

        if (index === 0) {
            this[currentField] = this.syllabusList;
        } else if (index === 1) {
            this.getFrameworkDetails(prevSelectedValue[0])
                .then(catagories => {
                    this.categories = catagories;
                });

            let request: CategoryRequest = {
                currentCategory: this.categories[0].code,
                // prevCategory: ,
                // selectedCode: prevSelectedValue
            }
            this.getCategoryData(request, currentField);
        } else {
            let request: CategoryRequest = {
                currentCategory: this.categories[index - 1].code,
                prevCategory: this.categories[index - 2].code,
                selectedCode: prevSelectedValue
            }
            this.getCategoryData(request, currentField);
        }

        // if (index != 0) {
        //     let request: CategoryRequest = {
        //         currentCategory: this.categories[index].code,
        //         prevCategory: this.categories[index - 1].code,
        //         selectedCode: prevSelectedValue
        //     }
        //     this.getCategoryData(request, currentField);
        // } else {
        //     // let request: CategoryRequest = {
        //     //     currentCategory: this.categories[index].code
        //     // }
        //     // this.getCategoryData(request, currentField);
        //     this[currentField] = this.syllabusList;

        // }
    }

    /**
     * It returns list name by ID
     * @param   {number} index
     * @returns {string} Listname
     */
    getListName(index: number): string {
        if (index == 0) {
            return 'syllabusList';
        } else if (index == 1) {
            return 'boardList';
        } else if (index == 2) {
            return 'gradeList';
        } else if (index == 3) {
            return 'subjectList';
        } else if (index == 4) {
            return 'mediumList';
        } else {
            return 'boardList';
        }
    }

    /**
     * Assign latest list data to local variables
     * @param {string} name name of the local variable
     */
    getListArray(name: string): void {
        if (name == 'syllabusList') {
            this.onBoardingSlides[0].options = this.syllabusList;
        } else if (name == 'boardList') {
            this.onBoardingSlides[1].options = this.boardList;
        } else if (name == 'gradeList') {
            this.onBoardingSlides[2].options = this.gradeList;
        } else if (name == 'subjectList') {
            this.onBoardingSlides[3].options = this.subjectList;
        } else if (name == 'mediumList') {
            this.onBoardingSlides[4].options = this.mediumList;
        }
    }

    /**
     * This will makes an API call for the current category
     */
    saveDetails(index: number): void {
        let req: Profile = {
            age: -1,
            day: -1,
            month: -1,
            standard: -1,
            syllabus: (_.find(this.onBoardingSlides, ['id', 'syllabusList']).selectedCode.length) ? _.find(this.onBoardingSlides, ['id', 'syllabusList']).selectedCode : this.profile.syllabus,
            board: (_.find(this.onBoardingSlides, ['id', 'boardList']).selectedCode.length) ? _.find(this.onBoardingSlides, ['id', 'boardList']).selectedCode : this.profile.board,
            grade: (_.find(this.onBoardingSlides, ['id', 'gradeList']).selectedCode.length) ? _.find(this.onBoardingSlides, ['id', 'gradeList']).selectedCode : this.profile.grade,
            subject: (_.find(this.onBoardingSlides, ['id', 'subjectList']).selectedCode.length) ? _.find(this.onBoardingSlides, ['id', 'subjectList']).selectedCode : this.profile.subject,
            medium: (_.find(this.onBoardingSlides, ['id', 'mediumList']).selectedCode.length) ? _.find(this.onBoardingSlides, ['id', 'mediumList']).selectedCode : this.profile.medium,
            uid: this.profile.uid,
            handle: this.profile.handle,
            isGroupUser: false,
            language: "en",
            avatar: "avatar",
            createdAt: this.profile.createdAt,
            profileType: this.profile.profileType
        }
        if (index === 0 && !_.find(this.onBoardingSlides, ['id', 'boardList']).selectedCode.length) {
            req.board = [];
        }
        if (index === 1 && !_.find(this.onBoardingSlides, ['id', 'gradeList']).selectedCode.length) {
            req.grade = [];
        }
        if (index === 2 && !_.find(this.onBoardingSlides, ['id', 'subjectList']).selectedCode.length) {
            req.subject = [];
        }
        if (index === 3 && !_.find(this.onBoardingSlides, ['id', 'mediumList']).selectedCode.length) {
            req.medium = [];
        }
        this.profileService.updateProfile(req,
            (res: any) => {
                if (this.onBoardingSlides.length === (index + 1)) {
                    this.isOnBoardingCardCompleted = true;
                    this.events.publish('onboarding-card:completed', { isOnBoardingCardCompleted: this.isOnBoardingCardCompleted });
                } else {
                    this.isOnBoardingCardCompleted = false;
                    this.events.publish('onboarding-card:completed', { isOnBoardingCardCompleted: this.isOnBoardingCardCompleted });
                }
                //this.currentIndex = index + 1;
                this.events.publish('refresh:profile');

                this.getCurrentUser();
            },
            (err: any) => {
                console.log("Err", err);
            });
    }

    /**
    * Method to convert Array to Comma separated string
    * @param {Array<string>} stringArray
    * @returns {string}
    */
    arrayToString(stringArray: Array<string>): string {
        return stringArray.join(", ");
    }
}