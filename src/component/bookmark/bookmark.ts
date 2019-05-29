import { Component, Inject } from '@angular/core';
import { SharedPreferences } from 'sunbird-sdk';
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

  constructor(
    @Inject('SHARED_PREFERENCES') private preferences: SharedPreferences,
    public viewCtrl: ViewController) {

  }

  updateBookmarkPreference() {
    this.preferences.putString(PreferenceKey.IS_BOOKMARK_VIEWED, 'true').toPromise().then();
    this.viewCtrl.dismiss();
  }

}
