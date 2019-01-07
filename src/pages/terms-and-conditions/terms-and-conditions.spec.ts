import {TermsAndConditionsPage} from '@app/pages/terms-and-conditions/terms-and-conditions';
import {
  appVersionMock,
  commonUtilServiceMock,
  domSanitizerMock,
  loadingControllerMock,
  logoutHandlerServiceMock,
  navParamsMock,
  platformMock,
  telemetryGeneratorServiceMock,
  tncUpdateHandlerServiceMock,
  translateServiceMock
} from '@app/__tests__/mocks';
import {of} from 'rxjs/observable/of';

describe('TermsAndConditionsPage', () => {
  let termsAndConditionsPage: TermsAndConditionsPage;

  beforeEach(() => {
    termsAndConditionsPage = new TermsAndConditionsPage(
      navParamsMock as any,
      platformMock as any,
      loadingControllerMock as any,
      logoutHandlerServiceMock as any,
      tncUpdateHandlerServiceMock as any,
      domSanitizerMock as any,
      commonUtilServiceMock as any,
      translateServiceMock as any,
      appVersionMock as any,
      telemetryGeneratorServiceMock as any
    );

    jest.resetAllMocks();
  });

  it('should create an instance', () => {
    expect(termsAndConditionsPage).toBeTruthy();
  });

  describe('ionViewDidLoad()', () => {
    const loading = {
      present: jest.fn(),
      dismissAll: jest.fn()
    };

    beforeEach(() => {
      loadingControllerMock.create.mockReturnValue(loading);
    });

    it('should show loadingSpinner on page load', async () => {
      // arrange
      navParamsMock.get.mockReturnValue({tncLatestVersionUrl: 'SAMPLE_URL'});

      // act
      await termsAndConditionsPage.ionViewDidLoad();

      // assert
      expect(loadingControllerMock.create).toHaveBeenCalled();
      expect(loading.present).toHaveBeenCalled();
    });

    describe('onIframeLoad()', () => {
      it('should dismiss loadingSpinner', async () => {
        // arrange
        navParamsMock.get.mockReturnValue({tncLatestVersionUrl: 'SAMPLE_URL'});

        // act
        await termsAndConditionsPage.ionViewDidLoad();
        termsAndConditionsPage.onIFrameLoad();

        expect(loading.dismissAll).toHaveBeenCalled();
      });
    });

    it('should show unchecked "confirmation" check box and disabled "accept" button', () => {
      expect(termsAndConditionsPage.shouldAcceptanceButtonEnabled).toBe(false);
    });

    it('should show set tncLatestVersionUrl passed via navParams', async () => {
      // arrange
      navParamsMock.get.mockReturnValue({tncLatestVersionUrl: 'SAMPLE_URL'});
      domSanitizerMock.bypassSecurityTrustResourceUrl.mockImplementation((arg) => arg);

      // act
      await termsAndConditionsPage.ionViewDidLoad();

      // assert
      expect(termsAndConditionsPage.tncLatestVersionUrl).toEqual('SAMPLE_URL');
    });

    describe('BackButtonAction', () => {
      it('should register showWarningToast on first back navigation', async (done) => {
        //   // arrange
        const mockBackButtonFunction = jest.fn();
        platformMock.registerBackButtonAction.mockReturnValue(mockBackButtonFunction);
        navParamsMock.get.mockReturnValue({tncLatestVersionUrl: 'SAMPLE_URL'});
        translateServiceMock.get.mockReturnValue(of('SAMPLE_MESSAGE'));
        appVersionMock.getAppName.mockResolvedValue('SOME_APP_NAME');

        // act
        await termsAndConditionsPage.ionViewDidLoad();
        platformMock.registerBackButtonAction.mock.calls[0][0].call(termsAndConditionsPage);

        // assert
        setTimeout(() => {
          expect(platformMock.registerBackButtonAction).toHaveBeenCalledWith(expect.any(Function), 10);
          expect(mockBackButtonFunction).toHaveBeenCalledTimes(1);
          expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith(expect.any(String));
          done();
        });
      });

      it('should register logout function on second back navigation', async (done) => {
        // arrange
        const mockBackButtonFunction = jest.fn();
        platformMock.registerBackButtonAction.mockReturnValue(mockBackButtonFunction);
        navParamsMock.get.mockReturnValue({tncLatestVersionUrl: 'SAMPLE_URL'});
        translateServiceMock.get.mockReturnValue(of('SAMPLE_MESSAGE'));
        appVersionMock.getAppName.mockResolvedValue('SOME_APP_NAME');

        // act
        await termsAndConditionsPage.ionViewDidLoad();
        platformMock.registerBackButtonAction.mock.calls[0][0].call(termsAndConditionsPage);

        // assert
        setTimeout(() => {
          platformMock.registerBackButtonAction.mock.calls[1][0].call(termsAndConditionsPage);

          setTimeout(() => {
            expect(platformMock.registerBackButtonAction).toHaveBeenCalledTimes(2);
            expect(mockBackButtonFunction).toHaveBeenCalledTimes(2);
            expect(logoutHandlerServiceMock.onLogout).toHaveBeenCalled();
            done();
          });
        });
      });
    });
  });

  describe('onConfirmationChange()', () => {
    it('should enable acceptance button if checked', () => {
      // act
      termsAndConditionsPage.onConfirmationChange(true);

      // assert
      expect(termsAndConditionsPage.shouldAcceptanceButtonEnabled).toBe(true);
    });

    it('should disable acceptance button if unchecked', () => {
      // act
      termsAndConditionsPage.onConfirmationChange(false);

      // assert
      expect(termsAndConditionsPage.shouldAcceptanceButtonEnabled).toBe(false);
    });
  });

  describe('onAcceptanceClick()', () => {
    it('should call onAcceptTnc() and dismissTncPage() on success', async () => {
      // arrange
      tncUpdateHandlerServiceMock.onAcceptTnc.mockResolvedValue(undefined);
      tncUpdateHandlerServiceMock.dismissTncPage.mockResolvedValue(undefined);

      // act
      await termsAndConditionsPage.onAcceptanceClick();

      // assert
      expect(tncUpdateHandlerServiceMock.onAcceptTnc).toHaveBeenCalled();
      expect(tncUpdateHandlerServiceMock.dismissTncPage).toHaveBeenCalled();
    });

    it('should call onLogout() and dismissTncPage() on error', async () => {
      // arrange
      tncUpdateHandlerServiceMock.onAcceptTnc.mockRejectedValue(undefined);
      tncUpdateHandlerServiceMock.dismissTncPage.mockResolvedValue(undefined);

      // act
      await termsAndConditionsPage.onAcceptanceClick();

      // assert
      expect(logoutHandlerServiceMock.onLogout).toHaveBeenCalled();
      expect(tncUpdateHandlerServiceMock.dismissTncPage).toHaveBeenCalled();
    });
  });
});
