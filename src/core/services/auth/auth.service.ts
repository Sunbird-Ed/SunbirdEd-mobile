import { Injectable } from "@angular/core";

@Injectable()
export class AuthService {

    getBearerToken(
        successCallback: (response: string) => void, 
        errorCallback: (error: string) => void) {
            (<any>window).GenieSDK.auth(successCallback, errorCallback);
    }

}