import {Component, Inject, NgZone, Renderer2, ViewChild} from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import {ProfilePage} from './../profile';
import {TelemetryGeneratorService} from '@app/service';
import {CommonUtilService} from '../../../service/common-util.service';
import {AuthService, ProfileService, ServerProfileSearchCriteria, Visit} from 'sunbird-sdk';
import {Environment, ImpressionType, PageId} from '../../../service/telemetry-constants';

@Component({
  selector: 'user-search',
  templateUrl: 'user-search.html'
})

/* This component shows the list of user based on search*/
export class UserSearchComponent {
  @ViewChild('input') input;
  searchInput = '';
  prevSearchInput = '';
  userList: any = [];
  fallBackImage = './assets/imgs/ic_profile_default.png';
  enableInfiniteScroll = false;
  showEmptyMessage = false;

  /* Default Limits for the API */
  apiOffset = 0;
  apiLimit = 10;

  visibleItems: Array<Visit> = [];
  visits: Array<any> = [];
  isContentLoaded = false;

  constructor(
    @Inject('PROFILE_SERVICE') private profileService: ProfileService,
    @Inject('AUTH_SERVICE') private authService: AuthService,
    private navCtrl: NavController,
    private zone: NgZone,
    private renderer: Renderer2,
    private loadingCtrl: LoadingController,
    private commonUtilService: CommonUtilService,
    private telemetryGeneratorService: TelemetryGeneratorService
  ) { }

  /**
   * Makes an search user API call
   * @param {object} scrollEvent - infinite Scroll Event
   */
  onInput(event?, scrollEvent?): void {
    const loader = this.commonUtilService.getLoader();

    if (!this.enableInfiniteScroll || !scrollEvent) {
      loader.present();
    }
    if (event) {
      // this.renderer.invokeElementMethod(event.target, 'blur');
      this.renderer.selectRootElement(event.target).blur();
    }
    this.authService.getSession().toPromise().then(session => {
      if (Boolean(session)) {
        const req: ServerProfileSearchCriteria = {
          query: this.searchInput,
          offset: this.apiOffset,
          filters: {
            identifier: new Set()
          },
          limit: this.apiLimit,
          fields: []
        };
        if (req.query === '') {
          this.userList = [];
          this.showEmptyMessage = false;
          loader.dismiss();
        } else {
          this.profileService.getServerProfiles(req)
            .toPromise().then((res: any) => {
            const result = JSON.parse(JSON.parse(res).searchUser);
            if (this.searchInput !== this.prevSearchInput) {
              this.userList = [];
            }
            Array.prototype.push.apply(this.userList, result.content);
            this.enableInfiniteScroll = (this.apiOffset + this.apiLimit) < result.count;
            if (scrollEvent) {
              scrollEvent.complete();
            }
            this.showEmptyMessage = result.content.length ? false : true;
            this.prevSearchInput = this.searchInput;
            loader.dismiss();
          }).catch(() => {
            if (scrollEvent) {
              scrollEvent.complete();
            }
            this.commonUtilService.showToast(this.commonUtilService.translateMessage('SOMETHING_WENT_WRONG'));
            loader.dismiss();
          });
        }
      }
    });
  }

  /**
   * Navigates to the User Profile
   * @param {string} id User ID
   */
  openUserProfile(id): void {
    this.navCtrl.push(ProfilePage, { userId: id });
  }

  /**
   * Makes an infinite scroll call.
   * @param {object} scrollEvent - Infinite scroll event
   */
  doInfiniteScroll(scrollEvent): void {
    if (this.enableInfiniteScroll) {
      this.apiOffset += this.apiLimit;
      this.onInput(undefined, scrollEvent);
    } else {
      scrollEvent.complete();
    }
  }

  ionViewDidLoad() {
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.SEARCH, '',
      PageId.PROFILE,
      Environment.USER, '', '', '',
      undefined, undefined
    );
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.input.setFocus();
    }, 100);
  }

  checkClear() {
    if (this.searchInput === '') {
      this.onInput();
    }
  }

  /*
  //Required for list item visibility telemetry tracking

      ionViewWillEnter() {
        this.visibleItems = [];
      }

      onScrollEnd(event: any): void {
        this.getVisibleElementRange();
      }

      contentLoad() {
        if (this.userList.length <= this.apiLimit) {
          this.getVisibleElementRange();
        }
      }

      getVisibleElementRange() {
        this.userList.forEach((element, index) => {
          if (document.getElementById(<string>index)) {
            this.generateVisitObject(element, index);
          }
        });
      }

      isElementInViewport(el) {
        var rect = el.getBoundingClientRect();
        return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
      }

      generateVisitObject(element, index) {
        let visitItem = new Visit();
        visitItem.objid = element.id;
        visitItem.index = index;
        visitItem.objtype = "user";
        this.visibleItems.push(visitItem);
      }

      ionViewWillLeave() {
        this.visibleItems = _.uniq(this.visibleItems);
      }
  */

}
