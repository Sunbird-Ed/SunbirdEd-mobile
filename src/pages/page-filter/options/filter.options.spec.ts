import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule } from "@angular/common/http";
import { Network } from '@ionic-native/network';
import { PipesModule } from './../../../pipes/pipes.module';

import {
  NavController, Events, IonicModule, NavParams, PopoverController, Platform
} from 'ionic-angular';

import {
  NetworkMock,
} from 'ionic-mocks';

import {
  AuthService, FrameworkModule,
  ContentService, TelemetryService, CourseService, ShareUtil, FrameworkService, SharedPreferences, ProfileType, FileUtil, PageId
} from "sunbird";

import {
  NavMock, TranslateLoaderMock, NavControllerMock, FormAndFrameworkUtilServiceMock, NavParamsMockNew, AppGlobalServiceMock, PopoverControllerMock
} from '../../../../test-config/mocks-ionic';

import { } from 'jasmine';
import { TelemetryGeneratorService } from '../../../service/telemetry-generator.service';
import { FormAndFrameworkUtilService } from '../../profile/formandframeworkutil.service';
import { AppVersion } from '@ionic-native/app-version';
import { CommonUtilService } from '../../../service/common-util.service';
import { mockRes } from './../../page-filter/options/filter.spec.data';
import { PageFilterOptions } from './../../page-filter/options/filter.options';
import { mockView } from 'ionic-angular/util/mock-providers';
import { ViewController } from 'ionic-angular/navigation/view-controller';

describe('PageFilterOption Component', () => {
  let component: PageFilterOptions;
  let fixture: ComponentFixture<PageFilterOptions>;
  let spyHandleBackButton;
  let viewControllerMock = mockView();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageFilterOptions],
      imports: [
        IonicModule.forRoot(PageFilterOptions),
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
        }),
        PipesModule,
        HttpClientModule,
        FrameworkModule
      ],
      providers: [
        CommonUtilService,
        { provide: NavParams, useClass: NavParamsMockNew },
        { provide: NavController, useClass: NavMock },
        { provide: PopoverController, useFactory: () => PopoverControllerMock.instance() },
        { provide: ViewController, useValue: viewControllerMock }
      ]
    })
  }));

  beforeEach(() => {
    PageFilterOptions.prototype.backButtonFunc= jasmine.createSpy();
    spyHandleBackButton = spyOn(PageFilterOptions.prototype,'handleDeviceBackButton');
    spyHandleBackButton.and.callFake(()=>{});
    NavParamsMockNew.setParams('facets', mockRes.sampleFacetWithGradeValues);
    
    fixture = TestBed.createComponent(PageFilterOptions);
    component = fixture.componentInstance;
  });

  it("#handleDeviceBackButton should dissmiss the View contoller", function () {
    const platform = TestBed.get(Platform);
    spyOn(platform, 'registerBackButtonAction').and.callFake(function (success) {
      return success();
    });
    const viewController = TestBed.get(ViewController);
    spyOn(viewController, 'dismiss');
    spyHandleBackButton.and.callThrough();
    component.backButtonFunc = jasmine.createSpy();
    component.handleDeviceBackButton();
    expect(viewController.dismiss).toHaveBeenCalled();
  });

  it("#confirm should dissmiss the View contoller", function () {
    const viewController = TestBed.get(ViewController);
    spyOn(viewController, 'dismiss');
    component.confirm();
    expect(viewController.dismiss).toHaveBeenCalled();
  });

  it("#changeValue should add to the facets in facetFilter", function () {
    component.changeValue('Class 2', 2);
    expect(component.facets.selected).toEqual(['Class 2']);
  });

  it("#changeValue should remove value from the  facets filter", function () {
    component.changeValue('Class 2', 2);
    component.changeValue('Class 2', 2);
    expect(component.facets.selected).toEqual(['Class 2']);
  });

  it("#changeValue should add value to the selectedValuesIndices", function () {
    component.facets = mockRes.sampleFacetWithContentType;
    component.changeValue('Story', 0);
    expect(component.facets.selectedValuesIndices).toEqual([0]);
  });

  it("#changeValue should remove the indicies if the same value is selected again", function () {
    component.facets = mockRes.sampleFacetWithContentType;
    component.changeValue('Story', 0);
    component.changeValue('Story', 0);
    expect(component.facets.selectedValuesIndices).toEqual([0]);
  });

  it("#isSelected should return if facet is selected or not", function () {
    component.facets = mockRes.sampleFacetWithGradeValues;
    expect(component.isSelected('Class 2')).toBeTruthy();
    component.changeValue('Class 1', 1);
    expect(component.isSelected('Class 2')).toBeTruthy();
  });
});







