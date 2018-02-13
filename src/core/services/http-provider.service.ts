import { Injectable } from "@angular/core";
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class HttpProviderService {

    constructor(public http: Http) { }

    public getProfileData() {
        return this.http.get("assets/data/profile.json")
            .map((res: Response) => res.json());
    }
}