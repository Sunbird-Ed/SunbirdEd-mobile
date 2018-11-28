import { Component } from '@angular/core';
import { SharedPreferences } from 'sunbird';
import { PreferenceKey } from '../../app/app.constant';
import { ViewController } from 'ionic-angular';

/**
 * Generated class for the BookmarkComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'bookmark',
  templateUrl: 'bookmark.html'
})
export class BookmarkComponent {

  constructor(private preference: SharedPreferences, public viewCtrl: ViewController) {

  }

  updateBookmarkPreference() {
    this.preference.putString(PreferenceKey.IS_BOOKMARK_VIEWED, 'true');
    this.viewCtrl.dismiss();
  }

}
