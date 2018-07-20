import { IonicPage, NavController, NavParams, LoadingController, Events, ToastController } from 'ionic-angular';
import { Component, NgZone, OnInit } from '@angular/core';
import { ContentService, CourseService, PageAssembleService, TelemetryService, PageId, Environment, ImpressionType, Log, LogLevel } from 'sunbird';
import * as _ from 'lodash';
import { generateImpressionTelemetry } from '../../app/telemetryutil';
import { ContentType } from '../../app/app.constant';
import { ContentDetailsPage } from '../content-details/content-details';
import { CourseUtilService } from '../../service/course-util.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the ViewMoreActivityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
	selector: 'page-view-more-activity',
	templateUrl: 'view-more-activity.html',
})

export class ViewMoreActivityPage implements OnInit {

	/**
	 * Contains search query
	 */
	searchQuery: any;

	/**
	 * To hold search result
	 */
	searchList: any;

	/**
	 * Contains tab bar element ref
	 */
	tabBarElement: any;

	/**
	 * Flag to show / hide button
	 */
	loadMoreBtn: boolean = true;

	/**
	 * Offcet
	 */
	offset: number = 0;

	/**
	 * Contains search limit
	 */
	searchLimit: number = 10

	/**
	 * Total search count
	 */
	totalCount: number;

	/**
	 * Load more flag
	 */
	isLoadMore: boolean = false;

	/**
	 * Contains reference of NgZone
	 */
	ngZone: NgZone;

	/**
	 * Contains reference of NavController
	 */
	navCtrl: NavController;

	/**
	 * Contains reference of NavParams
	 */
	navParams: NavParams;

	/**
	 * Header title
	 */
	headerTitle: string;

	/**
	 * Default page type
	 */
	pageType = 'library'

	/**
	 * To queue downloaded identifier
	 */
	queuedIdentifiers: Array<any> = [];

	downloadPercentage: number = 0;

	showOverlay: boolean = false;

	resumeContentData: any;

	/**
	 * Contains reference of ContentService
	 */
	public contentService: ContentService;

	/**
	 * Contains reference of page api service
	 */
	public pageService: PageAssembleService;

	/**
	 * Contains reference of LoadingController
	 */
	public loadingCtrl: LoadingController;

	/**
	 * Contains reference of course service
	 */
	public courseService: CourseService;



	/**
	 * Default method of class SearchPage
	 *
	 * @param navCtrl
	 * @param navParams
	 * @param contentService
	 * @param ngZone
	 */
	constructor(navCtrl: NavController, navParams: NavParams, contentService: ContentService, ngZone: NgZone,
		loadingCtrl: LoadingController, pageService: PageAssembleService, courseService: CourseService
		, private telemetryService: TelemetryService, private events: Events, private courseUtilService: CourseUtilService, private translate: TranslateService, private toastCtrl: ToastController) {
		this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
		this.contentService = contentService;
		this.ngZone = ngZone;
		this.navCtrl = navCtrl;
		this.navParams = navParams;
		this.loadingCtrl = loadingCtrl;
		this.pageService = pageService;
		this.courseService = courseService;
		this.events.subscribe('savedResources:update', (res) => {
			if (res && res.update) {
				if (this.navParams.get('pageName') === 'resource.SavedResources') {
					this.getLocalContents();
				}
			}
		});

		this.events.subscribe('viewMore:Courseresume', (data) => {
			this.resumeContentData = data.content;
			this.getContentDetails(data.content);
		})
	}

	/**
	 * Search content
	 */
	search() {
		console.log('Inside search');
		let loader = this.getLoader();
		loader.present();

		this.contentService.getSearchCriteriaFromRequest(this.searchQuery, (success: any) => {
			let reqBody = JSON.parse(success);
			reqBody.limit = 10;
			reqBody.offset = this.offset === 0 ? reqBody.offset : this.offset;
			console.log("Filters", JSON.stringify(reqBody));
			this.contentService.searchContent(reqBody, true,false,false,  (data: any) => {
				data = JSON.parse(data);
				console.log('search response...', data);
				this.ngZone.run(() => {
					if (data.result && data.result.contentDataList) {
						this.loadMoreBtn = data.result.contentDataList.length < this.searchLimit ? false : true;
						if (this.isLoadMore) {
							_.forEach(data.result.contentDataList, (value, key) => {
								this.searchList.push(value);
							});
						} else {
							this.searchList = data.result.contentDataList;
						}
					} else {
						this.loadMoreBtn = false;
					}
					console.log('this.searchResult', this.searchList);
					loader.dismiss();
				})
				this.generateImpressionEvent();
				this.generateLogEvent(data.result);
			}, (error: any) => {
				console.log('Error: while fetchig view more content');
				loader.dismiss();
			})
		}, (error: any) => {
			console.log('Error: while fetchig view more content');
			loader.dismiss();
		});
	}

