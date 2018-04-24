import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Component, NgZone, OnInit } from '@angular/core';
import { ContentService, CourseService, PageAssembleService, PageAssembleCriteria } from 'sunbird';
import { ViewMoreActivityListComponent } from '../../component/view-more-activity-list/view-more-activity-list';
import * as _ from 'lodash';

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
		loadingCtrl: LoadingController, pageService: PageAssembleService, courseService: CourseService) {
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
	 * Function to build api request
	 */
	getRequestBody(): object {
		let data = JSON.parse(this.searchQuery);
		data = data.request;
		const requestParams = {
			query: data.query,
			limit: this.searchLimit,
			contentStatusArray: data.filters.status,
			contentTypes: data.filters.contentType
		}

		console.log('Request params.....', requestParams);
		return requestParams;
	}

	/**
	 * Search content
	 */
	search() {
		console.log('Inside search');
		let loader = this.getLoader();
		loader.present();
		this.contentService.searchContent(this.getRequestBody(), false, (data: any) => {
			data = JSON.parse(data);
			console.log('search limit...', data);
			this.ngZone.run(() => {
				if (data.result && data.result.contentDataList) {
					if (this.isLoadMore) {
						this.searchList.push(data.result.contentDataList);
					} else {
						this.searchList = data.result.contentDataList;
					}
				}
				console.log('this.searchResult', this.searchList);
				loader.dismiss();
			})
		}, (error: any) => {
			console.log('Error: while fetchig view more content');
			loader.dismiss();
		})
	}

	/**
	 * Load more result
	 */
	loadMore() {
		// TODO: Issue in SDK - SDK is not accepting offset value.
		this.searchLimit = this.searchLimit + 10;
		this.mapper();
	}

	/**
	 * Mapper to call api based on page.Layout name
	 */
	mapper() {
		const pageName = this.navParams.get('pageName');
		switch (pageName) {
			case 'course.EnrolledCourses':
				this.pageType = 'enrolledCourse';
				this.getEnrolledCourse();
				break;
			case 'course.PopularContent':
				this.pageType = 'popularCourses';
				this.search();
				break;
			case 'resource.SavedResources':
				this.getLocalContents();
				break;
			default:
				this.search();
		}
	}

	/**
	 * Ionic default life cycle hook
	 */
	ionViewWillEnter(): void {
		this.tabBarElement.style.display = 'none';
		this.searchQuery = this.navParams.get('requestParams');
		console.log('queryParams received =>>>>', this.navParams.get('requestParams'));
		this.headerTitle = this.navParams.get('headerTitle');
		this.mapper();
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
		this.contentService.getAllLocalContents(requestParams, (data: any) => {
			data = JSON.parse(data);
			console.log('Success: saved resources', data);
			this.ngZone.run(() => {
				if (data.result) {
					// TODO Temporary code - should be fixed at backend
					_.forEach(data.result, (value, key) => {
						value.contentData.lastUpdatedOn = value.lastUpdatedTime;
						value.createdOn = value.contentData.createdOn;
						if (value.contentData.appIcon && value.basePath) {
							value.contentData.appIcon = value.basePath + '/' + value.contentData.appIcon;
						}
					});
					this.searchList = data.result;
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
		this.searchLimit = 10;
		this.searchList = [];
		this.loadMoreBtn = true;
		this.pageType = 'library';
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
