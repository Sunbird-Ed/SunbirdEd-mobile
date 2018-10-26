
import { Injectable } from '@angular/core';
import {
    Profile,
    ProfileType,
    AuthService,
    SharedPreferences,
    ProfileService,
    BuildParamService,
    PageId,
    Environment,
    InteractType,
    InteractSubtype,
    FrameworkDetailsRequest,
    FrameworkService
} from 'sunbird';
import {
    Events,
    PopoverController,
    PopoverOptions
} from 'ionic-angular';
import { UpgradePopover } from '../pages/upgrade/upgrade-popover';
import {
    GenericAppConfig,
    PreferenceKey
} from '../app/app.constant';
import { TelemetryGeneratorService } from './telemetry-generator.service';

@Injectable()
export class AppGlobalService {

    constructor(
        private event: Events,
        private authService: AuthService,
        private profile: ProfileService,
        private preference: SharedPreferences,
        private popoverCtrl: PopoverController,
        private buildParamService: BuildParamService,
        private framework: FrameworkService,
        private telemetryGeneratorService: TelemetryGeneratorService
    ) {

        this.initValues();
        this.listenForEvents();
    }

    public static readonly USER_INFO_UPDATED = 'user-profile-changed';
    public static readonly PROFILE_OBJ_CHANGED = 'app-global:profile-obj-changed';
    public static isPlayerLaunched = false;

    /**
    * This property stores the courses enrolled by a user
    */
    courseList: Array<any>;
    /**
    * This property stores the form details at the app level for a particular app session
    */
    syllabusList: Array<any> = [];

    /**
    * This property stores the course filter configuration at the app level for a particular app session
    */
    courseFilterConfig: Array<any> = [];

    /**
    * This property stores the library filter configuration at the app level for a particular app session
    */
    libraryFilterConfig: Array<any> = [];

    guestUserProfile: Profile;
    isGuestUser = false;
    guestProfileType: ProfileType;
    isProfileSettingsCompleted: boolean;
    isOnBoardingCompleted = false;
    session: any;
    public averageTime = 0;
    public averageScore = 0;
    private frameworkData = [];
    public DISPLAY_ONBOARDING_CARDS = false;
    public DISPLAY_FRAMEWORK_CATEGORIES_IN_PROFILE = false;
    public DISPLAY_ONBOARDING_PAGE = false;
    public DISPLAY_SIGNIN_FOOTER_CARD_IN_COURSE_TAB_FOR_TEACHER = false;
    public DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_TEACHER = false;
    public DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_TEACHER = false;
    public DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_STUDENT = false;
    public DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_STUDENT = false;
    public TRACK_USER_TELEMETRY = false;
    public CONTENT_STREAMING_ENABLED = false;
    public DISPLAY_ONBOARDING_SCAN_PAGE = false;
    public DISPLAY_ONBOARDING_CATEGORY_PAGE = false;
    public OPEN_RAPDISCOVERY_ENABLED = false;

    isUserLoggedIn(): boolean {
        return !this.isGuestUser;
    }

    getGuestUserType(): ProfileType {
        return this.guestProfileType;
    }

    getCurrentUser(): Profile {
        return this.guestUserProfile;
    }

    getSessionData(): any {
        return this.session;
    }

    getNameForCodeInFramework(category, code) {
        let name;

        if (this.frameworkData[category]
            && this.frameworkData[category].terms
            && this.frameworkData[category].terms.length > 0) {
            const matchingTerm = this.frameworkData[category].terms.find((term) => {
                return term.code === code;
            });

            if (matchingTerm) {
                name = matchingTerm.name;
            }
        }

        return name;
    }

    /**
    * This method stores the list of courses enrolled by user, and is updated every time
    * getEnrolledCourses is called.
    * @param courseList
    */
    setEnrolledCourseList(courseList: Array<any>) {
        this.courseList = courseList;
    }

    /**
    * This method returns the list of enrolled courses
    *
    * @param courseList
    *
    */
    getEnrolledCourseList(): Array<any> {
        return this.courseList;
    }

