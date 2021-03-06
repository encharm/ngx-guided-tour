import { GuidedTourService } from './guided-tour.service';
import { GuidedTourComponent } from './guided-tour.component';
import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/compiler/src/core';

@NgModule({
    declarations: [
        GuidedTourComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        GuidedTourComponent
    ],
    entryComponents: [
        GuidedTourComponent
    ]
})
export class GuidedTourModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: GuidedTourModule,
            providers: [
                ErrorHandler,
                GuidedTourService
            ]
        };
    }
}
