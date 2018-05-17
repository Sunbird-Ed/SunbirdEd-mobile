import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Component, NgZone, OnInit } from '@angular/core';
import { ContentService, CourseService, PageAssembleService, TelemetryService, PageId, Environment, ImpressionType, Log, LogLevel } from 'sunbird';
import * as _ from 'lodash';
import { generateImpressionEvent } from '../../app/telemetryutil';

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
		, private telemetryService: TelemetryService) {
		this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
		this.contentService = contentService;
		this.ngZone = ngZone;
		this.navCtrl = navCtrl;
		this.navParams = navParams;
		this.loadingCtrl = loadingCtrl;
		this.pageService = pageService;
		this.courseService = courseService;
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
			this.contentService.searchContent(reqBody, true, (data: any) => {
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
			generateImpressionEvent(
				ImpressionType.SEARCH,
				PageId.LIBRARY,
				Environment.HOME, "", "", "")
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
		console.log('queryParams received =>>>>', this.searchQuery);
		if (this.headerTitle !== this.navParams.get('headerTitle')) {
			this.headerTitle = this.navParams.get('headerTitle');
			this.offset = 0;
			this.loadMoreBtn = true;
			this.mapper();
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
			contentTypes: ['Story', 'Worksheet', 'Collection', 'Game', 'TextBook', 'Course', 'Resource', 'LessonPlan']
		};
		this.contentService.getAllLocalContents(requestParams, (res: any) => {
			let data = JSON.parse(res);
			console.log('Success: saved resources...', data);
			this.ngZone.run(() => {
				if (data.result) {
					let contentData = [];
					// TODO Temporary code - should be fixed at backend
					_.forEach(data.result, (value, key) => {
						value.contentData.lastUpdatedOn = value.lastUpdatedTime;
						value.createdOn = value.contentData.createdOn;
						if (value.contentData.appIcon && value.basePath) {
							value.contentData.appIcon = value.basePath + '/' + value.contentData.appIcon;
						}
						contentData.push(value.contentData)
					});
					this.searchList = contentData;
				}
				loader.dismiss();
				this.loadMoreBtn = false;
			});
		}, error => {
			console.log('error while getting saved contents', error);
			loader.dismiss();
		});


	}

	/**
	 * Ionic life cycle hook
	 */
	ionViewCanLeave() {
		this.tabBarElement.style.display = 'flex';
		this.isLoadMore = false;
		this.pageType = this.pageType;
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
}
