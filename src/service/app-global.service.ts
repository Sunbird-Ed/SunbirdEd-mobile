import { Injectable } from "@angular/core";
import { Profile, ProfileType, AuthService, SharedPreferences, ProfileService } from "sunbird";
import { Events } from "ionic-angular";


@Injectable()
export class AppGlobalService {

    public static readonly USER_INFO_UPDATED = 'user-profile-changed';
    public static readonly PROFILE_OBJ_CHANGED = 'app-global:profile-obj-changed';

    guestUserProfile: Profile;
    isGuestUser: boolean = false;
    guestProfileType: ProfileType;

    session: any;


    constructor(private event: Events,
        private authService: AuthService,
        private profile: ProfileService,
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
            this.event.publish(AppGlobalService.PROFILE_OBJ_CHANGED);
        }, (error) => {
            this.guestUserProfile = undefined;
            this.event.publish(AppGlobalService.PROFILE_OBJ_CHANGED);
        });
    }


    private getGuestUserInfo() {
        console.log("getGuestUserInfo");
        this.preference.getString('selected_user_type', (val) => {
            if (val != "") {
                if (val == ProfileType.STUDENT) {
                    this.guestProfileType = ProfileType.STUDENT;
                }
                else if (val == ProfileType.TEACHER) {
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
}