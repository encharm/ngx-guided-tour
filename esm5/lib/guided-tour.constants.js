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
var Orientation = /** @class */ (function () {
    function Orientation() {
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
    return Orientation;
}());
export { Orientation };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZGVkLXRvdXIuY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWd1aWRlZC10b3VyLyIsInNvdXJjZXMiOlsibGliL2d1aWRlZC10b3VyLmNvbnN0YW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0EsOEJBcUJDOzs7Ozs7SUFuQkcsNEJBQWtCOzs7OztJQUVsQix5QkFBZTs7Ozs7SUFFZiwyQkFBZ0I7Ozs7O0lBRWhCLCtCQUF1RDs7Ozs7SUFFdkQsMEJBQW9COzs7OztJQUVwQiwrQkFBeUI7Ozs7O0lBRXpCLDRCQUFtQjs7Ozs7SUFFbkIsb0NBQTBCOzs7OztJQUUxQix1Q0FBOEI7Ozs7O0lBRTlCLG9DQUEwQjs7Ozs7QUFHOUIsZ0NBa0JDOzs7Ozs7SUFoQkcsNEJBQWU7Ozs7O0lBRWYsNEJBQWlCOzs7OztJQUVqQiwyQkFBa0I7Ozs7O0lBRWxCLGtDQUErQzs7Ozs7SUFFL0Msc0NBQThCOzs7OztJQUU5Qix1Q0FBMkI7Ozs7OztJQUszQixrREFBdUM7Ozs7O0FBRzNDLDhDQUtDOzs7Ozs7SUFIRyx3REFBa0M7Ozs7O0lBRWxDLCtDQUFxQjs7QUFHekI7SUFBQTtJQVVBLENBQUM7SUFUMEIsa0JBQU0sR0FBRyxRQUFRLENBQUM7SUFDbEIsc0JBQVUsR0FBRyxhQUFhLENBQUM7SUFDM0IsdUJBQVcsR0FBRyxjQUFjLENBQUM7SUFDN0Isa0JBQU0sR0FBRyxRQUFRLENBQUM7SUFDbEIsZ0JBQUksR0FBRyxNQUFNLENBQUM7SUFDZCxpQkFBSyxHQUFHLE9BQU8sQ0FBQztJQUNoQixlQUFHLEdBQUcsS0FBSyxDQUFDO0lBQ1osbUJBQU8sR0FBRyxVQUFVLENBQUM7SUFDckIsb0JBQVEsR0FBRyxXQUFXLENBQUM7SUFDbEQsa0JBQUM7Q0FBQSxBQVZELElBVUM7U0FWWSxXQUFXOzs7SUFDcEIsbUJBQXlDOztJQUN6Qyx1QkFBa0Q7O0lBQ2xELHdCQUFvRDs7SUFDcEQsbUJBQXlDOztJQUN6QyxpQkFBcUM7O0lBQ3JDLGtCQUF1Qzs7SUFDdkMsZ0JBQW1DOztJQUNuQyxvQkFBNEM7O0lBQzVDLHFCQUE4QyIsInNvdXJjZXNDb250ZW50IjpbIlxuZXhwb3J0IGludGVyZmFjZSBUb3VyU3RlcCB7XG4gICAgLyoqIFNlbGVjdG9yIGZvciBlbGVtZW50IHRoYXQgd2lsbCBiZSBoaWdobGlnaHRlZCAqL1xuICAgIHNlbGVjdG9yPzogc3RyaW5nO1xuICAgIC8qKiBUb3VyIHRpdGxlIHRleHQgKi9cbiAgICB0aXRsZT86IHN0cmluZztcbiAgICAvKiogVG91ciBzdGVwIHRleHQgKi9cbiAgICBjb250ZW50OiBzdHJpbmc7XG4gICAgLyoqIFdoZXJlIHRoZSB0b3VyIHN0ZXAgd2lsbCBhcHBlYXIgbmV4dCB0byB0aGUgc2VsZWN0ZWQgZWxlbWVudCAqL1xuICAgIG9yaWVudGF0aW9uPzogT3JpZW50YXRpb24gfCBPcmllbnRhdGlvbkNvbmZpZ3VyYXRpb25bXTtcbiAgICAvKiogQWN0aW9uIHRoYXQgaGFwcGVucyB3aGVuIHRoZSBzdGVwIGlzIG9wZW5lZCAqL1xuICAgIGFjdGlvbj86ICgpID0+IHZvaWQ7XG4gICAgLyoqIEFjdGlvbiB0aGF0IGhhcHBlbnMgd2hlbiB0aGUgc3RlcCBpcyBjbG9zZWQgKi9cbiAgICBjbG9zZUFjdGlvbj86ICgpID0+IHZvaWQ7XG4gICAgLyoqIFNraXBzIHRoaXMgc3RlcCwgdGhpcyBpcyBzbyB5b3UgZG8gbm90IGhhdmUgY3JlYXRlIG11bHRpcGxlIHRvdXIgY29uZmlndXJhdGlvbnMgYmFzZWQgb24gdXNlciBzZXR0aW5ncy9jb25maWd1cmF0aW9uICovXG4gICAgc2tpcFN0ZXA/OiBib29sZWFuO1xuICAgIC8qKiBBZGRzIHNvbWUgcGFkZGluZyBmb3IgdGhpbmdzIGxpa2Ugc3RpY2t5IGhlYWRlcnMgd2hlbiBzY3JvbGxpbmcgdG8gYW4gZWxlbWVudCAqL1xuICAgIHNjcm9sbEFkanVzdG1lbnQ/OiBudW1iZXI7XG4gICAgLyoqIEFkZHMgZGVmYXVsdCBwYWRkaW5nIGFyb3VuZCB0b3VyIGhpZ2hsaWdodGluZy4gRG9lcyBub3QgbmVlZCB0byBiZSB0cnVlIGZvciBoaWdobGlnaHRQYWRkaW5nIHRvIHdvcmsgKi9cbiAgICB1c2VIaWdobGlnaHRQYWRkaW5nPzogYm9vbGVhbjtcbiAgICAvKiogQWRkcyBwYWRkaW5nIGFyb3VuZCB0b3VyIGhpZ2hsaWdodGluZyBpbiBwaXhlbHMsIHRoaXMgb3ZlcndyaXRlcyB0aGUgZGVmYXVsdCBmb3IgdGhpcyBzdGVwLiBJcyBub3QgZGVwZW5kZW50IG9uIHVzZUhpZ2hsaWdodFBhZGRpbmcgYmVpbmcgdHJ1ZSAqL1xuICAgIGhpZ2hsaWdodFBhZGRpbmc/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR3VpZGVkVG91ciB7XG4gICAgLyoqIElkZW50aWZpZXIgZm9yIHRvdXIgKi9cbiAgICB0b3VySWQ6IHN0cmluZztcbiAgICAvKiogVXNlIG9yYiB0byBzdGFydCB0b3VyICovXG4gICAgdXNlT3JiPzogYm9vbGVhbjtcbiAgICAvKiogU3RlcHMgZm8gdGhlIHRvdXIgKi9cbiAgICBzdGVwczogVG91clN0ZXBbXTtcbiAgICAvKiogRnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2hlbiB0b3VyIGlzIHNraXBwZWQgKi9cbiAgICBza2lwQ2FsbGJhY2s/OiAoc3RlcFNraXBwZWRPbjogbnVtYmVyKSA9PiB2b2lkO1xuICAgIC8qKiBGdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuIHRvdXIgaXMgY29tcGxldGVkICovXG4gICAgY29tcGxldGVDYWxsYmFjaz86ICgpID0+IHZvaWQ7XG4gICAgLyoqIE1pbmltdW0gc2l6ZSBvZiBzY3JlZW4gaW4gcGl4ZWxzIGJlZm9yZSB0aGUgdG91ciBpcyBydW4sIGlmIHRoZSB0b3VyIGlzIHJlc2l6ZWQgYmVsb3cgdGhpcyB2YWx1ZSB0aGUgdXNlciB3aWxsIGJlIHRvbGQgdG8gcmVzaXplICovXG4gICAgbWluaW11bVNjcmVlblNpemU/OiBudW1iZXI7XG4gICAgLyoqXG4gICAgICogUHJldmVudHMgdGhlIHRvdXIgZnJvbSBhZHZhbmNpbmcgYnkgY2xpY2tpbmcgdGhlIGJhY2tkcm9wLlxuICAgICAqIFRoaXMgc2hvdWxkIG9ubHkgYmUgc2V0IGlmIHlvdSBhcmUgY29tcGxldGVseSBzdXJlIHlvdXIgdG91ciBpcyBkaXNwbGF5aW5nIGNvcnJlY3RseSBvbiBhbGwgc2NyZWVuIHNpemVzIG90aGVyd2lzZSBhIHVzZXIgY2FuIGdldCBzdHVjay5cbiAgICAgKi9cbiAgICBwcmV2ZW50QmFja2Ryb3BGcm9tQWR2YW5jaW5nPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPcmllbnRhdGlvbkNvbmZpZ3VyYXRpb24ge1xuICAgIC8qKiBXaGVyZSB0aGUgdG91ciBzdGVwIHdpbGwgYXBwZWFyIG5leHQgdG8gdGhlIHNlbGVjdGVkIGVsZW1lbnQgKi9cbiAgICBvcmllbnRhdGlvbkRpcmVjdGlvbjogT3JpZW50YXRpb247XG4gICAgLyoqIFdoZW4gdGhpcyBvcmllbnRhdGlvbiBjb25maWd1cmF0aW9uIHN0YXJ0cyBpbiBwaXhlbHMgKi9cbiAgICBtYXhpbXVtU2l6ZT86IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIE9yaWVudGF0aW9uIHtcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEJvdHRvbSA9ICdib3R0b20nO1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQm90dG9tTGVmdCA9ICdib3R0b20tbGVmdCc7XG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBCb3R0b21SaWdodCA9ICdib3R0b20tcmlnaHQnO1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ2VudGVyID0gJ2NlbnRlcic7XG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBMZWZ0ID0gJ2xlZnQnO1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUmlnaHQgPSAncmlnaHQnO1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVG9wID0gJ3RvcCc7XG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBUb3BMZWZ0ID0gJ3RvcC1sZWZ0JztcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFRvcFJpZ2h0ID0gJ3RvcC1yaWdodCc7XG59XG4iXX0=