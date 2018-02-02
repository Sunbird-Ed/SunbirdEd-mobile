import { Component } from '@angular/core';

import { CoursesPage } from '../courses/courses';
import { ResourcesPage } from '../resources/resources';
import { GroupPage } from '../group/group';
import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile'
import { SamplePage } from '../sample/sample';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = CoursesPage;
  tab3Root = ResourcesPage;
  tab4Root = GroupPage;
  // tab5Root = SamplePage;
  tab5Root = ProfilePage;

  constructor() {

  }
}
