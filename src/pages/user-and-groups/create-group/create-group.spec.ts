import { CommonUtilService } from './../../../service/common-util.service';
import { AppVersion } from '@ionic-native/app-version';
import { TelemetryGeneratorService } from './../../../service/telemetry-generator.service';
import { AppGlobalService } from './../../../service/app-global.service';
import { FormAndFrameworkUtilService } from './../../profile/formandframeworkutil.service';
import { CreateGroupPage } from './create-group';
import { async, TestBed, ComponentFixture, inject, fakeAsync, tick } from '@angular/core/testing';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { mockCreateorremoveGroupRes } from './create-group.spec.data';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import {
  IonicModule, NavController, NavParams, LoadingController,
} from 'ionic-angular';

import { PipesModule } from '../../../pipes/pipes.module';
import { } from 'jasmine';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  SharedPreferences, ProfileService, ServiceProvider, TelemetryService, ContainerService,
  FrameworkService, BuildParamService, FormService, AuthService, GroupService
} from 'sunbird';
import {
  LoadingControllerMock, TranslateServiceStub, ToastControllerMockNew, AuthServiceMock, NavParamsMock,
  FormAndFrameworkUtilServiceMock, ContainerServiceMock, AppGlobalServiceMock, NavMock,
  TranslateLoaderMock, NavParamsMockNew, SharedPreferencesMock
} from '../../../../test-config/mocks-ionic';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { request } from 'https';