    /**
    * This method stores the form details, for a particular session of the app
    *
    * @param syllabusList
    *
    */
    setSyllabusList(syllabusList: Array<any>): any {
        this.syllabusList = syllabusList;
    }

    /**
    * This method returns the form details cached, for a particular session of the app
    *
    * @param syllabusList
    *
    */
    getCachedSyllabusList(): Array<any> {
        return this.syllabusList;
    }

    /**
    * This method stores the course filter config, for a particular session of the app
    *
    * @param courseFilterConfig
    *
    */
    setCourseFilterConfig(courseFilterConfig: Array<any>) {
        this.courseFilterConfig = courseFilterConfig;
    }

    /**
    * This method returns the course filter config cache, for a particular session of the app
    *
    * @param syllabusList
    *
    */
    getCachedCourseFilterConfig(): Array<any> {
        return this.courseFilterConfig;
    }

    /**
    * This method stores the library filter config, for a particular session of the app
    *
    */
    setLibraryFilterConfig(libraryFilterConfig: Array<any>) {
        this.libraryFilterConfig = libraryFilterConfig;
    }

    /**
    * This method returns the library filter config cache, for a particular session of the app
    *
    */
    getCachedLibraryFilterConfig(): Array<any> {
        return this.libraryFilterConfig;
    }

    private initValues() {
        this.readConfig();
        this.authService.getSessionData((session) => {
            if (session === null || session === 'null') {
                this.getGuestUserInfo();
            } else {
                this.guestProfileType = undefined;
                this.isGuestUser = false;
                this.session = JSON.parse(session);
            }
            this.getCurrentUserProfile();
        });

        this.preference.getString(PreferenceKey.IS_ONBOARDING_COMPLETED)
            .then((result) => {
                this.isOnBoardingCompleted = (result === 'true') ? true : false;
            });
    }

    setOnBoardingCompleted() {
        this.isOnBoardingCompleted = true;
        this.preference.putString(PreferenceKey.IS_ONBOARDING_COMPLETED, 'true');
    }

