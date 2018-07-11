import { Component, NgZone, OnInit } from '@angular/core';
import {
	PageAssembleService, PageAssembleCriteria, ContentService,
	Impression, ImpressionType, PageId, Environment, TelemetryService,
	InteractType, InteractSubtype, ContentDetailRequest, SharedPreferences,
	ContentFilterCriteria, ProfileType, PageAssembleFilter,
	CorrelationData
} from "sunbird";
import { NavController, PopoverController, Events, ToastController } from 'ionic-angular';
import * as _ from 'lodash';
import { ViewMoreActivityPage } from '../view-more-activity/view-more-activity';
import { QRResultCallback, SunbirdQRScanner } from '../qrscanner/sunbirdqrscanner.service';
import { SearchPage } from '../search/search';
import { generateInteractTelemetry, Map, generateImpressionTelemetry } from '../../app/telemetryutil';
// import { CourseDetailPage } from '../course-detail/course-detail';
import { CollectionDetailsPage } from '../collection-details/collection-details';
import { ContentDetailsPage } from '../content-details/content-details';
import { TranslateService } from '@ngx-translate/core';
import { ContentType, MimeType, PageFilterConstants, AudienceFilter } from '../../app/app.constant';
import { Network } from '@ionic-native/network';
import { PageFilterCallback, PageFilter } from '../page-filter/page.filter';
import { EnrolledCourseDetailsPage } from '../enrolled-course-details/enrolled-course-details';
import { AppGlobalService } from '../../service/app-global.service';
import Driver from 'driver.js';
import { AppVersion } from "@ionic-native/app-version";
import { updateFilterInSearchQuery } from '../../util/filter.util';

@Component({
	selector: 'page-resources',
	templateUrl: 'resources.html'
})
export class ResourcesPage implements OnInit {

	pageLoadedSuccess: boolean = false;

	storyAndWorksheets: Array<any>;
	selectedValue: Array<string> = [];

	guestUser: boolean = false;

	showSignInCard: boolean = false;

	isNetworkAvailable: boolean;
	showWarning: boolean = false;

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

	isOnBoardingCardCompleted: boolean = false;
	public source = PageId.LIBRARY;

	resourceFilter: any;

	appliedFilter: any;

	filterIcon = "./assets/imgs/ic_action_filter.png";

	selectedLanguage: string = 'en';

	//noInternetConnection: boolean = false;

	audienceFilter = [];
	private corRelationList: Array<CorrelationData>;

	profile: any;
	appLabel: string;

	private mode: string = "soft";

	private isFilterApplied: boolean = false;


	private isVisible: boolean = false;

	constructor(public navCtrl: NavController,
		private pageService: PageAssembleService,
		private ngZone: NgZone,
		private contentService: ContentService,
		private qrScanner: SunbirdQRScanner,
		private popCtrl: PopoverController,
		private telemetryService: TelemetryService,
		private events: Events,
		private toastCtrl: ToastController,
		private preference: SharedPreferences,
		private translate: TranslateService,
		private zone: NgZone,
		private network: Network,
		private appGlobal: AppGlobalService,
		private appVersion: AppVersion
	) {
		this.preference.getString('selected_language_code', (val: string) => {
			if (val && val.length) {
				this.selectedLanguage = val;
			}
		});

		this.events.subscribe('savedResources:update', (res) => {
			if (res && res.update) {
				this.setSavedContent();
			}
		});

		this.events.subscribe('onAfterLanguageChange:update', (res) => {
			if (res && res.selectedLanguage) {
				this.selectedLanguage = res.selectedLanguage;
				this.getPopularContent(true);
			}
		});

		this.events.subscribe(AppGlobalService.PROFILE_OBJ_CHANGED, () => {
			this.swipeDownToRefresh();
		});

		if (this.network.type === 'none') {
			this.isNetworkAvailable = false;
		} else {
			this.isNetworkAvailable = true;
		}
		this.network.onDisconnect().subscribe((data) => {
			this.isNetworkAvailable = false;
		});
		this.network.onConnect().subscribe((data) => {
			this.isNetworkAvailable = true;
		});

		this.appVersion.getAppName()
			.then((appName: any) => {
				this.appLabel = appName;
			});


		this.events.subscribe('tab.change', (data) => {
			this.zone.run(() => {
				if (data === "LIBRARY‌") {
					if (this.appliedFilter) {
						this.filterIcon = "./assets/imgs/ic_action_filter.png";
						this.resourceFilter = undefined;
						this.appliedFilter = undefined;
						this.isFilterApplied = false;
						this.getPopularContent();
					}
				}
			});
		});
	}

