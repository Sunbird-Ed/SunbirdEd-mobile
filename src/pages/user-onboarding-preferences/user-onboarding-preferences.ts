import { group } from '@angular/core';
import { AppGlobalService } from './../../service/app-global.service';
import { UserSource, ProfileService } from 'sunbird';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
	IonicPage,
	NavController,
	NavParams,
	ToastController
} from 'ionic-angular';
import { FormAndFrameworkUtilService } from '../profile/formandframeworkutil.service';
import {
	CategoryRequest,
	SharedPreferences,
	Profile,
	ImpressionType,
	PageId,
	Environment,
	InteractType,
	InteractSubtype
} from 'sunbird';

import { LoadingController, Events, Platform } from 'ionic-angular';
import { PreferenceKey } from '../../app/app.constant';
import * as _ from 'lodash';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';

export interface toastOptions {
	message: string,
	duration: number,
	position: string
};
@IonicPage()
@Component({
	selector: 'page-user-onboarding-preferences',
	templateUrl: 'user-onboarding-preferences.html',
})
export class UserOnboardingPreferencesPage {

	userForm: FormGroup;
	classList = [];
	profile: Profile;
	
	syllabusList: Array<any> = []
	BoardList: Array<any> = [];
	mediumList: Array<any> = [];
	gradeList: Array<any> = [];
	categories: Array<any> = [];
	loader: any;
	frameworks: Array<any> = [];
	frameworkId: string = '';
	btnColor: string = '#8FC4FF';
	isEditData: boolean = true;
	unregisterBackButton: any;

	selectedLanguage: string = 'en';

	options: toastOptions = {
		message: '',
		duration: 3000,
		position: 'bottom'
	};
	syllabusOptions = {
		title: this.translateMessage('SYLLABUS').toLocaleUpperCase(),
		cssClass: 'select-box'
	};
	boardOptions = {
		title: this.translateMessage('BOARD').toLocaleUpperCase(),
		cssClass: 'select-box'
	};
	mediumOptions = {
		title: this.translateMessage('MEDIUM_OF_INSTRUCTION').toLocaleUpperCase(),
		cssClass: 'select-box'
	};
	classOptions = {
		title: this.translateMessage('CLASS').toLocaleUpperCase(),
		cssClass: 'select-box'
	};

	constructor(
		private navCtrl: NavController,
		private fb: FormBuilder,
		private formAndFrameworkUtilService: FormAndFrameworkUtilService,
		private translate: TranslateService,
		private navParams: NavParams,
		private loadingCtrl: LoadingController,
		private toastCtrl: ToastController,
		private preference: SharedPreferences,
		private profileService: ProfileService,
		private telemetryGeneratorService: TelemetryGeneratorService,
		private appGlobalService: AppGlobalService,
		private events: Events,
		private platform: Platform,
	) {
		this.preference.getString(PreferenceKey.SELECTED_LANGUAGE_CODE)
		.then(val => {
			if (val && val.length) {
				this.selectedLanguage = val;
			}
		});
		this.initUserForm();
		this.getGuestUser();
	}
	
	ionViewWillEnter() {
		this.getSyllabusDetails();
	}

	ionViewDidEnter() {
		this.unregisterBackButton = this.platform.registerBackButtonAction(() => {
		  this.telemetryGeneratorService.generateImpressionTelemetry(
			ImpressionType.VIEW, "",
			PageId.ONBOARDING_PREFERENCES ,
			Environment.SETTINGS
		  );
		});
	}

	getGuestUser(){
		this.profileService.getCurrentUser((response) => {
			this.profile = JSON.parse(response);
			console.log('getGuestUser profile',this.profile);
			this.initUserForm();
        }, (error) => {
			this.profile = undefined;
			this.initUserForm();
        });
	}

	initUserForm(){
		this.userForm = this.fb.group({
			syllabus: [this.profile && this.profile.syllabus && this.profile.syllabus[0] || []],
			boards: [this.profile && this.profile.board || []],
			grades: [this.profile && this.profile.grade || []],
			medium: [this.profile && this.profile.medium || []]
		});
		console.log('initUserForm', this.userForm);
	}
	
