import { Component, DebugElement } from '@angular/core';
import { TestBed, ComponentFixture, async, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActionMenuComponent } from './menu.action.component';
import { IonicModule, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateLoaderMock, NavMock, NavParamsMock, ViewControllerMock, ToastControllerMock } from '../../../../test-config/mocks-ionic';

let translateService: TranslateService;

describe('ContentDetailsPage Component', () => {
    let component;
    let fixture: ComponentFixture<ActionMenuComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ActionMenuComponent],
            imports: [
                IonicModule.forRoot(ActionMenuComponent),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
                  }),
            ],
            providers: [
                { provide: NavController, useClass: NavMock },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: ViewController, useClass: ViewControllerMock },
                { provide: ToastController, useClass: ToastControllerMock },
            ]
        })
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ActionMenuComponent);
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        inject([TranslateService], (service) => {
          translateService = service;
          translateService.use('en');
        })
      });

    it('should create a valid instance of ActionMenuComponent', () => {
        expect(component instanceof ActionMenuComponent).toBe(true);
    });
});
