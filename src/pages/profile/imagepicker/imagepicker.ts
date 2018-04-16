import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController, LoadingController, Events } from "ionic-angular";
import { TranslateService } from '@ngx-translate/core';

import { UsersnClassesComponent } from "../usersnclasses/usersnclass.component";
import { SettingsPage } from "../../settings/settings";
import { UserProfileService, UploadFileRequest, AuthService, UpdateUserInfoRequest } from "sunbird";

/* Interface for the Toast Object */
export interface toastOptions {
    message: string,
    duration: number,
    position: string
};

@Component({
    selector: 'image-picker',
    templateUrl: 'imagepicker.html'
})

export class ImagePicker {

    imageUri: string;
    loader: any;
    profile: any = {};
    req: UpdateUserInfoRequest;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        private toastCtrl: ToastController,
        private userProfileService: UserProfileService,
        private loadingCtrl: LoadingController,
        private authService: AuthService,
        private translate: TranslateService,
        public events: Events) {

        this.imageUri = navParams.get('imageUri');
        this.profile = navParams.get('profile');
        this.loader = this.loadingCtrl.create({ duration: 10000, spinner: "crescent" });

        this.req = {
            userId: this.profile.userId,
            firstName: this.profile.firstName,
            language: this.profile.language,
            phone: '8698645680'
        }
    }

    /**
     * It will Open up the Image choose window and this internally calls an upload image API
     */

    changeImage(): void {
        (<any>window).imagechooser.chooseImage(
            (path: any) => {
                this.imageUri = path;
                this.loader.present();

                this.authService.getSessionData(session => {
                    let request: UploadFileRequest = {
                        filePath: path,
                        userId: JSON.parse(session)["userToken"]
                    }

                    this.userProfileService.uploadFile(
                        request,
                        (response: any) => {
                            let resObj = JSON.parse(response);
                            let url = resObj["url"];
                            this.loader.dismiss();
                            this.updateProfilePictureEvent(url, true);
                            this.req['avatar'] = url;
                            this.updateProfilePicture();
                        },
                        (error: any) => {
                            this.loader.dismiss();
                            this.presentToast(this.translateMessage('ERROR_UPLOADING_IMG'));
                            this.viewCtrl.dismiss();
                        });
                });
            },
            (error: any) => {
                console.log(error);
                this.presentToast(this.translateMessage('ERROR_SERVER_MESSAGE') + error);
                this.viewCtrl.dismiss();
            }
        );
    }

    /**
     * Dispatches an Event `profilePicture:update` and passes data `url` and `isUploading`.
     * @param {string} url - New URL of the uploaded Image
     * @param {boolean} isUploading - Flag for the spinner
     */
    updateProfilePictureEvent(url: string = '', isUploading: boolean = false) {
        this.events.publish('profilePicture:update', {
            url: url,
            isUploading: isUploading
        });
    }

    /**
     * This method internally call an update API
     */
    updateProfilePicture() {
        this.userProfileService.updateUserInfo(this.req,
            (res: any) => {
                this.presentToast('Profile Picture Uploaded Successfully');
                this.viewCtrl.dismiss();
                this.updateProfilePictureEvent('', false);
            },
            (err: any) => {
                console.log("Error", err);
                this.viewCtrl.dismiss();
                this.updateProfilePictureEvent('', false);
            });
    }

    /**
     * This method call an Update API and unset the avatar.
     */
    deleteImage() {
        this.req['avatar'] = '';
        this.updateProfilePicture();
    }

    /**
     * Used to Translate message to current Language
     * @param {string} messageConst - Message Constant to be translated
     * @returns {string} translatedMsg - Translated Message
     */
    translateMessage(messageConst): string {
        let translatedMsg = '';
        this.translate.get(messageConst).subscribe(
            (value: any) => {
                translatedMsg = value;
            });
        return translatedMsg;
    }

    /**
     * It will shows the Toast Message
     * @param {string} message - Message to be displayed on Toaster
     */
    presentToast(message: string): void {
        this.toastCtrl.create({
            message: this.translateMessage(message),
            duration: 3000
        }).present();
    }
}