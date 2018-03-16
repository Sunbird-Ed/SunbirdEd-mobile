import {Injectable} from "@angular/core";
import {ContainerService} from "sunbird";
import { GroupPage } from "../pages/group/group";
import { CoursesPage } from "../pages/courses/courses";
import { GuestProfilePage } from "../pages/guest-profile/guest-profile";
import { HomePage } from "../pages/home/home";
import { ProfilePage } from "../pages/profile/profile";
import { ResourcesPage } from "../pages/resources/resources";
import { CoursesPageModule } from "../pages/courses/courses.module";
import { GroupPageModule } from "../pages/group/group.module";
import { HomePageModule } from "../pages/home/home.module";
import { ProfilePageModule } from "../pages/profile/profile.module";
import { ResourcesPageModule } from "../pages/resources/resources.module";
import { GuestProfilePageModule } from "../pages/guest-profile/guest-profile.module";
import { OnboardingPageModule } from "../pages/onboarding/onboarding.module";
import { LanguageSettingsPageModule } from "../pages/language-settings/language-settings.module";
import { RolePageModule } from "../pages/userrole/role.module";
import { GuestEditProfileModule } from "../pages/guest-edit.profile/guest-edit-profile.module";

export function initUserTabs(container: ContainerService) {
    container.removeAllTabs();
    container.addTab({root: GroupPage, label: "GROUPS", icon:"groups", index: 3});
    container.addTab({root: CoursesPage, icon: "courses", label:"COURSES", index: 1});
    container.addTab({root: HomePage, label: "HOME", icon:"home", index: 0});
    container.addTab({ root: ProfilePage, label: "PROFILE", icon: "profile", index: 4});
    container.addTab({root: ResourcesPage, label: "RESOURCES", icon: "resources", index: 2});
}

export function initGuestTabs(container: ContainerService) {
    container.removeAllTabs();
    container.addTab({root: GroupPage, label: "GROUPS", icon:"groups", index: 3});
    container.addTab({root: CoursesPage, icon: "courses", label:"COURSES", index: 1});
    container.addTab({ root: GuestProfilePage, label: "PROFILE", icon: "profile", index: 4 })
    container.addTab({root: HomePage, label: "HOME", icon:"home", index: 0});
    container.addTab({root: ResourcesPage, label: "RESOURCES", icon: "resources", index: 2});
}

export const PluginModules = [CoursesPageModule, GroupPageModule, HomePageModule, 
    ProfilePageModule, ResourcesPageModule, GuestProfilePageModule, 
    OnboardingPageModule, LanguageSettingsPageModule, RolePageModule,
    GuestEditProfileModule];
