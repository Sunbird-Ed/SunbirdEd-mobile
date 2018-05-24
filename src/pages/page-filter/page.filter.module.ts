import { NgModule } from "@angular/core";
import { PageFilter } from "./page.filter";
import { PageFilterOptions } from "./options/filter.options";
import { ComponentsModule } from "../../component/components.module";
import { TranslateModule } from "@ngx-translate/core";
import { IonicPageModule } from "ionic-angular";

@NgModule({
    declarations: [
        PageFilter,
        PageFilterOptions
    ],
    imports: [
        IonicPageModule.forChild(PageFilter),
        TranslateModule.forChild(),
        ComponentsModule
    ],
    entryComponents: [
        PageFilter,
        PageFilterOptions
    ]
})
export class PageFilterMoudule {

}