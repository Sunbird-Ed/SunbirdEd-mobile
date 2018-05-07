import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { PageAssembleService, PageAssembleCriteria, ContentService, AuthService, FrameworkService, CategoryRequest, Impression, ImpressionType, PageId, Environment, TelemetryService, FrameworkDetailsRequest, InteractType, InteractSubtype, ProfileService, ContentDetailRequest } from "sunbird";
import { NavController, PopoverController, Events, ToastController } from 'ionic-angular';
import * as _ from 'lodash';
import { Slides } from 'ionic-angular';
import { ViewMoreActivityPage } from '../view-more-activity/view-more-activity';
import { QRResultCallback, SunbirdQRScanner } from '../qrscanner/sunbirdqrscanner.service';
import { SearchPage } from '../search/search';
import { ResourceFilter, ResourceFilterCallback } from './filters/resource.filter';
import { generateInteractEvent, Map } from '../../app/telemetryutil';
import { CourseDetailPage } from '../course-detail/course-detail';
import { CollectionDetailsPage } from '../collection-details/collection-details';
import { ContentDetailsPage } from '../content-details/content-details';



@Component({
	selector: 'page-resources',
	templateUrl: 'resources.html'
})
export class ResourcesPage implements OnInit {

	pageLoadedSuccess = false;

	storyAndWorksheets: Array<any>;
	selectedValue: Array<string> = [];


	guestUser: boolean = false;

	/**
	 * Contains local resources
	 */
	localResources: Array<any>;

	userId: string;
	/**
	 * Loader
	 */
	showLoader: boolean = false;

	/**
	 * Flag to show latest and popular course loader
	 */
	pageApiLoader: boolean = true;

	/**
	 * Contains reference of content service
	 */
	public contentService: ContentService;

	/**
	 * Auth service to get user id.
	 */
	public authService: AuthService;

	isOnBoardingCardCompleted: boolean = false;
	public source = "resource";

	constructor(public navCtrl: NavController, private pageService: PageAssembleService, private ngZone: NgZone, private popupCtrl: PopoverController,
		contentService: ContentService, authService: AuthService, private qrScanner: SunbirdQRScanner, private popCtrl: PopoverController, private telemetryService: TelemetryService, private events: Events, private profileService: ProfileService, private toastCtrl: ToastController) {
		this.contentService = contentService;
		this.authService = authService;

		this.events.subscribe('onboarding-card:completed', (param) => {
			this.isOnBoardingCardCompleted = param.isOnBoardingCardCompleted;
		});

		this.events.subscribe('savedResources:update', (res) => {
			if (res && res.update) {
				this.setSavedContent();
			}
		});
	}

	/**
* It will fetch the guest user profile details
*/
	getCurrentUser(): void {
		this.profileService.getCurrentUser(
			(res: any) => {
				let profile = JSON.parse(res);
				if (profile.board && profile.board.length && profile.grade && profile.grade.length && profile.medium && profile.medium.length && profile.subject && profile.subject.length) {
					this.isOnBoardingCardCompleted = true;
					this.events.publish('onboarding-card:completed', { isOnBoardingCardCompleted: this.isOnBoardingCardCompleted });
				}
			},
			(err: any) => {
				this.isOnBoardingCardCompleted = false;
			});
	}

	viewAllSavedResources() {
		this.navCtrl.push(ViewMoreActivityPage, {
			headerTitle: 'SAVED_RESOURCES',
			pageName: 'resource.SavedResources'
		});
	}

	/**
	 * Get saved content
	 */
	setSavedContent() {
		// this.localResources = [];
		this.showLoader = true;
		const requestParams = {
			contentTypes: ['Story', 'Worksheet', 'Collection', 'Game', 'TextBook', 'Resource', 'LessonPlan']
		};
		this.contentService.getAllLocalContents(requestParams, (data: any) => {
			data = JSON.parse(data);
			console.log('Success: saved resources', data);
			this.ngZone.run(() => {
				if (data.result) {
					//TODO Temporary code - should be fixed at backend
					_.forEach(data.result, (value, key) => {
						value.contentData.lastUpdatedOn = value.lastUpdatedTime;
						if (value.contentData.appIcon) {
							value.contentData.appIcon = value.basePath + '/' + value.contentData.appIcon;
						}
					});
					this.localResources = data.result;
					console.log('Success: localResources resources', this.localResources);

				}
				this.showLoader = false;
			});
		}, error => {
			console.log('error while getting saved contents', error);
			this.ngZone.run(() => {
				this.showLoader = false;
			})
		});

	}

	/**
	 * Get popular content
	 */
	getPopularContent() {
		this.pageApiLoader = true;
		let that = this;
		let criteria = new PageAssembleCriteria();
		criteria.name = "Resource";
		this.pageService.getPageAssemble(criteria, res => {
			that.ngZone.run(() => {
				let response = JSON.parse(res);
				console.log('Popular content, response');
				//TODO Temporary code - should be fixed at backend
				let a = JSON.parse(response.sections);
				console.log('page service ==>>>>', a);
				let newSections = [];
				a.forEach(element => {
					element.display = JSON.parse(element.display);
					newSections.push(element);
				});
				//END OF TEMPORARY CODE
				that.storyAndWorksheets = newSections;
				console.log('storyAndWorksheets', that.storyAndWorksheets);
				this.pageLoadedSuccess = true;
				this.pageApiLoader = false;
			});
		}, error => {
			console.log('error while getting popular resources...', error);
			this.pageApiLoader = false;
		});
	}

