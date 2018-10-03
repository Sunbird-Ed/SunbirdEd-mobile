import { Component } from '@angular/core';
import {
    NavParams,
    ViewController,
    Events
} from 'ionic-angular';
import {
    UserProfileService,
    UploadFileRequest,
    AuthService,
    UpdateUserInfoRequest
} from 'sunbird';
import { ProfileConstants } from '../../../app/app.constant';
import { CommonUtilService } from '../../../service/common-util.service';

@Component({
    selector: 'image-picker',
    templateUrl: 'imagepicker.html'
})
export class ImagePicker {

    imageUri: string;
    profile: any = {};
    req: UpdateUserInfoRequest;

    constructor(
        private navParams: NavParams,
        private viewCtrl: ViewController,
        private userProfileService: UserProfileService,
        private authService: AuthService,
        private commonUtilService: CommonUtilService,
        private events: Events) {

        this.imageUri = this.navParams.get('imageUri');
        this.profile = this.navParams.get('profile');

        this.req = {
            userId: this.profile.userId,
        };
    }

    /**
     * It will Open up the Image choose window and this internally calls an upload image API
     */
    changeImage(): void {
        (<any>window).imagechooser.chooseImage(
            (path: any) => {
                this.updateProfilePictureEvent('', true);
                this.viewCtrl.dismiss();

                this.authService.getSessionData(session => {
                    const request: UploadFileRequest = {
                        filePath: path,
                        userId: JSON.parse(session)[ProfileConstants.USER_TOKEN]
                    };

                    this.userProfileService.uploadFile(
                        request,
                        (response: any) => {
                            const resObj = JSON.parse(response);
                            const url = resObj['url'];
                            this.updateProfilePictureEvent(url, true);
                            this.req['avatar'] = url;
                            this.updateProfilePicture();
                        },
                        (error: any) => {
                            this.commonUtilService.showToast(this.commonUtilService.translateMessage('ERROR_UPLOADING_IMG'));
                            this.updateProfilePictureEvent('', false);
                        });
                });
            },
            (error: any) => {
                console.log(error);
                this.commonUtilService.showToast(this.commonUtilService.translateMessage('ERROR_SERVER_MESSAGE') + error);
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
                this.commonUtilService.showToast('Profile Picture Uploaded Successfully');
                this.viewCtrl.dismiss();
                this.updateProfilePictureEvent('', false);
            },
            (err: any) => {
                console.log('Error', err);
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
}
