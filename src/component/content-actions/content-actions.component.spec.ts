import { ViewControllerMock, ToastControllerMock, ToastControllerMockNew, PopoverControllerMock, TranslateServiceStub, PlatformMock } from './../../../test-config/mocks-ionic';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CollectionDetailsPage } from './../../pages/collection-details/collection-details';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { NavController, PopoverController, Events } from 'ionic-angular/index';
import { ViewController, ToastController, Platform } from 'ionic-angular';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ContentService, AuthService } from 'sunbird';
import { ReportIssuesComponent } from '../report-issues/report-issues';
import { ProfileConstants } from '../../app/app.constant';
import { AppGlobalService } from '../../service/app-global.service';
import { ContentActionsComponent } from './content-actions';

describe('Content-details', () => {
    let comp: ContentActionsComponent;
    let fixture: ComponentFixture<ContentActionsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [ContentActionsComponent],
            providers: [
                ContentService, AuthService, Events, AppGlobalService,
                { provide: ViewController, useClass: ViewControllerMock },
                { provide: ToastController, useFactory: () => ToastControllerMockNew.instance() },
                { provide: PopoverController, useClass: PopoverControllerMock },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Platform, useClass: PlatformMock }
            ]
        });

        fixture = TestBed.createComponent(ContentActionsComponent);
        comp = fixture.componentInstance;

        it('should create instance', () => {
            expect(comp).toBeTruthy();
        });
    });
});