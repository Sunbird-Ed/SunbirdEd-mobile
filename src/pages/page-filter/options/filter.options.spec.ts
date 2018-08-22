import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { NavParams } from "ionic-angular";
import { Platform } from "ionic-angular";
import { ViewController } from "ionic-angular";
import { PageFilterOptions } from "./filter.options";
import { TranslateModule } from "@ngx-translate/core";
import {} from "jasmine";
import "rxjs/add/observable/of";
import { mockRes } from "./filter.spec.data";
import { platform } from "os";
import { PlatformMock } from "../../../../test-config/mocks-ionic";

describe("PageFilterOptions", () => {
  let comp: PageFilterOptions;
  let fixture: ComponentFixture<PageFilterOptions>;

  beforeEach(() => {
    const navParamsStub = {
      get: () => ({})
    };
    const platformStub = {
      registerBackButtonAction: () => ({
        dismiss: () => ({})
      })
    };
    const viewControllerStub = {
      dismiss: () => ({})
    };
    const translateModuleStub = {
      use: () => ({})
    };
    TestBed.configureTestingModule({
      declarations: [PageFilterOptions],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [TranslateModule.forRoot()],

      providers: [
        { provide: NavParams, useValue: navParamsStub },
        { provide: Platform, useValue: PlatformMock },
        { provide: Platform, useValue: platformStub },
        { provide: ViewController, useValue: viewControllerStub },
        { provide: TranslateModule, useValue: translateModuleStub }
      ]
    });

    //    spyOn(PageFilterOptions.prototype, "backButtonFunc");

    fixture = TestBed.createComponent(PageFilterOptions);
    comp = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(comp).toBeTruthy();
  });

  it("should dimiss popup, on click of back button", () => {
   /* spyOn(comp, "backButtonFunc");
   
    const platformStub = TestBed.get(Platform);
    const viewControllerStub = TestBed.get(ViewController);
    spyOn(platformStub, "registerBackButtonAction").and.callThrough();
    // spyOn(viewControllerStub, 'dismiss');
    expect(platformStub.registerBackButtonAction).toHaveBeenCalled();*/
    // expect(viewControllerStub.dismiss).toHaveBeenCalled();
    //expect(comp.backButtonFu1').andCallThrough();nc).toHaveBeenCalled();
  });

  it("backButtonFunc defaults to: undefined", () => {
    expect(comp.backButtonFunc).not.toEqual(undefined);
  });

  describe("isSelected", () => {
    it("should be select the value", () => {
      comp.facets = mockRes.facets;
      comp.isSelected("sam2");

      comp.facets = mockRes.facetsWithoutSelectedValue;
      comp.isSelected("sam2");
    });
  });

  describe("changeValue", () => {
    it("should be change the value", () => {
      comp.facets = mockRes.facets;
      comp.changeValue("sam2");
      comp.facets = " ";
    });
    it("should be change the value of index", () => {
      comp.facets = mockRes.facets;
      comp.changeValue("sam4");

      comp.facets = mockRes.facetsWithoutSelectedValue;
      comp.changeValue("sam4");
    });
  });

  describe("confirm", () => {
    it("makes expected calls", () => {
      const viewControllerStub: ViewController = fixture.debugElement.injector.get(
        ViewController
      );
      spyOn(viewControllerStub, "dismiss");
      comp.confirm();
      expect(viewControllerStub.dismiss).toHaveBeenCalled();
    });
  });
});
