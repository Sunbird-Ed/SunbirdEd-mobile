import { ExploreBooksSort } from './explore-books-sort/explore-books-sort';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResourcesPage } from './resources';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../component/components.module';
import { PlayerPageModule } from '../player/player.module';
import { DirectivesModule } from '@app/directives/directives.module';
import { ExploreBooksPageModule} from "../resources/explore-books/explore-books.module";
import { NotificationsPageModule } from '../notifications/notifications.module';

@NgModule({
  declarations: [
    ResourcesPage,
    ExploreBooksSort
  ],
  imports: [
    IonicPageModule.forChild(ResourcesPage),
    TranslateModule.forChild(),
    ComponentsModule,
    PlayerPageModule,
    DirectivesModule,
    ExploreBooksPageModule,
    NotificationsPageModule
  ],
  exports: [
    ResourcesPage
  ],
  entryComponents: [ExploreBooksSort],
  providers: []
})
export class ResourcesPageModule { }
