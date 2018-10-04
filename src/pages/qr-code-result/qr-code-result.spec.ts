import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import {} from 'jasmine'
import { NgZone } from "@angular/core";
import { NavController } from "ionic-angular";
import { NavParams } from "ionic-angular";
import { ContentService } from "sunbird";
import { TranslateService, TranslateModule } from "@ngx-translate/core";
import { QrCodeResultPage } from "./qr-code-result";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import { mockRes } from './../qr-code-result/qr-code-result.spec.data';
import { NavControllerMock, NavParamsMock, ContentServiceMock, TranslateServiceStub} from '../../../test-config/mocks-ionic'

describe("QrCodeResultPage", () => {
    let comp: QrCodeResultPage;
    let fixture: ComponentFixture<QrCodeResultPage>;

    beforeEach(() => {
     
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [ QrCodeResultPage ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
              
                { provide: NavController, useClass: NavControllerMock },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: ContentService, useClass: ContentServiceMock },
                { provide: TranslateService, useClass: TranslateServiceStub }
            ]
        });
        fixture = TestBed.createComponent(QrCodeResultPage);
        comp = fixture.componentInstance;
    });

        
    it("#ionViewWillEnter calls for child and parents", () => {
            const navParamsStub = TestBed.get(NavParams);
            expect(comp.ionViewWillEnter).toBeDefined();
            spyOn(comp, "getChildContents");
            // comp.content = {identifier : "ID-65656767"}
            // let searchIdentifier = true;
            //comp.ParentContent = false;
            spyOn(navParamsStub, "get").and.returnValue({identifier : "ID-65656767"});
            comp.ionViewWillEnter();
            expect(comp.getChildContents).toHaveBeenCalled();
            expect(navParamsStub.get).toHaveBeenCalled();
           // expect(comp.ionViewWillEnter).toHaveBeenCalled();
        
        });

    // it("#ionViewWillEnter should be root is undefined", () =>{
    //    expect(comp.ionViewWillEnter).toBeDefined();
    //    spyOn(comp, "ionViewWillEnter").and.returnValue(false);;
    //     comp.ionViewWillEnter();
    //    expect(comp.ionViewWillEnter).toHaveBeenCalled();
    // })



    // fit("#getChildContents makes expected calls", () => {
    //     const contentServiceStub = TestBed.get(ContentService);
    //     //expect(comp.getChildContents).toBeDefined
    //     spyOn(contentServiceStub,'getChildContents').and.callFake((req, success , error) => {
    //         return success(mockRes.data);
    //     })
    //     expect(contentServiceStub.getChildContents).toHaveBeenCalled();
    //     });


});
