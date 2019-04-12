/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { debounceTime } from 'rxjs/internal/operators';
import { ErrorHandler, Injectable } from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { Orientation } from './guided-tour.constants';
import { cloneDeep } from 'lodash';
export class GuidedTourService {
    /**
     * @param {?} errorHandler
     */
    constructor(errorHandler) {
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
        () => {
            if (this._currentTour && this._currentTourStepIndex > -1) {
                if (this._currentTour.minimumScreenSize && this._currentTour.minimumScreenSize >= window.innerWidth) {
                    this._onResizeMessage = true;
                    this._guidedTourCurrentStepSubject.next({
                        title: 'Please resize',
                        content: 'You have resized the tour to a size that is too small to continue. Please resize the browser to a larger size to continue the tour or close the tour.'
                    });
                }
                else {
                    this._onResizeMessage = false;
                    this._guidedTourCurrentStepSubject.next(this.getPreparedTourStep(this._currentTourStepIndex));
                }
            }
        }));
    }
    /**
     * @return {?}
     */
    nextStep() {
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
                () => {
                    if (this._checkSelectorValidity()) {
                        this._guidedTourCurrentStepSubject.next(this.getPreparedTourStep(this._currentTourStepIndex));
                    }
                    else {
                        this.nextStep();
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
    }
    /**
     * @return {?}
     */
    backStep() {
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
                () => {
                    if (this._checkSelectorValidity()) {
                        this._guidedTourCurrentStepSubject.next(this.getPreparedTourStep(this._currentTourStepIndex));
                    }
                    else {
                        this.backStep();
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
    }
    /**
     * @return {?}
     */
    skipTour() {
        if (this._currentTour.skipCallback) {
            this._currentTour.skipCallback(this._currentTourStepIndex);
        }
        this.resetTour();
    }
    /**
     * @return {?}
     */
    resetTour() {
        document.body.classList.remove('tour-open');
        this._currentTour = null;
        this._currentTourStepIndex = 0;
        this._guidedTourCurrentStepSubject.next(null);
    }
    /**
     * @param {?} tour
     * @return {?}
     */
    startTour(tour) {
        this._currentTour = cloneDeep(tour);
        this._currentTour.steps = this._currentTour.steps.filter((/**
         * @param {?} step
         * @return {?}
         */
        step => !step.skipStep));
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
    }
    /**
     * @return {?}
     */
    activateOrb() {
        this._guidedTourOrbShowingSubject.next(false);
        document.body.classList.add('tour-open');
    }
    /**
     * @private
     * @return {?}
     */
    _setFirstAndLast() {
        this._onLastStep = (this._currentTour.steps.length - 1) === this._currentTourStepIndex;
        this._onFirstStep = this._currentTourStepIndex === 0;
    }
    /**
     * @private
     * @return {?}
     */
    _checkSelectorValidity() {
        if (this._currentTour.steps[this._currentTourStepIndex].selector) {
            /** @type {?} */
            const selectedElement = document.querySelector(this._currentTour.steps[this._currentTourStepIndex].selector);
            if (!selectedElement) {
                this.errorHandler.handleError(
                // If error handler is configured this should not block the browser.
                new Error(`Error finding selector ${this._currentTour.steps[this._currentTourStepIndex].selector} on step ${this._currentTourStepIndex + 1} during guided tour: ${this._currentTour.tourId}`));
                return false;
            }
        }
        return true;
    }
    /**
     * @return {?}
     */
    get onLastStep() {
        return this._onLastStep;
    }
    /**
     * @return {?}
     */
    get onFirstStep() {
        return this._onFirstStep;
    }
    /**
     * @return {?}
     */
    get onResizeMessage() {
        return this._onResizeMessage;
    }
    /**
     * @return {?}
     */
    get currentTourStepDisplay() {
        return this._currentTourStepIndex + 1;
    }
    /**
     * @return {?}
     */
    get currentTourStepCount() {
        return this._currentTour && this._currentTour.steps ? this._currentTour.steps.length : 0;
    }
    /**
     * @return {?}
     */
    get preventBackdropFromAdvancing() {
        return this._currentTour && this._currentTour.preventBackdropFromAdvancing;
    }
    /**
     * @private
     * @param {?} index
     * @return {?}
     */
    getPreparedTourStep(index) {
        return this.setTourOrientation(this._currentTour.steps[index]);
    }
    /**
     * @private
     * @param {?} step
     * @return {?}
     */
    setTourOrientation(step) {
        /** @type {?} */
        const convertedStep = cloneDeep(step);
        if (convertedStep.orientation
            && !(typeof convertedStep.orientation === 'string')
            && ((/** @type {?} */ (convertedStep.orientation))).length) {
            ((/** @type {?} */ (convertedStep.orientation))).sort((/**
             * @param {?} a
             * @param {?} b
             * @return {?}
             */
            (a, b) => {
                if (!b.maximumSize) {
                    return 1;
                }
                if (!a.maximumSize) {
                    return -1;
                }
                return b.maximumSize - a.maximumSize;
            }));
            /** @type {?} */
            let currentOrientation = Orientation.Top;
            ((/** @type {?} */ (convertedStep.orientation))).forEach((/**
             * @param {?} orientationConfig
             * @return {?}
             */
            (orientationConfig) => {
                if (!orientationConfig.maximumSize || window.innerWidth <= orientationConfig.maximumSize) {
                    currentOrientation = orientationConfig.orientationDirection;
                }
            }));
            convertedStep.orientation = currentOrientation;
        }
        return convertedStep;
    }
}
GuidedTourService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
GuidedTourService.ctorParameters = () => [
    { type: ErrorHandler }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZGVkLXRvdXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1ndWlkZWQtdG91ci8iLCJzb3VyY2VzIjpbImxpYi9ndWlkZWQtdG91ci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDdkQsT0FBTyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekQsT0FBTyxFQUFjLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdEQsT0FBTyxFQUF3QixXQUFXLEVBQTRCLE1BQU0seUJBQXlCLENBQUM7QUFDdEcsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUduQyxNQUFNLE9BQU8saUJBQWlCOzs7O0lBWTFCLFlBQ1csWUFBMEI7UUFBMUIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFUN0Isa0NBQTZCLEdBQUcsSUFBSSxPQUFPLEVBQVksQ0FBQztRQUN4RCxpQ0FBNEIsR0FBRyxJQUFJLE9BQU8sRUFBVyxDQUFDO1FBQ3RELDBCQUFxQixHQUFHLENBQUMsQ0FBQztRQUMxQixpQkFBWSxHQUFlLElBQUksQ0FBQztRQUNoQyxpQkFBWSxHQUFHLElBQUksQ0FBQztRQUNwQixnQkFBVyxHQUFHLElBQUksQ0FBQztRQUNuQixxQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFLN0IsSUFBSSxDQUFDLDJCQUEyQixHQUFHLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNyRixJQUFJLENBQUMsMEJBQTBCLEdBQUcsSUFBSSxDQUFDLDRCQUE0QixDQUFDLFlBQVksRUFBRSxDQUFDO1FBRW5GLFNBQVMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVM7OztRQUFDLEdBQUcsRUFBRTtZQUMv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a0M7Ozs7O0lBQ2xDLHlDQUF3Qzs7Ozs7SUFDeEMseUNBQTRCOzs7OztJQUM1Qix3Q0FBMkI7Ozs7O0lBQzNCLDZDQUFpQzs7SUFHN0IseUNBQWlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZGVib3VuY2VUaW1lIH0gZnJvbSAncnhqcy9pbnRlcm5hbC9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgRXJyb3JIYW5kbGVyLCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0LCBmcm9tRXZlbnQgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEd1aWRlZFRvdXIsIFRvdXJTdGVwLCBPcmllbnRhdGlvbiwgT3JpZW50YXRpb25Db25maWd1cmF0aW9uIH0gZnJvbSAnLi9ndWlkZWQtdG91ci5jb25zdGFudHMnO1xuaW1wb3J0IHsgY2xvbmVEZWVwIH0gZnJvbSAnbG9kYXNoJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEd1aWRlZFRvdXJTZXJ2aWNlIHtcbiAgICBwdWJsaWMgZ3VpZGVkVG91ckN1cnJlbnRTdGVwU3RyZWFtOiBPYnNlcnZhYmxlPFRvdXJTdGVwPjtcbiAgICBwdWJsaWMgZ3VpZGVkVG91ck9yYlNob3dpbmdTdHJlYW06IE9ic2VydmFibGU8Ym9vbGVhbj47XG5cbiAgICBwcml2YXRlIF9ndWlkZWRUb3VyQ3VycmVudFN0ZXBTdWJqZWN0ID0gbmV3IFN1YmplY3Q8VG91clN0ZXA+KCk7XG4gICAgcHJpdmF0ZSBfZ3VpZGVkVG91ck9yYlNob3dpbmdTdWJqZWN0ID0gbmV3IFN1YmplY3Q8Ym9vbGVhbj4oKTtcbiAgICBwcml2YXRlIF9jdXJyZW50VG91clN0ZXBJbmRleCA9IDA7XG4gICAgcHJpdmF0ZSBfY3VycmVudFRvdXI6IEd1aWRlZFRvdXIgPSBudWxsO1xuICAgIHByaXZhdGUgX29uRmlyc3RTdGVwID0gdHJ1ZTtcbiAgICBwcml2YXRlIF9vbkxhc3RTdGVwID0gdHJ1ZTtcbiAgICBwcml2YXRlIF9vblJlc2l6ZU1lc3NhZ2UgPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwdWJsaWMgZXJyb3JIYW5kbGVyOiBFcnJvckhhbmRsZXJcbiAgICApIHtcbiAgICAgICAgdGhpcy5ndWlkZWRUb3VyQ3VycmVudFN0ZXBTdHJlYW0gPSB0aGlzLl9ndWlkZWRUb3VyQ3VycmVudFN0ZXBTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuICAgICAgICB0aGlzLmd1aWRlZFRvdXJPcmJTaG93aW5nU3RyZWFtID0gdGhpcy5fZ3VpZGVkVG91ck9yYlNob3dpbmdTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuXG4gICAgICAgIGZyb21FdmVudCh3aW5kb3csICdyZXNpemUnKS5waXBlKGRlYm91bmNlVGltZSgyMDApKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRUb3VyICYmIHRoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY3VycmVudFRvdXIubWluaW11bVNjcmVlblNpemUgJiYgdGhpcy5fY3VycmVudFRvdXIubWluaW11bVNjcmVlblNpemUgPj0gd2luZG93LmlubmVyV2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25SZXNpemVNZXNzYWdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ3VpZGVkVG91ckN1cnJlbnRTdGVwU3ViamVjdC5uZXh0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUGxlYXNlIHJlc2l6ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiAnWW91IGhhdmUgcmVzaXplZCB0aGUgdG91ciB0byBhIHNpemUgdGhhdCBpcyB0b28gc21hbGwgdG8gY29udGludWUuIFBsZWFzZSByZXNpemUgdGhlIGJyb3dzZXIgdG8gYSBsYXJnZXIgc2l6ZSB0byBjb250aW51ZSB0aGUgdG91ciBvciBjbG9zZSB0aGUgdG91ci4nXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29uUmVzaXplTWVzc2FnZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ndWlkZWRUb3VyQ3VycmVudFN0ZXBTdWJqZWN0Lm5leHQodGhpcy5nZXRQcmVwYXJlZFRvdXJTdGVwKHRoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmV4dFN0ZXAoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLl9jdXJyZW50VG91ci5zdGVwc1t0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleF0uY2xvc2VBY3Rpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRUb3VyLnN0ZXBzW3RoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4XS5jbG9zZUFjdGlvbigpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9jdXJyZW50VG91ci5zdGVwc1t0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleCArIDFdKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleCsrO1xuICAgICAgICAgICAgdGhpcy5fc2V0Rmlyc3RBbmRMYXN0KCk7XG4gICAgICAgICAgICBpZiAodGhpcy5fY3VycmVudFRvdXIuc3RlcHNbdGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXhdLmFjdGlvbikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRUb3VyLnN0ZXBzW3RoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4XS5hY3Rpb24oKTtcbiAgICAgICAgICAgICAgICAvLyBVc3VhbGx5IGFuIGFjdGlvbiBpcyBvcGVuaW5nIHNvbWV0aGluZyBzbyB3ZSBuZWVkIHRvIGdpdmUgaXQgdGltZSB0byByZW5kZXIuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jaGVja1NlbGVjdG9yVmFsaWRpdHkoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ3VpZGVkVG91ckN1cnJlbnRTdGVwU3ViamVjdC5uZXh0KHRoaXMuZ2V0UHJlcGFyZWRUb3VyU3RlcCh0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleCkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0U3RlcCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jaGVja1NlbGVjdG9yVmFsaWRpdHkoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ndWlkZWRUb3VyQ3VycmVudFN0ZXBTdWJqZWN0Lm5leHQodGhpcy5nZXRQcmVwYXJlZFRvdXJTdGVwKHRoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4KSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0U3RlcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jdXJyZW50VG91ci5jb21wbGV0ZUNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudFRvdXIuY29tcGxldGVDYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yZXNldFRvdXIoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBiYWNrU3RlcCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRUb3VyLnN0ZXBzW3RoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4XS5jbG9zZUFjdGlvbikge1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudFRvdXIuc3RlcHNbdGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXhdLmNsb3NlQWN0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRUb3VyLnN0ZXBzW3RoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4IC0gMV0pIHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4LS07XG4gICAgICAgICAgICB0aGlzLl9zZXRGaXJzdEFuZExhc3QoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jdXJyZW50VG91ci5zdGVwc1t0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleF0uYWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudFRvdXIuc3RlcHNbdGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXhdLmFjdGlvbigpO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fY2hlY2tTZWxlY3RvclZhbGlkaXR5KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2d1aWRlZFRvdXJDdXJyZW50U3RlcFN1YmplY3QubmV4dCh0aGlzLmdldFByZXBhcmVkVG91clN0ZXAodGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXgpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYmFja1N0ZXAoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY2hlY2tTZWxlY3RvclZhbGlkaXR5KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ3VpZGVkVG91ckN1cnJlbnRTdGVwU3ViamVjdC5uZXh0KHRoaXMuZ2V0UHJlcGFyZWRUb3VyU3RlcCh0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleCkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmFja1N0ZXAoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0VG91cigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHNraXBUb3VyKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5fY3VycmVudFRvdXIuc2tpcENhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50VG91ci5za2lwQ2FsbGJhY2sodGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzZXRUb3VyKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlc2V0VG91cigpOiB2b2lkIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCd0b3VyLW9wZW4nKTtcbiAgICAgICAgdGhpcy5fY3VycmVudFRvdXIgPSBudWxsO1xuICAgICAgICB0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleCA9IDA7XG4gICAgICAgIHRoaXMuX2d1aWRlZFRvdXJDdXJyZW50U3RlcFN1YmplY3QubmV4dChudWxsKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhcnRUb3VyKHRvdXI6IEd1aWRlZFRvdXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fY3VycmVudFRvdXIgPSBjbG9uZURlZXAodG91cik7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRUb3VyLnN0ZXBzID0gdGhpcy5fY3VycmVudFRvdXIuc3RlcHMuZmlsdGVyKHN0ZXAgPT4gIXN0ZXAuc2tpcFN0ZXApO1xuICAgICAgICB0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleCA9IDA7XG4gICAgICAgIHRoaXMuX3NldEZpcnN0QW5kTGFzdCgpO1xuICAgICAgICB0aGlzLl9ndWlkZWRUb3VyT3JiU2hvd2luZ1N1YmplY3QubmV4dCh0aGlzLl9jdXJyZW50VG91ci51c2VPcmIpO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50VG91ci5zdGVwcy5sZW5ndGggPiAwXG4gICAgICAgICAgICAmJiAoIXRoaXMuX2N1cnJlbnRUb3VyLm1pbmltdW1TY3JlZW5TaXplXG4gICAgICAgICAgICAgICAgfHwgKHdpbmRvdy5pbm5lcldpZHRoID49IHRoaXMuX2N1cnJlbnRUb3VyLm1pbmltdW1TY3JlZW5TaXplKSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2N1cnJlbnRUb3VyLnVzZU9yYikge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgndG91ci1vcGVuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5fY3VycmVudFRvdXIuc3RlcHNbdGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXhdLmFjdGlvbikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRUb3VyLnN0ZXBzW3RoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4XS5hY3Rpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl9jaGVja1NlbGVjdG9yVmFsaWRpdHkoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2d1aWRlZFRvdXJDdXJyZW50U3RlcFN1YmplY3QubmV4dCh0aGlzLmdldFByZXBhcmVkVG91clN0ZXAodGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXgpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0U3RlcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFjdGl2YXRlT3JiKCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9ndWlkZWRUb3VyT3JiU2hvd2luZ1N1YmplY3QubmV4dChmYWxzZSk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgndG91ci1vcGVuJyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfc2V0Rmlyc3RBbmRMYXN0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9vbkxhc3RTdGVwID0gKHRoaXMuX2N1cnJlbnRUb3VyLnN0ZXBzLmxlbmd0aCAtIDEpID09PSB0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleDtcbiAgICAgICAgdGhpcy5fb25GaXJzdFN0ZXAgPSB0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleCA9PT0gMDtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9jaGVja1NlbGVjdG9yVmFsaWRpdHkoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLl9jdXJyZW50VG91ci5zdGVwc1t0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleF0uc2VsZWN0b3IpIHtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5fY3VycmVudFRvdXIuc3RlcHNbdGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXhdLnNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmICghc2VsZWN0ZWRFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvckhhbmRsZXIuaGFuZGxlRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIGVycm9yIGhhbmRsZXIgaXMgY29uZmlndXJlZCB0aGlzIHNob3VsZCBub3QgYmxvY2sgdGhlIGJyb3dzZXIuXG4gICAgICAgICAgICAgICAgICAgIG5ldyBFcnJvcihgRXJyb3IgZmluZGluZyBzZWxlY3RvciAke3RoaXMuX2N1cnJlbnRUb3VyLnN0ZXBzW3RoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4XS5zZWxlY3Rvcn0gb24gc3RlcCAke3RoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4ICsgMX0gZHVyaW5nIGd1aWRlZCB0b3VyOiAke3RoaXMuX2N1cnJlbnRUb3VyLnRvdXJJZH1gKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgb25MYXN0U3RlcCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uTGFzdFN0ZXA7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBvbkZpcnN0U3RlcCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uRmlyc3RTdGVwO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgb25SZXNpemVNZXNzYWdlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fb25SZXNpemVNZXNzYWdlO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgY3VycmVudFRvdXJTdGVwRGlzcGxheSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXggKyAxO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgY3VycmVudFRvdXJTdGVwQ291bnQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRUb3VyICYmIHRoaXMuX2N1cnJlbnRUb3VyLnN0ZXBzID8gdGhpcy5fY3VycmVudFRvdXIuc3RlcHMubGVuZ3RoIDogMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHByZXZlbnRCYWNrZHJvcEZyb21BZHZhbmNpbmcoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jdXJyZW50VG91ciAmJiB0aGlzLl9jdXJyZW50VG91ci5wcmV2ZW50QmFja2Ryb3BGcm9tQWR2YW5jaW5nO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0UHJlcGFyZWRUb3VyU3RlcChpbmRleDogbnVtYmVyKTogVG91clN0ZXAge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRUb3VyT3JpZW50YXRpb24odGhpcy5fY3VycmVudFRvdXIuc3RlcHNbaW5kZXhdKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldFRvdXJPcmllbnRhdGlvbihzdGVwOiBUb3VyU3RlcCk6IFRvdXJTdGVwIHtcbiAgICAgICAgY29uc3QgY29udmVydGVkU3RlcCA9IGNsb25lRGVlcChzdGVwKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgY29udmVydGVkU3RlcC5vcmllbnRhdGlvblxuICAgICAgICAgICAgJiYgISh0eXBlb2YgY29udmVydGVkU3RlcC5vcmllbnRhdGlvbiA9PT0gJ3N0cmluZycpXG4gICAgICAgICAgICAmJiAoY29udmVydGVkU3RlcC5vcmllbnRhdGlvbiBhcyBPcmllbnRhdGlvbkNvbmZpZ3VyYXRpb25bXSkubGVuZ3RoXG4gICAgICAgICkge1xuICAgICAgICAgICAgKGNvbnZlcnRlZFN0ZXAub3JpZW50YXRpb24gYXMgT3JpZW50YXRpb25Db25maWd1cmF0aW9uW10pLnNvcnQoKGE6IE9yaWVudGF0aW9uQ29uZmlndXJhdGlvbiwgYjogT3JpZW50YXRpb25Db25maWd1cmF0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFiLm1heGltdW1TaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWEubWF4aW11bVNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gYi5tYXhpbXVtU2l6ZSAtIGEubWF4aW11bVNpemU7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbGV0IGN1cnJlbnRPcmllbnRhdGlvbjogT3JpZW50YXRpb24gPSBPcmllbnRhdGlvbi5Ub3A7XG4gICAgICAgICAgICAoY29udmVydGVkU3RlcC5vcmllbnRhdGlvbiBhcyBPcmllbnRhdGlvbkNvbmZpZ3VyYXRpb25bXSkuZm9yRWFjaChcbiAgICAgICAgICAgICAgICAob3JpZW50YXRpb25Db25maWc6IE9yaWVudGF0aW9uQ29uZmlndXJhdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIW9yaWVudGF0aW9uQ29uZmlnLm1heGltdW1TaXplIHx8IHdpbmRvdy5pbm5lcldpZHRoIDw9IG9yaWVudGF0aW9uQ29uZmlnLm1heGltdW1TaXplKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50T3JpZW50YXRpb24gPSBvcmllbnRhdGlvbkNvbmZpZy5vcmllbnRhdGlvbkRpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnZlcnRlZFN0ZXAub3JpZW50YXRpb24gPSBjdXJyZW50T3JpZW50YXRpb247XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbnZlcnRlZFN0ZXA7XG4gICAgfVxufVxuIl19