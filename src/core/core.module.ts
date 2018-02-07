import { NgModule } from "@angular/core";
import { HomePageModule } from "../plugins/home/home.module";
import { CoursesPageModule } from "../plugins/courses/courses.module";
import { GroupPageModule } from "../plugins/group/group.module";
import { ResourcesPageModule } from "../plugins/resources/resources.module";
import { ProfilePageModule } from "../plugins/profile/profile.module";
import { OnboardingPageModule } from "../plugins/onboarding/onboarding.module";
import { ContainerService } from "./container/container.services";
import { PluginService } from "./plugin/plugin.service";


@NgModule({
    imports: [
        HomePageModule,
        CoursesPageModule,
        GroupPageModule,
        ResourcesPageModule,
        ProfilePageModule,
        OnboardingPageModule
    ],
    providers: [
        PluginService,
        ContainerService
    ]
})
export class CoreModule {

}
