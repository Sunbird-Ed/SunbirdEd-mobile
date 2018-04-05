import { IonicPage } from "ionic-angular/navigation/ionic-page";
import { Component } from '@angular/core';
import { NavController } from "ionic-angular/navigation/nav-controller";
import { NavParams } from "ionic-angular/navigation/nav-params";
import { ViewController } from "ionic-angular/navigation/view-controller";
import { UsersnClassesComponent } from "../usersnclasses/usersnclass.component";
import { ToastController } from "ionic-angular";
import { SettingsPage } from "../../settings/settings";
import { UserProfileService, UploadFileRequest, AuthService } from "sunbird";
import { LoadingController, AlertController } from "ionic-angular";

@Component({
    selector: 'image-picker',
    templateUrl: 'imagepicker.html'
})

export class ImagePicker {
    
    imageUri: string;
    loader: any;

    constructor(public navCtrl: NavController, 
        public navParams: NavParams, 
        public viewCtrl: ViewController, 
        private toastCtrl: ToastController,
        private userProfileService: UserProfileService,
        private loadingCtrl: LoadingController,
        private authService: AuthService,
        private alert: AlertController) {

        this.imageUri = navParams.get('imageUri');
        this.loader = this.loadingCtrl.create({duration: 30000, spinner: "crescent" });
    }

    changeImage() {
        (<any>window).imagechooser.chooseImage(
            path => {
                this.imageUri = path;
                this.loader.present();
                
                this.authService.getSessionData(session => {
                    let sessionObj = JSON.parse(session);
                    let request = new UploadFileRequest();
                    request.filePath = path;
                    request.userId = sessionObj["userToken"];
                    this.userProfileService.uploadFile(
                    request, 
                    res => {
                        let resObj = JSON.parse(res);
                        let url = resObj["url"];
                        // this.userProfileService.updateUserInfo()
                        this.loader.dismiss();
                    }, 
                    error => {
                        this.loader.dismiss();
                        this.alert.create().setMessage("Unable to update profile image").present();
                    });
                });
            },
            error => {
                console.log(error);
            }
        );
    }

    deleteImage() {
        
    }
     
     
}