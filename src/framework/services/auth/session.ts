import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

const KEY_REFRESH_TOKEN = "refresh_token";
const KEY_ACCESS_TOKEN = "access_token";
const KEY_USER_TOKEN = "user_token";

@Injectable()
export class Session {

    user_token: string;
    user_access_token: string;
    refresh_token: string;

    constructor(private storage: Storage) {
        this.init();
    }

    private init() {
        let that = this;
        that.storage.get(KEY_USER_TOKEN)
        .then(val => {
            if (val === undefined || val === "")
                return;
            that.user_token = val;
            return that.storage.get(KEY_ACCESS_TOKEN);
        })
        .then(val => {
            if (val === undefined || val === "")
                return;
            that.user_access_token = val;
            return that.storage.get(KEY_REFRESH_TOKEN);
        })
        .then(val => {
            if (val === undefined || val === "")
                return;
            that.refresh_token = val;
        })
    }

    createSession(user_token: string, user_access_token: string, refresh_token: string) {
        this.user_token = user_token;
        this.user_access_token = user_access_token;
        this.refresh_token = refresh_token;

        this.storage.set(KEY_REFRESH_TOKEN, refresh_token);
        this.storage.set(KEY_USER_TOKEN, user_token);
        this.storage.set(KEY_ACCESS_TOKEN, user_access_token);
    }

    logout() {
        this.user_token = undefined;
        this.user_access_token = undefined;
        this.refresh_token = undefined;

        this.storage.remove(KEY_REFRESH_TOKEN);
        this.storage.remove(KEY_USER_TOKEN);
        this.storage.remove(KEY_ACCESS_TOKEN);
    }

    isValidSession(): boolean {
        return (this.user_token !== undefined && 
            this.user_access_token !== undefined && 
            this.refresh_token !== undefined);
    }

}