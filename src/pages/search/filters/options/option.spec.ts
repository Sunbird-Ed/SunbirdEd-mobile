import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule } from "@angular/common/http";
import { PipesModule } from './../../../../pipes/pipes.module';
import {
    IonicModule, NavParams,ViewController,Platform
} from 'ionic-angular';


import {
    FrameworkModule} from "sunbird";

import {
    TranslateLoaderMock, NavParamsMockNew} from '../../../../../test-config/mocks-ionic';

import { } from 'jasmine';
import { FilterOptions } from './../../filters/options/options';
import { mockView } from "ionic-angular/util/mock-providers";
describe('SearchPage Component', () => {
    let component: FilterOptions;
    let fixture: ComponentFixture<FilterOptions>;
    let viewControllerMock = mockView();
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FilterOptions],
            imports: [
                IonicModule.forRoot(FilterOptions),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
                }),
                PipesModule,
                HttpClientModule,
                FrameworkModule
            ],
            providers: [
                { provide: NavParams, useClass: NavParamsMockNew },
                { provide: ViewController, useValue: viewControllerMock },
            ]
        })
    }));

    beforeEach(() => {
        const platform = TestBed.get(Platform);
        spyOn(platform, 'registerBackButtonAction').and.callFake(function (success) {
            return success(jasmine.anything);
        });
        fixture = TestBed.createComponent(FilterOptions);
        component = fixture.componentInstance;
    });


    it("#confirm should dissmiss the View contoller", function () {
        const viewController = TestBed.get(ViewController);
        spyOn(viewController,'dismiss');
        component.confirm();
        expect(viewController.dismiss).toHaveBeenCalled();
     });

});







