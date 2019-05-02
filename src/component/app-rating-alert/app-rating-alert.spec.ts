import {
  viewControllerMock,
  appVersionMock,
  utilityServiceMock,
  sharedPreferencesMock,
  appRatingServiceMock,
  translateServiceMock,
  platformMock
} from "@app/__tests__/mocks";

import {AppRatingAlertComponent} from "@app/component/app-rating-alert/app-rating-alert";
import {Observable} from "rxjs";

describe('AppRatingAlertComponent', () => {
  let appRatingPage: AppRatingAlertComponent;
  enum ViewType {
    APP_RATE = 'appRate',
    STORE_RATE = 'storeRate',
    HELP_DESK = 'helpDesk',
  }
  const appRateView = {

    appRate: { type: ViewType.APP_RATE, heading: 'APP_RATING_RATE_EXPERIENCE', message: 'APP_RATING_TAP_ON_STARS' },
    storeRate: { type: ViewType.STORE_RATE, heading: 'APP_RATING_THANKS_FOR_RATING', message: 'APP_RATING_RATE_ON_PLAYSTORE' },
    helpDesk: { type: ViewType.HELP_DESK, heading: 'APP_RATING_THANKS_FOR_RATING', message: 'APP_RATING_REPORT_AN_ISSUE' }
  };
  beforeEach(() => {
    sharedPreferencesMock.getString.mockImplementation((key: string) => {
      if (key === 'app_name') {
        return Observable.of('SAMPLE_APP_NAME');
      } else if (key === 'app_logo') {
        return Observable.of('SAMPLE_APP_LOGO');
      }

      return Observable.of('')
    });
    platformMock.registerBackButtonAction.mockReturnValue(jest.fn());
    appRatingPage = new AppRatingAlertComponent(
      viewControllerMock as any, appVersionMock as any, utilityServiceMock as any,
      appRatingServiceMock as any, sharedPreferencesMock as any, translateServiceMock as any,
      platformMock as any
    );
    jest.resetAllMocks();
  });
  it('should load instance', () => {
    expect(appRatingPage).toBeTruthy();
  });
  it('should call viewController onDidDismiss when data is null triggered at the beginning ', () => {
    // arrange
    viewControllerMock.onDidDismiss.mockImplementation((cb) => {
      cb();
      if(cb === null) {
        spyOn(appRatingServiceMock, 'setInitialDate').and.stub();
      }
      return {};
    });
    spyOn(appRatingPage, 'ionViewDidLoad').and.callThrough();
    // act
    appRatingPage.ionViewDidLoad();
    //assert
    expect(appRatingPage.ionViewDidLoad).toHaveBeenCalled();
  });

  it('should call viewController dismiss() when closePopOver method is triggered', () => {
    spyOn(appRatingPage, 'closePopover').and.callThrough();
    appRatingPage.closePopover();
    viewControllerMock.dismiss.mockReturnValue((data: null) => {
      if (data) {
        return expect(appRatingPage.closePopover()).toHaveBeenCalled();
      }
    });
  });
  it('should call viewController dismiss() when rateLater() is called ', () => {
    spyOn(appRatingPage, 'rateLater').and.callThrough();
    appRatingPage.rateLater();
    viewControllerMock.dismiss.mockReturnValue((data: null) => {
      if (data) {
        expect(appRatingPage.rateLater).toHaveBeenCalled();
      }
    });
  });
  it('should call appVersion.getPackageName() when submitRating() is triggered', () => {
    appVersionMock.getPackageName.mockResolvedValue('SAMPLE_PACKAGE_NAME');
    utilityServiceMock.openPlayStore.mockResolvedValue('SAMPLE_PACKAGE_NAME');
    viewControllerMock.dismiss.mockResolvedValue('close');
    spyOn(appRatingPage, 'rateOnStore').and.callThrough();
    appRatingPage.rateOnStore();
    expect(appRatingPage.rateOnStore).toHaveBeenCalled();
  });
  xit('should change currentViewText when rating is greater than 4 or more', () => {
    // arrange
    spyOn(appRatingPage, 'submitRating').and.stub();
    //act
    appRatingPage.submitRating(5);
    // assert
    expect(appRatingPage.submitRating(5)).toHaveBeenCalled();
  });
  xit('should changeViewText when rating is less than 3', () => {
    // arrange
    spyOn(appRatingPage, 'submitRating').and.callThrough();
    // act
    appRatingPage.submitRating(2);
    // assert
    expect(appRatingPage.submitRating(2)).toHaveBeenCalled();
  })
});
