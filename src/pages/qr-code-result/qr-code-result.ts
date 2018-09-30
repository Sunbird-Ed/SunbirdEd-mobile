import { FormAndFrameworkUtilService } from './../profile/formandframeworkutil.service';
import { Component, NgZone, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform, Navbar, Events } from 'ionic-angular';
import { ContentService, CorrelationData, ChildContentRequest, InteractSubtype, PageId, Profile, ProfileService } from 'sunbird';
import { ContentDetailsPage } from '../content-details/content-details';
import { EnrolledCourseDetailsPage } from '../enrolled-course-details/enrolled-course-details';
import { ContentType, MimeType } from '../../app/app.constant';
import { CollectionDetailsPage } from '../collection-details/collection-details';
import { TranslateService } from '@ngx-translate/core';
import { AppGlobalService } from "../../service/app-global.service";
import {
	InteractType,
	Environment,
	ImpressionType
} from 'sunbird';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import * as _ from 'lodash';

@IonicPage()
@Component({
	selector: 'page-qr-code-result',
	templateUrl: 'qr-code-result.html'
})
export class QrCodeResultPage {
	unregisterBackButton: any;
	/**
	 * To hold identifier
	 */
	identifier: string;

	/**
	 * To hold identifier
	 */
	searchIdentifier: string;

	/**
	 * Contains children content data
	 */
	childrenData: Array<any>;

	/**
	 * Show loader while importing content
	 */
	showChildrenLoader: boolean;

	/**
	 * Contains card data of previous state
	 */
	content: any;

	/**
	 * Contains Parent Content Details
	 */
	parentContent: any;

	/**
	 * Contains
	 */
	isParentContentAvailable: boolean = false;
	profile: Profile;

	corRelationList: Array<CorrelationData>;
	shouldGenerateEndTelemetry: boolean = false;
	source: string = '';
	results: Array<any> = [];
	defaultImg: string;
	parents: Array<any> = [];
	categories: Array<any> = [];
	boardList: Array<any> = [];
	mediumList: Array<any> = [];
	gradeList: Array<any> = [];
	subjectList: Array<any> = [];

	@ViewChild(Navbar) navBar: Navbar;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public contentService: ContentService,
		public zone: NgZone,
		public translate: TranslateService,
		public platform: Platform,
		private telemetryGeneratorService: TelemetryGeneratorService,

