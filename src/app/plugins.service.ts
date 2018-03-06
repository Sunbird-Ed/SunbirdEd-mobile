import {Injectable} from "@angular/core";
import {ContainerService} from "sunbird";
import {CoursesPageModule} from "./../plugins/core/courses/courses.module";
import {GroupPageModule} from "./../plugins/core/group/group.module";
import {HomePageModule} from "./../plugins/core/home/home.module";
import {ProfilePageModule} from "./../plugins/core/profile/profile.module";
import {ResourcesPageModule} from "./../plugins/core/resources/resources.module";
import {CoursesPage} from "./../plugins/core/courses/courses";
import {GroupPage} from "./../plugins/core/group/group";
import {HomePage} from "./../plugins/core/home/home";
// import {ProfilePage} from "./../plugins/core/profile/profile";
import {ResourcesPage} from "./../plugins/core/resources/resources";
import { GuestProfilePage } from "../plugins/core/guest-profile/guest-profile";
import { GuestProfilePageModule } from "../plugins/core/guest-profile/guest-profile.module";

@Injectable()
export class PluginService {
    constructor(private container: ContainerService) {
    }

    loadAllPlugins() {
        CoursesPage.prototype.init(this.container);
        // GroupPage.prototype.init(this.container);
        HomePage.prototype.init(this.container);
        // ProfilePage.prototype.init(this.container);
        GuestProfilePage.prototype.init(this.container);
        ResourcesPage.prototype.init(this.container);
    }

    static getAllPluginModules(): Array<any> {
        let modules = [CoursesPageModule, GroupPageModule, HomePageModule, 
            ProfilePageModule, ResourcesPageModule,GuestProfilePageModule];
        return modules;
    }
}