	ngAfterViewInit() {
		this.events.subscribe('onboarding-card:completed', (param) => {
			this.isOnBoardingCardCompleted = param.isOnBoardingCardCompleted;
		});
	}
	/**
	 * It will fetch the guest user profile details
	 */
	getCurrentUser(): void {
		let profiletype = this.appGlobal.getGuestUserType();
		if (profiletype == ProfileType.TEACHER) {
			this.showSignInCard = true;
			this.audienceFilter = AudienceFilter.GUEST_TEACHER;
		} else if (profiletype == ProfileType.STUDENT) {
			this.showSignInCard = false;
			this.audienceFilter = AudienceFilter.GUEST_STUDENT;
		}

		this.setSavedContent();

		this.profile = this.appGlobal.getCurrentUser();
		if (this.profile && this.profile.syllabus && this.profile.syllabus[0]
			&& this.profile.board && this.profile.board.length
			&& this.profile.grade && this.profile.grade.length
			&& this.profile.medium && this.profile.medium.length
			&& this.profile.subject && this.profile.subject.length) {
			this.isOnBoardingCardCompleted = true;
			this.events.publish('onboarding-card:completed', { isOnBoardingCardCompleted: this.isOnBoardingCardCompleted });
		}
	}

	viewAllSavedResources() {
		let values = new Map();
		values["SectionName"] = "Saved Resources";
		this.telemetryService.interact(
			generateInteractTelemetry(InteractType.TOUCH,
				InteractSubtype.VIEWALL_CLICKED,
				Environment.HOME,
				this.source, values,
				undefined,
				undefined)
		);
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
		const requestParams: ContentFilterCriteria = {
			contentTypes: ContentType.FOR_LIBRARY_TAB,
			audience: this.audienceFilter
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
			});
		});
	}

	/**
	 * Get popular content
	 */
	getPopularContent(isAfterLanguageChange = false, pageAssembleCriteria?: PageAssembleCriteria) {
		this.pageApiLoader = true;
		//this.noInternetConnection = false;
		let that = this;

		if (!pageAssembleCriteria) {
			let criteria = new PageAssembleCriteria();
			criteria.name = "Resource";
			criteria.mode = "soft";

			if (that.appliedFilter) {
				let filterApplied = false;

				Object.keys(this.appliedFilter).forEach(key => {
					if (this.appliedFilter[key].length > 0) {
						filterApplied = true;
					}
				})

				if (filterApplied) {
					criteria.mode = "hard";
				}

				criteria.filters = this.appliedFilter;
			}

			pageAssembleCriteria = criteria;
		}

		this.mode = pageAssembleCriteria.mode;

		if (this.profile && !this.isFilterApplied) {

			if (!pageAssembleCriteria.filters) {
				pageAssembleCriteria.filters = new PageAssembleFilter();
			}

			if (this.profile.board && this.profile.board.length) {
				pageAssembleCriteria.filters.board = this.applyProfileFilter(this.profile.board, pageAssembleCriteria.filters.board, "board");
			}

			if (this.profile.medium && this.profile.medium.length) {
				pageAssembleCriteria.filters.medium = this.applyProfileFilter(this.profile.medium, pageAssembleCriteria.filters.medium, "medium");
			}

			if (this.profile.grade && this.profile.grade.length) {
				pageAssembleCriteria.filters.gradeLevel = this.applyProfileFilter(this.profile.grade, pageAssembleCriteria.filters.gradeLevel, "gradeLevel");
			}

			if (this.profile.subject && this.profile.subject.length) {
				pageAssembleCriteria.filters.subject = this.applyProfileFilter(this.profile.subject, pageAssembleCriteria.filters.subject, "subject");
			}
		}


		this.pageService.getPageAssemble(pageAssembleCriteria, res => {
			that.ngZone.run(() => {
				let response = JSON.parse(res);
				console.log('Popular content, response');
				//TODO Temporary code - should be fixed at backend
				let a = JSON.parse(response.sections);
				console.log('page service ==>>>>', a);
				let newSections = [];
				a.forEach(element => {
					element.display = JSON.parse(element.display);
					if (element.display.name) {
						if (_.has(element.display.name, this.selectedLanguage)) {
							let langs = [];
							_.forEach(element.display.name, function (value, key) {
								langs[key] = value;
							});
							element.name = langs[this.selectedLanguage];
						}
					}
					newSections.push(element);
				});
				//END OF TEMPORARY CODE
				that.storyAndWorksheets = newSections;
				console.log('storyAndWorksheets', that.storyAndWorksheets);
				this.pageLoadedSuccess = true;
				this.pageApiLoader = false;
				//this.noInternetConnection = false;
				this.checkEmptySearchResult(isAfterLanguageChange);
			});
		}, error => {
			console.log('error while getting popular resources...', error);
			that.ngZone.run(() => {
				this.pageApiLoader = false;
				if (error === 'CONNECTION_ERROR') {
					//this.noInternetConnection = true;
					this.isNetworkAvailable = false;
				} else if (error === 'SERVER_ERROR' || error === 'SERVER_AUTH_ERROR') {
					if (!isAfterLanguageChange) this.getMessageByConst('ERROR_FETCHING_DATA');
				}
			});
		});
	}

	applyProfileFilter(profileFilter: Array<any>, assembleFilter: Array<any>, categoryKey?: string) {
		if (categoryKey) {
			let nameArray = [];
			profileFilter.forEach(filterCode => {
				let nameForCode = this.appGlobal.getNameForCodeInFramework(categoryKey, filterCode);

				if (!nameForCode) {
					nameForCode = filterCode;
				}

				nameArray.push(nameForCode);
			})

			profileFilter = nameArray;
		}


		if (!assembleFilter) {
			assembleFilter = [];
		}
		assembleFilter = assembleFilter.concat(profileFilter);

		let unique_array = [];

		for (let i = 0; i < assembleFilter.length; i++) {
			if (unique_array.indexOf(assembleFilter[i]) == -1 && assembleFilter[i].length > 0) {
				unique_array.push(assembleFilter[i])
			}
		}

		assembleFilter = unique_array;

		if (assembleFilter.length == 0) {
			return undefined;
		}

		return assembleFilter;
	}


	showMessage(message) {
		let toast = this.toastCtrl.create({
			message: message,
			duration: 4000,
			position: 'bottom'
		});
		toast.present();
	}

	getMessageByConst(constant) {
		if (!this.isVisible) {
			return
		}

		this.translate.get(constant).subscribe(
			(value: any) => {
				this.showMessage(value);
			}
		);
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
			generateInteractTelemetry(InteractType.TOUCH,
				InteractSubtype.VIEWALL_CLICKED,
				Environment.HOME,
				this.source, values,
				undefined,
				undefined)
		);

		queryParams = updateFilterInSearchQuery(queryParams, this.appliedFilter, this.profile, this.mode, this.isFilterApplied, this.appGlobal);

		this.navCtrl.push(ViewMoreActivityPage, {
			requestParams: queryParams,
			headerTitle: headerTitle
		});
	}

	ionViewDidEnter() {
		

		this.isVisible = true;

		this.generateImpressionEvent();
		this.preference.getString('show_app_walkthrough_screen', (value) => {
			if (value === 'true') {
				const driver = new Driver({
					allowClose: true,
					closeBtnText: this.translateMessage('DONE'),
					showButtons: true
				});

				console.log("Driver", driver);
				setTimeout(() => {
					driver.highlight({
						element: '#qrIcon',
						popover: {
							title: this.translateMessage('ONBOARD_SCAN_QR_CODE'),
							description: "<img src='assets/imgs/ic_scanqrdemo.png' /><p>" + this.translateMessage('ONBOARD_SCAN_QR_CODE_DESC', this.appLabel) + "</p>",
							showButtons: true,         // Do not show control buttons in footer
							closeBtnText: this.translateMessage('DONE'),
						}
					});

					let element = document.getElementById("driver-highlighted-element-stage");
					var img = document.createElement("img");
					img.src = "assets/imgs/ic_scan.png";
					img.id = "qr_scanner";
					element.appendChild(img);
				}, 100);

				this.preference.putString('show_app_walkthrough_screen', 'false');
			}
		});
	}

	ionViewWillEnter() {
		this.guestUser = !this.appGlobal.isUserLoggedIn();

		if (this.guestUser) {
			this.getCurrentUser();
		} else {
			this.audienceFilter = AudienceFilter.LOGGED_IN_USER;
		}

		if (!this.pageLoadedSuccess) {
			this.getPopularContent();
		}

		this.subscribeGenieEvents();

		if (this.network.type === 'none') {
			this.isNetworkAvailable = false;
		}
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
		this.isVisible = false;
		this.events.unsubscribe('genie.event');
	}
	/**
	 *
	 * @param refresher
	 */
	swipeDownToRefresh(refresher?) {
		if (refresher) {
			refresher.complete();
		}

		this.storyAndWorksheets = [];
		this.setSavedContent();
		this.guestUser = !this.appGlobal.isUserLoggedIn();

		if (this.guestUser) {
			this.getCurrentUser();
		} else {
			this.audienceFilter = AudienceFilter.LOGGED_IN_USER;
		}

		this.getPopularContent(false);
		this.checkNetworkStatus();
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
		this.telemetryService.impression(generateImpressionTelemetry(
			ImpressionType.VIEW, "",
			PageId.LIBRARY,
			Environment.HOME, "", "", "",
			undefined,
			undefined

		));
	}

	scanQRCode() {
		this.telemetryService.interact(
			generateInteractTelemetry(InteractType.TOUCH,
				InteractSubtype.QRCodeScanClicked,
				Environment.HOME,
				PageId.LIBRARY, null,
				undefined,
				undefined));
		const that = this;

		const callback: QRResultCallback = {

			dialcode(scanResult, dialCode) {

				that.addCorRelation(dialCode, "qr");
				that.navCtrl.push(SearchPage, {
					dialCode: dialCode,
					corRelation: that.corRelationList,
					source: that.source,
					shouldGenerateEndTelemetry: true
				});
			},
			content(scanResult, contentId) {
				let request: ContentDetailRequest = {
					contentId: contentId
				}

				that.contentService.getContentDetail(request, (response) => {
					let data = JSON.parse(response);
					that.addCorRelation(data.result.identifier, "qr")
					that.showContentDetails(data.result, that.corRelationList);
				}, (error) => {
					console.log("Error " + error);
					if (that.network.type === 'none') {
						that.getMessageByConst('ERROR_NO_INTERNET_MESSAGE');
					} else {
						that.getMessageByConst('UNKNOWN_QR');
					}
				});
			}
		}

		this.qrScanner.startScanner(undefined, undefined, undefined, callback, PageId.LIBRARY);
	}

	addCorRelation(identifier: string, type: string) {
		if (this.corRelationList === undefined) {
			this.corRelationList = new Array<CorrelationData>();
		}
		else {
			this.corRelationList = [];
		}
		let corRelation: CorrelationData = new CorrelationData();
		corRelation.id = identifier;
		corRelation.type = type;
		this.corRelationList.push(corRelation);
	}

	search() {

		this.telemetryService.interact(
			generateInteractTelemetry(InteractType.TOUCH,
				InteractSubtype.SEARCH_BUTTON_CLICKED,
				Environment.HOME,
				PageId.LIBRARY, null,
				undefined,
				undefined));

		this.navCtrl.push(SearchPage, { contentType: ContentType.FOR_LIBRARY_TAB, source: PageId.LIBRARY });
	}

	showContentDetails(content, corRelationList) {

		if (content.contentType === ContentType.COURSE) {
			console.log('Calling course details page');
			this.navCtrl.push(EnrolledCourseDetailsPage, {
				content: content,
				corRelation: corRelationList,
				source: this.source,
				shouldGenerateEndTelemetry: true
			})
		} else if (content.mimeType === MimeType.COLLECTION) {
			console.log('Calling collection details page');
			this.navCtrl.push(CollectionDetailsPage, {
				content: content,
				corRelation: corRelationList,
				source: this.source,
				shouldGenerateEndTelemetry: true

			})
		} else {
			console.log('Calling content details page');
			this.navCtrl.push(ContentDetailsPage, {
				content: content,
				corRelation: corRelationList,
				source: this.source,
				shouldGenerateEndTelemetry: true
			})
		}
	}

	showFilter() {
		this.telemetryService.interact(
			generateInteractTelemetry(InteractType.TOUCH,
				InteractSubtype.FILTER_BUTTON_CLICKED,
				Environment.HOME,
				PageId.LIBRARY, null,
				undefined,
				undefined));

		const that = this;
		//this.noInternetConnection = false;
		const callback: PageFilterCallback = {
			applyFilter(filter, appliedFilter) {
				let criteria = new PageAssembleCriteria();
				criteria.name = "Resource";
				criteria.filters = filter;
				criteria.mode = "hard";
				that.resourceFilter = appliedFilter;
				that.appliedFilter = filter;

				let filterApplied = false;
				that.isFilterApplied = false;

				Object.keys(that.appliedFilter).forEach(key => {
					if (that.appliedFilter[key].length > 0) {
						filterApplied = true;
						that.isFilterApplied = true;
					}
				})

				if (filterApplied) {
					criteria.mode = "hard";
					that.filterIcon = "./assets/imgs/ic_action_filter_applied.png";
				} else {
					criteria.mode = "soft";
					that.filterIcon = "./assets/imgs/ic_action_filter.png";
				}


				that.getPopularContent(false, criteria)
			}
		}

		let filterOptions = {
			callback: callback
		}

		// Already apllied filter
		if (this.resourceFilter) {
			filterOptions['filter'] = this.resourceFilter;
		} else {
			filterOptions['filter'] = PageFilterConstants.RESOURCE_FILTER;
		}

		let filter = this.popCtrl.create(PageFilter, filterOptions, { cssClass: 'resource-filter' })
		filter.present();
	}

	checkEmptySearchResult(isAfterLanguageChange = false) {
		let flags = [];
		_.forEach(this.storyAndWorksheets, function (value, key) {
			if (value.contents && value.contents.length) {
				flags[key] = true;
			}
		});

		if (flags.length && _.includes(flags, true)) {
			console.log('search result found');
		} else {
			if (!isAfterLanguageChange) this.getMessageByConst('NO_CONTENTS_FOUND');
		}
	}

	showNetworkWarning() {
		this.showWarning = true;
		setTimeout(() => {
			this.showWarning = false;
		}, 3000);
	}

	buttonClick(isNetAvailable?) {
		this.showNetworkWarning();
	}

	checkNetworkStatus(showRefresh = false) {
		if (this.network.type === 'none') {
			this.isNetworkAvailable = false;
		} else {
			this.isNetworkAvailable = true;
			if (showRefresh) {
				this.swipeDownToRefresh();
			}
		}
	}

	/**
	 * Used to Translate message to current Language
	 * @param {string} messageConst - Message Constant to be translated
	 * @returns {string} translatedMsg - Translated Message
	 */
	translateMessage(messageConst: string, field?: string): string {
		let translatedMsg = '';
		this.translate.get(messageConst, { '%s': field }).subscribe(
			(value: any) => {
				translatedMsg = value;
			}
		);
		return translatedMsg;
	}
}
