import { NgModule } from '@angular/core';
import { ReadMoreDirective } from './read-more/read-more';
import { HideHeaderFooterDirective } from './hide-header-footer/hide-header-footer';
import { HideHeaderDirective } from './hide-header/hide-header';
import { HideTabFooterDirective } from './hide-tab-footer/hide-tab-footer';
@NgModule({
  declarations: [ReadMoreDirective,
    HideHeaderFooterDirective,
    HideHeaderDirective,
    HideHeaderDirective,
    HideTabFooterDirective],
  imports: [],
  exports: [ReadMoreDirective,
    HideHeaderFooterDirective,
    HideHeaderDirective,
    HideHeaderDirective,
    HideTabFooterDirective]
})
export class DirectivesModule {}
