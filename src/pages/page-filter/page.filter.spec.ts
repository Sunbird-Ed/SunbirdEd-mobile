import {mockRes} from '../../pages/page-filter/page.filter.spec.data';
import 'jest';
import {PageFilter} from './page.filter';
import {
  appGlobalServiceMock,
  commonUtilServiceMock,
  eventsMock,
  frameworkServiceMock,
  navParamsMock,
  platformMock,
  popoverCtrlMock,
  telemetryGeneratorServiceMock,
  translateServiceMock,
  viewControllerMock
} from '../../__tests__/mocks';
import {Profile} from 'sunbird';

describe('PageFilter component', () => {
  let pageFilter: PageFilter;

    beforeEach(() => {
      navParamsMock.get.mockImplementation((param: string) => {
        if (param === 'filter') {
          return [];
        } else {
          return 'pageId';
        }
        });

      appGlobalServiceMock.getCurrentUser.mockReturnValue({syllabus: 'sample'});

      pageFilter = new PageFilter(popoverCtrlMock as any, viewControllerMock as any, navParamsMock as any,
        platformMock as any, frameworkServiceMock as any, translateServiceMock as any,
        appGlobalServiceMock as any, eventsMock as any, telemetryGeneratorServiceMock as any, commonUtilServiceMock as any);

      jest.resetAllMocks();
    });

  it('sets default language to en', () => {
    expect(pageFilter.selectedLanguage).toBe('en');
  });
  it('should ctreate a valid instance of PageFilter', () => {
    expect(pageFilter).toBeTruthy();
    });

  it(' cancel() should dismiss the viewcontroller', () => {
    // arrange
    spyOn(telemetryGeneratorServiceMock, 'generateInteractTelemetry').and.stub();
    // act
    pageFilter.cancel();
    // assert
    expect(viewControllerMock.dismiss).toHaveBeenCalled();

    });

  it('apply should dismiss the viewcontroller after applying the filter', () => {

    // arrange
    pageFilter.callback = {
            applyFilter(filter, appliedFilter) {
            }
        };
    pageFilter.facetsFilter = mockRes.filters;
    // act
    pageFilter.apply();
    // assert
    expect(viewControllerMock.dismiss).toHaveBeenCalled();
    });

  describe('initFilterValues()', () => {
    it('initFilterValues() should initiate the filters', () => {
      // arrange
      navParamsMock.get.mockImplementation((param: string) => {
        if (param === 'filter') {
          return [];
        } else {
          return 'pageId';
        }
      });
      appGlobalServiceMock.getCurrentUser.mockReturnValue(new Profile());
      // act
      pageFilter.initFilterValues();
      // assert
      expect(pageFilter.filters).toBeDefined();
    });

    it('initFilterValues() should initiate the filters', () => {
      // arrange
      navParamsMock.get.mockImplementation((param: string) => {
        if (param === 'filter') {
          return [];
        } else {
          return 'pageId';
        }
      });
      appGlobalServiceMock.getCurrentUser.mockReturnValue(new Profile());
      // act
      pageFilter.initFilterValues();
      // assert
      expect(pageFilter.filters).toBeDefined();
    });
  });

  it('openFilterOptions() should open the filter option popup', () => {
    // arrange
    popoverCtrlMock.create.mockReturnValue({present: jest.fn()});
    // act
    pageFilter.openFilterOptions(mockRes.filters[0]);
    // assert
    expect(popoverCtrlMock.create).toHaveBeenCalled();
  });

  it('getSelectedOptionCount() should give the count of added filter option', () => {
    // arrange
    commonUtilServiceMock.translateMessage.mockReturnValue('FILTER_ADDED');
    // act-assert
    expect(pageFilter.getSelectedOptionCount(mockRes.filters[0])).toBe('1 FILTER_ADDED');
  });

  it('getSelectedOptionCount() should give nothing when no filter is selected', () => {
    // act-assert
    expect(pageFilter.getSelectedOptionCount({})).toBe('');
  });

  it('getFrameworkData() should get the data frm API', () => {
    // arrange
    spyOn(frameworkServiceMock, 'getCategoryData').and.returnValue(Promise.resolve(JSON.stringify(mockRes.categoryDataResponse)));
    pageFilter.filters = mockRes.filters;
    // act-assert
    expect(pageFilter.getFrameworkData('ap_k_1', 'gradeLevel', 0)).resolves.toEqual(pageFilter.filters[0].values);
  });

  it('getFrameworkData() should not set filters if error is thrown', () => {
    // arrange
    frameworkServiceMock.getCategoryData.mockRejectedValue('SAMPLE_ERROR');
    pageFilter.filters = mockRes.filters;
    // act-assert
    expect(pageFilter.getFrameworkData('ap_k_1', 'gradeLevel', 0)).rejects.toEqual('SAMPLE_ERROR');
  });

  it('onLanguageChange() should open the filter option popup', () => {
    // arrange
    pageFilter.facetsFilter = mockRes.filters;
    // act
    pageFilter.onLanguageChange();

  });
});