	/**
	 * Navigate to search page
	 *
	 * @param {string} queryParams search query params
	 */
	viewAllPopularContent(queryParams, headerTitle): void {
		console.log('Search query...', queryParams);
		let values = new Map();
		values["SectionName"] = headerTitle;
		this.telemetryService.interact(
			generateInteractEvent(InteractType.TOUCH,
				InteractSubtype.VIEWALL_CLICKED,
				Environment.HOME,
				this.source, values)
		);
		this.navCtrl.push(ViewMoreActivityPage, {
			requestParams: queryParams,
			headerTitle: headerTitle
		});
	}

	/**
	 * Ionic life cycle hooks
	 */
	ionViewDidLoad() {
		console.log('Resources component initialized...==>>');
		// this.getPopularContent();
	}

	ionViewDidEnter() {
		this.generateImpressionEvent();
	}

	ionViewWillEnter() {
		if (!this.pageLoadedSuccess) {
			this.getPopularContent();
		}

		this.authService.getSessionData((res: string) => {
			if (res === undefined || res === "null") {
				this.guestUser = true;
				this.getCurrentUser();
			} else {
				this.guestUser = false;
			}
		});
		this.subscribeGenieEvents();
	}

	subscribeGenieEvents() {
		this.events.subscribe('genie.event', (data) => {
			let res = JSON.parse(data);
			if (res.data && res.data.status === 'IMPORT_COMPLETED' && res.type === 'contentImport') {
				this.setSavedContent();
			}
		})
	}
	/**
	 * Ionic life cycle hook
	 */
	ionViewWillLeave(): void {
		this.events.unsubscribe('genie.event');
	}
	/**
	 *
	 * @param refresher
	 */
	swipeDownToRefresh(refresher?) {
		refresher.complete();
		this.storyAndWorksheets = [];
		this.setSavedContent();
		this.getPopularContent();
	}

	/**
	 * Angular life cycle hooks
	 */
	ngOnInit() {
		console.log('courses component initialized...');
		// this.getCourseTabData();
		this.setSavedContent();
	}

	generateImpressionEvent() {
		let impression = new Impression();
		impression.type = ImpressionType.VIEW;
		impression.pageId = PageId.LIBRARY;
		impression.env = Environment.HOME;
		this.telemetryService.impression(impression);
	}

	scanQRCode() {
		this.telemetryService.interact(
			generateInteractEvent(InteractType.TOUCH,
				InteractSubtype.QRCodeScanClicked,
				Environment.HOME,
				PageId.LIBRARY, null));
		const that = this;
		const callback: QRResultCallback = {
			dialcode(scanResult, dialCode) {
				that.navCtrl.push(SearchPage, { dialCode: dialCode });
			},
			content(scanResult, contentId) {
        // that.navCtrl.push(SearchPage);
        let request: ContentDetailRequest = {
          contentId: contentId
        }
        that.contentService.getContentDetail(request, (response)=> {
          let data = JSON.parse(response);
          that.showContentDetails(data.result);
        }, (error)=> {
          console.log("Error " + error);
          let toast = that.toastCtrl.create({
            message: "No content found associated with that QR code",
            duration: 3000
          })

          toast.present();
        });
			}
		}

		this.qrScanner.startScanner(undefined, undefined, undefined, callback, PageId.LIBRARY);
	}

	search() {

		this.telemetryService.interact(
			generateInteractEvent(InteractType.TOUCH,
				InteractSubtype.SEARCH_BUTTON_CLICKED,
				Environment.HOME,
				PageId.LIBRARY, null));

		const contentType: Array<string> = [
			"Story",
			"Worksheet",
			"Game",
			"Collection",
			"TextBook",
			"LessonPlan",
			"Resource",
		];

		this.navCtrl.push(SearchPage, { contentType: contentType,source: PageId.LIBRARY });
  }

  showContentDetails(content) {
    if (content.contentType === 'Course') {
      console.log('Calling course details page');
      this.navCtrl.push(CourseDetailPage, {
        content: content
      })
    } else if (content.mimeType === 'application/vnd.ekstep.content-collection') {
      console.log('Calling collection details page');
      this.navCtrl.push(CollectionDetailsPage, {
        content: content
      })
    } else {
      console.log('Calling content details page');
      this.navCtrl.push(ContentDetailsPage, {
        content: content
      })
    }
  }

	showFilter() {
		this.telemetryService.interact(
			generateInteractEvent(InteractType.TOUCH,
				InteractSubtype.FILTER_BUTTON_CLICKED,
				Environment.HOME,
				PageId.LIBRARY, null));

		const that = this;
		const callback: ResourceFilterCallback = {
			applyFilter(filter) {
				let criteria = new PageAssembleCriteria();
				criteria.name = "Resource";
				criteria.filters = filter;
				that.pageService.getPageAssemble(criteria, res => {
					that.ngZone.run(() => {
						let response = JSON.parse(res);
						console.log('Saved resources', response);
						//TODO Temporary code - should be fixed at backend
						let a = JSON.parse(response.sections);
						console.log('page service ==>>>>', a);

						let newSections = [];
						a.forEach(element => {
							element.display = JSON.parse(element.display);
							newSections.push(element);
						});
						//END OF TEMPORARY CODE
						that.storyAndWorksheets = newSections;
						console.log('storyAndWorksheets', that.storyAndWorksheets);
						that.pageLoadedSuccess = true;
					});
				}, error => {
					console.log('error while getting popular resources...', error);
				});
			}
		}

		let filter = this.popCtrl.create(ResourceFilter, { callback: callback }, { cssClass: 'resource-filter' })
		filter.present();
	}
}
