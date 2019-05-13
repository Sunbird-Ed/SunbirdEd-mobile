import { formAndFrameworkUtilServiceMock } from './../../__tests__/mocks';
import { mockRes } from '../../pages/page-filter/page.filter.spec.data';
import 'jest';
import { PageFilter } from './page.filter';
import {
    popoverCtrlMock,
    navParamsMock,
    platformMock,
    frameworkServiceMock,
    translateServiceMock,
    appGlobalServiceMock,
    eventsMock,
    telemetryGeneratorServiceMock,
    commonUtilServiceMock,
    viewControllerMock
} from '../../__tests__/mocks';
import { Profile, ProfileSource, ProfileType } from 'sunbird-sdk';

describe('PageFilter component', () => {
    let pageFilter: PageFilter;
    const profile: Profile = {
        uid: 'sample-uid',
        handle: 'Name',
        source: ProfileSource.LOCAL,
        profileType: ProfileType.TEACHER
    };

    beforeEach(() => {
        commonUtilServiceMock.getLoader.mockReturnValue({
            present: () => { },
            dismiss: () => { }
        });
        navParamsMock.get.mockImplementation((param: string) => {
            if (param === 'filter') {
                return [{
                    'name': 'Organization',
                    'translations': '{\'en\':\'Organization\'}',
                    'code': 'channel',
                    'frameworkCategory': false,
                    'index': 0,
                    'values': []
                }];
            } else {
                return 'pageId';
            }
        });
        appGlobalServiceMock.getCurrentUser.mockReturnValue({ syllabus: 'sample' });

        pageFilter = new PageFilter(popoverCtrlMock as any, viewControllerMock as any, navParamsMock as any,
            platformMock as any, frameworkServiceMock as any, translateServiceMock as any,
            appGlobalServiceMock as any, eventsMock as any, telemetryGeneratorServiceMock as any, commonUtilServiceMock as any,
            formAndFrameworkUtilServiceMock as any);
    });

    it('should set default language to en', () => {
        expect(pageFilter.selectedLanguage).toBe('en');
    });
    it('should ctreate a valid instance of PageFilter', () => {
        expect(pageFilter).toBeTruthy();
    });

    it('should dismiss the viewcontroller when cancel()', () => {
        // arrange
        spyOn(telemetryGeneratorServiceMock, 'generateInteractTelemetry').and.stub();
        // act
        pageFilter.cancel();
        // assert
        expect(viewControllerMock.dismiss).toHaveBeenCalled();

    });

    it('should dismiss the viewcontroller after applying the filter when apply()', () => {

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
        it('should initiate the filters initFilterValues()', () => {
            // arrange
            navParamsMock.get.mockImplementation((param: string) => {
                if (param === 'filter') {
                    return [];
                } else {
                    return 'pageId';
                }
            });

            appGlobalServiceMock.getCurrentUser.mockReturnValue(profile);
            // act
            pageFilter.initFilterValues();
            // assert
            expect(pageFilter.filters).toBeDefined();
        });

        it('should initiate the filters when initFilterValues()', () => {
            // arrange
            navParamsMock.get.mockImplementation((param: string) => {
                if (param === 'filter') {
                    return [];
                } else {
                    return 'pageId';
                }
            });
            appGlobalServiceMock.getCurrentUser.mockReturnValue(profile);
            // act
            pageFilter.initFilterValues();
            // assert
            expect(pageFilter.filters).toBeDefined();
        });
    });

    it('should open the filter option popup openFilterOptions()', () => {
        // arrange
        popoverCtrlMock.create.mockReturnValue({ present: jest.fn() });
        // act
        pageFilter.openFilterOptions(mockRes.filters[0]);
        // assert
        expect(popoverCtrlMock.create).toHaveBeenCalled();
    });

    it(' should give the count of added filter option when getSelectedOptionCount()', () => {
        // arrange
        commonUtilServiceMock.translateMessage.mockReturnValue('FILTER_ADDED');
        // act-assert
        expect(pageFilter.getSelectedOptionCount(mockRes.filters[0])).toBe('1 FILTER_ADDED');
    });

    it(' should give nothing when no filter is selected when getSelectedOptionCount()', () => {
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
    it('getRootOrganizations() should set the values of organization in filter array', (done) => {

        formAndFrameworkUtilServiceMock.getRootOrganizations.mockResolvedValue(['Organization List']);
        // act
        pageFilter.getRootOrganizations(0);

        setTimeout(() => {

            // assert
            expect(pageFilter.filters[0].values.length).toEqual(1);
            done();
        }, 10);

    });
    it('getRootOrganizations() should set the values of organization in filter array', (done) => {

        formAndFrameworkUtilServiceMock.getRootOrganizations.mockResolvedValue(['Organization List']);
        // act
        pageFilter.getRootOrganizations(0);

        setTimeout(() => {

            // assert
            expect(pageFilter.filters[0].values.length).toEqual(1);
            done();
        }, 10);

    });

    it('initFilterValues() should call getCourseFrameworkId when pageId is PageId.COURSE_PAGE_FILTER', (done) => {
        // arranage
        jest.resetAllMocks();
        navParamsMock.get.mockImplementation((param: string) => {
            if (param === 'filter') {
                return [{
                    'name': 'Organization',
                    'translations': '{\'en\':\'Organization\'}',
                    'code': 'channel',
                    'frameworkCategory': false,
                    'index': 0,
                    'values': []
                }];
            } else {
                return PageId.COURSE_PAGE_FILTER;
            }
        });

        commonUtilServiceMock.getLoader.mockReturnValue({
            present: () => { },
            dismiss: () => { }
        });
        appGlobalServiceMock.getCurrentUser.mockReturnValue({ syllabus: 'sample' });

        formAndFrameworkUtilServiceMock.getRootOrganizations.mockResolvedValue(['Organization List']);

        formAndFrameworkUtilServiceMock.getCourseFrameworkId.mockResolvedValue('TPD');
        pageFilter = new PageFilter(popoverCtrlMock as any, viewControllerMock as any, navParamsMock as any,
            platformMock as any, frameworkServiceMock as any, translateServiceMock as any,
            appGlobalServiceMock as any, eventsMock as any, telemetryGeneratorServiceMock as any, commonUtilServiceMock as any,
            formAndFrameworkUtilServiceMock as any);

        // act

        pageFilter.initFilterValues();

        setTimeout(() => {

            // assert
            expect(formAndFrameworkUtilServiceMock.getCourseFrameworkId).toHaveBeenCalled();
            done();
        }, 10);
    });

});
