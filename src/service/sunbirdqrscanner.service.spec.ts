import { TestBed, inject } from '@angular/core/testing';
import { } from 'jasmine';
import { SunbirdQRScanner } from '../pages/qrscanner/sunbirdqrscanner.service';
import { TranslateService, TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { PopoverController, DeepLinker } from 'ionic-angular';
import { App } from 'ionic-angular';
import { Config } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { ToastControllerMockNew, TranslateLoaderMock, PopoverControllerMock } from '../../test-config/mocks-ionic';
import { ConfigMock, NetworkMock } from 'ionic-mocks';
import { TelemetryService, ServiceProvider, PermissionService, ContentService, PageId, InteractSubtype,
         Environment, InteractType, ImpressionType, ImpressionSubtype, TelemetryObject, Mode } from 'sunbird';
import { Network } from '@ionic-native/network';
import { ToastController } from 'ionic-angular';
import { QRScannerResultHandler } from '../pages/qrscanner/qrscanresulthandler.service';
import { TelemetryGeneratorService } from './telemetry-generator.service';
import { CommonUtilService } from './common-util.service';
import { mockRes } from '../service/service.spec.data';
import { SubjectSubscriber } from 'rxjs/Subject';
describe('SunbirdQRScanner', () => {
  let service: SunbirdQRScanner;
  const VALID_DIALCODE_LINK = 'https://staging.open-sunbird.org/dial/SAMPLE';
  const VALID_CONTENT_LINK = 'https://staging.open-sunbird.org/play/content/SAMPLE';
  const VALID_COLLECTION_LINK = 'https://staging.open-sunbird.org/play/collection/SAMPLE';
  const VALID_COURSE_LINK = 'https://staging.open-sunbird.org/learn/course/SAMPLE';
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ],
      providers: [SunbirdQRScanner, TranslateService, App,
        Config, Platform, ServiceProvider, PermissionService, TelemetryGeneratorService, Network,
        ContentService, CommonUtilService, TelemetryService, QRScannerResultHandler,
        { provide: DeepLinker, useFactory: () => ConfigMock.instance() },
        { provide: ToastController, useFactory: () => ToastControllerMockNew.instance() },
        { provide: Network, useFactory: () => NetworkMock.instance('none') },
        { provide: PopoverController, useFactory: () => PopoverControllerMock.instance() },
      ]
    });
  });


  beforeEach(inject([SunbirdQRScanner], (sunbirdqrscanner: SunbirdQRScanner) => {
    window['qrScanner'] = {
      startScanner: (screenTitle, displayText, displayTextColor) => ({}),
      stopScanner: ({})
    };
    service = sunbirdqrscanner;
  }));


  it('#startScanner should start the scanner if permission is given', () => {
    const permissionService = TestBed.get(PermissionService);
    spyOn(service, 'generateStartEvent').and.callFake(() => {
    });
    spyOn(permissionService, 'hasPermission').and.callFake(({ }, success) => {
      return success(JSON.stringify(mockRes.hasPermissionResponse));
    });

    spyOn(permissionService, 'requestPermission').and.callFake(({ }, success) => {
      return success(JSON.stringify(mockRes.hasPermissionResponse));
    });

    spyOn<any>(service, 'startQRScanner').and.callFake(() => {
    });

    service.startScanner('SCAN_QR_CODE', false, '#0b0b0b', PageId.COURSES);

    expect(service['startQRScanner']).toHaveBeenCalled();
  });

  it('#startScanner should start the scanner after granting permission', () => {
    const permissionService = TestBed.get(PermissionService);
    const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
    spyOn(telemetryGeneratorService, 'generateStartTelemetry');
    spyOn(permissionService, 'hasPermission').and.callFake(({ }, success) => {
      return success(JSON.stringify(mockRes.reqPermissionResponse));
    });

    spyOn(permissionService, 'requestPermission').and.callFake(({ }, success) => {
      return success(JSON.stringify(mockRes.hasPermissionResponse));
    });

    spyOn<any>(service, 'startQRScanner').and.callFake(() => {
    });

    service.startScanner(PageId.COURSES);

    expect(service['startQRScanner']).toHaveBeenCalled();
  });

  it('#startScanner should show toast if permission is not granted', () => {
    const permissionService = TestBed.get(PermissionService);
    const toastController = TestBed.get(ToastController);
    spyOn(service, 'generateStartEvent').and.callFake(() => {
    });
    spyOn(permissionService, 'hasPermission').and.callFake(({ }, success) => {
      return success(JSON.stringify(mockRes.reqPermissionResponse));
    });

    spyOn(permissionService, 'requestPermission').and.callFake(({ }, success) => {
      return success(JSON.stringify(mockRes.reqPermissionResponse));
    });

    service.startScanner(PageId.COURSES);

    expect(toastController.create).toHaveBeenCalled();
  });

  it('#stopScanner should stop the scanner', () => {
    service.backButtonFunc = jasmine.createSpy();
    spyOn(window['qrScanner'], 'stopScanner');
    service.stopScanner();
    expect(window['qrScanner'].stopScanner).toHaveBeenCalled();
  });

  it('#stopScanner should stop the scanner', () => {

    service.backButtonFunc = jasmine.createSpy();
    spyOn(window['qrScanner'], 'stopScanner');
    service.stopScanner();
    expect(window['qrScanner'].stopScanner).toHaveBeenCalled();
  });

  it('#startQRScanner should generate end event if cancel event comes from QRscanner plugin', () => {
    const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);

    spyOn(telemetryGeneratorService, 'generateEndTelemetry');
    spyOn(telemetryGeneratorService, 'generateInteractTelemetry');
    spyOn(window['qrScanner'], 'startScanner').and.callFake((arg1, arg2, arg3, arg4, arg5, success) => {
      return success('cancel');
    });
    spyOn(window['qrScanner'], 'stopScanner');
    service.backButtonFunc = jasmine.createSpy();
    service['startQRScanner']('', '', '', '', false, PageId.QRCodeScanner);
    expect(telemetryGeneratorService.generateInteractTelemetry).toHaveBeenCalledWith(InteractType.OTHER,
      InteractSubtype.QRCodeScanCancelled,
      Environment.HOME,
      PageId.QRCodeScanner);
    const telemetryObject: TelemetryObject = new TelemetryObject();
    telemetryObject.id = '';
    telemetryObject.type = 'qr';
    expect(telemetryGeneratorService.generateEndTelemetry).toHaveBeenCalledWith('qr',
      Mode.PLAY,
      PageId.QRCodeScanner,
      Environment.HOME,
      telemetryObject);
  });

  it('#startQRScanner should handle dial code if QRscanner plugin returns a valid dialcode', () => {
    const qrresultHandler = TestBed.get(QRScannerResultHandler);
    spyOn(qrresultHandler, 'handleDialCode').and.callFake(() => { });
    spyOn(window['qrScanner'], 'startScanner').and.callFake((arg1, arg2, arg3, arg4, arg5, success) => {
      return success(VALID_DIALCODE_LINK);
    });
    spyOn(window['qrScanner'], 'stopScanner');
    spyOn(service, 'generateEndEvent');
    service.backButtonFunc = jasmine.createSpy();
    service['startQRScanner'](',', '', '', '', false, PageId.QRCodeScanner);
    expect(qrresultHandler.handleDialCode).toHaveBeenCalled();
  });

  it('#startQRScanner should handle content qrcode  if QRscanner plugin returns a valid content qrcode', () => {
    const qrresultHandler = TestBed.get(QRScannerResultHandler);
    const platform = TestBed.get(Platform);
    service.backButtonFunc = jasmine.createSpy();
    spyOn(platform, 'registerBackButtonAction').and.callFake((success) => {
      return success();
    });
    spyOn(qrresultHandler, 'handleContentId').and.callFake(() => { });
    spyOn(window['qrScanner'], 'startScanner').and.callFake((arg1, arg2, arg3, arg4, arg5, success) => {
      return success(VALID_CONTENT_LINK);
    });
    spyOn(window['qrScanner'], 'stopScanner');
    spyOn(service, 'generateEndEvent');
    service.backButtonFunc = jasmine.createSpy();
    service['startQRScanner'](',', '', '', '', false, PageId.QRCodeScanner);
    expect(qrresultHandler.handleContentId).toHaveBeenCalled();
  });

  it('#startQRScanner should handle invalid code if QRscanner plugin returns a valid content qrcode', () => {
    const qrresultHandler = TestBed.get(QRScannerResultHandler);
    spyOn(qrresultHandler, 'handleInvalidQRCode').and.callFake(() => { });
    spyOn(window['qrScanner'], 'startScanner').and.callFake((arg1, arg2, arg3, arg4, arg5, success) => {
      return success('INAVIDE_QR_CODE');
    });
    spyOn(window['qrScanner'], 'stopScanner');
    spyOn(service, 'showInvalidCodeAlert').and.callThrough();
    service.backButtonFunc = jasmine.createSpy();
    service['startQRScanner'](',', '', '', '', false, PageId.QRCodeScanner);
    expect(qrresultHandler.handleInvalidQRCode).toHaveBeenCalled();
    expect(service.showInvalidCodeAlert).toHaveBeenCalled();
  });

  it('#startQRScanner should handle error is returned from QRScanner plugin', () => {
    const qrresultHandler = TestBed.get(QRScannerResultHandler);
    spyOn(qrresultHandler, 'handleInvalidQRCode').and.callFake(() => { });
    spyOn(window['qrScanner'], 'startScanner').and.callFake((arg1, arg2, arg3, arg4, arg5, success, error) => {
      return error('INAVIDE_QR_CODE');
    });
    spyOn(window['qrScanner'], 'stopScanner');
    spyOn(service, 'showInvalidCodeAlert');
    service.backButtonFunc = jasmine.createSpy();
    service['startQRScanner'](',', '', '', '', false, PageId.QRCodeScanner);
    expect(window['qrScanner'].stopScanner).toHaveBeenCalled();
  });

  it('#ionViewDidLoad should generate impression event', () => {
    const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
    spyOn(telemetryGeneratorService, 'generateImpressionTelemetry');
    service.ionViewDidLoad();

    expect(telemetryGeneratorService.generateImpressionTelemetry).toHaveBeenCalledWith(ImpressionType.VIEW,
      ImpressionSubtype.QRCodeScanInitiate,
      PageId.QRCodeScanner,
      Environment.HOME);
  });

});
