import { CollectionDetailsEtbPage } from '@app/pages/collection-details-etb/collection-details-etb';
import { TelemetryObject, InteractType, InteractSubtype } from 'sunbird';
import { TelemetryGeneratorService } from './../../service/telemetry-generator.service';
import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DOCUMENT } from '@angular/common';

/**
 * Generated class for the TextbookCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'textbook-card',
  templateUrl: 'textbook-card.html'
})
export class TextbookCardComponent {

  text: string;
  defaultImg: string;

  @Input() content: any;
  @Input() layoutName: string;

  constructor() {
    console.log('Hello TextbookCardComponent Component');
    this.text = 'Hello World';
    this.defaultImg = 'assets/imgs/ic_launcher.png';
  }
}
