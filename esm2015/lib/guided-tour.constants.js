/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
export function TourStep() { }
if (false) {
    /**
     * Selector for element that will be highlighted
     * @type {?|undefined}
     */
    TourStep.prototype.selector;
    /**
     * Tour title text
     * @type {?|undefined}
     */
    TourStep.prototype.title;
    /**
     * Tour step text
     * @type {?}
     */
    TourStep.prototype.content;
    /**
     * Where the tour step will appear next to the selected element
     * @type {?|undefined}
     */
    TourStep.prototype.orientation;
    /**
     * Action that happens when the step is opened
     * @type {?|undefined}
     */
    TourStep.prototype.action;
    /**
     * Action that happens when the step is closed
     * @type {?|undefined}
     */
    TourStep.prototype.closeAction;
    /**
     * Skips this step, this is so you do not have create multiple tour configurations based on user settings/configuration
     * @type {?|undefined}
     */
    TourStep.prototype.skipStep;
    /**
     * Adds some padding for things like sticky headers when scrolling to an element
     * @type {?|undefined}
     */
    TourStep.prototype.scrollAdjustment;
    /**
     * Adds default padding around tour highlighting. Does not need to be true for highlightPadding to work
     * @type {?|undefined}
     */
    TourStep.prototype.useHighlightPadding;
    /**
     * Adds padding around tour highlighting in pixels, this overwrites the default for this step. Is not dependent on useHighlightPadding being true
     * @type {?|undefined}
     */
    TourStep.prototype.highlightPadding;
}
/**
 * @record
 */
export function GuidedTour() { }
if (false) {
    /**
     * Identifier for tour
     * @type {?}
     */
    GuidedTour.prototype.tourId;
    /**
     * Use orb to start tour
     * @type {?|undefined}
     */
    GuidedTour.prototype.useOrb;
    /**
     * Steps fo the tour
     * @type {?}
     */
    GuidedTour.prototype.steps;
    /**
     * Function will be called when tour is skipped
     * @type {?|undefined}
     */
    GuidedTour.prototype.skipCallback;
    /**
     * Function will be called when tour is completed
     * @type {?|undefined}
     */
    GuidedTour.prototype.completeCallback;
    /**
     * Minimum size of screen in pixels before the tour is run, if the tour is resized below this value the user will be told to resize
     * @type {?|undefined}
     */
    GuidedTour.prototype.minimumScreenSize;
    /**
     * Prevents the tour from advancing by clicking the backdrop.
     * This should only be set if you are completely sure your tour is displaying correctly on all screen sizes otherwise a user can get stuck.
     * @type {?|undefined}
     */
    GuidedTour.prototype.preventBackdropFromAdvancing;
}
/**
 * @record
 */
