import { Injectable } from "@angular/core";
import { ViewContainerRef, ViewChild, ComponentFactoryResolver } from '@angular/core';

@Injectable()
export class ComponentLoaderService {
    constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

    static getComponents(components: any[]): any[] {
        var tmp = Array();

        tmp = components;
        
        return tmp;
    }
}