	/**
	 * It will fetch syllabus details
	 */
	getSyllabusDetails() {
		this.loader = this.getLoader();
		this.loader.present();

		this.formAndFrameworkUtilService.getSyllabusList()
			.then((result) => {
				if (result && result !== undefined && result.length > 0) {
					result.forEach(element => {
						//renaming the fields to text, value and checked
						let value = { 'name': element.name, 'code': element.frameworkId };
						this.syllabusList.push(value);
					});
					console.log('this.syllabusList',this.syllabusList);
					this.loader.dismiss();
					console.log('this.profile',this.profile);
					console.log('this.userForm',this.userForm);

					if (this.profile && this.profile.syllabus && this.profile.syllabus[0] !== undefined) {
						this.formAndFrameworkUtilService.getFrameworkDetails(this.profile.syllabus[0])
						.then(catagories => {
							console.log('this.categories',catagories);
							this.categories = catagories;
							this.resetForm(0, false);
						}).catch(error => {
							console.log('errorrrrrr',error);
							this.loader.dismiss();
							this.getToast(this.translateMessage("NEED_INTERNET_TO_CHANGE")).present();
						});
					} else {
						this.loader.dismiss();
					}
				} else {
					this.loader.dismiss();
					this.getToast(this.translateMessage('NO_DATA_FOUND')).present();
				}
			});
	}

	/**
	 * This will internally call framework API
	 * @param {string} currentCategory - request Parameter passing to the framework API
	 * @param {string} list - Local variable name to hold the list data
	 */
	getCategoryData(req: CategoryRequest, list): void {
		console.log('this.frameworkId', this.frameworkId);
		if(this.frameworkId){
			this.formAndFrameworkUtilService.getCategoryData(req, this.frameworkId).
				then((result) => {
					console.log('getCategoryData',result);
					if (this.loader !== undefined){
						this.loader.dismiss();
					}
					this[list] = result;
					if (list != 'gradeList') {
						this[list] = _.orderBy(this[list], ['name'], ['asc']);
					}
					if (req.currentCategory === 'board') {
						console.log('if boardList', result);
						this.userForm.patchValue({
							boards: [result[0].code]
						})
						this.resetForm(1, false)
					} else if(this.isEditData){
						this.isEditData = false;
						this.userForm.patchValue({
							medium: this.profile.medium || []
						});
						this.userForm.patchValue({
							grades: this.profile.grade || []
						});
					}
				})
			}
	}

	/**
	 * It will check previous value and make a API call
	 * @param index 
	 * @param currentField 
	 * @param prevSelectedValue 
	 */
	checkPrevValue(index, currentField, prevSelectedValue = []) {
		console.log('checkPrevValue====>',index, currentField, prevSelectedValue);
		if (index === 1) {
			let loader = this.getLoader();
			// loader.present();
			this.frameworkId = prevSelectedValue[0];
			this.formAndFrameworkUtilService.getFrameworkDetails(this.frameworkId)
				.then(catagories => {
					console.log('checkPrevValue catagories',catagories);
					this.categories = catagories;

					// loader.dismiss();
					let request: CategoryRequest = {
						currentCategory: this.categories[0].code,
						selectedLanguage: this.translate.currentLang
					}
					this.getCategoryData(request, currentField);
				}).catch(error => {
					this.getToast(this.translateMessage("NEED_INTERNET_TO_CHANGE")).present();
					loader.dismiss();
				});

		} else {
			let request: CategoryRequest = {
				currentCategory: this.categories[index - 1].code,
				prevCategory: this.categories[index - 2].code,
				selectedCode: prevSelectedValue,
				selectedLanguage: this.selectedLanguage
			}
			this.getCategoryData(request, currentField);
		}
	}