export function OrientationConfiguration() { }
if (false) {
    /**
     * Where the tour step will appear next to the selected element
     * @type {?}
     */
    OrientationConfiguration.prototype.orientationDirection;
    /**
     * When this orientation configuration starts in pixels
     * @type {?|undefined}
     */
    OrientationConfiguration.prototype.maximumSize;
}
export class Orientation {
}
Orientation.Bottom = 'bottom';
Orientation.BottomLeft = 'bottom-left';
Orientation.BottomRight = 'bottom-right';
Orientation.Center = 'center';
Orientation.Left = 'left';
Orientation.Right = 'right';
Orientation.Top = 'top';
Orientation.TopLeft = 'top-left';
Orientation.TopRight = 'top-right';
if (false) {
    /** @type {?} */
    Orientation.Bottom;
    /** @type {?} */
    Orientation.BottomLeft;
    /** @type {?} */
    Orientation.BottomRight;
    /** @type {?} */
    Orientation.Center;
    /** @type {?} */
    Orientation.Left;
    /** @type {?} */
    Orientation.Right;
    /** @type {?} */
    Orientation.Top;
    /** @type {?} */
    Orientation.TopLeft;
    /** @type {?} */
    Orientation.TopRight;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZGVkLXRvdXIuY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWd1aWRlZC10b3VyLyIsInNvdXJjZXMiOlsibGliL2d1aWRlZC10b3VyLmNvbnN0YW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0EsOEJBcUJDOzs7Ozs7SUFuQkcsNEJBQWtCOzs7OztJQUVsQix5QkFBZTs7Ozs7SUFFZiwyQkFBZ0I7Ozs7O0lBRWhCLCtCQUF1RDs7Ozs7SUFFdkQsMEJBQW9COzs7OztJQUVwQiwrQkFBeUI7Ozs7O0lBRXpCLDRCQUFtQjs7Ozs7SUFFbkIsb0NBQTBCOzs7OztJQUUxQix1Q0FBOEI7Ozs7O0lBRTlCLG9DQUEwQjs7Ozs7QUFHOUIsZ0NBa0JDOzs7Ozs7SUFoQkcsNEJBQWU7Ozs7O0lBRWYsNEJBQWlCOzs7OztJQUVqQiwyQkFBa0I7Ozs7O0lBRWxCLGtDQUErQzs7Ozs7SUFFL0Msc0NBQThCOzs7OztJQUU5Qix1Q0FBMkI7Ozs7OztJQUszQixrREFBdUM7Ozs7O0FBRzNDLDhDQUtDOzs7Ozs7SUFIRyx3REFBa0M7Ozs7O0lBRWxDLCtDQUFxQjs7QUFHekIsTUFBTSxPQUFPLFdBQVc7O0FBQ0csa0JBQU0sR0FBRyxRQUFRLENBQUM7QUFDbEIsc0JBQVUsR0FBRyxhQUFhLENBQUM7QUFDM0IsdUJBQVcsR0FBRyxjQUFjLENBQUM7QUFDN0Isa0JBQU0sR0FBRyxRQUFRLENBQUM7QUFDbEIsZ0JBQUksR0FBRyxNQUFNLENBQUM7QUFDZCxpQkFBSyxHQUFHLE9BQU8sQ0FBQztBQUNoQixlQUFHLEdBQUcsS0FBSyxDQUFDO0FBQ1osbUJBQU8sR0FBRyxVQUFVLENBQUM7QUFDckIsb0JBQVEsR0FBRyxXQUFXLENBQUM7OztJQVI5QyxtQkFBeUM7O0lBQ3pDLHVCQUFrRDs7SUFDbEQsd0JBQW9EOztJQUNwRCxtQkFBeUM7O0lBQ3pDLGlCQUFxQzs7SUFDckMsa0JBQXVDOztJQUN2QyxnQkFBbUM7O0lBQ25DLG9CQUE0Qzs7SUFDNUMscUJBQThDIiwic291cmNlc0NvbnRlbnQiOlsiXG5leHBvcnQgaW50ZXJmYWNlIFRvdXJTdGVwIHtcbiAgICAvKiogU2VsZWN0b3IgZm9yIGVsZW1lbnQgdGhhdCB3aWxsIGJlIGhpZ2hsaWdodGVkICovXG4gICAgc2VsZWN0b3I/OiBzdHJpbmc7XG4gICAgLyoqIFRvdXIgdGl0bGUgdGV4dCAqL1xuICAgIHRpdGxlPzogc3RyaW5nO1xuICAgIC8qKiBUb3VyIHN0ZXAgdGV4dCAqL1xuICAgIGNvbnRlbnQ6IHN0cmluZztcbiAgICAvKiogV2hlcmUgdGhlIHRvdXIgc3RlcCB3aWxsIGFwcGVhciBuZXh0IHRvIHRoZSBzZWxlY3RlZCBlbGVtZW50ICovXG4gICAgb3JpZW50YXRpb24/OiBPcmllbnRhdGlvbiB8IE9yaWVudGF0aW9uQ29uZmlndXJhdGlvbltdO1xuICAgIC8qKiBBY3Rpb24gdGhhdCBoYXBwZW5zIHdoZW4gdGhlIHN0ZXAgaXMgb3BlbmVkICovXG4gICAgYWN0aW9uPzogKCkgPT4gdm9pZDtcbiAgICAvKiogQWN0aW9uIHRoYXQgaGFwcGVucyB3aGVuIHRoZSBzdGVwIGlzIGNsb3NlZCAqL1xuICAgIGNsb3NlQWN0aW9uPzogKCkgPT4gdm9pZDtcbiAgICAvKiogU2tpcHMgdGhpcyBzdGVwLCB0aGlzIGlzIHNvIHlvdSBkbyBub3QgaGF2ZSBjcmVhdGUgbXVsdGlwbGUgdG91ciBjb25maWd1cmF0aW9ucyBiYXNlZCBvbiB1c2VyIHNldHRpbmdzL2NvbmZpZ3VyYXRpb24gKi9cbiAgICBza2lwU3RlcD86IGJvb2xlYW47XG4gICAgLyoqIEFkZHMgc29tZSBwYWRkaW5nIGZvciB0aGluZ3MgbGlrZSBzdGlja3kgaGVhZGVycyB3aGVuIHNjcm9sbGluZyB0byBhbiBlbGVtZW50ICovXG4gICAgc2Nyb2xsQWRqdXN0bWVudD86IG51bWJlcjtcbiAgICAvKiogQWRkcyBkZWZhdWx0IHBhZGRpbmcgYXJvdW5kIHRvdXIgaGlnaGxpZ2h0aW5nLiBEb2VzIG5vdCBuZWVkIHRvIGJlIHRydWUgZm9yIGhpZ2hsaWdodFBhZGRpbmcgdG8gd29yayAqL1xuICAgIHVzZUhpZ2hsaWdodFBhZGRpbmc/OiBib29sZWFuO1xuICAgIC8qKiBBZGRzIHBhZGRpbmcgYXJvdW5kIHRvdXIgaGlnaGxpZ2h0aW5nIGluIHBpeGVscywgdGhpcyBvdmVyd3JpdGVzIHRoZSBkZWZhdWx0IGZvciB0aGlzIHN0ZXAuIElzIG5vdCBkZXBlbmRlbnQgb24gdXNlSGlnaGxpZ2h0UGFkZGluZyBiZWluZyB0cnVlICovXG4gICAgaGlnaGxpZ2h0UGFkZGluZz86IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHdWlkZWRUb3VyIHtcbiAgICAvKiogSWRlbnRpZmllciBmb3IgdG91ciAqL1xuICAgIHRvdXJJZDogc3RyaW5nO1xuICAgIC8qKiBVc2Ugb3JiIHRvIHN0YXJ0IHRvdXIgKi9cbiAgICB1c2VPcmI/OiBib29sZWFuO1xuICAgIC8qKiBTdGVwcyBmbyB0aGUgdG91ciAqL1xuICAgIHN0ZXBzOiBUb3VyU3RlcFtdO1xuICAgIC8qKiBGdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuIHRvdXIgaXMgc2tpcHBlZCAqL1xuICAgIHNraXBDYWxsYmFjaz86IChzdGVwU2tpcHBlZE9uOiBudW1iZXIpID0+IHZvaWQ7XG4gICAgLyoqIEZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW4gdG91ciBpcyBjb21wbGV0ZWQgKi9cbiAgICBjb21wbGV0ZUNhbGxiYWNrPzogKCkgPT4gdm9pZDtcbiAgICAvKiogTWluaW11bSBzaXplIG9mIHNjcmVlbiBpbiBwaXhlbHMgYmVmb3JlIHRoZSB0b3VyIGlzIHJ1biwgaWYgdGhlIHRvdXIgaXMgcmVzaXplZCBiZWxvdyB0aGlzIHZhbHVlIHRoZSB1c2VyIHdpbGwgYmUgdG9sZCB0byByZXNpemUgKi9cbiAgICBtaW5pbXVtU2NyZWVuU2l6ZT86IG51bWJlcjtcbiAgICAvKipcbiAgICAgKiBQcmV2ZW50cyB0aGUgdG91ciBmcm9tIGFkdmFuY2luZyBieSBjbGlja2luZyB0aGUgYmFja2Ryb3AuXG4gICAgICogVGhpcyBzaG91bGQgb25seSBiZSBzZXQgaWYgeW91IGFyZSBjb21wbGV0ZWx5IHN1cmUgeW91ciB0b3VyIGlzIGRpc3BsYXlpbmcgY29ycmVjdGx5IG9uIGFsbCBzY3JlZW4gc2l6ZXMgb3RoZXJ3aXNlIGEgdXNlciBjYW4gZ2V0IHN0dWNrLlxuICAgICAqL1xuICAgIHByZXZlbnRCYWNrZHJvcEZyb21BZHZhbmNpbmc/OiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9yaWVudGF0aW9uQ29uZmlndXJhdGlvbiB7XG4gICAgLyoqIFdoZXJlIHRoZSB0b3VyIHN0ZXAgd2lsbCBhcHBlYXIgbmV4dCB0byB0aGUgc2VsZWN0ZWQgZWxlbWVudCAqL1xuICAgIG9yaWVudGF0aW9uRGlyZWN0aW9uOiBPcmllbnRhdGlvbjtcbiAgICAvKiogV2hlbiB0aGlzIG9yaWVudGF0aW9uIGNvbmZpZ3VyYXRpb24gc3RhcnRzIGluIHBpeGVscyAqL1xuICAgIG1heGltdW1TaXplPzogbnVtYmVyO1xufVxuXG5leHBvcnQgY2xhc3MgT3JpZW50YXRpb24ge1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQm90dG9tID0gJ2JvdHRvbSc7XG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBCb3R0b21MZWZ0ID0gJ2JvdHRvbS1sZWZ0JztcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEJvdHRvbVJpZ2h0ID0gJ2JvdHRvbS1yaWdodCc7XG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBDZW50ZXIgPSAnY2VudGVyJztcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IExlZnQgPSAnbGVmdCc7XG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBSaWdodCA9ICdyaWdodCc7XG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBUb3AgPSAndG9wJztcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFRvcExlZnQgPSAndG9wLWxlZnQnO1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVG9wUmlnaHQgPSAndG9wLXJpZ2h0Jztcbn1cbiJdfQ==