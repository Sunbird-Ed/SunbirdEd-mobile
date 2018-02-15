import { NgModule } from "@angular/core";
import { ContainerService } from "./container/container.services";
import { HttpProviderService } from "./services/http-provider.service";
import { CameraService } from "./services/camera.service";
import { Camera } from '@ionic-native/camera';
import { ContentService } from "./services/content/content.service";
import { EventService } from "./services/event/event.service";
import { IonicStorageModule } from "@ionic/storage";
import { TelemetryService } from "./services/telemetry/telemetry.service";
import { TelemetryServiceFactory } from "./services/telemetry/factory";
import { GenieSDKServiceFactory } from "./services/telemetry/geniesdk.service";

@NgModule({
    imports: [
        IonicStorageModule.forRoot()
    ],
    providers: [
        ContainerService,
        HttpProviderService,
        CameraService,
        Camera,
        ContentService,
        EventService,
        {provide: TelemetryServiceFactory, useClass: GenieSDKServiceFactory},
        TelemetryService
    ]
})
export class CoreModule {

}