    readConfig() {
        this.buildParamService.getBuildConfigParam(GenericAppConfig.DISPLAY_ONBOARDING_CARDS)
            .then(response => {
                this.DISPLAY_ONBOARDING_CARDS = response === 'true' ? true : false;
            })
            .catch(error => {
                this.DISPLAY_ONBOARDING_CARDS = false;
            });

        this.buildParamService.getBuildConfigParam(GenericAppConfig.DISPLAY_FRAMEWORK_CATEGORIES_IN_PROFILE)
            .then(response => {
                this.DISPLAY_FRAMEWORK_CATEGORIES_IN_PROFILE = response === 'true' ? true : false;
            })
            .catch(error => {
                this.DISPLAY_FRAMEWORK_CATEGORIES_IN_PROFILE = false;
            });

        this.buildParamService.getBuildConfigParam(GenericAppConfig.DISPLAY_ONBOARDING_PAGE)
            .then(response => {
                this.DISPLAY_ONBOARDING_PAGE = response === 'true' ? true : false;
            })
            .catch(error => {
                this.DISPLAY_ONBOARDING_PAGE = false;
            });

        this.buildParamService.getBuildConfigParam(GenericAppConfig.DISPLAY_SIGNIN_FOOTER_CARD_IN_COURSE_TAB_FOR_TEACHER)
            .then(response => {
                this.DISPLAY_SIGNIN_FOOTER_CARD_IN_COURSE_TAB_FOR_TEACHER = response === 'true' ? true : false;
            })
            .catch(error => {
                this.DISPLAY_SIGNIN_FOOTER_CARD_IN_COURSE_TAB_FOR_TEACHER = false;
            });

        this.buildParamService.getBuildConfigParam(GenericAppConfig.DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_TEACHER)
            .then(response => {
                this.DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_TEACHER = response === 'true' ? true : false;
            })
            .catch(error => {
                this.DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_TEACHER = false;
            });

        this.buildParamService.getBuildConfigParam(GenericAppConfig.DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_TEACHER)
            .then(response => {
                this.DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_TEACHER = response === 'true' ? true : false;
            })
            .catch(error => {
                this.DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_TEACHER = false;
            });

        this.buildParamService.getBuildConfigParam(GenericAppConfig.DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_STUDENT)
            .then(response => {
                this.DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_STUDENT = response === 'true' ? true : false;
            })
            .catch(error => {
                this.DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_STUDENT = false;
            });

        this.buildParamService.getBuildConfigParam(GenericAppConfig.DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_STUDENT)
            .then(response => {
                this.DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_STUDENT = response === 'true' ? true : false;
            })
            .catch(error => {
                this.DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_STUDENT = false;
            });
        this.buildParamService.getBuildConfigParam(GenericAppConfig.TRACK_USER_TELEMETRY)
            .then(response => {
                this.TRACK_USER_TELEMETRY = response === 'true' ? true : false;
            })
            .catch(error => {
                this.TRACK_USER_TELEMETRY = false;
            });
        this.buildParamService.getBuildConfigParam(GenericAppConfig.CONTENT_STREAMING_ENABLED)
            .then(response => {
                this.CONTENT_STREAMING_ENABLED = response === 'true' ? true : false;
            })
            .catch(error => {
                this.CONTENT_STREAMING_ENABLED = false;
            });

        this.buildParamService.getBuildConfigParam(GenericAppConfig.DISPLAY_ONBOARDING_SCAN_PAGE)
            .then(response => {
                this.DISPLAY_ONBOARDING_SCAN_PAGE = response === 'true' ? true : false;
            })
            .catch(error => {
                this.DISPLAY_ONBOARDING_SCAN_PAGE = false;
            });
        this.buildParamService.getBuildConfigParam(GenericAppConfig.DISPLAY_ONBOARDING_CATEGORY_PAGE)
            .then(response => {
                this.DISPLAY_ONBOARDING_CATEGORY_PAGE = response === 'true' ? true : false;
            })
            .catch(error => {
                this.DISPLAY_ONBOARDING_CATEGORY_PAGE = false;
            });
        this.buildParamService.getBuildConfigParam(GenericAppConfig.OPEN_RAPDISCOVERY_ENABLED)
            .then(response => {
                this.OPEN_RAPDISCOVERY_ENABLED = response === 'true' ? true : false;
            })
            .catch( error => {
               this.OPEN_RAPDISCOVERY_ENABLED = false;
            });
    }

    private getCurrentUserProfile() {
        this.profile.getCurrentUser((response) => {
            this.guestUserProfile = JSON.parse(response);
            if (this.guestUserProfile.syllabus && this.guestUserProfile.syllabus.length > 0) {
                this.getFrameworkDetails(this.guestUserProfile.syllabus[0])
                    .then((categories) => {
                        categories.forEach(category => {
                            this.frameworkData[category.code] = category;
                        });

                        this.event.publish(AppGlobalService.PROFILE_OBJ_CHANGED);
                    }).catch((error) => {
                        this.frameworkData = [];
                        this.event.publish(AppGlobalService.PROFILE_OBJ_CHANGED);
                    });
                this.getProfileSettingsStatus();
            } else {
                this.frameworkData = [];
                this.event.publish(AppGlobalService.PROFILE_OBJ_CHANGED);
            }
        }, (error) => {
            this.guestUserProfile = undefined;
            this.event.publish(AppGlobalService.PROFILE_OBJ_CHANGED);
        });
    }

