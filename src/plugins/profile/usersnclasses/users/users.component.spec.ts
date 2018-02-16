import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { IonicModule, Platform, NavController, PopoverController } from 'ionic-angular/index';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PlatformMock, StatusBarMock, SplashScreenMock }
    from '../../../../../test-config/mocks-ionic';
import { UsersComponent } from './users.component';
import {MockPopoverController, MockPopover } from "../../../../mocks";
import { ActionMenuComponent } from '../../actionmenu/menu.action.component';
import { TranslateModule } from '@ngx-translate/core';

describe('Page1', () => {
    let de: DebugElement;
    let comp: UsersComponent;
    let fixture: ComponentFixture<UsersComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UsersComponent,ActionMenuComponent],
            imports: [
                IonicModule.forRoot(UsersComponent),
                TranslateModule.forChild()
            ],
            providers: [
                NavController,
                { provide: Platform, useClass: PlatformMock },
                { provide: PopoverController, useClass: MockPopoverController }
            ]
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UsersComponent);
        comp = fixture.componentInstance;
    });

    it('should create component', () => expect(comp).toBeDefined());

    it('should show OverflowMenu', () => {
        spyOn(comp, 'showMenu');
        spyOn(MockPopoverController.prototype, 'create').and.callThrough();
        spyOn(MockPopover.prototype, 'present');
        comp.showMenu('event', { handle: 'Swayangjit', type: 'Student', avatar: 'avatar1' });
        expect(comp.showMenu).toHaveBeenCalledTimes(1);
        expect(MockPopoverController.prototype.create).not.toHaveBeenCalled();
        expect(MockPopover.prototype.present).not.toHaveBeenCalled();
    });

});
