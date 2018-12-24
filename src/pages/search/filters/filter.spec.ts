// import {
//     async,
//     TestBed,
//     ComponentFixture
// } from '@angular/core/testing';
// import {
//     TranslateModule,
//     TranslateLoader
// } from '@ngx-translate/core';
// import { HttpClientModule } from '@angular/common/http';
// import { PipesModule } from './../../../pipes/pipes.module';
// import {
//     NavController, Events, IonicModule, NavParams, PopoverController
// } from 'ionic-angular';
// import {
//     NetworkMock,
// } from 'ionic-mocks';
// import {
//     FrameworkModule,
// } from 'sunbird';
// import {
//     NavMock, TranslateLoaderMock,
//     NavParamsMockNew,
//     PopoverControllerMock
// } from '../../../../test-config/mocks-ionic';
// import { } from 'jasmine';
// import { CommonUtilService } from '../../../service/common-util.service';
// import { FilterPage } from './../filters/filter';
// import { mockRes } from './../filters/filter.spec.data';
// import { ViewController } from 'ionic-angular/navigation/view-controller';
// import { mockView } from 'ionic-angular/util/mock-providers';

// describe('SearchFilter Component', () => {
//     let component: FilterPage;
//     let fixture: ComponentFixture<FilterPage>;
//     const viewControllerMock = mockView();
//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [FilterPage],
//             imports: [
//                 IonicModule.forRoot(FilterPage),
//                 TranslateModule.forRoot({
//                     loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
//                 }),
//                 PipesModule,
//                 HttpClientModule,
//                 FrameworkModule
//             ],
//             providers: [
//                 CommonUtilService,
//                 { provide: NavParams, useClass: NavParamsMockNew },
//                 { provide: NavController, useClass: NavMock },
//                 { provide: PopoverController, useFactory: () => PopoverControllerMock.instance() },
//                 { provide: ViewController, useValue: viewControllerMock }
//             ]
//         });
//     }));

//     beforeEach(() => {
//         NavParamsMockNew.setParams('filterCriteria', mockRes.filterCriteria);
//         fixture = TestBed.createComponent(FilterPage);
//         component = fixture.componentInstance;
//     });

//     it('#applyFilter should applyFilter', () => {
//         const navController = TestBed.get(NavController);
//         const events = TestBed.get(Events);
//         spyOn(navController, 'pop');
//         spyOn(events, 'publish');
//         component.filterCriteria = mockRes.filterCriteria;
//         component.applyFilter();
//         component.getFilterValues('');
//         expect(navController.pop).toHaveBeenCalled();
//         expect(events.publish).toHaveBeenCalledWith('search.applyFilter', mockRes.filterCriteria);
//     });

//     it('#openFilterOptions should applyFilter', () => {
//         const popOverController = TestBed.get(PopoverController);
//         component.openFilterOptions(mockRes.filterCriteria.facetFilters);
//         expect(popOverController.create).toHaveBeenCalled();
//     });

//     it('#getSelectedOptionCount should return selected option count', () => {
//         expect(component.getSelectedOptionCount(component.facetsFilter[0])).toBe('1 FILTER_ADDED');
//     });

//     it('#getSelectedOptionCount should return blank if nothing is selected', () => {
//         expect(component.getSelectedOptionCount(component.facetsFilter[1])).toBe('');
//     });

// });
