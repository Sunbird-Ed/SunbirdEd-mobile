import { NgModule } from "@angular/core";
import { HomePageModule } from "../plugins/home/home.module";
import { CoursesPageModule } from "../plugins/courses/courses.module";
import { GroupPageModule } from "../plugins/group/group.module";
import { ResourcesPageModule } from "../plugins/resources/resources.module";
import { ProfilePageModule } from "../plugins/profile/profile.module";
import { OnboardingPageModule } from "../plugins/onboarding/onboarding.module";
import { ContainerService } from "./container/container.services";
import { PluginService } from "./plugin/plugin.service";
import { CameraService } from "./services/camera.service";
import { Camera } from '@ionic-native/camera';
import { ContentService } from "./services/content/content.service";
import { EventService } from "./services/event/event.service";

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
        ContainerService,
        CameraService,
        Camera,
        ContentService,
        EventService
    ]
})
export class CoreModule {

}