    // Remove this method after refactoring formandframeworkutil.service
    private getFrameworkDetails(frameworkId: string): Promise<any> {
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

    public getGuestUserInfo() {
        this.preference.getString(PreferenceKey.SELECTED_USER_TYPE)
            .then(val => {
                if (val !== undefined && val !== '') {
                    if (val === ProfileType.STUDENT) {
                        this.guestProfileType = ProfileType.STUDENT;
                    } else if (val === ProfileType.TEACHER) {
                        this.guestProfileType = ProfileType.TEACHER;
                    } else if (val === 'student') {
                        this.guestProfileType = ProfileType.STUDENT;
                    } else if (val === 'teacher') {
                        this.guestProfileType = ProfileType.TEACHER;
                    }
                    this.isGuestUser = true;
                }
            });
    }

    private listenForEvents() {
        this.event.subscribe(AppGlobalService.USER_INFO_UPDATED, () => {
            this.initValues();
        });

        this.event.subscribe('refresh:profile', () => {
            this.initValues();
        });
    }

    openPopover(upgradeType: any) {
        let shouldDismissAlert = true;

        if (upgradeType.upgrade.type === 'force') {
            shouldDismissAlert = false;
        }

        const options: PopoverOptions = {
            cssClass: 'upgradePopover',
            showBackdrop: true,
            enableBackdropDismiss: shouldDismissAlert
        };

        const popover = this.popoverCtrl.create(UpgradePopover, { type: upgradeType }, options);
        popover.present({
        });
    }

    generateConfigInteractEvent(pageId: string, isOnBoardingCompleted?: boolean) {
        if (this.isGuestUser) {
            const paramsMap = new Map();
            if (pageId !== PageId.PROFILE) {
                paramsMap['isOnBoardingPageConfigEnabled'] = this.DISPLAY_ONBOARDING_PAGE;
                paramsMap['isOnBoardingCardsConfigEnabled'] = this.DISPLAY_ONBOARDING_CARDS;
                paramsMap['isProfileSettingsCompleted'] = isOnBoardingCompleted;
            }
            const profileType = this.getGuestUserType();
            if (profileType === ProfileType.TEACHER) {
                switch (pageId) {
                    case PageId.LIBRARY: {
                        paramsMap['isSignInCardConfigEnabled'] = this.DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_TEACHER;
                        break;
                    }
                    case PageId.COURSES: {
                        paramsMap['isSignInCardConfigEnabled'] = this.DISPLAY_SIGNIN_FOOTER_CARD_IN_COURSE_TAB_FOR_TEACHER;
                        break;
                    }
                    case PageId.GUEST_PROFILE: {
                        paramsMap['isSignInCardConfigEnabled'] = this.DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_TEACHER;
                        break;
                    }
                }

            } else {
                switch (pageId) {
                    case PageId.LIBRARY: {
                        paramsMap['isSignInCardConfigEnabled'] = this.DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_STUDENT;
                        break;
                    }
                    case PageId.GUEST_PROFILE: {
                        paramsMap['isSignInCardConfigEnabled'] = this.DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_STUDENT;
                        break;
                    }
                }
            }

            this.telemetryGeneratorService.generateInteractTelemetry(InteractType.OTHER,
                InteractSubtype.INITIAL_CONFIG,
                Environment.HOME,
                pageId,
                undefined,
                paramsMap
            );
        }
    }

    generateAttributeChangeTelemetry(oldAttribute, newAttribute) {
        if (this.TRACK_USER_TELEMETRY) {
            const values = new Map();
            values['oldValue'] = oldAttribute;
            values['newValue'] = newAttribute;

            this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
                InteractSubtype.PROFILE_ATTRIBUTE_CHANGED,
                Environment.USER,
                PageId.GUEST_PROFILE,
                undefined,
                values);
        }
    }

    generateSaveClickedTelemetry(profile, validation, pageId, interactSubtype) {
        if (this.TRACK_USER_TELEMETRY) {
            const values = new Map();
            values['profile'] = profile;
            values['validation'] = validation;

            this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
                interactSubtype,
                Environment.USER,
                pageId,
                undefined,
                values);
        }
    }

    setAverageTime(time) {
        this.averageTime = time;
    }

    getAverageTime() {
        return this.averageTime;
    }

    setAverageScore(averageScore: any): any {
        this.averageScore = averageScore;
    }

    getAverageScore() {
        return this.averageScore;
    }

    getProfileSettingsStatus(): Promise<any> {
        return new Promise((resolve, reject) => {
            const profile = this.getCurrentUser();
            this.isProfileSettingsCompleted = Boolean(this.isGuestUser
                && profile
                && profile.syllabus && profile.syllabus[0]
                && profile.board && profile.board.length
                && profile.grade && profile.grade.length
                && profile.medium && profile.medium.length);
            resolve(this.isProfileSettingsCompleted);
        });
    }
}

