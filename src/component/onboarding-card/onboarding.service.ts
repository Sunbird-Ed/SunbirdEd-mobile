/* istanbul ignore next */
import {
    Injectable
} from '@angular/core';
import * as _ from 'lodash';
import { Events } from 'ionic-angular';
import {
    CategoryRequest,
    ProfileService,
    Profile,
    SharedPreferences,
} from 'sunbird';
import { FormAndFrameworkUtilService } from '../../pages/profile/formandframeworkutil.service';
import { TranslateService } from '@ngx-translate/core';
import { PreferenceKey, FrameworkCategory } from '../../app/app.constant';
import { CommonUtilService } from '../../service/common-util.service';

@Injectable()
export class OnboardingService {
    userId: string;
    profile: Profile = new Profile(); // TODO: Any should be changed to Profile
    onBoardingSlides: any[];
    isOnBoardingCardCompleted = false;
    currentIndex = 0;
    slideIndex = -1;
    selectedLanguage = 'en';
    categories: Array<any> = [];
    syllabusList: Array<any> = [];
    boardList: Array<string> = [];
    gradeList: Array<any> = [];
    subjectList: Array<string> = [];
    mediumList: Array<string> = [];
    frameworkId = '';

    constructor(
        private profileService: ProfileService,
        private events: Events,
        private preference: SharedPreferences,
        private formAndFrameworkUtilService: FormAndFrameworkUtilService,
        private commonUtilService: CommonUtilService,
        private translate: TranslateService
    ) {
        // fetch language code
        this.preference.getString(PreferenceKey.SELECTED_LANGUAGE_CODE)
            .then(val => {
                /* istanbul ignore else */
                if (val && val.length) {
                    this.selectedLanguage = val;
                }
            });
    }

