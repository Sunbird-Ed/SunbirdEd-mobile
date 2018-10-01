import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { TranslateModule} from '@ngx-translate/core';
import { PrivacypolicyPage } from './privacypolicy';

describe('PrivacypolicyPage', () => {
    let comp: PrivacypolicyPage;
    let fixture: ComponentFixture<PrivacypolicyPage>;

    beforeEach(() => {
        const navControllerStub = {};
        const navParamsStub = {};
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [ PrivacypolicyPage ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: NavController, useValue: navControllerStub },
                { provide: NavParams, useValue: navParamsStub }
            ]
        });
        fixture = TestBed.createComponent(PrivacypolicyPage);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

});
