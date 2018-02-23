import { Injectable } from "@angular/core";
import { Camera, CameraOptions } from '@ionic-native/camera';

@Injectable()
export class CameraService {

  constructor(private camera: Camera) {

  }

  public getPicture(): Promise<any> {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    return this.camera.getPicture(options);
  }

}