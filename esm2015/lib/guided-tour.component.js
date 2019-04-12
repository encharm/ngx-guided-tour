/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { fromEvent } from 'rxjs';
import { Orientation } from './guided-tour.constants';
import { GuidedTourService } from './guided-tour.service';
export class GuidedTourComponent {
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
if (false) {
    /** @type {?} */
    GuidedTourComponent.prototype.topOfPageAdjustment;
    /** @type {?} */
    GuidedTourComponent.prototype.tourStepWidth;
    /** @type {?} */
    GuidedTourComponent.prototype.minimalTourStepWidth;
    /** @type {?} */
    GuidedTourComponent.prototype.tourStep;
    /** @type {?} */
    GuidedTourComponent.prototype.highlightPadding;
    /** @type {?} */
    GuidedTourComponent.prototype.currentTourStep;
    /** @type {?} */
    GuidedTourComponent.prototype.selectedElementRect;
    /** @type {?} */
    GuidedTourComponent.prototype.isOrbShowing;
    /**
     * @type {?}
     * @private
     */
    GuidedTourComponent.prototype._announcementsCount;
    /**
     * @type {?}
     * @private
     */
    GuidedTourComponent.prototype.resizeSubscription;
    /**
     * @type {?}
     * @private
     */
    GuidedTourComponent.prototype.scrollSubscription;
    /** @type {?} */
    GuidedTourComponent.prototype.guidedTourService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZGVkLXRvdXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWd1aWRlZC10b3VyLyIsInNvdXJjZXMiOlsibGliL2d1aWRlZC10b3VyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFpQixTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBYSxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckgsT0FBTyxFQUFFLFNBQVMsRUFBZ0IsTUFBTSxNQUFNLENBQUM7QUFDL0MsT0FBTyxFQUFFLFdBQVcsRUFBWSxNQUFNLHlCQUF5QixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBNEUxRCxNQUFNLE9BQU8sbUJBQW1COzs7O0lBYzVCLFlBQ1csaUJBQW9DO1FBQXBDLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7UUFkL0Isd0JBQW1CLEdBQUksQ0FBQyxDQUFDO1FBQ3pCLGtCQUFhLEdBQUksR0FBRyxDQUFDO1FBQ3JCLHlCQUFvQixHQUFJLEdBQUcsQ0FBQztRQUVyQyxxQkFBZ0IsR0FBRyxDQUFDLENBQUM7UUFDckIsb0JBQWUsR0FBYSxJQUFJLENBQUM7UUFDakMsd0JBQW1CLEdBQVksSUFBSSxDQUFDO1FBQ3BDLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBRXBCLHdCQUFtQixHQUFHLENBQUMsQ0FBQztJQU01QixDQUFDOzs7OztJQUVMLElBQVksNkJBQTZCO1FBQ3JDLE9BQU8sSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUM7SUFDMUQsQ0FBQzs7Ozs7SUFFRCxJQUFZLDZCQUE2QjtRQUNyQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNoQixPQUFPLENBQUMsQ0FBQztTQUNaOztZQUNHLFVBQVUsR0FBRyxDQUFDO1FBQ2xCLElBQUksSUFBSSxDQUFDLHNCQUFzQixHQUFHLENB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SUFDM0MsMkNBQTRCOzs7OztJQUU1QixrREFBZ0M7Ozs7O0lBQ2hDLGlEQUF5Qzs7Ozs7SUFDekMsaURBQXlDOztJQUdyQyxnREFBMkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIElucHV0LCBPbkRlc3Ryb3ksIFZpZXdDaGlsZCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGZyb21FdmVudCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBPcmllbnRhdGlvbiwgVG91clN0ZXAgfSBmcm9tICcuL2d1aWRlZC10b3VyLmNvbnN0YW50cyc7XG5pbXBvcnQgeyBHdWlkZWRUb3VyU2VydmljZSB9IGZyb20gJy4vZ3VpZGVkLXRvdXIuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnbmd4LWd1aWRlZC10b3VyJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2ICpuZ0lmPVwiY3VycmVudFRvdXJTdGVwICYmIHNlbGVjdGVkRWxlbWVudFJlY3QgJiYgaXNPcmJTaG93aW5nXCJcbiAgICAgICAgICAgICAgICAobW91c2VlbnRlcik9XCJoYW5kbGVPcmIoKVwiXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJ0b3VyLW9yYiB0b3VyLXt7IGN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiB9fVwiXG4gICAgICAgICAgICAgICAgW3N0eWxlLnRvcC5weF09XCJvcmJUb3BQb3NpdGlvblwiXG4gICAgICAgICAgICAgICAgW3N0eWxlLmxlZnQucHhdPVwib3JiTGVmdFBvc2l0aW9uXCJcbiAgICAgICAgICAgICAgICBbc3R5bGUudHJhbnNmb3JtXT1cIm9yYlRyYW5zZm9ybVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0b3VyLW9yYi1yaW5nXCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2ICpuZ0lmPVwiY3VycmVudFRvdXJTdGVwICYmICFpc09yYlNob3dpbmdcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJndWlkZWQtdG91ci11c2VyLWlucHV0LW1hc2tcIiAoY2xpY2spPVwiYmFja2Ryb3BDbGljaygkZXZlbnQpXCI+PC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ3VpZGVkLXRvdXItc3BvdGxpZ2h0LW92ZXJsYXlcIlxuICAgICAgICAgICAgICAgIFtzdHlsZS50b3AucHhdPVwib3ZlcmxheVRvcFwiXG4gICAgICAgICAgICAgICAgW3N0eWxlLmxlZnQucHhdPVwib3ZlcmxheUxlZnRcIlxuICAgICAgICAgICAgICAgIFtzdHlsZS5oZWlnaHQucHhdPVwib3ZlcmxheUhlaWdodFwiXG4gICAgICAgICAgICAgICAgW3N0eWxlLndpZHRoLnB4XT1cIm92ZXJsYXlXaWR0aFwiPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2ICpuZ0lmPVwiY3VycmVudFRvdXJTdGVwICYmICFpc09yYlNob3dpbmdcIj5cbiAgICAgICAgICAgIDxkaXYgI3RvdXJTdGVwICpuZ0lmPVwiY3VycmVudFRvdXJTdGVwXCJcbiAgICAgICAgICAgICAgICBjbGFzcz1cInRvdXItc3RlcCB0b3VyLXt7IGN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiB9fVwiXG4gICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwie1xuICAgICAgICAgICAgICAgICAgICAncGFnZS10b3VyLXN0ZXAnOiAhY3VycmVudFRvdXJTdGVwLnNlbGVjdG9yXG4gICAgICAgICAgICAgICAgfVwiXG4gICAgICAgICAgICAgICAgW3N0eWxlLnRvcC5weF09XCIoY3VycmVudFRvdXJTdGVwLnNlbGVjdG9yICYmIHNlbGVjdGVkRWxlbWVudFJlY3QgPyB0b3BQb3NpdGlvbiA6IG51bGwpXCJcbiAgICAgICAgICAgICAgICBbc3R5bGUubGVmdC5weF09XCIoY3VycmVudFRvdXJTdGVwLnNlbGVjdG9yICYmIHNlbGVjdGVkRWxlbWVudFJlY3QgPyBsZWZ0UG9zaXRpb24gOiBudWxsKVwiXG4gICAgICAgICAgICAgICAgW3N0eWxlLndpZHRoLnB4XT1cIihjdXJyZW50VG91clN0ZXAuc2VsZWN0b3IgJiYgc2VsZWN0ZWRFbGVtZW50UmVjdCA/IGNhbGN1bGF0ZWRUb3VyU3RlcFdpZHRoIDogbnVsbClcIlxuICAgICAgICAgICAgICAgIFtzdHlsZS50cmFuc2Zvcm1dPVwiKGN1cnJlbnRUb3VyU3RlcC5zZWxlY3RvciAmJiBzZWxlY3RlZEVsZW1lbnRSZWN0ID8gdHJhbnNmb3JtIDogbnVsbClcIj5cbiAgICAgICAgICAgICAgICA8ZGl2ICpuZ0lmPVwiY3VycmVudFRvdXJTdGVwLnNlbGVjdG9yXCIgY2xhc3M9XCJ0b3VyLWFycm93XCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvdXItYmxvY2tcIj5cbiAgICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzPVwidG91ci10aXRsZVwiICpuZ0lmPVwiY3VycmVudFRvdXJTdGVwLnRpdGxlICYmIGN1cnJlbnRUb3VyU3RlcC5zZWxlY3RvclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge3sgY3VycmVudFRvdXJTdGVwLnRpdGxlIH19XG4gICAgICAgICAgICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgICAgICAgICAgIDxoMiBjbGFzcz1cInRvdXItdGl0bGVcIiAqbmdJZj1cImN1cnJlbnRUb3VyU3RlcC50aXRsZSAmJiAhY3VycmVudFRvdXJTdGVwLnNlbGVjdG9yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7eyBjdXJyZW50VG91clN0ZXAudGl0bGUgfX1cbiAgICAgICAgICAgICAgICAgICAgPC9oMj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvdXItY29udGVudFwiIFtpbm5lckhUTUxdPVwiY3VycmVudFRvdXJTdGVwLmNvbnRlbnRcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvdXItYnV0dG9uc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiAqbmdJZj1cIiFndWlkZWRUb3VyU2VydmljZS5vblJlc2l6ZU1lc3NhZ2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjbGljayk9XCJndWlkZWRUb3VyU2VydmljZS5za2lwVG91cigpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInNraXAtYnV0dG9uIGxpbmstYnV0dG9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU2tpcFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uICpuZ0lmPVwiIWd1aWRlZFRvdXJTZXJ2aWNlLm9uTGFzdFN0ZXAgJiYgIWd1aWRlZFRvdXJTZXJ2aWNlLm9uUmVzaXplTWVzc2FnZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJuZXh0LWJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNsaWNrKT1cImd1aWRlZFRvdXJTZXJ2aWNlLm5leHRTdGVwKClcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBOZXh0Jm5ic3A7Jm5ic3A7e3sgZ3VpZGVkVG91clNlcnZpY2UuY3VycmVudFRvdXJTdGVwRGlzcGxheSB9fS97eyBndWlkZWRUb3VyU2VydmljZS5jdXJyZW50VG91clN0ZXBDb3VudCB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uICpuZ0lmPVwiZ3VpZGVkVG91clNlcnZpY2Uub25MYXN0U3RlcFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJuZXh0LWJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNsaWNrKT1cImd1aWRlZFRvdXJTZXJ2aWNlLm5leHRTdGVwKClcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBEb25lXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiAqbmdJZj1cImd1aWRlZFRvdXJTZXJ2aWNlLm9uUmVzaXplTWVzc2FnZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJuZXh0LWJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNsaWNrKT1cImd1aWRlZFRvdXJTZXJ2aWNlLnJlc2V0VG91cigpXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2xvc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiAqbmdJZj1cIiFndWlkZWRUb3VyU2VydmljZS5vbkZpcnN0U3RlcCAmJiAhZ3VpZGVkVG91clNlcnZpY2Uub25SZXNpemVNZXNzYWdlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImJhY2stYnV0dG9uIGxpbmstYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwiZ3VpZGVkVG91clNlcnZpY2UuYmFja1N0ZXAoKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEJhY2tcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIHN0eWxlVXJsczogWycuL2d1aWRlZC10b3VyLmNvbXBvbmVudC5zY3NzJ10sXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBHdWlkZWRUb3VyQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgICBASW5wdXQoKSBwdWJsaWMgdG9wT2ZQYWdlQWRqdXN0bWVudCA/PSAwO1xuICAgIEBJbnB1dCgpIHB1YmxpYyB0b3VyU3RlcFdpZHRoID89IDMwMDtcbiAgICBASW5wdXQoKSBwdWJsaWMgbWluaW1hbFRvdXJTdGVwV2lkdGggPz0gMjAwO1xuICAgIEBWaWV3Q2hpbGQoJ3RvdXJTdGVwJykgcHVibGljIHRvdXJTdGVwOiBFbGVtZW50UmVmO1xuICAgIHB1YmxpYyBoaWdobGlnaHRQYWRkaW5nID0gNDtcbiAgICBwdWJsaWMgY3VycmVudFRvdXJTdGVwOiBUb3VyU3RlcCA9IG51bGw7XG4gICAgcHVibGljIHNlbGVjdGVkRWxlbWVudFJlY3Q6IERPTVJlY3QgPSBudWxsO1xuICAgIHB1YmxpYyBpc09yYlNob3dpbmcgPSBmYWxzZTtcblxuICAgIHByaXZhdGUgX2Fubm91bmNlbWVudHNDb3VudCA9IDA7XG4gICAgcHJpdmF0ZSByZXNpemVTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgICBwcml2YXRlIHNjcm9sbFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyBndWlkZWRUb3VyU2VydmljZTogR3VpZGVkVG91clNlcnZpY2VcbiAgICApIHsgfVxuXG4gICAgcHJpdmF0ZSBnZXQgbWF4V2lkdGhBZGp1c3RtZW50Rm9yVG91clN0ZXAoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG91clN0ZXBXaWR0aCAtIHRoaXMubWluaW1hbFRvdXJTdGVwV2lkdGg7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgd2lkdGhBZGp1c3RtZW50Rm9yU2NyZWVuQm91bmQoKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKCF0aGlzLnRvdXJTdGVwKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgYWRqdXN0bWVudCA9IDA7XG4gICAgICAgIGlmICh0aGlzLmNhbGN1bGF0ZWRMZWZ0UG9zaXRpb24gPCAwKSB7XG4gICAgICAgICAgICBhZGp1c3RtZW50ID0gLXRoaXMuY2FsY3VsYXRlZExlZnRQb3NpdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jYWxjdWxhdGVkTGVmdFBvc2l0aW9uID4gd2luZG93LmlubmVyV2lkdGggLSB0aGlzLnRvdXJTdGVwV2lkdGgpIHtcbiAgICAgICAgICAgIGFkanVzdG1lbnQgPSB0aGlzLmNhbGN1bGF0ZWRMZWZ0UG9zaXRpb24gLSAod2luZG93LmlubmVyV2lkdGggLSB0aGlzLnRvdXJTdGVwV2lkdGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIE1hdGgubWluKHRoaXMubWF4V2lkdGhBZGp1c3RtZW50Rm9yVG91clN0ZXAsIGFkanVzdG1lbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgY2FsY3VsYXRlZFRvdXJTdGVwV2lkdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvdXJTdGVwV2lkdGggLSB0aGlzLndpZHRoQWRqdXN0bWVudEZvclNjcmVlbkJvdW5kO1xuICAgIH1cblxuICAgIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZ3VpZGVkVG91clNlcnZpY2UuZ3VpZGVkVG91ckN1cnJlbnRTdGVwU3RyZWFtLnN1YnNjcmliZSgoc3RlcDogVG91clN0ZXApID0+IHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRvdXJTdGVwID0gc3RlcDtcbiAgICAgICAgICAgIGlmIChzdGVwICYmIHN0ZXAuc2VsZWN0b3IpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3RlZEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHN0ZXAuc2VsZWN0b3IpO1xuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxUb0FuZFNldEVsZW1lbnQoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0ID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5ndWlkZWRUb3VyU2VydmljZS5ndWlkZWRUb3VyT3JiU2hvd2luZ1N0cmVhbS5zdWJzY3JpYmUoKHZhbHVlOiBib29sZWFuKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmlzT3JiU2hvd2luZyA9IHZhbHVlO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnJlc2l6ZVN1YnNjcmlwdGlvbiA9IGZyb21FdmVudCh3aW5kb3csICdyZXNpemUnKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTdGVwTG9jYXRpb24oKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zY3JvbGxTdWJzY3JpcHRpb24gPSBmcm9tRXZlbnQod2luZG93LCAnc2Nyb2xsJykuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU3RlcExvY2F0aW9uKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yZXNpemVTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgdGhpcy5zY3JvbGxTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2Nyb2xsVG9BbmRTZXRFbGVtZW50KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnVwZGF0ZVN0ZXBMb2NhdGlvbigpO1xuICAgICAgICAvLyBBbGxvdyB0aGluZ3MgdG8gcmVuZGVyIHRvIHNjcm9sbCB0byB0aGUgY29ycmVjdCBsb2NhdGlvblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc09yYlNob3dpbmcgJiYgIXRoaXMuaXNUb3VyT25TY3JlZW4oKSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QgJiYgdGhpcy5pc0JvdHRvbSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNjcm9sbCBzbyB0aGUgZWxlbWVudCBpcyBvbiB0aGUgdG9wIG9mIHRoZSBzY3JlZW4uXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvcFBvcyA9ICgod2luZG93LnNjcm9sbFkgKyB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QudG9wKSAtIHRoaXMudG9wT2ZQYWdlQWRqdXN0bWVudClcbiAgICAgICAgICAgICAgICAgICAgICAgIC0gKHRoaXMuY3VycmVudFRvdXJTdGVwLnNjcm9sbEFkanVzdG1lbnQgPyB0aGlzLmN1cnJlbnRUb3VyU3RlcC5zY3JvbGxBZGp1c3RtZW50IDogMClcbiAgICAgICAgICAgICAgICAgICAgICAgICsgdGhpcy5nZXRTdGVwU2NyZWVuQWRqdXN0bWVudCgpO1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogdG9wUG9zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlaGF2aW9yOiAnc21vb3RoJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIFR5cGVFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zY3JvbGwoMCwgdG9wUG9zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2Nyb2xsIHNvIHRoZSBlbGVtZW50IGlzIG9uIHRoZSBib3R0b20gb2YgdGhlIHNjcmVlbi5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9wUG9zID0gKHdpbmRvdy5zY3JvbGxZICsgdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LnRvcCArIHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC5oZWlnaHQpXG4gICAgICAgICAgICAgICAgICAgICAgICAtIHdpbmRvdy5pbm5lckhlaWdodFxuICAgICAgICAgICAgICAgICAgICAgICAgKyAodGhpcy5jdXJyZW50VG91clN0ZXAuc2Nyb2xsQWRqdXN0bWVudCA/IHRoaXMuY3VycmVudFRvdXJTdGVwLnNjcm9sbEFkanVzdG1lbnQgOiAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgLSB0aGlzLmdldFN0ZXBTY3JlZW5BZGp1c3RtZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiB0b3BQb3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnNjcm9sbCgwLCB0b3BQb3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBoYW5kbGVPcmIoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZ3VpZGVkVG91clNlcnZpY2UuYWN0aXZhdGVPcmIoKTtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRvdXJTdGVwICYmIHRoaXMuY3VycmVudFRvdXJTdGVwLnNlbGVjdG9yKSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbFRvQW5kU2V0RWxlbWVudCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc1RvdXJPblNjcmVlbigpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG91clN0ZXBcbiAgICAgICAgICAgICYmIHRoaXMuZWxlbWVudEluVmlld3BvcnQoZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmN1cnJlbnRUb3VyU3RlcC5zZWxlY3RvcikpXG4gICAgICAgICAgICAmJiB0aGlzLmVsZW1lbnRJblZpZXdwb3J0KHRoaXMudG91clN0ZXAubmF0aXZlRWxlbWVudCk7XG4gICAgfVxuXG4gICAgLy8gTW9kaWZpZWQgZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMjM5OTkvaG93LXRvLXRlbGwtaWYtYS1kb20tZWxlbWVudC1pcy12aXNpYmxlLWluLXRoZS1jdXJyZW50LXZpZXdwb3J0XG4gICAgcHJpdmF0ZSBlbGVtZW50SW5WaWV3cG9ydChlbGVtZW50OiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xuICAgICAgICBsZXQgdG9wID0gZWxlbWVudC5vZmZzZXRUb3A7XG4gICAgICAgIGNvbnN0IGhlaWdodCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICAgIHdoaWxlIChlbGVtZW50Lm9mZnNldFBhcmVudCkge1xuICAgICAgICAgICAgZWxlbWVudCA9IChlbGVtZW50Lm9mZnNldFBhcmVudCBhcyBIVE1MRWxlbWVudCk7XG4gICAgICAgICAgICB0b3AgKz0gZWxlbWVudC5vZmZzZXRUb3A7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaXNCb3R0b20oKSkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICB0b3AgPj0gKHdpbmRvdy5wYWdlWU9mZnNldFxuICAgICAgICAgICAgICAgICAgICArIHRoaXMudG9wT2ZQYWdlQWRqdXN0bWVudFxuICAgICAgICAgICAgICAgICAgICArICh0aGlzLmN1cnJlbnRUb3VyU3RlcC5zY3JvbGxBZGp1c3RtZW50ID8gdGhpcy5jdXJyZW50VG91clN0ZXAuc2Nyb2xsQWRqdXN0bWVudCA6IDApXG4gICAgICAgICAgICAgICAgICAgICsgdGhpcy5nZXRTdGVwU2NyZWVuQWRqdXN0bWVudCgpKVxuICAgICAgICAgICAgICAgICYmICh0b3AgKyBoZWlnaHQpIDw9ICh3aW5kb3cucGFnZVlPZmZzZXQgKyB3aW5kb3cuaW5uZXJIZWlnaHQpXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICB0b3AgPj0gKHdpbmRvdy5wYWdlWU9mZnNldCArIHRoaXMudG9wT2ZQYWdlQWRqdXN0bWVudCAtIHRoaXMuZ2V0U3RlcFNjcmVlbkFkanVzdG1lbnQoKSlcbiAgICAgICAgICAgICAgICAmJiAodG9wICsgaGVpZ2h0ICsgKHRoaXMuY3VycmVudFRvdXJTdGVwLnNjcm9sbEFkanVzdG1lbnQgPyB0aGlzLmN1cnJlbnRUb3VyU3RlcC5zY3JvbGxBZGp1c3RtZW50IDogMCkpIDw9ICh3aW5kb3cucGFnZVlPZmZzZXQgKyB3aW5kb3cuaW5uZXJIZWlnaHQpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGJhY2tkcm9wQ2xpY2soZXZlbnQ6IEV2ZW50KTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmd1aWRlZFRvdXJTZXJ2aWNlLnByZXZlbnRCYWNrZHJvcEZyb21BZHZhbmNpbmcpIHtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ndWlkZWRUb3VyU2VydmljZS5uZXh0U3RlcCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHVwZGF0ZVN0ZXBMb2NhdGlvbigpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRvdXJTdGVwICYmIHRoaXMuY3VycmVudFRvdXJTdGVwLnNlbGVjdG9yKSB7XG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuY3VycmVudFRvdXJTdGVwLnNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QgPSAoc2VsZWN0ZWRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpIGFzIERPTVJlY3QpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaXNCb3R0b20oKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvblxuICAgICAgICAgICAgJiYgKHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5Cb3R0b21cbiAgICAgICAgICAgIHx8IHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5Cb3R0b21MZWZ0XG4gICAgICAgICAgICB8fCB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uQm90dG9tUmlnaHQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgdG9wUG9zaXRpb24oKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgcGFkZGluZ0FkanVzdG1lbnQgPSB0aGlzLmdldEhpZ2hsaWdodFBhZGRpbmcoKTtcblxuICAgICAgICBpZiAodGhpcy5pc0JvdHRvbSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LnRvcCArIHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC5oZWlnaHQgKyBwYWRkaW5nQWRqdXN0bWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QudG9wIC0gdGhpcy5nZXRIaWdobGlnaHRQYWRkaW5nKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBvcmJUb3BQb3NpdGlvbigpOiBudW1iZXIge1xuICAgICAgICBpZiAodGhpcy5pc0JvdHRvbSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LnRvcCArIHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC5oZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uUmlnaHRcbiAgICAgICAgICAgIHx8IHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5MZWZ0XG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QudG9wICsgKHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC5oZWlnaHQgLyAyKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LnRvcDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldCBjYWxjdWxhdGVkTGVmdFBvc2l0aW9uKCk6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IHBhZGRpbmdBZGp1c3RtZW50ID0gdGhpcy5nZXRIaWdobGlnaHRQYWRkaW5nKCk7XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLlRvcFJpZ2h0XG4gICAgICAgICAgICB8fCB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uQm90dG9tUmlnaHRcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC5yaWdodCAtIHRoaXMudG91clN0ZXBXaWR0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uVG9wTGVmdFxuICAgICAgICAgICAgfHwgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLkJvdHRvbUxlZnRcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC5sZWZ0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uTGVmdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC5sZWZ0IC0gdGhpcy50b3VyU3RlcFdpZHRoIC0gcGFkZGluZ0FkanVzdG1lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLlJpZ2h0KSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC5sZWZ0ICsgdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LndpZHRoICsgcGFkZGluZ0FkanVzdG1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICh0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QucmlnaHQgLSAodGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LndpZHRoIC8gMikgLSAodGhpcy50b3VyU3RlcFdpZHRoIC8gMikpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgbGVmdFBvc2l0aW9uKCk6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLmNhbGN1bGF0ZWRMZWZ0UG9zaXRpb24gPj0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FsY3VsYXRlZExlZnRQb3NpdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhZGp1c3RtZW50ID0gTWF0aC5tYXgoMCwgLXRoaXMuY2FsY3VsYXRlZExlZnRQb3NpdGlvbilcbiAgICAgICAgY29uc3QgbWF4QWRqdXN0bWVudCA9IE1hdGgubWluKHRoaXMubWF4V2lkdGhBZGp1c3RtZW50Rm9yVG91clN0ZXAsIGFkanVzdG1lbnQpO1xuICAgICAgICByZXR1cm4gdGhpcy5jYWxjdWxhdGVkTGVmdFBvc2l0aW9uICsgbWF4QWRqdXN0bWVudDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IG9yYkxlZnRQb3NpdGlvbigpOiBudW1iZXIge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uVG9wUmlnaHRcbiAgICAgICAgICAgIHx8IHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5Cb3R0b21SaWdodFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QucmlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uVG9wTGVmdFxuICAgICAgICAgICAgfHwgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLkJvdHRvbUxlZnRcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LmxlZnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLkxlZnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QubGVmdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uUmlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LmxlZnQgKyB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3Qud2lkdGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICh0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QucmlnaHQgLSAodGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LndpZHRoIC8gMikpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgdHJhbnNmb3JtKCk6IHN0cmluZyB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgICF0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvblxuICAgICAgICAgICAgfHwgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLlRvcFxuICAgICAgICAgICAgfHwgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLlRvcFJpZ2h0XG4gICAgICAgICAgICB8fCB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uVG9wTGVmdFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiAndHJhbnNsYXRlWSgtMTAwJSknO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgb3JiVHJhbnNmb3JtKCk6IHN0cmluZyB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgICF0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvblxuICAgICAgICAgICAgfHwgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLlRvcFxuICAgICAgICAgICAgfHwgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLkJvdHRvbVxuICAgICAgICAgICAgfHwgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLlRvcExlZnRcbiAgICAgICAgICAgIHx8IHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5Cb3R0b21MZWZ0XG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuICd0cmFuc2xhdGVZKC01MCUpJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5Ub3BSaWdodFxuICAgICAgICAgICAgfHwgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLkJvdHRvbVJpZ2h0XG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuICd0cmFuc2xhdGUoLTEwMCUsIC01MCUpJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5SaWdodFxuICAgICAgICAgICAgfHwgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLkxlZnRcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3RyYW5zbGF0ZSgtNTAlLCAtNTAlKSc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IG92ZXJsYXlUb3AoKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC50b3AgLSB0aGlzLmdldEhpZ2hsaWdodFBhZGRpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IG92ZXJsYXlMZWZ0KCk6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QubGVmdCAtIHRoaXMuZ2V0SGlnaGxpZ2h0UGFkZGluZygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgb3ZlcmxheUhlaWdodCgpOiBudW1iZXIge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LmhlaWdodCArICh0aGlzLmdldEhpZ2hsaWdodFBhZGRpbmcoKSAqIDIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgb3ZlcmxheVdpZHRoKCk6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3Qud2lkdGggKyAodGhpcy5nZXRIaWdobGlnaHRQYWRkaW5nKCkgKiAyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEhpZ2hsaWdodFBhZGRpbmcoKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IHBhZGRpbmdBZGp1c3RtZW50ID0gdGhpcy5jdXJyZW50VG91clN0ZXAudXNlSGlnaGxpZ2h0UGFkZGluZyA/IHRoaXMuaGlnaGxpZ2h0UGFkZGluZyA6IDA7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb3VyU3RlcC5oaWdobGlnaHRQYWRkaW5nKSB7XG4gICAgICAgICAgICBwYWRkaW5nQWRqdXN0bWVudCA9IHRoaXMuY3VycmVudFRvdXJTdGVwLmhpZ2hsaWdodFBhZGRpbmc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhZGRpbmdBZGp1c3RtZW50O1xuICAgIH1cblxuICAgIC8vIFRoaXMgY2FsY3VsYXRlcyBhIHZhbHVlIHRvIGFkZCBvciBzdWJ0cmFjdCBzbyB0aGUgc3RlcCBzaG91bGQgbm90IGJlIG9mZiBzY3JlZW4uXG4gICAgcHJpdmF0ZSBnZXRTdGVwU2NyZWVuQWRqdXN0bWVudCgpOiBudW1iZXIge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uTGVmdFxuICAgICAgICAgICAgfHwgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLlJpZ2h0XG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZWxlbWVudEhlaWdodCA9IHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC5oZWlnaHRcbiAgICAgICAgICAgICsgKHRoaXMuY3VycmVudFRvdXJTdGVwLnNjcm9sbEFkanVzdG1lbnQgPyB0aGlzLmN1cnJlbnRUb3VyU3RlcC5zY3JvbGxBZGp1c3RtZW50IDogMClcbiAgICAgICAgICAgICsgdGhpcy50b3VyU3RlcC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcblxuICAgICAgICBpZiAoKHdpbmRvdy5pbm5lckhlaWdodCAtIHRoaXMudG9wT2ZQYWdlQWRqdXN0bWVudCkgPCBlbGVtZW50SGVpZ2h0KSB7XG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudEhlaWdodCAtICh3aW5kb3cuaW5uZXJIZWlnaHQgLSB0aGlzLnRvcE9mUGFnZUFkanVzdG1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn1cbiJdfQ==