		private appGlobal: AppGlobalService,
        private formAndFrameworkUtilService: FormAndFrameworkUtilService,
        private profileService: ProfileService,
        private events: Events,
	) {
		this.defaultImg = 'assets/imgs/ic_launcher.png';
	}

	/**
	 * Ionic life cycle hook
	 */
	ionViewWillEnter(): void {
		this.content = this.navParams.get('content');
		this.corRelationList = this.navParams.get('corRelation');
		this.shouldGenerateEndTelemetry = this.navParams.get('shouldGenerateEndTelemetry');
		this.source = this.navParams.get('source');

		//check for parent content
		this.parentContent = this.navParams.get('parentContent');
		this.searchIdentifier = this.content.identifier;

		if (this.parentContent) {
			this.isParentContentAvailable = true;
			this.identifier = this.parentContent.identifier;
		} else {
			this.isParentContentAvailable = false;
			this.identifier = this.content.identifier;
		}

		this.getChildContents();


	}

	ionViewDidLoad() {
		this.telemetryGeneratorService.generateImpressionTelemetry(ImpressionType.VIEW, '',
			PageId.DIAL_CODE_SCAN_RESULT, Environment.HOME);

		this.navBar.backButtonClick = () => {
			this.handleNavBackButton();
			this.navCtrl.pop();
		};

		this.unregisterBackButton = this.platform.registerBackButtonAction(() => {
			this.telemetryGeneratorService.generateInteractTelemetry(
				InteractType.TOUCH,
				InteractSubtype.DEVICE_BACK_CLICKED,
				Environment.HOME,
				PageId.DIAL_CODE_SCAN_RESULT);
			this.navCtrl.pop();
			this.unregisterBackButton();
		}, 11);
	}

	handleNavBackButton() {
		this.telemetryGeneratorService.generateInteractTelemetry(
			InteractType.TOUCH,
			InteractSubtype.NAV_BACK_CLICKED,
			Environment.HOME,
			PageId.DIAL_CODE_SCAN_RESULT);
	}

	/**
	 *
	 */
	getChildContents() {
		const request: ChildContentRequest = { contentId: this.identifier };
		this.contentService.getChildContents(
			request,
			(data: any) => {
				data = JSON.parse(data);
				this.parents.splice(0, this.parents.length);
				this.parents.push(data.result);
				console.log('qr data', data);

                this.profile = this.appGlobal.getCurrentUser();

                console.log('this.profile', this.profile);
                this.checkProfileData(data.result.contentData, this.profile)
				this.findContentNode(data.result);
			},
			(error: string) => {
				console.log('Error: while fetching child contents ===>>>', error);
				this.zone.run(() => {
					this.showChildrenLoader = false;
				});
			}
		);
	}

	private showAllChild(content: any) {
		if (content.children === undefined) {
			this.results.push(content);
			return;
		}
		content.children.forEach(child => {
			this.showAllChild(child);
		});
	}

	private findContentNode(data: any) {
		if (data !== undefined && data.identifier === this.searchIdentifier) {
			this.showAllChild(data);
			return true;
		}
		if (data.children !== undefined) {
			data.children.forEach(child => {
				this.parents.push(child);
				var isFound = this.findContentNode(child);
				if (isFound === true) {
					return true;
				}
				this.parents.splice(-1, 1);
			});
		}
		return false;
	}

	navigateToDetailsPage(content) {
		if (content.contentData.contentType === ContentType.COURSE) {
			this.navCtrl.push(EnrolledCourseDetailsPage, {
				content: content
			});
		} else if (content.mimeType === MimeType.COLLECTION) {
			this.navCtrl.push(CollectionDetailsPage, {
				content: content
			});
		} else {
			this.navCtrl.push(ContentDetailsPage, {
				content: content,
				depth: '1',
				isChildContent: true,
				downloadAndPlay: true
			});
		}
	}

	/**
	 * request with profile data to set current profile
	 * 
	 */

	EditProfile(): void {
        let req: Profile = new Profile();
        req.board = this.profile.board;
        req.grade = this.profile.grade;
        req.medium = this.profile.medium;
        req.subject = this.profile.subject;
        req.uid = this.profile.uid;
        req.handle = this.profile.handle;
        req.profileType = this.profile.profileType;
        req.source = this.profile.source;
        req.createdAt = this.profile.createdAt;
        req.syllabus = this.profile.syllabus;

        if (this.profile.grade && this.profile.grade.length > 0) {
            this.profile.grade.forEach(gradeCode => {
                for (let i = 0; i < this.gradeList.length; i++) {
                    if (this.gradeList[i].code == gradeCode) {
                        req.gradeValueMap = this.profile.gradeValueMap;
                        req.gradeValueMap[this.gradeList[i].code] = this.gradeList[i].name
                        break;
                    }
                }
            });
        }
        console.log('EditProfile req', req);
        this.profileService.updateProfile(req,
        (res: any) => {
            console.log("Update Response from qrcode-->", JSON.parse(res));
            // this.getToast(this.translateMessage('PROFILE_UPDATE_SUCCESS')).present();
            this.events.publish('refresh:profile');
            this.appGlobal.guestUserProfile = JSON.parse(res);
        },
        (err: any) => {
            // loader.dismiss();
            // this.getToast(this.translateMessage('PROFILE_UPDATE_FAILED')).present();
            console.log("Err", err);
        });
    }

    setgrade(reset, grades) {
        if(reset){
            
            this.profile.grade = [];
            this.profile.gradeValueMap = {};
            console.log('in reset form',this.profile);
        }
        _.each(grades, (grade) => {
            let currentGradeCode = _.find(this.gradeList, (category) => { return category.name == grade; }).code
            if (currentGradeCode && this.profile.grade.indexOf(currentGradeCode) == -1) {
                if (!reset && this.profile.grade && this.profile.grade.length) {
                    this.profile.grade.push(currentGradeCode)
                } else {
                    this.profile.grade = [currentGradeCode];
                }
            }
        })
	}
	
	/**
	 * assigning board, medium, grade and subject to profile 
	 */

    setCurrentProfile(index, data) {
        console.log('setCurrentProfile idx',index);
        // let boardList,gradeList, mediumList, subjectList;
        this.formAndFrameworkUtilService.getFrameworkDetails(data.framework)
            .then(catagories => {
                this.categories = catagories;
                console.log('this.categories', catagories);
                this.boardList = _.find(this.categories, (category) => { return category.code == "board"; }).terms;
                this.gradeList = _.find(this.categories, (category) => { return category.code == "gradeLevel"; }).terms;
                this.mediumList = _.find(this.categories, (category) => { return category.code == "medium"; }).terms;
                this.subjectList = _.find(this.categories, (category) => { return category.code == "subject"; }).terms;
                
                if (!this.profile.medium || !this.profile.medium.length) {
                    this.profile.medium = [];
                }
                if (!this.profile.subject || !this.profile.subject.length) {
                    this.profile.subject = [];
                }
                switch (index) {
                    case 0:
                        this.profile.syllabus = [data.framework];
                        this.profile.board = [_.find(this.boardList, (category) => { return category.name == data.board; }).code];
                        this.profile.medium = [_.find(this.mediumList, (category) => { return category.name == data.medium; }).code]
                        this.profile.subject = [_.find(this.subjectList, (category) => { return category.name == data.subject; }).code]
                        this.setgrade(true, data.gradeLevel);
                        break;
                    case 1:
                        this.profile.board = [_.find(this.boardList, (category) => { return category.name == data.board; }).code];
                        this.profile.medium = [_.find(this.mediumList, (category) => { return category.name == data.medium; }).code]
                        this.profile.subject = [_.find(this.subjectList, (category) => { return category.name == data.subject; }).code]
                        this.setgrade(true, data.gradeLevel);
                        break;
                    case 2:
                        this.profile.medium.push(_.find(this.mediumList, (category) => { return category.name == data.medium; }).code)
                        this.profile.subject.push(_.find(this.subjectList, (category) => { return category.name == data.subject; }).code)
                        this.setgrade(false, data.gradeLevel);
                        break;
                    case 3:
                        this.profile.subject.push(_.find(this.subjectList, (category) => { return category.name == data.subject; }).code)
                        this.setgrade(false, data.gradeLevel);
                        break;
                    case 4:
                        this.profile.subject.push(_.find(this.subjectList, (category) => { return category.name == data.subject; }).code)
                        break;
                }
                console.log('this.profile',this.profile);
                this.EditProfile();
            }).catch(error => {
                console.log('errorrrrrr', error);
                // this.loader.dismiss();
                // this.getToast(this.translateMessage("NEED_INTERNET_TO_CHANGE")).present();
            });
    }

	/**
	 * checking current profile data with qr result data
	 */

    checkProfileData(data, profile) {
		if(profile.syllabus && profile.syllabus[0]){
			if (data.framework == profile.syllabus[0]) {
				if (!(profile.board.length > 1) && data.board == profile.board[0]) {
					let existingMedium = false;
					if(profile.medium){
						existingMedium = _.find(profile.medium, (medium) => {
							return medium.name == data.medium
						});
					}
					if (existingMedium) {
						
						let existingGrade = false;
						for(let i=0;i<data.gradeLevel.length;i++){
							let gradeExists = _.find(profile.grade, (grade) => {
								return grade.name == data.grade[0]
							});
							if(!gradeExists){
								break;
							}
							existingGrade = true;
						}
						if (existingGrade) {
							let existingSubject = false;
							if(profile.subject){
								existingSubject = _.find(profile.subject, (subject) => {
									return subject.name == data.subject
								});
							}
							if (existingSubject) {

							} else {
								this.setCurrentProfile(4, data)
							}
						} else {
							this.setCurrentProfile(3, data)
						}
					} else {
						this.setCurrentProfile(2, data)
					}
				} else {
					this.setCurrentProfile(1, data)
				}
			} else {
				this.setCurrentProfile(0, data);
			}
		} else {
			this.setCurrentProfile(0, data);
		}
    }
}