    initializeCard(): Promise<any> {
        return new Promise((resolve, reject) => {

            if (this.slideIndex === -1) {

                this.profileService.getCurrentUser().then((res: any) => {
                    this.profile = JSON.parse(res);
                    let syllabusFramework = '';

                    this.initializeSlides();

                    /* istanbul ignore else */
                    if (this.profile.syllabus && this.profile.syllabus[0] !== '') {
                        syllabusFramework = this.profile.syllabus[0];
                        this.frameworkId = syllabusFramework;
                        this.formAndFrameworkUtilService.getFrameworkDetails(syllabusFramework)
                            .then(catagories => {
                                this.categories = catagories;
                                return this.getCurrentUser();
                            })
                            .then(index => {
                                this.slideIndex = index;
                                resolve(index);
                            })
                            .catch(err => {
                                reject(err);
                            });
                    }
                })
                    .catch((err: any) => {
                        console.log('Err1', err);
                        reject(err);
                    });
            } else {
                resolve(this.slideIndex);
            }
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
                'id': 'mediumList',
                'title': 'MEDIUM_QUESTION',
                'desc': 'MEDIUM_OPTION_TEXT',
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
            }
        ];

        this.onBoardingSlides[0].options = this.syllabusList;
        this.onBoardingSlides[1].options = this.boardList;
        this.onBoardingSlides[2].options = this.mediumList;
        this.onBoardingSlides[3].options = this.gradeList;
        this.onBoardingSlides[4].options = this.subjectList;
    }
    /**
     * Method user to fetch Current Guest User
     */
    getCurrentUser(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.profileService.getCurrentUser().then((res: any) => {
                let index = 0;
                this.profile = JSON.parse(res);
                this.currentIndex = 0;

                /* istanbul ignore else */
                if (this.profile.syllabus && this.profile.syllabus[0] !== '') {
                    const displayValues = [];

                    this.syllabusList.forEach(element => {
                        if (_.includes(this.profile.syllabus, element.value)) {
                            element.checked = true;
                            displayValues.push(element.text);
                        } else {
                            element.checked = false;
                        }
                    });
                    this.onBoardingSlides[0].selectedOptions = this.arrayToString(displayValues);

                    this.currentIndex = 20;
                    index = 1;
                }

                /* istanbul ignore else */
                if (this.profile.board && this.profile.board[0] !== '') {
                    this.onBoardingSlides[1].selectedOptions = this.getSelectedOptions(0, this.profile.board);
                    this.currentIndex = 40;
                    index = 2;
                }

                /* istanbul ignore else */
                if (this.profile.medium && this.profile.medium[0] !== '') {
                    this.onBoardingSlides[2].selectedOptions = this.getSelectedOptions(1, this.profile.medium);
                    this.currentIndex = 60;
                    index = 3;
                }

                /* istanbul ignore else */
                if (this.profile.grade && this.profile.grade[0] !== '') {
                    this.onBoardingSlides[3].selectedOptions = this.getSelectedOptions(2, this.profile.grade);
                    this.currentIndex = 80;
                    index = 4;
                }

                /* istanbul ignore else */
                if (this.profile.subject && this.profile.subject[0] !== '') {
                    this.onBoardingSlides[4].selectedOptions = this.getSelectedOptions(3, this.profile.subject);
                    this.currentIndex = 100;
                    index = 5;
                }

                resolve(index);
            })
                .catch((err: any) => {
                    console.log('Err1', err);
                    reject(err);
                });
        });
    }

    getSelectedOptions(index: number, field) {
        const displayValues = [];
        this.categories[index].terms.forEach(element => {
            /* istanbul ignore else */
            if (_.includes(field, element.code)) {
                displayValues.push(element.name);
            }
        });
        return this.arrayToString(displayValues.sort());
    }

    /**
     * This will internally call framework API to get latest list of item, wont call API if list is already present locally
     * @param {string} currentCategory - request Parameter passing to the framework API
     * @param {string} list - Local variable name to hold the list data
     */
    getCategoryData(req: CategoryRequest, list, index: number, hasUserClicked: boolean): void {

        /* istanbul ignore else */
        if (this.frameworkId !== undefined && this.frameworkId.length) {
            req.frameworkId = this.frameworkId;
        }

        this.formAndFrameworkUtilService.getCategoryData(req, this.frameworkId)
            .then((result) => {
                /* istanbul ignore else */
                if (result && result !== undefined && result.length > 0) {
                    this[list] = [];
                    let value = {};
                    result.forEach(element => {
                        if (list === 'boardList'
                            && this.profile.board && this.profile.board.length && this.profile.board.indexOf(element.code) > -1) {
                            this.onBoardingSlides[1].selectedCode.push(element.code);
                            value = { 'text': element.name, 'value': element.code, 'checked': true };
                        } else if (list === 'mediumList'
                            && this.profile.medium && this.profile.medium.length && this.profile.medium.indexOf(element.code) > -1) {
                            this.onBoardingSlides[2].selectedCode.push(element.code);
                            value = { 'text': element.name, 'value': element.code, 'checked': true };
                        } else if (list === 'gradeList'
                            && this.profile.grade && this.profile.grade.length && this.profile.grade.indexOf(element.code) > -1) {
                            this.onBoardingSlides[3].selectedCode.push(element.code);
                            value = { 'text': element.name, 'value': element.code, 'checked': true };
                        } else if (list === 'subjectList'
                            && this.profile.subject && this.profile.subject.length && this.profile.subject.indexOf(element.code) > -1) {
                            this.onBoardingSlides[4].selectedCode.push(element.code);
                            value = { 'text': element.name, 'value': element.code, 'checked': true };
                        } else {
                            value = { 'text': element.name, 'value': element.code, 'checked': false };
                        }

                        this[list].push(value);
                    });

                    /* istanbul ignore else */
                    if (list !== 'gradeList') {
                        this[list] = _.orderBy(this[list], ['text'], ['asc']);
                    }

                    this.getListArray(list);

                    // End the loader here
                    this.events.publish('is-data-available', { show: true, index: index });

                    // if the user has not clicked on the button, only then it has to be automated for single values
                    if (!hasUserClicked) {
                        // check if the list has single item
                        /* istanbul ignore else */
                        if (list === 'boardList' && this[list].length === 1) {
                            // make the item as checked
                            this[list][0].checked = true;

                            this.onBoardingSlides[1].selectedOptions = this[list][0].text;

                            this.onBoardingSlides[1].selectedCode.push(this[list][0].value);

                            this.setAndSaveDetails(this.onBoardingSlides[index], index);
                        } else if (list === 'mediumList' && this[list].length === 1) {
                            // make the item as checked
                            this[list][0].checked = true;

                            this.onBoardingSlides[2].selectedOptions = this[list][0].text;

                            this.onBoardingSlides[2].selectedCode.push(this[list][0].value);

                            this.setAndSaveDetails(this.onBoardingSlides[index], index);
                        } else if (list === 'gradeList' && this[list].length === 1) {
                            // make the item as checked
                            this[list][0].checked = true;

                            this.onBoardingSlides[3].selectedOptions = this[list][0].text;

                            this.onBoardingSlides[3].selectedCode.push(this[list][0].value);

                            this.setAndSaveDetails(this.onBoardingSlides[index], index);
                        }
                    }
                }
            });
    }

    getSyllabusDetails() {
        return new Promise((resolve, reject) => {
            // clear all the syllbusList
            this.syllabusList = [];

            // this.formAndFrameworkUtilService.getSupportingBoardList()
            //     .then((result) => {
            //         if (result && result !== undefined && result.length > 0) {
            //             result.forEach(element => {
            //                 // renaming the fields to text, value and checked
            //                 const value = { 'text': element.name, 'value': element.frameworkId, 'checked': false };
            //                 this.syllabusList.push(value);
            //             });

            //             resolve(this.syllabusList);
            //         } else {
            //             reject(this.syllabusList);
            //         }
            //     });
        });
    }

    /**
     * It checks whether Previous Field is filled or not
     * @param {number} index
     * @param {any}    currentField
     * @param {string} prevSelectedValue
     */
    checkPrevValue(index: number = 0, currentField, prevSelectedValue, hasUserClicked: boolean) {
        if (index === 0) {
            this[currentField] = this.syllabusList;
        } else if (index === 1) {
            // if the user has not clicked on the button, only then it has to show the loader
            /* istanbul ignore else */
            if (!hasUserClicked) {
                // publish a event to show the loader on card here
                this.events.publish('is-data-available', { show: false, index: index });
            }

            this.formAndFrameworkUtilService.getFrameworkDetails(this.frameworkId)
                .then(catagories => {
                    this.categories = catagories;

                    const request: CategoryRequest = {
                        currentCategory: this.categories[0].code,
                        selectedLanguage: this.translate.currentLang,
                        categories: FrameworkCategory.DEFAULT_FRAMEWORK_CATEGORIES
                    };
                    this.getCategoryData(request, currentField, index, hasUserClicked);
                });
        } else {
            // if the user has not clicked on the button, only then it has to show the loader
            /* istanbul ignore else */
            if (!hasUserClicked) {
                // publish a event to show the loader on card here
                this.events.publish('is-data-available', { show: false, index: index });
            }

            const request: CategoryRequest = {
                currentCategory: this.categories[index - 1].code,
                prevCategory: this.categories[index - 2].code,
                selectedCode: prevSelectedValue,
                selectedLanguage: this.translate.currentLang,
                categories: FrameworkCategory.DEFAULT_FRAMEWORK_CATEGORIES
            };
            this.getCategoryData(request, currentField, index, hasUserClicked);
        }
    }

    /**
     * It returns list name by ID
     * @param   {number} index
     * @returns {string} Listname
     */
    getListName(index: number): string {
        if (index === 0) {
            return 'syllabusList';
        } else if (index === 1) {
            return 'boardList';
        } else if (index === 2) {
            return 'mediumList';
        } else if (index === 3) {
            return 'gradeList';
        } else if (index === 4) {
            return 'subjectList';
        } else {
            return 'boardList';
        }
    }

    /**
     * Assign latest list data to local variables
     * @param {string} name name of the local variable
     */
    getListArray(name: string): void {
        /* istanbul ignore else */
        if (name === 'syllabusList') {
            this.onBoardingSlides[0].options = this.syllabusList;
        } else if (name === 'boardList') {
            this.onBoardingSlides[1].options = this.boardList;
        } else if (name === 'mediumList') {
            this.onBoardingSlides[2].options = this.mediumList;
        } else if (name === 'gradeList') {
            this.onBoardingSlides[3].options = this.gradeList;
        } else if (name === 'subjectList') {
            this.onBoardingSlides[4].options = this.subjectList;
        }
    }

    /**
     * This will makes an API call for the current category
     */
    saveDetails(index: number): Promise<any> {

        return new Promise((resolve, reject) => {
            const req: Profile = new Profile();
            req.syllabus = (_.find(this.onBoardingSlides, ['id', 'syllabusList']).selectedCode.length) ?
                _.find(this.onBoardingSlides, ['id', 'syllabusList']).selectedCode : this.profile.syllabus;
            req.board = (_.find(this.onBoardingSlides, ['id', 'boardList']).selectedCode.length) ?
                _.find(this.onBoardingSlides, ['id', 'boardList']).selectedCode : this.profile.board;
            req.grade = (_.find(this.onBoardingSlides, ['id', 'gradeList']).selectedCode.length) ?
                _.find(this.onBoardingSlides, ['id', 'gradeList']).selectedCode : this.profile.grade;
            req.subject = (_.find(this.onBoardingSlides, ['id', 'subjectList']).selectedCode.length) ?
                _.find(this.onBoardingSlides, ['id', 'subjectList']).selectedCode : this.profile.subject;
            req.medium = (_.find(this.onBoardingSlides, ['id', 'mediumList']).selectedCode.length) ?
                _.find(this.onBoardingSlides, ['id', 'mediumList']).selectedCode : this.profile.medium;
            req.uid = this.profile.uid;
            req.handle = this.profile.handle;
            req.createdAt = this.profile.createdAt;
            req.profileType = this.profile.profileType;
            req.source = this.profile.source;

            if (index === 0 && !_.find(this.onBoardingSlides, ['id', 'boardList']).selectedCode.length) {
                req.board = [];
                req.medium = [];
                req.grade = [];
                req.subject = [];
            }
            if (index === 1 && !_.find(this.onBoardingSlides, ['id', 'gradeList']).selectedCode.length) {
                req.grade = [];
            }
            if (index === 2 && !_.find(this.onBoardingSlides, ['id', 'gradeList']).selectedCode.length) {
                req.grade = [];
                req.subject = [];
            }
            if (index === 3 && !_.find(this.onBoardingSlides, ['id', 'subjectList']).selectedCode.length) {
                req.subject = [];
            }

            if (req.grade && req.grade.length > 0) {
                req.grade.forEach(gradeCode => {
                    for (let i = 0; i < this.gradeList.length; i++) {
                        if (this.gradeList[i].value === gradeCode) {
                            if (!req.gradeValueMap) {
                                req.gradeValueMap = {};
                            }
                            req.gradeValueMap[this.gradeList[i].value] = this.gradeList[i].text;
                            break;
                        }
                    }
                });
            }

            this.profileService.updateProfile(req)
                .then((res: any) => {
                    if (this.onBoardingSlides.length === (index + 1)) {
                        this.isOnBoardingCardCompleted = true;
                        this.events.publish('onboarding-card:completed', { isOnBoardingCardCompleted: this.isOnBoardingCardCompleted });
                    } else {
                        this.isOnBoardingCardCompleted = false;
                        this.events.publish('onboarding-card:completed', { isOnBoardingCardCompleted: this.isOnBoardingCardCompleted });
                    }
                    this.events.publish('refresh:profile');

                    this.getCurrentUser();

                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }

    /**
    * Method to convert Array to Comma separated string
    * @param {Array<string>} stringArray
    * @returns {string}
    */
    arrayToString(stringArray: Array<string>): string {
        return stringArray.join(', ');
    }

    /**
  * It Filter out the selected value and stores in object
  * @param {object} selectedSlide Object of all Options
  * @param {number} index         Slide index
  */
    selectedCheckboxValue(selectedSlide: any, index: number) {
        if (index === 0) {
            // To Support offline support for Onboarding Card
            for (let i = 0; i < selectedSlide.options.length; i++) {
                /* istanbul ignore else */
                if (selectedSlide.options[i].checked) {
                    this.formAndFrameworkUtilService.getFrameworkDetails(selectedSlide.options[i].value).then((val) => {
                        this.onBoardingSlides[index].selectedCode = [];
                        this.onBoardingSlides[index].selectedOptions = '';

                        for (let j = index; j < 5; j++) {
                            this.onBoardingSlides[j].selectedCode = [];
                            this.onBoardingSlides[j].selectedOptions = '';
                        }

                        this.setAndSaveDetails(selectedSlide, index);
                    }).catch(error => {
                        /* istanbul ignore else */
                        if (this.profile.syllabus && this.profile.syllabus[0] !== '') {
                            const displayValues = [];

                            this.syllabusList.forEach(element => {
                                if (_.includes(this.profile.syllabus, element.value)) {
                                    element.checked = true;
                                    displayValues.push(element.text);
                                }
                            });
                            this.onBoardingSlides[0].selectedOptions = this.arrayToString(displayValues);
                        }
                        this.commonUtilService.showToast(this.commonUtilService.translateMessage('NEED_INTERNET_TO_CHANGE'));
                    });
                }
            }
        } else {
            this.onBoardingSlides[index].selectedCode = [];
            this.onBoardingSlides[index].selectedOptions = '';

            for (let i = index; i < 5; i++) {
                this.onBoardingSlides[i].selectedCode = [];
                this.onBoardingSlides[i].selectedOptions = '';
            }

            this.setAndSaveDetails(selectedSlide, index);
        }
    }

    private setAndSaveDetails(selectedSlide: any, index: number) {
        const localSelectedSlide = selectedSlide;

        // The selectedCode has to be emptied here again, because, in getCategoryDetails we are by default selecting the category, if the
        // category list contains only one value in list
        this.onBoardingSlides[index].selectedCode = [];

        localSelectedSlide.options.forEach(options => {
            /* istanbul ignore else */
            if (options.checked) {
                this.onBoardingSlides[index].selectedCode.push(options.value);
            }
        });
        const displayValues = [];
        this.onBoardingSlides[index].options.forEach(element => {
            /* istanbul ignore else */
            if (_.includes(this.onBoardingSlides[index].selectedCode, element.value)) {
                displayValues.push(element.text);
            }
        });
        this.onBoardingSlides[index].selectedOptions = this.arrayToString(displayValues);

        this.saveDetails(index)
            .then(res => {
                // If user Selected Something from the list then only move the slide to next slide
                /* istanbul ignore else */
                if (this.onBoardingSlides[index].selectedOptions !== '') {
                    this.events.publish('slide-onboarding-card', { slideIndex: index });
                }

                if (index === 0) {
                    this.profile.board = [];
                    this.profile.grade = [];
                    this.profile.subject = [];
                    this.profile.medium = [];

                    // save the framework id here
                    this.frameworkId = this.onBoardingSlides[index].selectedCode[0];

                    this.checkPrevValue(index + 1, this.getListName(index + 1), this.profile.syllabus, false);
                } else if (index === 1) {
                    this.profile.grade = [];
                    this.profile.subject = [];
                    this.profile.medium = [];
                    this.checkPrevValue(index + 1, this.getListName(index + 1), this.profile.board, false);
                } else if (index === 2) {
                    this.profile.grade = [];
                    this.profile.subject = [];
                    this.checkPrevValue(index + 1, this.getListName(index + 1), this.profile.medium, false);
                } else if (index === 3) {
                    this.profile.subject = [];
                    this.checkPrevValue(index + 1, this.getListName(index + 1), this.profile.grade, false);
                }

            });
    }

}
