import { Injectable } from "@angular/core";
import { HomePage } from "../../plugins/home/home";
import { CoursesPage } from "../../plugins/courses/courses";
import { ResourcesPage } from "../../plugins/resources/resources";
import { GroupPage } from "../../plugins/group/group";
import { ProfilePage } from "../../plugins/profile/profile";
import { ContainerService } from "../container/container.services";

export interface BasePlugin {

    init(containerService: ContainerService);

}


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

}
