import { SearchListComponent } from './search-list/search-list';
import { NgModule } from "@angular/core";
import { CourseCard } from "./card/course/course-card";
import { IonicPageModule } from 'ionic-angular';
import { Ionic2RatingModule } from "ionic2-rating";
import { IonicImageLoader } from "ionic-image-loader";

@NgModule({
    declarations: [
        CourseCard,
        SearchListComponent
    ],
    imports: [
        IonicPageModule.forChild(CourseCard),
        Ionic2RatingModule,
        IonicImageLoader
    ],
    exports: [
        CourseCard,
        SearchListComponent
    ]
})
export class ComponentsModule { }