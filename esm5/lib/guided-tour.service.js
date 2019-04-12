/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { debounceTime } from 'rxjs/internal/operators';
import { ErrorHandler, Injectable } from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { Orientation } from './guided-tour.constants';
import { cloneDeep } from 'lodash';
var GuidedTourService = /** @class */ (function () {
    function GuidedTourService(errorHandler) {
        var _this = this;
        this.errorHandler = errorHandler;
        this._guidedTourCurrentStepSubject = new Subject();
        this._guidedTourOrbShowingSubject = new Subject();
        this._currentTourStepIndex = 0;
        this._currentTour = null;
        this._onFirstStep = true;
        this._onLastStep = true;
        this._onResizeMessage = false;
        this.guidedTourCurrentStepStream = this._guidedTourCurrentStepSubject.asObservable();
        this.guidedTourOrbShowingStream = this._guidedTourOrbShowingSubject.asObservable();
        fromEvent(window, 'resize').pipe(debounceTime(200)).subscribe((/**
         * @return {?}
         */
        function () {
            if (_this._currentTour && _this._currentTourStepIndex > -1) {
                if (_this._currentTour.minimumScreenSize && _this._currentTour.minimumScreenSize >= window.innerWidth) {
                    _this._onResizeMessage = true;
                    _this._guidedTourCurrentStepSubject.next({
                        title: 'Please resize',
                        content: 'You have resized the tour to a size that is too small to continue. Please resize the browser to a larger size to continue the tour or close the tour.'
                    });
                }
                else {
                    _this._onResizeMessage = false;
                    _this._guidedTourCurrentStepSubject.next(_this.getPreparedTourStep(_this._currentTourStepIndex));
                }
            }
        }));
    }
    /**
     * @return {?}
     */
    GuidedTourService.prototype.nextStep = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this._currentTour.steps[this._currentTourStepIndex].closeAction) {
            this._currentTour.steps[this._currentTourStepIndex].closeAction();
        }
        if (this._currentTour.steps[this._currentTourStepIndex + 1]) {
            this._currentTourStepIndex++;
            this._setFirstAndLast();
            if (this._currentTour.steps[this._currentTourStepIndex].action) {
                this._currentTour.steps[this._currentTourStepIndex].action();
                // Usually an action is opening something so we need to give it time to render.
                setTimeout((/**
                 * @return {?}
                 */
                function () {
                    if (_this._checkSelectorValidity()) {
                        _this._guidedTourCurrentStepSubject.next(_this.getPreparedTourStep(_this._currentTourStepIndex));
                    }
                    else {
                        _this.nextStep();
                    }
                }));
            }
            else {
                if (this._checkSelectorValidity()) {
                    this._guidedTourCurrentStepSubject.next(this.getPreparedTourStep(this._currentTourStepIndex));
                }
                else {
                    this.nextStep();
                }
            }
        }
        else {
            if (this._currentTour.completeCallback) {
                this._currentTour.completeCallback();
            }
            this.resetTour();
        }
    };
    /**
     * @return {?}
     */
    GuidedTourService.prototype.backStep = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this._currentTour.steps[this._currentTourStepIndex].closeAction) {
            this._currentTour.steps[this._currentTourStepIndex].closeAction();
        }
        if (this._currentTour.steps[this._currentTourStepIndex - 1]) {
            this._currentTourStepIndex--;
            this._setFirstAndLast();
            if (this._currentTour.steps[this._currentTourStepIndex].action) {
                this._currentTour.steps[this._currentTourStepIndex].action();
                setTimeout((/**
                 * @return {?}
                 */
                function () {
                    if (_this._checkSelectorValidity()) {
                        _this._guidedTourCurrentStepSubject.next(_this.getPreparedTourStep(_this._currentTourStepIndex));
                    }
                    else {
                        _this.backStep();
                    }
                }));
            }
            else {
                if (this._checkSelectorValidity()) {
                    this._guidedTourCurrentStepSubject.next(this.getPreparedTourStep(this._currentTourStepIndex));
                }
                else {
                    this.backStep();
                }
            }
        }
        else {
            this.resetTour();
        }
    };
    /**
     * @return {?}
     */
    GuidedTourService.prototype.skipTour = /**
     * @return {?}
     */
    function () {
        if (this._currentTour.skipCallback) {
            this._currentTour.skipCallback(this._currentTourStepIndex);
        }
        this.resetTour();
    };
    /**
     * @return {?}
     */
    GuidedTourService.prototype.resetTour = /**
     * @return {?}
     */
    function () {
        document.body.classList.remove('tour-open');
        this._currentTour = null;
        this._currentTourStepIndex = 0;
        this._guidedTourCurrentStepSubject.next(null);
    };
    /**
     * @param {?} tour
     * @return {?}
     */
    GuidedTourService.prototype.startTour = /**
     * @param {?} tour
     * @return {?}
     */
    function (tour) {
        this._currentTour = cloneDeep(tour);
        this._currentTour.steps = this._currentTour.steps.filter((/**
         * @param {?} step
         * @return {?}
         */
        function (step) { return !step.skipStep; }));
        this._currentTourStepIndex = 0;
        this._setFirstAndLast();
        this._guidedTourOrbShowingSubject.next(this._currentTour.useOrb);
        if (this._currentTour.steps.length > 0
            && (!this._currentTour.minimumScreenSize
                || (window.innerWidth >= this._currentTour.minimumScreenSize))) {
            if (!this._currentTour.useOrb) {
                document.body.classList.add('tour-open');
            }
            if (this._currentTour.steps[this._currentTourStepIndex].action) {
                this._currentTour.steps[this._currentTourStepIndex].action();
            }
            if (this._checkSelectorValidity()) {
                this._guidedTourCurrentStepSubject.next(this.getPreparedTourStep(this._currentTourStepIndex));
            }
            else {
                this.nextStep();
            }
        }
    };
    /**
     * @return {?}
     */
    GuidedTourService.prototype.activateOrb = /**
     * @return {?}
     */
    function () {
        this._guidedTourOrbShowingSubject.next(false);
        document.body.classList.add('tour-open');
    };
    /**
     * @private
     * @return {?}
     */
    GuidedTourService.prototype._setFirstAndLast = /**
     * @private
     * @return {?}
     */
    function () {
        this._onLastStep = (this._currentTour.steps.length - 1) === this._currentTourStepIndex;
        this._onFirstStep = this._currentTourStepIndex === 0;
    };
    /**
     * @private
     * @return {?}
     */
    GuidedTourService.prototype._checkSelectorValidity = /**
     * @private
     * @return {?}
     */
    function () {
        if (this._currentTour.steps[this._currentTourStepIndex].selector) {
            /** @type {?} */
            var selectedElement = document.querySelector(this._currentTour.steps[this._currentTourStepIndex].selector);
            if (!selectedElement) {
                this.errorHandler.handleError(
                // If error handler is configured this should not block the browser.
                new Error("Error finding selector " + this._currentTour.steps[this._currentTourStepIndex].selector + " on step " + (this._currentTourStepIndex + 1) + " during guided tour: " + this._currentTour.tourId));
                return false;
            }
        }
        return true;
    };
    Object.defineProperty(GuidedTourService.prototype, "onLastStep", {
        get: /**
         * @return {?}
         */
        function () {
            return this._onLastStep;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourService.prototype, "onFirstStep", {
        get: /**
         * @return {?}
         */
        function () {
            return this._onFirstStep;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourService.prototype, "onResizeMessage", {
        get: /**
         * @return {?}
         */
        function () {
            return this._onResizeMessage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourService.prototype, "currentTourStepDisplay", {
        get: /**
         * @return {?}
         */
        function () {
            return this._currentTourStepIndex + 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourService.prototype, "currentTourStepCount", {
        get: /**
         * @return {?}
         */
        function () {
            return this._currentTour && this._currentTour.steps ? this._currentTour.steps.length : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourService.prototype, "preventBackdropFromAdvancing", {
        get: /**
         * @return {?}
         */
        function () {
            return this._currentTour && this._currentTour.preventBackdropFromAdvancing;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     * @param {?} index
     * @return {?}
     */
    GuidedTourService.prototype.getPreparedTourStep = /**
     * @private
     * @param {?} index
     * @return {?}
     */
    function (index) {
        return this.setTourOrientation(this._currentTour.steps[index]);
    };
    /**
     * @private
     * @param {?} step
     * @return {?}
     */
    GuidedTourService.prototype.setTourOrientation = /**
     * @private
     * @param {?} step
     * @return {?}
     */
    function (step) {
        /** @type {?} */
        var convertedStep = cloneDeep(step);
        if (convertedStep.orientation
            && !(typeof convertedStep.orientation === 'string')
            && ((/** @type {?} */ (convertedStep.orientation))).length) {
            ((/** @type {?} */ (convertedStep.orientation))).sort((/**
             * @param {?} a
             * @param {?} b
             * @return {?}
             */
            function (a, b) {
                if (!b.maximumSize) {
                    return 1;
                }
                if (!a.maximumSize) {
                    return -1;
                }
                return b.maximumSize - a.maximumSize;
            }));
            /** @type {?} */
            var currentOrientation_1 = Orientation.Top;
            ((/** @type {?} */ (convertedStep.orientation))).forEach((/**
             * @param {?} orientationConfig
             * @return {?}
             */
            function (orientationConfig) {
                if (!orientationConfig.maximumSize || window.innerWidth <= orientationConfig.maximumSize) {
                    currentOrientation_1 = orientationConfig.orientationDirection;
                }
            }));
            convertedStep.orientation = currentOrientation_1;
        }
        return convertedStep;
    };
    GuidedTourService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    GuidedTourService.ctorParameters = function () { return [
        { type: ErrorHandler }
    ]; };
    return GuidedTourService;
}());
export { GuidedTourService };
if (false) {
    /** @type {?} */
    GuidedTourService.prototype.guidedTourCurrentStepStream;
    /** @type {?} */
    GuidedTourService.prototype.guidedTourOrbShowingStream;
    /**
     * @type {?}
     * @private
     */
    GuidedTourService.prototype._guidedTourCurrentStepSubject;
    /**
     * @type {?}
     * @private
     */
    GuidedTourService.prototype._guidedTourOrbShowingSubject;
    /**
     * @type {?}
     * @private
     */
    GuidedTourService.prototype._currentTourStepIndex;
    /**
     * @type {?}
     * @private
     */
    GuidedTourService.prototype._currentTour;
    /**
     * @type {?}
     * @private
     */
    GuidedTourService.prototype._onFirstStep;
    /**
     * @type {?}
     * @private
     */
    GuidedTourService.prototype._onLastStep;
    /**
     * @type {?}
     * @private
     */
    GuidedTourService.prototype._onResizeMessage;
    /** @type {?} */
    GuidedTourService.prototype.errorHandler;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZGVkLXRvdXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1ndWlkZWQtdG91ci8iLCJzb3VyY2VzIjpbImxpYi9ndWlkZWQtdG91ci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDdkQsT0FBTyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekQsT0FBTyxFQUFjLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdEQsT0FBTyxFQUF3QixXQUFXLEVBQTRCLE1BQU0seUJBQXlCLENBQUM7QUFDdEcsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUVuQztJQWFJLDJCQUNXLFlBQTBCO1FBRHJDLGlCQW9CQztRQW5CVSxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQVQ3QixrQ0FBNkIsR0FBRyxJQUFJLE9BQU8sRUFBWSxDQUFDO1FBQ3hELGlDQUE0QixHQUFHLElBQUksT0FBTyxFQUFXLENBQUM7UUFDdEQsMEJBQXFCLEdBQUcsQ0FBQyxDQUFDO1FBQzFCLGlCQUFZLEdBQWUsSUFBSSxDQUFDO1FBQ2hDLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBQ25CLHFCQUFnQixHQUFHLEtBQUssQ0FBQztRQUs3QixJQUFJLENBQUMsMkJBQTJCLEdBQUcsSUFBSSxDQUFDLDZCQUE2QixDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3JGLElBQUksQ0FBQywwQkFBMEIsR0FBRyxJQUFJLENBQUMsNEJBQTRCLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFbkYsU0FBUyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsU0FBUzs7O1FBQUM7WUFDMUQsSUFBSSxLQUFJLENBQUMs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LENBQUM7U0FDbEQ7UUFDRCxPQUFPLGFBQWEsQ0FBQztJQUN6QixDQUFDOztnQkF2TkosVUFBVTs7OztnQkFMRixZQUFZOztJQTZOckIsd0JBQUM7Q0FBQSxBQXhORCxJQXdOQztTQXZOWSxpQkFBaUI7OztJQUMxQix3REFBeUQ7O0lBQ3pELHVEQUF1RDs7Ozs7SUFFdkQsMERBQWdFOzs7OztJQUNoRSx5REFBOEQ7Ozs7O0lBQzlELGtEQUFrQzs7Ozs7SUFDbEMseUNBQXdDOzs7OztJQUN4Qyx5Q0FBNEI7Ozs7O0lBQzVCLHdDQUEyQjs7Ozs7SUFDM0IsNkNBQWlDOztJQUc3Qix5Q0FBaUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkZWJvdW5jZVRpbWUgfSBmcm9tICdyeGpzL2ludGVybmFsL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBFcnJvckhhbmRsZXIsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QsIGZyb21FdmVudCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgR3VpZGVkVG91ciwgVG91clN0ZXAsIE9yaWVudGF0aW9uLCBPcmllbnRhdGlvbkNvbmZpZ3VyYXRpb24gfSBmcm9tICcuL2d1aWRlZC10b3VyLmNvbnN0YW50cyc7XG5pbXBvcnQgeyBjbG9uZURlZXAgfSBmcm9tICdsb2Rhc2gnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgR3VpZGVkVG91clNlcnZpY2Uge1xuICAgIHB1YmxpYyBndWlkZWRUb3VyQ3VycmVudFN0ZXBTdHJlYW06IE9ic2VydmFibGU8VG91clN0ZXA+O1xuICAgIHB1YmxpYyBndWlkZWRUb3VyT3JiU2hvd2luZ1N0cmVhbTogT2JzZXJ2YWJsZTxib29sZWFuPjtcblxuICAgIHByaXZhdGUgX2d1aWRlZFRvdXJDdXJyZW50U3RlcFN1YmplY3QgPSBuZXcgU3ViamVjdDxUb3VyU3RlcD4oKTtcbiAgICBwcml2YXRlIF9ndWlkZWRUb3VyT3JiU2hvd2luZ1N1YmplY3QgPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuICAgIHByaXZhdGUgX2N1cnJlbnRUb3VyU3RlcEluZGV4ID0gMDtcbiAgICBwcml2YXRlIF9jdXJyZW50VG91cjogR3VpZGVkVG91ciA9IG51bGw7XG4gICAgcHJpdmF0ZSBfb25GaXJzdFN0ZXAgPSB0cnVlO1xuICAgIHByaXZhdGUgX29uTGFzdFN0ZXAgPSB0cnVlO1xuICAgIHByaXZhdGUgX29uUmVzaXplTWVzc2FnZSA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyBlcnJvckhhbmRsZXI6IEVycm9ySGFuZGxlclxuICAgICkge1xuICAgICAgICB0aGlzLmd1aWRlZFRvdXJDdXJyZW50U3RlcFN0cmVhbSA9IHRoaXMuX2d1aWRlZFRvdXJDdXJyZW50U3RlcFN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG4gICAgICAgIHRoaXMuZ3VpZGVkVG91ck9yYlNob3dpbmdTdHJlYW0gPSB0aGlzLl9ndWlkZWRUb3VyT3JiU2hvd2luZ1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG5cbiAgICAgICAgZnJvbUV2ZW50KHdpbmRvdywgJ3Jlc2l6ZScpLnBpcGUoZGVib3VuY2VUaW1lKDIwMCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5fY3VycmVudFRvdXIgJiYgdGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jdXJyZW50VG91ci5taW5pbXVtU2NyZWVuU2l6ZSAmJiB0aGlzLl9jdXJyZW50VG91ci5taW5pbXVtU2NyZWVuU2l6ZSA+PSB3aW5kb3cuaW5uZXJXaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vblJlc2l6ZU1lc3NhZ2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ndWlkZWRUb3VyQ3VycmVudFN0ZXBTdWJqZWN0Lm5leHQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdQbGVhc2UgcmVzaXplJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICdZb3UgaGF2ZSByZXNpemVkIHRoZSB0b3VyIHRvIGEgc2l6ZSB0aGF0IGlzIHRvbyBzbWFsbCB0byBjb250aW51ZS4gUGxlYXNlIHJlc2l6ZSB0aGUgYnJvd3NlciB0byBhIGxhcmdlciBzaXplIHRvIGNvbnRpbnVlIHRoZSB0b3VyIG9yIGNsb3NlIHRoZSB0b3VyLidcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25SZXNpemVNZXNzYWdlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2d1aWRlZFRvdXJDdXJyZW50U3RlcFN1YmplY3QubmV4dCh0aGlzLmdldFByZXBhcmVkVG91clN0ZXAodGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBuZXh0U3RlcCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRUb3VyLnN0ZXBzW3RoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4XS5jbG9zZUFjdGlvbikge1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudFRvdXIuc3RlcHNbdGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXhdLmNsb3NlQWN0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRUb3VyLnN0ZXBzW3RoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4ICsgMV0pIHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4Kys7XG4gICAgICAgICAgICB0aGlzLl9zZXRGaXJzdEFuZExhc3QoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jdXJyZW50VG91ci5zdGVwc1t0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleF0uYWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudFRvdXIuc3RlcHNbdGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXhdLmFjdGlvbigpO1xuICAgICAgICAgICAgICAgIC8vIFVzdWFsbHkgYW4gYWN0aW9uIGlzIG9wZW5pbmcgc29tZXRoaW5nIHNvIHdlIG5lZWQgdG8gZ2l2ZSBpdCB0aW1lIHRvIHJlbmRlci5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2NoZWNrU2VsZWN0b3JWYWxpZGl0eSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9ndWlkZWRUb3VyQ3VycmVudFN0ZXBTdWJqZWN0Lm5leHQodGhpcy5nZXRQcmVwYXJlZFRvdXJTdGVwKHRoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4KSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHRTdGVwKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2NoZWNrU2VsZWN0b3JWYWxpZGl0eSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2d1aWRlZFRvdXJDdXJyZW50U3RlcFN1YmplY3QubmV4dCh0aGlzLmdldFByZXBhcmVkVG91clN0ZXAodGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXgpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHRTdGVwKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRUb3VyLmNvbXBsZXRlQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50VG91ci5jb21wbGV0ZUNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnJlc2V0VG91cigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGJhY2tTdGVwKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5fY3VycmVudFRvdXIuc3RlcHNbdGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXhdLmNsb3NlQWN0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50VG91ci5zdGVwc1t0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleF0uY2xvc2VBY3Rpb24oKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fY3VycmVudFRvdXIuc3RlcHNbdGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXggLSAxXSkge1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXgtLTtcbiAgICAgICAgICAgIHRoaXMuX3NldEZpcnN0QW5kTGFzdCgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRUb3VyLnN0ZXBzW3RoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4XS5hY3Rpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50VG91ci5zdGVwc1t0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleF0uYWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jaGVja1NlbGVjdG9yVmFsaWRpdHkoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ3VpZGVkVG91ckN1cnJlbnRTdGVwU3ViamVjdC5uZXh0KHRoaXMuZ2V0UHJlcGFyZWRUb3VyU3RlcCh0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleCkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5iYWNrU3RlcCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jaGVja1NlbGVjdG9yVmFsaWRpdHkoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ndWlkZWRUb3VyQ3VycmVudFN0ZXBTdWJqZWN0Lm5leHQodGhpcy5nZXRQcmVwYXJlZFRvdXJTdGVwKHRoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4KSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iYWNrU3RlcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXRUb3VyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc2tpcFRvdXIoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLl9jdXJyZW50VG91ci5za2lwQ2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRUb3VyLnNraXBDYWxsYmFjayh0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZXNldFRvdXIoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVzZXRUb3VyKCk6IHZvaWQge1xuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3RvdXItb3BlbicpO1xuICAgICAgICB0aGlzLl9jdXJyZW50VG91ciA9IG51bGw7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4ID0gMDtcbiAgICAgICAgdGhpcy5fZ3VpZGVkVG91ckN1cnJlbnRTdGVwU3ViamVjdC5uZXh0KG51bGwpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGFydFRvdXIodG91cjogR3VpZGVkVG91cik6IHZvaWQge1xuICAgICAgICB0aGlzLl9jdXJyZW50VG91ciA9IGNsb25lRGVlcCh0b3VyKTtcbiAgICAgICAgdGhpcy5fY3VycmVudFRvdXIuc3RlcHMgPSB0aGlzLl9jdXJyZW50VG91ci5zdGVwcy5maWx0ZXIoc3RlcCA9PiAhc3RlcC5za2lwU3RlcCk7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4ID0gMDtcbiAgICAgICAgdGhpcy5fc2V0Rmlyc3RBbmRMYXN0KCk7XG4gICAgICAgIHRoaXMuX2d1aWRlZFRvdXJPcmJTaG93aW5nU3ViamVjdC5uZXh0KHRoaXMuX2N1cnJlbnRUb3VyLnVzZU9yYik7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRUb3VyLnN0ZXBzLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICYmICghdGhpcy5fY3VycmVudFRvdXIubWluaW11bVNjcmVlblNpemVcbiAgICAgICAgICAgICAgICB8fCAod2luZG93LmlubmVyV2lkdGggPj0gdGhpcy5fY3VycmVudFRvdXIubWluaW11bVNjcmVlblNpemUpKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fY3VycmVudFRvdXIudXNlT3JiKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCd0b3VyLW9wZW4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl9jdXJyZW50VG91ci5zdGVwc1t0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleF0uYWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudFRvdXIuc3RlcHNbdGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXhdLmFjdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuX2NoZWNrU2VsZWN0b3JWYWxpZGl0eSgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZ3VpZGVkVG91ckN1cnJlbnRTdGVwU3ViamVjdC5uZXh0KHRoaXMuZ2V0UHJlcGFyZWRUb3VyU3RlcCh0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHRTdGVwKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYWN0aXZhdGVPcmIoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX2d1aWRlZFRvdXJPcmJTaG93aW5nU3ViamVjdC5uZXh0KGZhbHNlKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCd0b3VyLW9wZW4nKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9zZXRGaXJzdEFuZExhc3QoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX29uTGFzdFN0ZXAgPSAodGhpcy5fY3VycmVudFRvdXIuc3RlcHMubGVuZ3RoIC0gMSkgPT09IHRoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4O1xuICAgICAgICB0aGlzLl9vbkZpcnN0U3RlcCA9IHRoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4ID09PSAwO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2NoZWNrU2VsZWN0b3JWYWxpZGl0eSgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRUb3VyLnN0ZXBzW3RoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4XS5zZWxlY3Rvcikge1xuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLl9jdXJyZW50VG91ci5zdGVwc1t0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleF0uc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKCFzZWxlY3RlZEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9ySGFuZGxlci5oYW5kbGVFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgZXJyb3IgaGFuZGxlciBpcyBjb25maWd1cmVkIHRoaXMgc2hvdWxkIG5vdCBibG9jayB0aGUgYnJvd3Nlci5cbiAgICAgICAgICAgICAgICAgICAgbmV3IEVycm9yKGBFcnJvciBmaW5kaW5nIHNlbGVjdG9yICR7dGhpcy5fY3VycmVudFRvdXIuc3RlcHNbdGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXhdLnNlbGVjdG9yfSBvbiBzdGVwICR7dGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXggKyAxfSBkdXJpbmcgZ3VpZGVkIHRvdXI6ICR7dGhpcy5fY3VycmVudFRvdXIudG91cklkfWApXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBvbkxhc3RTdGVwKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fb25MYXN0U3RlcDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IG9uRmlyc3RTdGVwKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fb25GaXJzdFN0ZXA7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBvblJlc2l6ZU1lc3NhZ2UoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vblJlc2l6ZU1lc3NhZ2U7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBjdXJyZW50VG91clN0ZXBEaXNwbGF5KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleCArIDE7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBjdXJyZW50VG91clN0ZXBDb3VudCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fY3VycmVudFRvdXIgJiYgdGhpcy5fY3VycmVudFRvdXIuc3RlcHMgPyB0aGlzLl9jdXJyZW50VG91ci5zdGVwcy5sZW5ndGggOiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgcHJldmVudEJhY2tkcm9wRnJvbUFkdmFuY2luZygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRUb3VyICYmIHRoaXMuX2N1cnJlbnRUb3VyLnByZXZlbnRCYWNrZHJvcEZyb21BZHZhbmNpbmc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRQcmVwYXJlZFRvdXJTdGVwKGluZGV4OiBudW1iZXIpOiBUb3VyU3RlcCB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldFRvdXJPcmllbnRhdGlvbih0aGlzLl9jdXJyZW50VG91ci5zdGVwc1tpbmRleF0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0VG91ck9yaWVudGF0aW9uKHN0ZXA6IFRvdXJTdGVwKTogVG91clN0ZXAge1xuICAgICAgICBjb25zdCBjb252ZXJ0ZWRTdGVwID0gY2xvbmVEZWVwKHN0ZXApO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICBjb252ZXJ0ZWRTdGVwLm9yaWVudGF0aW9uXG4gICAgICAgICAgICAmJiAhKHR5cGVvZiBjb252ZXJ0ZWRTdGVwLm9yaWVudGF0aW9uID09PSAnc3RyaW5nJylcbiAgICAgICAgICAgICYmIChjb252ZXJ0ZWRTdGVwLm9yaWVudGF0aW9uIGFzIE9yaWVudGF0aW9uQ29uZmlndXJhdGlvbltdKS5sZW5ndGhcbiAgICAgICAgKSB7XG4gICAgICAgICAgICAoY29udmVydGVkU3RlcC5vcmllbnRhdGlvbiBhcyBPcmllbnRhdGlvbkNvbmZpZ3VyYXRpb25bXSkuc29ydCgoYTogT3JpZW50YXRpb25Db25maWd1cmF0aW9uLCBiOiBPcmllbnRhdGlvbkNvbmZpZ3VyYXRpb24pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIWIubWF4aW11bVNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghYS5tYXhpbXVtU2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBiLm1heGltdW1TaXplIC0gYS5tYXhpbXVtU2l6ZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBsZXQgY3VycmVudE9yaWVudGF0aW9uOiBPcmllbnRhdGlvbiA9IE9yaWVudGF0aW9uLlRvcDtcbiAgICAgICAgICAgIChjb252ZXJ0ZWRTdGVwLm9yaWVudGF0aW9uIGFzIE9yaWVudGF0aW9uQ29uZmlndXJhdGlvbltdKS5mb3JFYWNoKFxuICAgICAgICAgICAgICAgIChvcmllbnRhdGlvbkNvbmZpZzogT3JpZW50YXRpb25Db25maWd1cmF0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghb3JpZW50YXRpb25Db25maWcubWF4aW11bVNpemUgfHwgd2luZG93LmlubmVyV2lkdGggPD0gb3JpZW50YXRpb25Db25maWcubWF4aW11bVNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRPcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uQ29uZmlnLm9yaWVudGF0aW9uRGlyZWN0aW9uO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgY29udmVydGVkU3RlcC5vcmllbnRhdGlvbiA9IGN1cnJlbnRPcmllbnRhdGlvbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29udmVydGVkU3RlcDtcbiAgICB9XG59XG4iXX0=