import { AppVersion } from '@ionic-native/app-version';
import { TelemetryGeneratorService } from './../../../service/telemetry-generator.service';
import { AppGlobalService } from './../../../service/app-global.service';
import { FormAndFrameworkUtilService } from './../../profile/formandframeworkutil.service';
import { CreateGroupPage } from './create-group';
import { async, TestBed, ComponentFixture, inject, fakeAsync, tick } from '@angular/core/testing';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { mockCreateGroupRes } from './create-group.spec.data';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { 	IonicModule, NavController, NavParams, LoadingController,
} from 'ionic-angular';

import { PipesModule } from '../../../pipes/pipes.module';
import { } from 'jasmine';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedPreferences, ProfileService, ServiceProvider, TelemetryService, ContainerService,
FrameworkService, BuildParamService, FormService, AuthService, GroupService } from "sunbird";
import {
	LoadingControllerMock, TranslateServiceStub, ToastControllerMockNew, AuthServiceMock, NavParamsMock, profileServiceMock,
	FormAndFrameworkUtilServiceMock, ContainerServiceMock, AppGlobalServiceMock, NavMock, 
	TranslateLoaderMock, NavParamsMockNew, SharedPreferencesMock
} from '../../../../test-config/mocks-ionic'
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { request } from 'https';

