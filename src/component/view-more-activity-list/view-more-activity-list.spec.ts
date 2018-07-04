import { MyApp } from './../../app/app.component';
import { MockNgZone } from './mock-ngZone';
import { PipesModule } from './../../pipes/pipes.module';
import { PBHorizontal } from './../pbhorizontal/pb-horizontal';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { ViewMoreActivityListComponent } from './view-more-activity-list';
import { NgZone } from '@angular/core';
import { CourseUtilService } from '../../service/course-util.service';
import { NavController, Events } from 'ionic-angular';
import { } from 'jasmine';
import { IonicApp, IonicModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from "@angular/common/http";
import { ContentType, MimeType } from '../../app/app.constant';
import { FileUtil } from "sunbird";
// import { IonicStorageModule } from '@ionic/storage';
import { NavControllerMock } from 'ionic-mocks';

describe('ViewMoreActivityListComponent Component', () => {
    let component: ViewMoreActivityListComponent;
    let fixture: ComponentFixture<ViewMoreActivityListComponent>;

    //const mockNgZone = jasmine.createSpyObj('mockNgZone', ['run', 'runOutsideAngular']);
    //mockNgZone.run.and.callFake(fn => fn());

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MyApp, ViewMoreActivityListComponent, PBHorizontal],
            imports: [
                IonicModule.forRoot(ViewMoreActivityListComponent),
                PipesModule,
                HttpClientModule,
                TranslateModule
            ],
            providers: [
                CourseUtilService,
                // FileUtil,
                {provide: NavController, useFactory: () => NavControllerMock.instance()},
                // Events,
                { provide: NgZone, useValue: MockNgZone },
            ]
        })
        // .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ViewMoreActivityListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    xit('should create a valid instance of ViewMoreActivityListComponent', () => {
        // expect(component).toBe(true);
        // expect(component).toBeTruthy();
        // expect(1 + 1).toBe(2);
    });
});