	private generateImpressionEvent() {
		this.telemetryService.impression(
			generateImpressionTelemetry(
				ImpressionType.SEARCH, "",
				PageId.LIBRARY,
				Environment.HOME, "", "", "",
				undefined,
				undefined)
		);
	}

	private generateLogEvent(searchResult) {
		let log = new Log();
		log.level = LogLevel.INFO;
		log.type = ImpressionType.SEARCH;
		if (searchResult != null) {
			let contentArray: Array<any> = searchResult.contentDataList;
			let params = new Array<any>();
			let paramsMap = new Map();
			paramsMap["SearchResults"] = contentArray.length;
			paramsMap["SearchCriteria"] = searchResult.request;
			params.push(paramsMap);
			log.params = params;
			this.telemetryService.log(log);
		}
	}

	/**
	 * Load more result
	 */
	loadMore() {
		this.isLoadMore = true;
		this.offset = this.offset + this.searchLimit;
		this.mapper();
	}
	/**
	 * Ionic default life cycle hook
	 */
	ionViewWillEnter(): void {
		this.tabBarElement.style.display = 'none';
		this.searchQuery = this.navParams.get('requestParams');
		console.log('queryParams received:', this.searchQuery);
		if (this.headerTitle !== this.navParams.get('headerTitle')) {
			this.headerTitle = this.navParams.get('headerTitle');
			this.offset = 0;
			this.loadMoreBtn = true;
			this.mapper();
			console.log('Header changed.......====>>>>');
		}
	}

	/**
	 * Mapper to call api based on page.Layout name
	 */
	mapper() {
		const pageName = this.navParams.get('pageName');
		switch (pageName) {
			case 'course.EnrolledCourses':
				this.pageType = 'enrolledCourse';
				this.loadMoreBtn = false;
				this.getEnrolledCourse();
				break;
			case 'course.PopularContent':
				this.pageType = 'popularCourses';
				this.search();
				break;
			case 'resource.SavedResources':
				this.loadMoreBtn = false;
				this.getLocalContents();
				break;
			default:
				this.search();
		}
	}

	/**
	 * Get enrolled courses
	 */
	getEnrolledCourse() {
		let loader = this.getLoader();
		loader.present();
		this.pageType = 'enrolledCourse';
		let option = {
			userId: this.navParams.get('userId'),
			refreshEnrolledCourses: false
		};
		this.courseService.getEnrolledCourses(option, (data: any) => {
			if (data) {
				data = JSON.parse(data);
				this.searchList = data.result.courses ? data.result.courses : [];
				console.log('Enrolled courses', this.searchList);
				this.loadMoreBtn = false;
			}
			loader.dismiss();
		}, (error: any) => {
			console.log('error while loading enrolled courses', error);
			loader.dismiss();
		});
	}

	/**
	 * Get local content
	 */
	getLocalContents() {
		let loader = this.getLoader();
		loader.present();
		const requestParams = {
			contentTypes: ContentType.FOR_LIBRARY_TAB
		};
		this.contentService.getAllLocalContents(requestParams)
		.then(data => {
			let contentData = [];
			_.forEach(data, (value, key) => {
				value.contentData.lastUpdatedOn = value.lastUpdatedTime;
				if (value.contentData.appIcon) {
					value.contentData.appIcon = value.basePath + '/' + value.contentData.appIcon;
				}
				contentData.push(value.contentData);
			});
			this.ngZone.run(() => {
				this.searchList = contentData;
				loader.dismiss();
				this.loadMoreBtn = false;
			});
		})
		.catch(err => {
			loader.dismiss();
		});
	}

