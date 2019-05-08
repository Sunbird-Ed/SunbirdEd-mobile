import { NgModule } from '@angular/core';
import { ReadMoreDirective } from './read-more/read-more';
import { HideHeaderFooterDirective } from './hide-header-footer/hide-header-footer';
import { HideHeaderDirective } from './hide-header/hide-header';
import { HideTabFooterDirective } from './hide-tab-footer/hide-tab-footer';
import { HideResourseFilterDirective } from './hide-resourse-filter/hide-resourse-filter';

@NgModule({
  declarations: [ReadMoreDirective,
    HideHeaderFooterDirective,
    HideHeaderDirective,
    HideTabFooterDirective,
    HideResourseFilterDirective,
  ],
  imports: [],
  exports: [ReadMoreDirective,
    HideHeaderFooterDirective,
    HideHeaderDirective,
    HideTabFooterDirective,
    HideResourseFilterDirective,
  ]
})
export class DirectivesModule {}
