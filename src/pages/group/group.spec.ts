
import { async, TestBed, inject } from '@angular/core/testing';
import { NavController, IonicModule } from 'ionic-angular';
import { GroupPage } from './group';
import { NavMock } from '../../../test-config/mocks-ionic';

describe('ContentDetailsPage Component', () => {
    let component;
    let fixture;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GroupPage],
            imports: [
                IonicModule.forRoot(GroupPage),
            ],
            providers: [
                { provide: NavController, useClass: NavMock },
            ]
        })
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GroupPage);
        component = fixture.componentInstance;
    });

    it('should create a valid instance of GroupPage', () => {
        expect(component instanceof GroupPage).toBe(true);
    });
});
