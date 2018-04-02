import { IonicPage } from "ionic-angular/navigation/ionic-page";
import { Component } from '@angular/core';
import { NavController } from "ionic-angular/navigation/nav-controller";
import { NavParams } from "ionic-angular/navigation/nav-params";
import { ViewController } from "ionic-angular/navigation/view-controller";
import { UsersnClassesComponent } from "../usersnclasses/usersnclass.component";
import { ToastController } from "ionic-angular";
import { SettingsPage } from "../../settings/settings";

@Component({
    selector: 'image-picker',
    templateUrl: 'imagepicker.html'
})

export class ImagePicker {
    
    imageUri: string;

    constructor(public navCtrl: NavController, 
        public navParams: NavParams, 
        public viewCtrl: ViewController, 
        private toastCtrl: ToastController) {

        this.imageUri = navParams.get('imageUri');
    }

    changeImage() {
        (<any>window).imagechooser.chooseImage(
            path => {
                this.imageUri = path;
            },
            error => {
                console.log(error);
            }
        );
    }

    deleteImage() {
        
    }
     
     
}