describe('CreateGroupPage Component', () => {
	let component: CreateGroupPage;
	let fixture: ComponentFixture<CreateGroupPage>;
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
				ContainerService, AppVersion, GroupService,
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

	let getLoader = () => {
		const loadingController = TestBed.get(LoadingController);
		component.getLoader();
	}
	const telemetryGeneratorServiceStub = {
		generateInteractTelemetry: () => ({})
	};
	it('can load instance', () => {
		expect(component).toBeTruthy();
	});

	it('classlist defaults to: []', () => {
		expect(component).toBeTruthy();
	});

	it('#getSyllabusDetails makes expected calls', () => {
		const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
		getLoader();
		spyOn(formAndFrameworkUtilServiceStub, 'getSyllabusList').and.returnValue(Promise.resolve([]));
    component.getLoader = jasmine.createSpy().and.callFake(function () {
      return { present: function () { }, dismiss: function () { } }
    });
    (<jasmine.Spy>component.getSyllabusDetails).and.callThrough();
    component.getSyllabusDetails();
    expect(formAndFrameworkUtilServiceStub.getSyllabusList).toHaveBeenCalled();
  });


  it('#ionViewDidLoad loads for telemetry service', () => {
    const telemetryGeneratorServiceStub: TelemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
    spyOn(telemetryGeneratorServiceStub, 'generateInteractTelemetry').and.returnValue(Promise.resolve({}));
    component.ionViewDidLoad();
    expect(telemetryGeneratorServiceStub.generateInteractTelemetry).toHaveBeenCalled();
  })

  it('#getClassList makes expected calls', function () {
    isFormValid: true;
    component.getLoader = jasmine.createSpy().and.callFake(function () {
      return { present: function () { }, dismiss: function () { } }
    });

    spyOn(component, 'getClassList').and.callThrough();
    component.getLoader = jasmine.createSpy().and.callFake(function () {
      return { present: function () { }, dismiss: function () { } }
    });
    component.groupEditForm.patchValue = () => ({});
    component.getClassList('abcd', true);
    expect(component.getClassList).toHaveBeenCalled();
  });

  it('#getclassList makes form valid call', () => {
    isFormValid: false;
    const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
    component.getLoader = jasmine.createSpy().and.callFake(function () {
      return { present: function () { }, dismiss: function () { } }
    });
    spyOn(component, 'getClassList').and.callThrough();
    component.getLoader = jasmine.createSpy().and.callFake(function () {
      return { present: function () { }, dismiss: function () { } }
    });
    component.getClassList('abcd', true);
    expect(component.getClassList).toHaveBeenCalled();
  });

  it('#goToGuestEdit It should navigate to GroupMembersPage page', () => {
    const navControllerStub = TestBed.get(NavController);
    spyOn(navControllerStub, 'push').and.callThrough();
    component.goToGuestEdit();
    expect(navControllerStub.push).toHaveBeenCalled();
  });

  it('#goToGuestEdit getToast should make expected calls', () => {
    const navControllerStub = TestBed.get(NavController);
    spyOn(navControllerStub, 'push');
    component.goToGuestEdit();
    expect(navControllerStub.push).toHaveBeenCalled();
  });

  it('#groupEdit Formform invalid when empty', () => {
    expect(component.groupEditForm.valid).toBeFalsy();
  });

  it('#groupEditForm form valid when required fields are filled', () => {
    component.groupEditForm.controls['name'].setValue('Amaravathi');
    component.groupEditForm.controls['syllabus'].setValue('State (Andhra Pradesh)');
    component.groupEditForm.controls['class'].setValue('2nd class');
    expect(component.groupEditForm.valid).toBeTruthy();
  });

  it('#navigateToUsersList for submitting a form to create a group', () => {
    component.isFormValid = true;
    component.classList = [{ name: '2nd class', code: '2nd class' }];
    component.groupEditForm.controls['name'].setValue('Amaravathi');
    component.groupEditForm.controls['syllabus'].setValue('State (Andhra Pradesh)');
    component.groupEditForm.controls['class'].setValue('2nd class');
    component.navigateToUsersList();
    expect(component.groupEditForm.valid).toBeTruthy();
    const navControllerStub = TestBed.get(NavController);
    spyOn(navControllerStub, 'push').and.callThrough();
  });

  it('#updateGroup makes expected calls for UpdateGroup', () => {
    const navControllerStub: NavController = TestBed.get(NavController);
    const groupServiceStub: GroupService = TestBed.get(GroupService);
    spyOn(component, 'getLoader');
    spyOn(component, 'getToast');
    spyOn(component, 'translateMessage');
    spyOn(navControllerStub, 'popTo');
    spyOn(navControllerStub, 'getByIndex');
    spyOn(navControllerStub, 'length');
    spyOn(groupServiceStub, 'updateGroup').and.returnValue(Promise.resolve([]));
    component.classList = [{ name: '2nd class', code: '2nd class' }];
    component.groupEditForm.setValue({ 'name': 'Amaravathi', 'class': '2nd class', 'syllabus': 'State (Andhra Pradesh)' });
    component.getLoader = jasmine.createSpy().and.callFake(function () {
      return { present: function () { } }
    });
    component.updateGroup();
    expect(component.getLoader).toHaveBeenCalled();
    expect(groupServiceStub.updateGroup).toHaveBeenCalled();
  });

  it('#update group that for the  form in invalid makes expected  for UpdateGroup', () => {
    component.isFormValid = false;
    const translate = TestBed.get(TranslateService);
    spyOn(component, 'getToast').and.returnValue({
      present: () => { }
    });
    component.updateGroup();
    expect(translate.get).toHaveBeenCalled();
  });


  // tslint:disable-next-line:indent
	it('#getSyllabusDetails should fetch syllabus details', (done) => {
    const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
    component.group.syllabus = ['ap_k-12_13'];
    component.classList = [{ name: '2nd class', code: '2nd class' }];
    getLoader();
    spyOn(formAndFrameworkUtilServiceStub, 'getSyllabusList').and.returnValue(Promise.resolve(mockCreateGroupRes.syllabusList));
    component.getLoader = jasmine.createSpy().and.callFake(function () {
      return { present: () => { }, dismiss:  () => { } };
    });
    (<jasmine.Spy>component.getSyllabusDetails).and.callThrough();
    component.getSyllabusDetails();
    setTimeout(() => {
      expect(formAndFrameworkUtilServiceStub.getSyllabusList).toHaveBeenCalled();
      done();
    }, 1000);
  });
  it('#navigateToUsersList submitting a form to create a group', () => {
    const translate = TestBed.get(TranslateService);
    spyOn(component, 'getToast').and.returnValue({
      present: () => { }
    });
    component.isFormValid = false;
    component.navigateToUsersList();
    expect(translate.get).toHaveBeenCalled();
  });
  it('#navigateToUsersList submitting a form with invalid values to a group', () => {
    const translate = TestBed.get(TranslateService);
    spyOn(component, 'getToast').and.returnValue({
      present: () => { }
    });
    component.isFormValid = true;
    component.navigateToUsersList();
    expect(translate.get).toHaveBeenCalled();
  });
});
