import { Injectable } from "@angular/core";
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
    InteractSubtype
} from "sunbird";
import {
    Events,
    PopoverController,
    PopoverOptions
} from "ionic-angular";
import { UpgradePopover } from "../pages/upgrade/upgrade-popover";
import { GenericAppConfig } from "../app/app.constant";
import { TelemetryGeneratorService } from "./telemetry-generator.service";
import { FormAndFrameworkUtilService } from "../pages/profile/formandframeworkutil.service";

@Injectable()
export class AppGlobalService {

    /**
     * This property stores the form details at the app level for a particular app session
     */
    syllabusList: Array<any> = [];

    /**
     * This property stores the course filter configuration at the app level for a particular app session
     */
    courseFilterConfig: Array<any> = [];

    /**
     * This property stores the library filter configuration  at the app level for a particular app session
     */
    libraryFilterConfig: Array<any> = [];

    public static readonly USER_INFO_UPDATED = 'user-profile-changed';
    public static readonly PROFILE_OBJ_CHANGED = 'app-global:profile-obj-changed';

    guestUserProfile: Profile;
    isGuestUser: boolean = false;
    guestProfileType: ProfileType;

    session: any;
    public static isPlayerLaunched: boolean = false;

    private frameworkData = [];
    public DISPLAY_ONBOARDING_CARDS: boolean = false;
    public DISPLAY_FRAMEWORK_CATEGORIES_IN_PROFILE: boolean = false;
    public DISPLAY_ONBOARDING_PAGE: boolean = false;
    public DISPLAY_SIGNIN_FOOTER_CARD_IN_COURSE_TAB_FOR_TEACHER: boolean = false;
    public DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_TEACHER: boolean = false;
    public DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_TEACHER: boolean = false;
    public DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_STUDENT: boolean = false;
    public DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_STUDENT: boolean = false;

    constructor(private event: Events,
        private authService: AuthService,
        private profile: ProfileService,
        private preference: SharedPreferences,
        private popoverCtrl: PopoverController,
        private buildParamService: BuildParamService,
        private formAndFrameworkUtilService: FormAndFrameworkUtilService,
        private telemetryGeneratorService: TelemetryGeneratorService) {

        this.initValues();
        this.listenForEvents();
    }

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
        let name = undefined;

        if (this.frameworkData[category]
            && this.frameworkData[category].terms
            && this.frameworkData[category].terms.length > 0) {
            let matchingTerm = this.frameworkData[category].terms.find((term) => {
                return term.code == code;
            })

            if (matchingTerm) {
                name = matchingTerm.name;
            }
        }

        return name;
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
        console.log("initValues");
        this.authService.getSessionData((session) => {
            if (session === null || session === "null") {
                this.getGuestUserInfo();
            } else {
                this.guestProfileType = undefined;
                this.isGuestUser = false;
                this.session = JSON.parse(session);
            }
            this.getCurrentUserProfile();
        });
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
    }

    private getCurrentUserProfile() {
        console.log("getCurrentUserProfile");
        this.profile.getCurrentUser((response) => {
            this.guestUserProfile = JSON.parse(response);
            if (this.guestUserProfile.syllabus && this.guestUserProfile.syllabus.length > 0) {
                this.formAndFrameworkUtilService.getFrameworkDetails(this.guestUserProfile.syllabus[0])
                    .then((categories) => {
                        categories.forEach(category => {
                            this.frameworkData[category.code] = category;
                        })

                        this.event.publish(AppGlobalService.PROFILE_OBJ_CHANGED);
                    }).catch((error) => {
                        this.frameworkData = [];
                        this.event.publish(AppGlobalService.PROFILE_OBJ_CHANGED);
                    })
            } else {
                this.frameworkData = [];
                this.event.publish(AppGlobalService.PROFILE_OBJ_CHANGED);
            }
        }, (error) => {
            this.guestUserProfile = undefined;
            this.event.publish(AppGlobalService.PROFILE_OBJ_CHANGED);
        });
    }

    private getGuestUserInfo() {
        console.log("getGuestUserInfo");
        this.preference.getString('selected_user_type')
            .then(val => {
                if (val !== undefined && val != "") {
                    if (val == ProfileType.STUDENT) {
                        this.guestProfileType = ProfileType.STUDENT;
                    }
                    else if (val == ProfileType.TEACHER) {
                        this.guestProfileType = ProfileType.TEACHER;
                    } else if (val === "student") {
                        this.guestProfileType = ProfileType.STUDENT;
                    } else if (val === "teacher") {
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
        let shouldDismissAlert: boolean = true;

        if (upgradeType.upgrade.type === 'force') {
            shouldDismissAlert = false;
        }

        let options: PopoverOptions = {
            cssClass: 'upgradePopover',
            showBackdrop: true,
            enableBackdropDismiss: shouldDismissAlert
        }

        let popover = this.popoverCtrl.create(UpgradePopover, { type: upgradeType }, options);
        popover.present({
        });
    }

    generateConfigInteractEvent(pageId: String, isOnBoardingCompleted?: boolean) {
        if (this.isGuestUser) {
            let paramsMap = new Map();
            if (pageId !== PageId.PROFILE) {
                paramsMap["isOnBoardingPageConfigEnabled"] = this.DISPLAY_ONBOARDING_PAGE;
                paramsMap["isOnBoardingCardsConfigEnabled"] = this.DISPLAY_ONBOARDING_CARDS;
                paramsMap["isOnBoardingCompleted"] = isOnBoardingCompleted;
            }
            let profileType = this.getGuestUserType();
            if (profileType === ProfileType.TEACHER) {
                switch (pageId) {
                    case PageId.LIBRARY: {
                        paramsMap["isSignInCardConfigEnabled"] = this.DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_TEACHER;
                        break;
                    }
                    case PageId.COURSES: {
                        paramsMap["isSignInCardConfigEnabled"] = this.DISPLAY_SIGNIN_FOOTER_CARD_IN_COURSE_TAB_FOR_TEACHER;
                        break;
                    }
                    case PageId.GUEST_PROFILE: {
                        paramsMap["isSignInCardConfigEnabled"] = this.DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_TEACHER;
                        break;
                    }
                }

            } else {
                switch (pageId) {
                    case PageId.LIBRARY: {
                        paramsMap["isSignInCardConfigEnabled"] = this.DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_STUDENT;
                        break;
                    }
                    case PageId.GUEST_PROFILE: {
                        paramsMap["isSignInCardConfigEnabled"] = this.DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_STUDENT;
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
}