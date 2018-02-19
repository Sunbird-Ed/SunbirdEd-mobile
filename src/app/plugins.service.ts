import { Injectable } from "@angular/core";
import { ContainerService } from "../core/index";
import { HomePage } from "../plugins/home/home";
import { CoursesPage } from "../plugins/courses/courses";
import { ResourcesPage } from "../plugins/resources/resources";
import { GroupPage } from "../plugins/group/group";
import { ProfilePage } from "../plugins/profile/profile";
import { HomePageModule } from "../plugins/home/home.module";
import { CoursesPageModule } from "../plugins/courses/courses.module";
import { GroupPageModule } from "../plugins/group/group.module";
import { ResourcesPageModule } from "../plugins/resources/resources.module";
import { ProfilePageModule } from "../plugins/profile/profile.module";
import { OnboardingPageModule } from "../plugins/onboarding/onboarding.module";


@Injectable()
export class PluginService {

    constructor(private container: ContainerService) {

    }

    loadAllPlugins() {
        HomePage.prototype.init(this.container);
        CoursesPage.prototype.init(this.container);
        ResourcesPage.prototype.init(this.container);
        GroupPage.prototype.init(this.container);
        ProfilePage.prototype.init(this.container);
    }

    static getAllPluginModules(): Array<any> {
        let modules = [HomePageModule,
            CoursesPageModule,
            GroupPageModule,
            ResourcesPageModule,
            ProfilePageModule,
            OnboardingPageModule];
        return modules;
    }

}