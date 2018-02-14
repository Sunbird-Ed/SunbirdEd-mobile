import { Injectable } from "@angular/core";

@Injectable()
export class Session {

    user_token: string;
    user_access_token: string;
    refresh_token: string;

}