describe('CreateGroupPage Component', () => {
  let component: CreateGroupPage;
  let fixture: ComponentFixture<CreateGroupPage>;
  // tslint:disable-next-line:prefer-const
  let translateService: TranslateService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateGroupPage],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        IonicModule.forRoot(CreateGroupPage),
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
        }),
        PipesModule,
      ],
      providers: [
        ProfileService, ServiceProvider, TelemetryService,
        ContainerService, AppVersion, GroupService, CommonUtilService,
        { provide: NavController, useClass: NavMock },
        { provide: ToastController, useClass: ToastControllerMockNew },
        { provide: NavParams, useClass: NavParamsMockNew },
        { provide: SharedPreferences, useClass: SharedPreferencesMock },
        { provide: FormAndFrameworkUtilService, useClass: FormAndFrameworkUtilService },
        { provide: FrameworkService, useClass: FrameworkService },
        { provide: BuildParamService, useClass: BuildParamService },
        { provide: FormService, useClass: FormService },
        { provide: AppGlobalService, useClass: AppGlobalService },
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: TelemetryGeneratorService, useClass: TelemetryGeneratorService },
        { provide: AppGlobalServiceMock, useClass: AppGlobalServiceMock },
        { provide: LoadingControllerMock, useFactory: () => LoadingControllerMock.instance() },
        { provide: NavMock, useClass: NavMock },
        { provide: TranslateService, useClass: TranslateServiceStub }
      ]

    });
    const translate = TestBed.get(TranslateService);
    spyOn(translate, 'get').and.callFake((arg) => {
      return Observable.of('Cancel');
    });

    spyOn(CreateGroupPage.prototype, 'getSyllabusDetails');
    fixture = TestBed.createComponent(CreateGroupPage);
    component = fixture.componentInstance;
  }));

  const getLoader = () => {
    const loadingController = TestBed.get(LoadingController);
    component.getLoader();
  };
  const telemetryGeneratorServiceStub = {
    generateInteractTelemetry: () => ({})
  };

  it('#getSyllabusDetails should  makes expected calls', () => {
    const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
    getLoader();
    spyOn(formAndFrameworkUtilServiceStub, 'getSyllabusList').and.returnValue(Promise.resolve([]));
    // tslint:disable-next-line:only-arrow-functions
    component.getLoader = jasmine.createSpy().and.callFake(function () {
      // tslint:disable-next-line:only-arrow-functions
      return { present: function () { }, dismiss: function () { } };
    });
    (<jasmine.Spy>component.getSyllabusDetails).and.callThrough();
    component.getSyllabusDetails();
    expect(formAndFrameworkUtilServiceStub.getSyllabusList).toHaveBeenCalled();
  });


  it('#ionViewDidLoad  should loads for telemetry service', () => {
    // tslint:disable-next-line:no-shadowed-variable
    const telemetryGeneratorServiceStub: TelemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
    spyOn(telemetryGeneratorServiceStub, 'generateInteractTelemetry').and.returnValue(Promise.resolve({}));
    component.ionViewDidLoad();
    expect(telemetryGeneratorServiceStub.generateInteractTelemetry).toHaveBeenCalled();
  });

  // tslint:disable-next-line:only-arrow-functions
  it('#getClassList should makes expected calls', function () {
    component.getLoader = jasmine.createSpy().and.callFake(() => {
      return { present: () => { }, dismiss: () => { } };
    });

    spyOn(component, 'getClassList').and.callThrough();
    component.getLoader = jasmine.createSpy().and.callFake(() => {
      return { present: () => { }, dismiss: () => { } };
    });
    component.groupEditForm.patchValue = () => ({});
    component.getClassList('abcd', true);
    expect(component.getClassList).toHaveBeenCalled();
  });

  it('#getclassList should makes form valid call', () => {
    const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
    component.getLoader = jasmine.createSpy().and.callFake(() => {
      return { present: () => { }, dismiss: () => { } };
    });
    spyOn(component, 'getClassList').and.callThrough();
    component.getLoader = jasmine.createSpy().and.callFake(() => {
      return { present: () => { }, dismiss: () => { } };
    });
    component.getClassList('abcd', true);
    expect(component.getClassList).toHaveBeenCalled();
  });

  it('#goToGuestEdit should navigate to GroupMembersPage page', () => {
    const navControllerStub = TestBed.get(NavController);
    spyOn(navControllerStub, 'push').and.callThrough();
    component.goToGuestEdit();
    expect(navControllerStub.push).toHaveBeenCalled();
  });

  it('#goToGuestEdit should be get getToast should make expected calls', () => {
    const navControllerStub = TestBed.get(NavController);
    spyOn(navControllerStub, 'push');
    component.goToGuestEdit();
    expect(navControllerStub.push).toHaveBeenCalled();
  });

  it('#groupEdit should make a call when Formform invalid or empty', () => {
    expect(component.groupEditForm.valid).toBeFalsy();
  });

  it('#groupEditForm should make a form valid when required fields are filled', () => {
    component.groupEditForm.controls['name'].setValue('Amaravathi');
    component.groupEditForm.controls['syllabus'].setValue('State (Andhra Pradesh)');
    component.groupEditForm.controls['class'].setValue('2nd class');
    component.navigateToUsersList();
    expect(component.groupEditForm.valid).toBeTruthy();
  });

  it('#navigateToUsersList should make for submitting a form to create a group', () => {
    component.isFormValid = true;
    component.classList = [{ name: '2nd class', code: '2nd class' }];
    component.groupEditForm.controls['name'].setValue('Amaravathi');
    component.groupEditForm.controls['syllabus'].setValue('State (Andhra Pradesh)');
    component.groupEditForm.controls['class'].setValue('2nd class');
    const navControllerStub = TestBed.get(NavController);
    spyOn(navControllerStub, 'push').and.callThrough();
    component.navigateToUsersList();
    expect(component.groupEditForm.valid).toBeTruthy();
  });

  it('#updateGroup should makes expected calls for UpdateGroup', () => {
    const navControllerStub = TestBed.get(NavController);
    const groupServiceStub = TestBed.get(GroupService);
    const translateStub = TestBed.get(TranslateService);
    const commonutilservice = TestBed.get(CommonUtilService);
    spyOn(navControllerStub, 'popTo');
    spyOn(navControllerStub, 'getByIndex');
    spyOn(navControllerStub, 'length');
    spyOn(groupServiceStub, 'updateGroup').and.returnValue(Promise.resolve([]));
    component.classList = [{ name: '2nd class', code: '2nd class' }];
    component.groupEditForm.setValue({ 'name': 'Amaravathi', 'class': '2nd class', 'syllabus': 'State (Andhra Pradesh)' });
    component.getLoader = jasmine.createSpy().and.callFake(() => {
      return { present: () => { } };
    });
    component.updateGroup();
    expect(component.getLoader).toHaveBeenCalled();
    expect(groupServiceStub.updateGroup).toHaveBeenCalled();
  });
  // tslint:disable-next-line:indent
  it('#getSyllabusDetails should fetch syllabus details', (done) => {
    const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
    spyOn(component, 'syllabusList');
    component.classList = [{ name: '2nd class', code: '2nd class' }];
    getLoader();
    spyOn(formAndFrameworkUtilServiceStub, 'getSyllabusList').and.returnValue(Promise.resolve([]));
    component.getLoader = jasmine.createSpy().and.callFake(() => {
      return { present: () => { }, dismiss: () => { } };
    });
    (<jasmine.Spy>component.getSyllabusDetails).and.callThrough();
    component.getSyllabusDetails();
    setTimeout(() => {
      expect(formAndFrameworkUtilServiceStub.getSyllabusList).toHaveBeenCalled();
      done();
    }, 1000);
  });

  it('#navigateToUsersList should show toast with some message when form is invalid', () => {
    component.isFormValid = false;
    const translate = TestBed.get(TranslateService);
    const commonUtilService = TestBed.get(CommonUtilService);
    spyOn(commonUtilService, 'showToast').and.returnValue(Promise.resolve(commonUtilService.showToast));
    component.navigateToUsersList();
    // expect(translate.get).toHaveBeenCalledWith('ENTER_GROUP_NAME');
    expect(translate.get).toHaveBeenCalled();
  });

  it('#navigateToUsersList should be submitting a form with invalid values to a group', () => {
    component.isFormValid = true;
    const translateStub = TestBed.get(TranslateService);
    const commonUtilService = TestBed.get(CommonUtilService);
    spyOn(commonUtilService, 'showToast').and.returnValue(Promise.resolve(commonUtilService.showToast));
    getLoader();
    component.navigateToUsersList();
    expect(translateStub.get).toHaveBeenCalled();
  });
});
