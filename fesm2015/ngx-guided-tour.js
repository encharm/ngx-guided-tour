import { debounceTime } from 'rxjs/internal/operators';
import { cloneDeep } from 'lodash';
import { Subject, fromEvent } from 'rxjs';
import { ErrorHandler, Injectable, Component, Input, ViewChild, ViewEncapsulation, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class Orientation {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class GuidedTourService {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class GuidedTourComponent {
    /**
     * @param {?} guidedTourService
     */
    constructor(guidedTourService) {
        this.guidedTourService = guidedTourService;
        this.topOfPageAdjustment = 0;
        this.tourStepWidth = 300;
        this.minimalTourStepWidth = 200;
        this.highlightPadding = 4;
        this.currentTourStep = null;
        this.selectedElementRect = null;
        this.isOrbShowing = false;
        this._announcementsCount = 0;
    }
    /**
     * @private
     * @return {?}
     */
    get maxWidthAdjustmentForTourStep() {
        return this.tourStepWidth - this.minimalTourStepWidth;
    }
    /**
     * @private
     * @return {?}
     */
    get widthAdjustmentForScreenBound() {
        if (!this.tourStep) {
            return 0;
        }
        /** @type {?} */
        let adjustment = 0;
        if (this.calculatedLeftPosition < 0) {
            adjustment = -this.calculatedLeftPosition;
        }
        if (this.calculatedLeftPosition > window.innerWidth - this.tourStepWidth) {
            adjustment = this.calculatedLeftPosition - (window.innerWidth - this.tourStepWidth);
        }
        return Math.min(this.maxWidthAdjustmentForTourStep, adjustment);
    }
    /**
     * @return {?}
     */
    get calculatedTourStepWidth() {
        return this.tourStepWidth - this.widthAdjustmentForScreenBound;
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.guidedTourService.guidedTourCurrentStepStream.subscribe((/**
         * @param {?} step
         * @return {?}
         */
        (step) => {
            this.currentTourStep = step;
            if (step && step.selector) {
                /** @type {?} */
                const selectedElement = document.querySelector(step.selector);
                if (selectedElement) {
                    this.scrollToAndSetElement();
                }
                else {
                    this.selectedElementRect = null;
                }
            }
            else {
                this.selectedElementRect = null;
            }
        }));
        this.guidedTourService.guidedTourOrbShowingStream.subscribe((/**
         * @param {?} value
         * @return {?}
         */
        (value) => {
            this.isOrbShowing = value;
        }));
        this.resizeSubscription = fromEvent(window, 'resize').subscribe((/**
         * @return {?}
         */
        () => {
            this.updateStepLocation();
        }));
        this.scrollSubscription = fromEvent(window, 'scroll').subscribe((/**
         * @return {?}
         */
        () => {
            this.updateStepLocation();
        }));
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.resizeSubscription.unsubscribe();
        this.scrollSubscription.unsubscribe();
    }
    /**
     * @return {?}
     */
    scrollToAndSetElement() {
        this.updateStepLocation();
        // Allow things to render to scroll to the correct location
        setTimeout((/**
         * @return {?}
         */
        () => {
            if (!this.isOrbShowing && !this.isTourOnScreen()) {
                if (this.selectedElementRect && this.isBottom()) {
                    // Scroll so the element is on the top of the screen.
                    /** @type {?} */
                    const topPos = ((window.scrollY + this.selectedElementRect.top) - this.topOfPageAdjustment)
                        - (this.currentTourStep.scrollAdjustment ? this.currentTourStep.scrollAdjustment : 0)
                        + this.getStepScreenAdjustment();
                    try {
                        window.scrollTo({
                            left: null,
                            top: topPos,
                            behavior: 'smooth'
                        });
                    }
                    catch (err) {
                        if (err instanceof TypeError) {
                            window.scroll(0, topPos);
                        }
                        else {
                            throw err;
                        }
                    }
                }
                else {
                    // Scroll so the element is on the bottom of the screen.
                    /** @type {?} */
                    const topPos = (window.scrollY + this.selectedElementRect.top + this.selectedElementRect.height)
                        - window.innerHeight
                        + (this.currentTourStep.scrollAdjustment ? this.currentTourStep.scrollAdjustment : 0)
                        - this.getStepScreenAdjustment();
                    try {
                        window.scrollTo({
                            left: null,
                            top: topPos,
                            behavior: 'smooth'
                        });
                    }
                    catch (err) {
                        if (err instanceof TypeError) {
                            window.scroll(0, topPos);
                        }
                        else {
                            throw err;
                        }
                    }
                }
            }
        }));
    }
    /**
     * @return {?}
     */
    handleOrb() {
        this.guidedTourService.activateOrb();
        if (this.currentTourStep && this.currentTourStep.selector) {
            this.scrollToAndSetElement();
        }
    }
    /**
     * @private
     * @return {?}
     */
    isTourOnScreen() {
        return this.tourStep
            && this.elementInViewport(document.querySelector(this.currentTourStep.selector))
            && this.elementInViewport(this.tourStep.nativeElement);
    }
    // Modified from https://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
    /**
     * @private
     * @param {?} element
     * @return {?}
     */
    elementInViewport(element) {
        /** @type {?} */
        let top = element.offsetTop;
        /** @type {?} */
        const height = element.offsetHeight;
        while (element.offsetParent) {
            element = ((/** @type {?} */ (element.offsetParent)));
            top += element.offsetTop;
        }
        if (this.isBottom()) {
            return (top >= (window.pageYOffset
                + this.topOfPageAdjustment
                + (this.currentTourStep.scrollAdjustment ? this.currentTourStep.scrollAdjustment : 0)
                + this.getStepScreenAdjustment())
                && (top + height) <= (window.pageYOffset + window.innerHeight));
        }
        else {
            return (top >= (window.pageYOffset + this.topOfPageAdjustment - this.getStepScreenAdjustment())
                && (top + height + (this.currentTourStep.scrollAdjustment ? this.currentTourStep.scrollAdjustment : 0)) <= (window.pageYOffset + window.innerHeight));
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    backdropClick(event) {
        if (this.guidedTourService.preventBackdropFromAdvancing) {
            event.stopPropagation();
        }
        else {
            this.guidedTourService.nextStep();
        }
    }
    /**
     * @return {?}
     */
    updateStepLocation() {
        if (this.currentTourStep && this.currentTourStep.selector) {
            /** @type {?} */
            const selectedElement = document.querySelector(this.currentTourStep.selector);
            if (selectedElement) {
                this.selectedElementRect = ((/** @type {?} */ (selectedElement.getBoundingClientRect())));
            }
            else {
                this.selectedElementRect = null;
            }
        }
        else {
            this.selectedElementRect = null;
        }
    }
    /**
     * @private
     * @return {?}
     */
    isBottom() {
        return this.currentTourStep.orientation
            && (this.currentTourStep.orientation === Orientation.Bottom
                || this.currentTourStep.orientation === Orientation.BottomLeft
                || this.currentTourStep.orientation === Orientation.BottomRight);
    }
    /**
     * @return {?}
     */
    get topPosition() {
        /** @type {?} */
        const paddingAdjustment = this.getHighlightPadding();
        if (this.isBottom()) {
            return this.selectedElementRect.top + this.selectedElementRect.height + paddingAdjustment;
        }
        return this.selectedElementRect.top - this.getHighlightPadding();
    }
    /**
     * @return {?}
     */
    get orbTopPosition() {
        if (this.isBottom()) {
            return this.selectedElementRect.top + this.selectedElementRect.height;
        }
        if (this.currentTourStep.orientation === Orientation.Right
            || this.currentTourStep.orientation === Orientation.Left) {
            return (this.selectedElementRect.top + (this.selectedElementRect.height / 2));
        }
        return this.selectedElementRect.top;
    }
    /**
     * @private
     * @return {?}
     */
    get calculatedLeftPosition() {
        /** @type {?} */
        const paddingAdjustment = this.getHighlightPadding();
        if (this.currentTourStep.orientation === Orientation.TopRight
            || this.currentTourStep.orientation === Orientation.BottomRight) {
            return (this.selectedElementRect.right - this.tourStepWidth);
        }
        if (this.currentTourStep.orientation === Orientation.TopLeft
            || this.currentTourStep.orientation === Orientation.BottomLeft) {
            return (this.selectedElementRect.left);
        }
        if (this.currentTourStep.orientation === Orientation.Left) {
            return this.selectedElementRect.left - this.tourStepWidth - paddingAdjustment;
        }
        if (this.currentTourStep.orientation === Orientation.Right) {
            return (this.selectedElementRect.left + this.selectedElementRect.width + paddingAdjustment);
        }
        return (this.selectedElementRect.right - (this.selectedElementRect.width / 2) - (this.tourStepWidth / 2));
    }
    /**
     * @return {?}
     */
    get leftPosition() {
        if (this.calculatedLeftPosition >= 0) {
            return this.calculatedLeftPosition;
        }
        /** @type {?} */
        const adjustment = Math.max(0, -this.calculatedLeftPosition);
        /** @type {?} */
        const maxAdjustment = Math.min(this.maxWidthAdjustmentForTourStep, adjustment);
        return this.calculatedLeftPosition + maxAdjustment;
    }
    /**
     * @return {?}
     */
    get orbLeftPosition() {
        if (this.currentTourStep.orientation === Orientation.TopRight
            || this.currentTourStep.orientation === Orientation.BottomRight) {
            return this.selectedElementRect.right;
        }
        if (this.currentTourStep.orientation === Orientation.TopLeft
            || this.currentTourStep.orientation === Orientation.BottomLeft) {
            return this.selectedElementRect.left;
        }
        if (this.currentTourStep.orientation === Orientation.Left) {
            return this.selectedElementRect.left;
        }
        if (this.currentTourStep.orientation === Orientation.Right) {
            return (this.selectedElementRect.left + this.selectedElementRect.width);
        }
        return (this.selectedElementRect.right - (this.selectedElementRect.width / 2));
    }
    /**
     * @return {?}
     */
    get transform() {
        if (!this.currentTourStep.orientation
            || this.currentTourStep.orientation === Orientation.Top
            || this.currentTourStep.orientation === Orientation.TopRight
            || this.currentTourStep.orientation === Orientation.TopLeft) {
            return 'translateY(-100%)';
        }
        return null;
    }
    /**
     * @return {?}
     */
    get orbTransform() {
        if (!this.currentTourStep.orientation
            || this.currentTourStep.orientation === Orientation.Top
            || this.currentTourStep.orientation === Orientation.Bottom
            || this.currentTourStep.orientation === Orientation.TopLeft
            || this.currentTourStep.orientation === Orientation.BottomLeft) {
            return 'translateY(-50%)';
        }
        if (this.currentTourStep.orientation === Orientation.TopRight
            || this.currentTourStep.orientation === Orientation.BottomRight) {
            return 'translate(-100%, -50%)';
        }
        if (this.currentTourStep.orientation === Orientation.Right
            || this.currentTourStep.orientation === Orientation.Left) {
            return 'translate(-50%, -50%)';
        }
        return null;
    }
    /**
     * @return {?}
     */
    get overlayTop() {
        if (this.selectedElementRect) {
            return this.selectedElementRect.top - this.getHighlightPadding();
        }
        return 0;
    }
    /**
     * @return {?}
     */
    get overlayLeft() {
        if (this.selectedElementRect) {
            return this.selectedElementRect.left - this.getHighlightPadding();
        }
        return 0;
    }
    /**
     * @return {?}
     */
    get overlayHeight() {
        if (this.selectedElementRect) {
            return this.selectedElementRect.height + (this.getHighlightPadding() * 2);
        }
        return 0;
    }
    /**
     * @return {?}
     */
    get overlayWidth() {
        if (this.selectedElementRect) {
            return this.selectedElementRect.width + (this.getHighlightPadding() * 2);
        }
        return 0;
    }
    /**
     * @private
     * @return {?}
     */
    getHighlightPadding() {
        /** @type {?} */
        let paddingAdjustment = this.currentTourStep.useHighlightPadding ? this.highlightPadding : 0;
        if (this.currentTourStep.highlightPadding) {
            paddingAdjustment = this.currentTourStep.highlightPadding;
        }
        return paddingAdjustment;
    }
    // This calculates a value to add or subtract so the step should not be off screen.
    /**
     * @private
     * @return {?}
     */
    getStepScreenAdjustment() {
        if (this.currentTourStep.orientation === Orientation.Left
            || this.currentTourStep.orientation === Orientation.Right) {
            return 0;
        }
        /** @type {?} */
        const elementHeight = this.selectedElementRect.height
            + (this.currentTourStep.scrollAdjustment ? this.currentTourStep.scrollAdjustment : 0)
            + this.tourStep.nativeElement.getBoundingClientRect().height;
        if ((window.innerHeight - this.topOfPageAdjustment) < elementHeight) {
            return elementHeight - (window.innerHeight - this.topOfPageAdjustment);
        }
        return 0;
    }
}
GuidedTourComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-guided-tour',
                template: `
        <div *ngIf="currentTourStep && selectedElementRect && isOrbShowing"
                (mouseenter)="handleOrb()"
                class="tour-orb tour-{{ currentTourStep.orientation }}"
                [style.top.px]="orbTopPosition"
                [style.left.px]="orbLeftPosition"
                [style.transform]="orbTransform">
                <div class="tour-orb-ring"></div>
        </div>
        <div *ngIf="currentTourStep && !isOrbShowing">
            <div class="guided-tour-user-input-mask" (click)="backdropClick($event)"></div>
            <div class="guided-tour-spotlight-overlay"
                [style.top.px]="overlayTop"
                [style.left.px]="overlayLeft"
                [style.height.px]="overlayHeight"
                [style.width.px]="overlayWidth">
            </div>
        </div>
        <div *ngIf="currentTourStep && !isOrbShowing">
            <div #tourStep *ngIf="currentTourStep"
                class="tour-step tour-{{ currentTourStep.orientation }}"
                [ngClass]="{
                    'page-tour-step': !currentTourStep.selector
                }"
                [style.top.px]="(currentTourStep.selector && selectedElementRect ? topPosition : null)"
                [style.left.px]="(currentTourStep.selector && selectedElementRect ? leftPosition : null)"
                [style.width.px]="(currentTourStep.selector && selectedElementRect ? calculatedTourStepWidth : null)"
                [style.transform]="(currentTourStep.selector && selectedElementRect ? transform : null)">
                <div *ngIf="currentTourStep.selector" class="tour-arrow"></div>
                <div class="tour-block">
                    <h3 class="tour-title" *ngIf="currentTourStep.title && currentTourStep.selector">
                        {{ currentTourStep.title }}
                    </h3>
                    <h2 class="tour-title" *ngIf="currentTourStep.title && !currentTourStep.selector">
                        {{ currentTourStep.title }}
                    </h2>
                    <div class="tour-content" [innerHTML]="currentTourStep.content"></div>
                    <div class="tour-buttons">
                        <button *ngIf="!guidedTourService.onResizeMessage"
                            (click)="guidedTourService.skipTour()"
                            class="skip-button link-button">
                            Skip
                        </button>
                        <button *ngIf="!guidedTourService.onLastStep && !guidedTourService.onResizeMessage"
                            class="next-button"
                            (click)="guidedTourService.nextStep()">
                            Next&nbsp;&nbsp;{{ guidedTourService.currentTourStepDisplay }}/{{ guidedTourService.currentTourStepCount }}
                        </button>
                        <button *ngIf="guidedTourService.onLastStep"
                            class="next-button"
                            (click)="guidedTourService.nextStep()">
                            Done
                        </button>

                        <button *ngIf="guidedTourService.onResizeMessage"
                            class="next-button"
                            (click)="guidedTourService.resetTour()">
                            Close
                        </button>
                        <button *ngIf="!guidedTourService.onFirstStep && !guidedTourService.onResizeMessage"
                            class="back-button link-button"
                            (click)="guidedTourService.backStep()">
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,
                encapsulation: ViewEncapsulation.None,
                styles: ["ngx-guided-tour .guided-tour-user-input-mask{position:fixed;top:0;left:0;display:block;height:100%;width:100%;max-height:100vh;text-align:center;opacity:0}ngx-guided-tour .guided-tour-spotlight-overlay{position:fixed;box-shadow:0 0 0 9999px rgba(0,0,0,.7),0 0 1.5rem rgba(0,0,0,.5)}ngx-guided-tour .tour-orb{position:fixed;width:20px;height:20px;border-radius:50%}ngx-guided-tour .tour-orb .tour-orb-ring{width:35px;height:35px;position:relative;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);-webkit-animation:2s linear infinite pulse;animation:2s linear infinite pulse}ngx-guided-tour .tour-orb .tour-orb-ring:after{content:'';display:inline-block;height:100%;width:100%;border-radius:50%}@-webkit-keyframes pulse{from{-webkit-transform:translate(-50%,-50%) scale(.45);transform:translate(-50%,-50%) scale(.45);opacity:1}to{-webkit-transform:translate(-50%,-50%) scale(1);transform:translate(-50%,-50%) scale(1);opacity:0}}@keyframes pulse{from{-webkit-transform:translate(-50%,-50%) scale(.45);transform:translate(-50%,-50%) scale(.45);opacity:1}to{-webkit-transform:translate(-50%,-50%) scale(1);transform:translate(-50%,-50%) scale(1);opacity:0}}ngx-guided-tour .tour-step{position:fixed}ngx-guided-tour .tour-step.page-tour-step{max-width:400px;width:50%;left:50%;top:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}ngx-guided-tour .tour-step.tour-bottom .tour-arrow::before,ngx-guided-tour .tour-step.tour-bottom-left .tour-arrow::before,ngx-guided-tour .tour-step.tour-bottom-right .tour-arrow::before{position:absolute}ngx-guided-tour .tour-step.tour-bottom .tour-block,ngx-guided-tour .tour-step.tour-bottom-left .tour-block,ngx-guided-tour .tour-step.tour-bottom-right .tour-block{margin-top:10px}ngx-guided-tour .tour-step.tour-top,ngx-guided-tour .tour-step.tour-top-left,ngx-guided-tour .tour-step.tour-top-right{margin-bottom:10px}ngx-guided-tour .tour-step.tour-top .tour-arrow::before,ngx-guided-tour .tour-step.tour-top-left .tour-arrow::before,ngx-guided-tour .tour-step.tour-top-right .tour-arrow::before{position:absolute;bottom:0}ngx-guided-tour .tour-step.tour-top .tour-block,ngx-guided-tour .tour-step.tour-top-left .tour-block,ngx-guided-tour .tour-step.tour-top-right .tour-block{margin-bottom:10px}ngx-guided-tour .tour-step.tour-bottom .tour-arrow::before,ngx-guided-tour .tour-step.tour-top .tour-arrow::before{-webkit-transform:translateX(-50%);transform:translateX(-50%);left:50%}ngx-guided-tour .tour-step.tour-bottom-right .tour-arrow::before,ngx-guided-tour .tour-step.tour-top-right .tour-arrow::before{-webkit-transform:translateX(-100%);transform:translateX(-100%);left:calc(100% - 5px)}ngx-guided-tour .tour-step.tour-bottom-left .tour-arrow::before,ngx-guided-tour .tour-step.tour-top-left .tour-arrow::before{left:5px}ngx-guided-tour .tour-step.tour-left .tour-arrow::before{position:absolute;left:100%;-webkit-transform:translateX(-100%);transform:translateX(-100%);top:5px}ngx-guided-tour .tour-step.tour-left .tour-block{margin-right:10px}ngx-guided-tour .tour-step.tour-right .tour-arrow::before{position:absolute;left:0;top:5px}ngx-guided-tour .tour-step.tour-right .tour-block{margin-left:10px}ngx-guided-tour .tour-step .tour-block{padding:15px 25px}ngx-guided-tour .tour-step .tour-title{font-weight:700!important;padding-bottom:20px}ngx-guided-tour .tour-step h3.tour-title{font-size:20px}ngx-guided-tour .tour-step h2.tour-title{font-size:30px}ngx-guided-tour .tour-step .tour-content{min-height:80px;padding-bottom:30px;font-size:15px}ngx-guided-tour .tour-step .tour-buttons{overflow:hidden}ngx-guided-tour .tour-step .tour-buttons button.link-button{font-size:15px;font-weight:700;max-width:none!important;cursor:pointer;text-align:center;white-space:nowrap;vertical-align:middle;border:1px solid transparent;line-height:1.5;background-color:transparent;position:relative;outline:0;padding:0 15px;-webkit-appearance:button}ngx-guided-tour .tour-step .tour-buttons button.skip-button.link-button{padding-left:0;border-left:0}ngx-guided-tour .tour-step .tour-buttons .back-button{float:right}ngx-guided-tour .tour-step .tour-buttons .next-button{cursor:pointer;border-radius:1px;float:right;font-size:14px;border:none;outline:0;padding-left:10px;padding-right:10px}"]
            }] }
];
/** @nocollapse */
GuidedTourComponent.ctorParameters = () => [
    { type: GuidedTourService }
];
GuidedTourComponent.propDecorators = {
    topOfPageAdjustment: [{ type: Input }],
    tourStepWidth: [{ type: Input }],
    minimalTourStepWidth: [{ type: Input }],
    tourStep: [{ type: ViewChild, args: ['tourStep',] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class GuidedTourModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: GuidedTourModule,
            providers: [
                ErrorHandler,
                GuidedTourService
            ]
        };
    }
}
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { GuidedTourModule, GuidedTourComponent, GuidedTourService, Orientation };

//# sourceMappingURL=ngx-guided-tour.js.map