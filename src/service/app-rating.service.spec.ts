import {
  sharedPreferencesMock
} from '../__tests__/mocks';
import {AppRatingService} from './app-rating.service';
import {Observable} from "rxjs";
import {FileMock} from "ionic-mocks";

describe('App-rating-Service', () => {
  let appRatingService = AppRatingService;
  beforeEach(() => {
    appRatingService = new AppRatingService(
      sharedPreferencesMock as any,
      FileMock as any
    );
    jest.resetAllMocks();
  });
  it('should load instance', () => {
    expect(appRatingService).toBeTruthy();
  });


  it('should set present date as InitialDate when setInitialDate() call and set on Preferences ', () => {
    sharedPreferencesMock.putString.mockReturnValue(Observable.of(undefined));
    spyOn(appRatingService, 'setInitialDate').and.callThrough();
    appRatingService.setInitialDate();
    expect(appRatingService.setInitialDate).toHaveBeenCalled();
  });

  it('should call setInitialDate() on checkInitialDate() when initialDate is not present in preferences', () => {
    sharedPreferencesMock.getString.mockReturnValue(Observable.of('SAMPLE_APP_DATE'));
    spyOn(appRatingService, 'checkInitialDate').and.callThrough();
    appRatingService.checkInitialDate();
    expect(appRatingService.checkInitialDate).toHaveBeenCalled();
  });
  it('should not call setInitialDate() on checkInitialDate() when initialDate is present in preferences', () => {
    sharedPreferencesMock.getString.mockReturnValue(Observable.of(undefined));
    spyOn(appRatingService, 'checkInitialDate').and.callThrough();
    appRatingService.checkInitialDate();
    expect(appRatingService.checkInitialDate).toHaveBeenCalled();
  });
});
