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
	Profile
} from 'sunbird';

import { LoadingController } from 'ionic-angular';
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
	selectBoard: any;
	isSelectBoard: boolean = false;
	selectMedium: any;
	isSelectMedium: boolean = false;
	selectClass: any;
	isSelectClass: boolean = false;
	isEditGroup: boolean = false;
	syllabusList: Array<any> = []
	BoardList: Array<any> = [];
	mediumList: Array<any> = [];
	gradeList: Array<any> = [];
	categories: Array<any> = [];
	loader: any;
	frameworks: Array<any> = [];
	frameworkId: string = '';
	btnColor: string = '#8FC4FF';
	isNewUser: boolean = false;


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
	) {
		this.preference.getString(PreferenceKey.SELECTED_LANGUAGE_CODE)
			.then(val => {
				if (val && val.length) {
					this.selectedLanguage = val;
				}
			});
		
		this.userForm = this.fb.group({
			syllabus: [ [], Validators.required],
			boards: [ [], Validators.required],
			grades: [ [], Validators.required],
			medium: [ [], Validators.required]
		});

		// this.getGuestUser();
		
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad UserOnboardingPreferencesPage');
	}
	// onProfileTypeChange() {
	//   this.userForm.patchValue({
	//     syllabus: [],
	//     boards: [],
	//     grades: [],
	//     medium: []
	//   });
	// }
	ionViewWillEnter() {
		// this.formAndFrameworkUtilService.getFrameworkDetails('NCF').then((categories) => {
		//   console.log('categories is', categories);
		//   console.log('new', this.syllabusList[0]);

		// }).catch((error) => {
		//   console.log(error);
		// })

		this.getGuestUser();

	}

	getGuestUser(){
		this.profileService.getCurrentUser((response) => {
			this.profile = JSON.parse(response);
			console.log('getGuestUser profile',this.profile);
			this.patchuserForm();
        }, (error) => {
			this.profile = undefined;
			this.patchuserForm();
        });
	}

	patchuserForm(){
		this.userForm.patchValue({
			syllabus: [this.profile && this.profile.syllabus && this.profile.syllabus[0] || []],
			boards: [this.profile && this.profile.board || []],
			grades: [this.profile && this.profile.grade || []],
			medium: [this.profile && this.profile.medium || []]
		});
		console.log('patchuserForm', this.userForm);
		this.getSyllabusDetails();
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
								this.resetForm(0);
								// this.userForm.patchValue({
								// 	boards: this.profile.board || [],
								// 	medium: this.profile.medium || [],
								// 	grades: this.profile.grade || []
								// });
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
		this.formAndFrameworkUtilService.getCategoryData(req, this.frameworkId).
			then((result) => {
				console.log('getCategoryData',result);
				if (this.loader !== undefined)
					this.loader.dismiss();
				// if(list == 'boardList'){
				// 	console.log('if boardList', result);
				// 	this.userForm.patchValue({
				// 		boards: [result[0].code]
				// 	})
				// 	this.resetForm(1)
				// }
				
				this[list] = result;
				if (list != 'gradeList') {
					this[list] = _.orderBy(this[list], ['name'], ['asc']);
				}
				if(list == 'boardList'){
					console.log('if boardList', result);
					this.userForm.patchValue({
						boards: [result[0].code]
					})
					this.resetForm(1)
				}
				else{
					this.userForm.patchValue({
						boards: this.profile.board || [],
						medium: this.profile.medium || [],
						grades: this.profile.grade || []
					});
				}

			})
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
					// this.mediumList = this.categories[1].terms;

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
	resetForm(index): void {
		console.log('in reset form',index);
		switch (index) {
			case 0:
				this.userForm.patchValue({
					boards: [],
					grades: [],
					medium: []
				});
				
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

	ngOnInit() {

	}
	onSelectedBoard() {
		this.isSelectBoard = true;
	}
	onSelectMedium() {
		this.isSelectMedium = true;
	}
	onSelectClass() {
		this.isSelectClass = true;
		this.btnColor = '#006DE5';
	}
	showMessage(name: string) {
		this.btnColor = '#8FC4FF';
		let toast = this.toastCtrl.create({
			message: this.translateMessage('Please select a ') + name,
			duration: 2000,
			cssClass: 'userFinishSelectBtn',
			position: 'Bottom'
		});
		toast.dismissAll();
		toast.present();
	}

	onSubmit() {
		let loader = this.getLoader();
		console.log('--->',this.isSelectBoard , this.isSelectMedium , this.isSelectClass)
		console.log('his.userForm', this.userForm);
		// if (this.isSelectBoard && this.isSelectMedium && this.isSelectClass) {
			this.btnColor = '#006DE5';
			let formVal = this.userForm.value;
			this.submitEditForm(formVal, loader);
		// } else if (!this.isSelectBoard) {
		// 	this.showMessage("board");
		// 	// return false;
		// } else if (!this.isSelectMedium) {
		// 	this.showMessage("medium");
		// 	// return false;
		// } else if (!this.isSelectClass) {
		// 	console.log("class");
		// 	this.showMessage("class");
		// 	// return false;
		// } else {
		// }
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
			console.log("Update Response-->", res);
			loader.dismiss();
			this.getToast(this.translateMessage('PROFILE_UPDATE_SUCCESS')).present();
			// this.telemetryGeneratorService.generateInteractTelemetry(
			//   InteractType.OTHER,
			//   InteractSubtype.EDIT_USER_SUCCESS,
			//   Environment.USER,
			//   PageId.EDIT_USER
			// );
			this.navCtrl.pop();
		  },
		  (err: any) => {
			loader.dismiss();
			this.getToast(this.translateMessage('PROFILE_UPDATE_FAILED')).present();
			console.log("Err", err);
		  });
	  }

	// submitEditForm(formVal, loader): void {
	// 	let req: Profile = new Profile();
	// 	req.board = formVal.boards;
	// 	req.grade = formVal.grades;
	// 	// req.subject = formVal.subjects;
	// 	req.medium = formVal.medium;
	// 	req.handle = formVal.name;
	// 	req.profileType = formVal.profileType;
	// 	req.source = UserSource.LOCAL;
	// 	req.syllabus = (!formVal.syllabus.length) ? [] : [formVal.syllabus];

	// 	if (formVal.grades && formVal.grades.length > 0) {
	// 		formVal.grades.forEach(gradeCode => {
	// 			for (let i = 0; i < this.gradeList.length; i++) {
	// 				if (this.gradeList[i].code == gradeCode) {
	// 					if (!req.gradeValueMap) {
	// 						req.gradeValueMap = {};
	// 					}
	// 					req.gradeValueMap[this.gradeList[i].code] = this.gradeList[i].name
	// 					break;
	// 				}
	// 			}
	// 		});
	// 	}

	// 	this.profileService.createProfile(req, () => {
	// 		loader.dismiss();
	// 		this.getToast(this.translateMessage('USER_CREATED_SUCCESSFULLY')).present();
	// 		// this.telemetryGeneratorService.generateInteractTelemetry(InteractType.OTHER, InteractSubtype.CREATE_USER_SUCCESS, Environment.USER, PageId.CREATE_USER);
	// 		this.navCtrl.pop();
	// 	},
	// 		() => {
	// 			loader.dismiss();
	// 			this.getToast(this.translateMessage("FILL_THE_MANDATORY_FIELDS")).present();
	// 		});
	// }

	

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
