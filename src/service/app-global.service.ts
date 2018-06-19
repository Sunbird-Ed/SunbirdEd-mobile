import { Injectable } from "@angular/core";
import { Profile, ProfileType, AuthService, SharedPreferences, ProfileService, FrameworkDetailsRequest, FrameworkService } from "sunbird";
import { Events } from "ionic-angular";
import { FormAndFrameworkUtilService } from "../pages/profile/formandframeworkutil.service";


@Injectable()
export class AppGlobalService {

    /**
   * This property stores the form details at the app level for a particular app session 
   * 
   */
    syllabusList: Array<any> = [];

    public static readonly USER_INFO_UPDATED = 'user-profile-changed';
    public static readonly PROFILE_OBJ_CHANGED = 'app-global:profile-obj-changed';

    guestUserProfile: Profile;
    isGuestUser: boolean = false;
    guestProfileType: ProfileType;

    session: any;

    private frameWork = [];


    constructor(private event: Events,
        private authService: AuthService,
        private profile: ProfileService,
        private framework: FrameworkService,
        private preference: SharedPreferences) {
        console.log("constructor");
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

        if (this.frameWork[category] && this.frameWork[category].terms && this.frameWork[category].terms.length > 0) {
            let matchingTerm = this.frameWork[category].terms.find((term) => {
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

    private initValues() {
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


    private getCurrentUserProfile() {
        console.log("getCurrentUserProfile");
        this.profile.getCurrentUser((response) => {
            this.guestUserProfile = JSON.parse(response);
            this.getFrameworkDetails(this.guestUserProfile.syllabus[0])
                .then((categories) => {
                    categories.forEach(category => {
                        this.frameWork[category.code] = category;
                    })

                    this.event.publish(AppGlobalService.PROFILE_OBJ_CHANGED);
                }).catch((error) => {
                    this.frameWork = undefined;
                    this.event.publish(AppGlobalService.PROFILE_OBJ_CHANGED);
                })



        }, (error) => {
            this.guestUserProfile = undefined;
            this.event.publish(AppGlobalService.PROFILE_OBJ_CHANGED);
        });
    }


    private getGuestUserInfo() {
        console.log("getGuestUserInfo");
        this.preference.getString('selected_user_type', (val) => {
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

    /**
 * Get all categories using framework api
 */
    private getFrameworkDetails(frameworkId?: string): Promise<any> {

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
                    let categories = res;
                    resolve(categories);
                },
                (err: any) => {
                    reject(err);
                });
        });
    }
}