	/**
	 * It will reset user form, based on given index 
	 * @param index 
	 * @param showloader 
	 */
	resetForm(index, showloader: boolean): void {
		console.log('in reset form',index);
		
		switch (index) {
			case 0:
				this.userForm.patchValue({
					boards: [],
					grades: [],
					medium: []
				});
				if (showloader) {
					this.loader = this.getLoader();
					this.loader.present();
				  }
				this.checkPrevValue(1, 'boardList', [this.userForm.value.syllabus]);
				break;

			case 1:
				this.userForm.patchValue({
					// boards: [this.userForm.value.syllabus],
					grades: [],
					medium: []
				});
				this.checkPrevValue(2, 'mediumList', this.userForm.value.boards);
				break;

			case 2:
				this.userForm.patchValue({
					grades: [],
				});
				this.checkPrevValue(3, 'gradeList', this.userForm.value.medium);
				break;
		}
	}

	enableSubmit(){
		if(this.userForm.value.grades.length){
			this.btnColor = '#006DE5'
		} else {
			this.btnColor = '#8FC4FF';
		}
	}
	
	showMessage(name: string) {
		this.btnColor = '#8FC4FF';
		let toast = this.toastCtrl.create({
			message: this.translateMessage('Please select a ') + name,
			duration: 2000,
			cssClass: 'redErrorToast',
			position: 'Bottom'
		});
		toast.dismissAll();
		toast.present();
	}

	onSubmit() {
		let loader = this.getLoader();
		console.log('his.userForm', this.userForm);
		// this.btnColor = '#006DE5';
		let formVal = this.userForm.value;
		if (formVal.boards.length === 0) {
			this.showMessage('BOARD')
			return false;
		} else if (formVal.medium.length === 0) {
			this.showMessage('MEDIUM');
			return false;
		} else if (formVal.grades.length === 0) {
			this.showMessage('CLASS');
			return false;
		} else {
			this.submitEditForm(formVal, loader);
		}
	}

	submitEditForm(formVal, loader): void {
		let req: Profile = new Profile();
		req.board = formVal.boards;
		req.grade = formVal.grades;
		req.medium = formVal.medium;
		req.uid = this.profile.uid;
		req.handle = this.profile.handle;
		req.profileType = this.profile.profileType;
		req.source = this.profile.source;
		req.createdAt = this.profile.createdAt;
		req.syllabus = (!formVal.syllabus.length) ? [] : [formVal.syllabus];
	
		if (formVal.grades && formVal.grades.length > 0) {
		  formVal.grades.forEach(gradeCode => {
			for (let i = 0; i < this.gradeList.length; i++) {
			  if (this.gradeList[i].code == gradeCode) {
				if (!req.gradeValueMap) {
				  req.gradeValueMap = {};
				}
				req.gradeValueMap[this.gradeList[i].code] = this.gradeList[i].name
				break;
			  }
			}
		  });
		}
		this.profileService.updateProfile(req,
		  (res: any) => {
			console.log("Update Response-->", JSON.parse(res));
			
			this.getToast(this.translateMessage('PROFILE_UPDATE_SUCCESS')).present();
			// this.telemetryGeneratorService.generateInteractTelemetry(
			// 	InteractType.OTHER,
			// 	InteractSubtype.EDIT_USER_SUCCESS,
			// 	Environment.USER,
			// 	PageId.ONBOARDING_PREFERENCES
			// );
			console.log('======>', this.navCtrl.canGoBack());
			console.log('------->', this.navCtrl.getViews());
			this.events.publish('refresh:profile');
			this.appGlobalService.guestUserProfile =  JSON.parse(res);
			// setTimeout(() => {
				// loader.dismiss();
				this.navCtrl.pop();
			// }, 100);
			
		  },
		  (err: any) => {
			loader.dismiss();
			this.getToast(this.translateMessage('PROFILE_UPDATE_FAILED')).present();
			console.log("Err", err);
		  });
	  }
	

	translateMessage(messageConst: string, field?: string): string {
		let translatedMsg = '';
		this.translate.get(messageConst, { '%s': field }).subscribe(
			(value: any) => {
				translatedMsg = value;
			}
		);
		return translatedMsg;
	}
	getLoader(): any {
		return this.loadingCtrl.create({
			duration: 30000,
			spinner: "crescent"
		});
	}

	/** It will returns Toast Object
	 * @param {message} string - Message for the Toast to show
	 * @returns {object} - toast Object
	 */
	getToast(message: string = ''): any {
		this.options.message = message;
		if (message.length) return this.toastCtrl.create(this.options);
	}
}
