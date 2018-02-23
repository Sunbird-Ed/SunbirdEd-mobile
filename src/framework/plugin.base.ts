import { ContainerService } from "./index";

export interface BasePlugin {
    init(container: ContainerService);
}