	getContentDetails(content) {
		let identifier = content.contentId || content.identifier;
		this.contentService.getContentDetail({ contentId: identifier }, (data: any) => {
			data = JSON.parse(data);
			console.log('enrolled course details: ', data);
			if (data && data.result) {
				switch (data.result.isAvailableLocally) {
					case true: {
						console.log("Content locally available. Geting child content... @@@");
						this.navCtrl.push(ContentDetailsPage, {
							content: { identifier: content.lastReadContentId },
							depth: '1',
							contentState: {
								batchId: content.batchId ? content.batchId : '',
								courseId: identifier
							},
							isResumedCourse: true,
							isChildContent: true,
							resumedCourseCardData: this.resumeContentData
						});
						break;
					}
					case false: {
						this.subscribeGenieEvent();
						console.log("Content locally not available. Import started... @@@");
						this.showOverlay = true;
						this.importContent([identifier], false);
						break;
					}
					default: {
						console.log("Invalid choice");
						break;
					}
				}
			}
		},
			(error: any) => {
				console.log(error);
				console.log('Error while getting resumed course data....')
			});
	}

	importContent(identifiers, isChild) {
		this.queuedIdentifiers.length = 0;
		const option = {
			contentImportMap: this.courseUtilService.getImportContentRequestBody(identifiers, isChild),
			contentStatusArray: []
		}

		this.contentService.importContent(option, (data: any) => {
			data = JSON.parse(data);
			console.log('Success: Import content =>', data);
			this.ngZone.run(() => {
				if (data.result && data.result.length) {
					_.forEach(data.result, (value, key) => {
						if (value.status === 'ENQUEUED_FOR_DOWNLOAD') {
							this.queuedIdentifiers.push(value.identifier);
						}
					});
					if (this.queuedIdentifiers.length === 0) {
						this.showOverlay = false;
						this.downloadPercentage = 0;
						this.showMessage(this.translateMessage('ERROR_CONTENT_NOT_AVAILABLE'));
						console.log('Content not downloaded');
					}
				}
			});
		},
			(error: any) => {
				this.ngZone.run(() => {
					this.showOverlay = false;
					this.showMessage(this.translateMessage('ERROR_CONTENT_NOT_AVAILABLE'));
				});
			});
	}

	subscribeGenieEvent() {
		let count = 0;
		this.events.subscribe('genie.event', (data) => {
			this.ngZone.run(() => {
				data = JSON.parse(data);
				let res = data;
				console.log('event bus........', res);
				if (res.type === 'downloadProgress' && res.data.downloadProgress) {
					this.downloadPercentage = res.data.downloadProgress === -1 ? 0 : res.data.downloadProgress;
				}
				if (res.data && res.data.status === 'IMPORT_COMPLETED' && res.type === 'contentImport' && this.downloadPercentage === 100) {
					console.log('Comming after import complete. Genie event unsubscribed')
					this.showOverlay = false;
					this.navCtrl.push(ContentDetailsPage, {
						content: { identifier: this.resumeContentData.lastReadContentId },
						depth: '1',
						contentState: {
							batchId: this.resumeContentData.batchId ? this.resumeContentData.batchId : '',
							courseId: this.resumeContentData.contentId || this.resumeContentData.identifier
						},
						isResumedCourse: true,
						isChildContent: true,
						resumedCourseCardData: this.resumeContentData
					});
				}
			});
		});
	}

	cancelDownload() {
		this.ngZone.run(() => {
			this.contentService.cancelDownload(this.resumeContentData.contentId || this.resumeContentData.identifier, (response) => {
				this.showOverlay = false;
			}, (error) => {
				this.showOverlay = false;
			});
		});
	}

	/**
	 * Ionic life cycle hook
	 */
	ionViewCanLeave() {
		this.ngZone.run(() => {
			// this.events.unsubscribe('viewMore:Courseresume');
			this.events.unsubscribe('genie.event');
			console.log('Leaving view more page');
			this.tabBarElement.style.display = 'flex';
			this.isLoadMore = false;
			this.pageType = this.pageType;
			this.showOverlay = false;
		})
	}

	/**
	 * Angular life cycle hooks
	 */
	ngOnInit() {
		this.tabBarElement.style.display = 'none';
	}
	/**
	 * Function to get loader instance
	 */
	getLoader(): any {
		return this.loadingCtrl.create({
			duration: 30000,
			spinner: "crescent"
		});
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

	showMessage(message) {
		let toast = this.toastCtrl.create({
			message: message,
			duration: 4000,
			position: 'bottom'
		});
		toast.present();
	}
}
