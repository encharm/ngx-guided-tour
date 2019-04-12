/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { GuidedTourService } from './guided-tour.service';
import { GuidedTourComponent } from './guided-tour.component';
import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
var GuidedTourModule = /** @class */ (function () {
    function GuidedTourModule() {
    }
    /**
     * @return {?}
     */
    GuidedTourModule.forRoot = /**
     * @return {?}
     */
    function () {
        return {
            ngModule: GuidedTourModule,
            providers: [
                ErrorHandler,
                GuidedTourService
            ]
        };
    };
    GuidedTourModule.decorators = [
        { type: NgModule, args: [{
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
                },] }
    ];
    return GuidedTourModule;
}());
export { GuidedTourModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZGVkLXRvdXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWd1aWRlZC10b3VyLyIsInNvdXJjZXMiOlsibGliL2d1aWRlZC10b3VyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDMUQsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDOUQsT0FBTyxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdkQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRy9DO0lBQUE7SUF3QkEsQ0FBQzs7OztJQVRpQix3QkFBTzs7O0lBQXJCO1FBQ0ksT0FBTztZQUNILFFBQVEsRUFBRSxnQkFBZ0I7WUFDMUIsU0FBUyxFQUFFO2dCQUNQLFlBQVk7Z0JBQ1osaUJBQWlCO2FBQ3BCO1NBQ0osQ0FBQztJQUNOLENBQUM7O2dCQXZCSixRQUFRLFNBQUM7b0JBQ04sWUFBWSxFQUFFO3dCQUNWLG1CQUFtQjtxQkFDdEI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNMLFlBQVk7cUJBQ2Y7b0JBQ0QsT0FBTyxFQUFFO3dCQUNMLG1CQUFtQjtxQkFDdEI7b0JBQ0QsZUFBZSxFQUFFO3dCQUNiLG1CQUFtQjtxQkFDdEI7aUJBQ0o7O0lBV0QsdUJBQUM7Q0FBQSxBQXhCRCxJQXdCQztTQVZZLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEd1aWRlZFRvdXJTZXJ2aWNlIH0gZnJvbSAnLi9ndWlkZWQtdG91ci5zZXJ2aWNlJztcbmltcG9ydCB7IEd1aWRlZFRvdXJDb21wb25lbnQgfSBmcm9tICcuL2d1aWRlZC10b3VyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ01vZHVsZSwgRXJyb3JIYW5kbGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTW9kdWxlV2l0aFByb3ZpZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyL3NyYy9jb3JlJztcblxuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgR3VpZGVkVG91ckNvbXBvbmVudFxuICAgIF0sXG4gICAgaW1wb3J0czogW1xuICAgICAgICBDb21tb25Nb2R1bGVcbiAgICBdLFxuICAgIGV4cG9ydHM6IFtcbiAgICAgICAgR3VpZGVkVG91ckNvbXBvbmVudFxuICAgIF0sXG4gICAgZW50cnlDb21wb25lbnRzOiBbXG4gICAgICAgIEd1aWRlZFRvdXJDb21wb25lbnRcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIEd1aWRlZFRvdXJNb2R1bGUge1xuICAgIHB1YmxpYyBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5nTW9kdWxlOiBHdWlkZWRUb3VyTW9kdWxlLFxuICAgICAgICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgICAgICAgICAgRXJyb3JIYW5kbGVyLFxuICAgICAgICAgICAgICAgIEd1aWRlZFRvdXJTZXJ2aWNlXG4gICAgICAgICAgICBdXG4gICAgICAgIH07XG4gICAgfVxufVxuIl19