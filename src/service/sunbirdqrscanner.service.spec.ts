import { TestBed, inject } from "@angular/core/testing";
import { } from 'jasmine';
import { SunbirdQRScanner } from '../pages/qrscanner/sunbirdqrscanner.service';
import { TranslateService, TranslateModule, TranslateLoader, TranslateFakeLoader } from "@ngx-translate/core";
import { PopoverController, DeepLinker } from "ionic-angular";
import { App } from "ionic-angular";
import { Config } from "ionic-angular";
import { Platform } from "ionic-angular";
import { ToastControllerMockNew, TranslateLoaderMock } from "../../test-config/mocks-ionic";
import { ConfigMock, NetworkMock } from "ionic-mocks";
import { TelemetryService, ServiceProvider, PermissionService, ContentService, PageId } from "sunbird";
import { Network } from "@ionic-native/network";
import { ToastController } from "ionic-angular";
import { QRScannerResultHandler } from "../pages/qrscanner/qrscanresulthandler.service";
import { TelemetryGeneratorService } from "./telemetry-generator.service";
import { CommonUtilService } from "./common-util.service";
import { mockRes } from "../service/service.spec.data";
describe('SunbirdQRScanner', () => {
  let service: SunbirdQRScanner;
  let VALID_DIALCODE_LINK = 'https://staging.open-sunbird.org/dial/SAMPLE';
  let VALID_CONTENT_LINK = 'https://staging.open-sunbird.org/play/content/SAMPLE';
  let VALID_COLLECTION_LINK = 'https://staging.open-sunbird.org/play/collection/SAMPLE';
  let VALID_COURSE_LINK = 'https://staging.open-sunbird.org/learn/course/SAMPLE';
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ],
      providers: [SunbirdQRScanner, TranslateService, PopoverController, App,
        Config, Platform, ServiceProvider, PermissionService,TelemetryGeneratorService,Network,
        ContentService,CommonUtilService,TelemetryService,QRScannerResultHandler,
        { provide: DeepLinker, useFactory: () => ConfigMock.instance() },
        { provide: ToastController, useFactory: () => ToastControllerMockNew.instance() },
        { provide: Network, useFactory: () => NetworkMock.instance('none') },
      ]
    });
  });


  beforeEach(inject([SunbirdQRScanner], (sunbirdqrscanner: SunbirdQRScanner) => {
    service = sunbirdqrscanner;
  }));

  it('should initialize the component', () => {
       expect(service).toBeDefined();
  });

//   fit('#startScanner should start the scanner', () => {
//     const permissionService = TestBed.get(PermissionService);
//     spyOn(service,'generateStartEvent').and.callFake(() => {
//     });
//     spyOn(permissionService,'hasPermission').and.callFake(({},success) => {
//       return success(JSON.stringify(mockRes.hasPermissionResponse));
//     });
//     window['qrScanner'] = {
//       startScanner: (screenTitle, displayText, displayTextColor) => ({})
//     }
//     service.startScanner('SCAN_QR_CODE','SCAN_QR_CODE','#0000ff',PageId.COURSES);
// });
});

