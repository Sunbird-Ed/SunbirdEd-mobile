import { NgModule } from "@angular/core";
import { CourseCard } from "./card/course/course-card";
import { IonicPageModule } from 'ionic-angular';
import { Ionic2RatingModule } from "ionic2-rating";

@NgModule({
    declarations: [
        CourseCard,
    ],
    imports: [
        IonicPageModule.forChild(CourseCard),
        Ionic2RatingModule
    ],
    exports: [
        CourseCard
    ]
})
export class ComponentsModule {}