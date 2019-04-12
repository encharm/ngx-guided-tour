/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { fromEvent } from 'rxjs';
import { Orientation } from './guided-tour.constants';
import { GuidedTourService } from './guided-tour.service';
var GuidedTourComponent = /** @class */ (function () {
    function GuidedTourComponent(guidedTourService) {
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
    Object.defineProperty(GuidedTourComponent.prototype, "maxWidthAdjustmentForTourStep", {
        get: /**
         * @private
         * @return {?}
         */
        function () {
            return this.tourStepWidth - this.minimalTourStepWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourComponent.prototype, "widthAdjustmentForScreenBound", {
        get: /**
         * @private
         * @return {?}
         */
        function () {
            if (!this.tourStep) {
                return 0;
            }
            /** @type {?} */
            var adjustment = 0;
            if (this.calculatedLeftPosition < 0) {
                adjustment = -this.calculatedLeftPosition;
            }
            if (this.calculatedLeftPosition > window.innerWidth - this.tourStepWidth) {
                adjustment = this.calculatedLeftPosition - (window.innerWidth - this.tourStepWidth);
            }
            return Math.min(this.maxWidthAdjustmentForTourStep, adjustment);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourComponent.prototype, "calculatedTourStepWidth", {
        get: /**
         * @return {?}
         */
        function () {
            return this.tourStepWidth - this.widthAdjustmentForScreenBound;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    GuidedTourComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.guidedTourService.guidedTourCurrentStepStream.subscribe((/**
         * @param {?} step
         * @return {?}
         */
        function (step) {
            _this.currentTourStep = step;
            if (step && step.selector) {
                /** @type {?} */
                var selectedElement = document.querySelector(step.selector);
                if (selectedElement) {
                    _this.scrollToAndSetElement();
                }
                else {
                    _this.selectedElementRect = null;
                }
            }
            else {
                _this.selectedElementRect = null;
            }
        }));
        this.guidedTourService.guidedTourOrbShowingStream.subscribe((/**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            _this.isOrbShowing = value;
        }));
        this.resizeSubscription = fromEvent(window, 'resize').subscribe((/**
         * @return {?}
         */
        function () {
            _this.updateStepLocation();
        }));
        this.scrollSubscription = fromEvent(window, 'scroll').subscribe((/**
         * @return {?}
         */
        function () {
            _this.updateStepLocation();
        }));
    };
    /**
     * @return {?}
     */
    GuidedTourComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.resizeSubscription.unsubscribe();
        this.scrollSubscription.unsubscribe();
    };
    /**
     * @return {?}
     */
    GuidedTourComponent.prototype.scrollToAndSetElement = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.updateStepLocation();
        // Allow things to render to scroll to the correct location
        setTimeout((/**
         * @return {?}
         */
        function () {
            if (!_this.isOrbShowing && !_this.isTourOnScreen()) {
                if (_this.selectedElementRect && _this.isBottom()) {
                    // Scroll so the element is on the top of the screen.
                    /** @type {?} */
                    var topPos = ((window.scrollY + _this.selectedElementRect.top) - _this.topOfPageAdjustment)
                        - (_this.currentTourStep.scrollAdjustment ? _this.currentTourStep.scrollAdjustment : 0)
                        + _this.getStepScreenAdjustment();
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
                    var topPos = (window.scrollY + _this.selectedElementRect.top + _this.selectedElementRect.height)
                        - window.innerHeight
                        + (_this.currentTourStep.scrollAdjustment ? _this.currentTourStep.scrollAdjustment : 0)
                        - _this.getStepScreenAdjustment();
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
    };
    /**
     * @return {?}
     */
    GuidedTourComponent.prototype.handleOrb = /**
     * @return {?}
     */
    function () {
        this.guidedTourService.activateOrb();
        if (this.currentTourStep && this.currentTourStep.selector) {
            this.scrollToAndSetElement();
        }
    };
    /**
     * @private
     * @return {?}
     */
    GuidedTourComponent.prototype.isTourOnScreen = /**
     * @private
     * @return {?}
     */
    function () {
        return this.tourStep
            && this.elementInViewport(document.querySelector(this.currentTourStep.selector))
            && this.elementInViewport(this.tourStep.nativeElement);
    };
    // Modified from https://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
    // Modified from https://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
    /**
     * @private
     * @param {?} element
     * @return {?}
     */
    GuidedTourComponent.prototype.elementInViewport = 
    // Modified from https://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
    /**
     * @private
     * @param {?} element
     * @return {?}
     */
    function (element) {
        /** @type {?} */
        var top = element.offsetTop;
        /** @type {?} */
        var height = element.offsetHeight;
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
    };
    /**
     * @param {?} event
     * @return {?}
     */
    GuidedTourComponent.prototype.backdropClick = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (this.guidedTourService.preventBackdropFromAdvancing) {
            event.stopPropagation();
        }
        else {
            this.guidedTourService.nextStep();
        }
    };
    /**
     * @return {?}
     */
    GuidedTourComponent.prototype.updateStepLocation = /**
     * @return {?}
     */
    function () {
        if (this.currentTourStep && this.currentTourStep.selector) {
            /** @type {?} */
            var selectedElement = document.querySelector(this.currentTourStep.selector);
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
    };
    /**
     * @private
     * @return {?}
     */
    GuidedTourComponent.prototype.isBottom = /**
     * @private
     * @return {?}
     */
    function () {
        return this.currentTourStep.orientation
            && (this.currentTourStep.orientation === Orientation.Bottom
                || this.currentTourStep.orientation === Orientation.BottomLeft
                || this.currentTourStep.orientation === Orientation.BottomRight);
    };
    Object.defineProperty(GuidedTourComponent.prototype, "topPosition", {
        get: /**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var paddingAdjustment = this.getHighlightPadding();
            if (this.isBottom()) {
                return this.selectedElementRect.top + this.selectedElementRect.height + paddingAdjustment;
            }
            return this.selectedElementRect.top - this.getHighlightPadding();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourComponent.prototype, "orbTopPosition", {
        get: /**
         * @return {?}
         */
        function () {
            if (this.isBottom()) {
                return this.selectedElementRect.top + this.selectedElementRect.height;
            }
            if (this.currentTourStep.orientation === Orientation.Right
                || this.currentTourStep.orientation === Orientation.Left) {
                return (this.selectedElementRect.top + (this.selectedElementRect.height / 2));
            }
            return this.selectedElementRect.top;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourComponent.prototype, "calculatedLeftPosition", {
        get: /**
         * @private
         * @return {?}
         */
        function () {
            /** @type {?} */
            var paddingAdjustment = this.getHighlightPadding();
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourComponent.prototype, "leftPosition", {
        get: /**
         * @return {?}
         */
        function () {
            if (this.calculatedLeftPosition >= 0) {
                return this.calculatedLeftPosition;
            }
            /** @type {?} */
            var adjustment = Math.max(0, -this.calculatedLeftPosition);
            /** @type {?} */
            var maxAdjustment = Math.min(this.maxWidthAdjustmentForTourStep, adjustment);
            return this.calculatedLeftPosition + maxAdjustment;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourComponent.prototype, "orbLeftPosition", {
        get: /**
         * @return {?}
         */
        function () {
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourComponent.prototype, "transform", {
        get: /**
         * @return {?}
         */
        function () {
            if (!this.currentTourStep.orientation
                || this.currentTourStep.orientation === Orientation.Top
                || this.currentTourStep.orientation === Orientation.TopRight
                || this.currentTourStep.orientation === Orientation.TopLeft) {
                return 'translateY(-100%)';
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourComponent.prototype, "orbTransform", {
        get: /**
         * @return {?}
         */
        function () {
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourComponent.prototype, "overlayTop", {
        get: /**
         * @return {?}
         */
        function () {
            if (this.selectedElementRect) {
                return this.selectedElementRect.top - this.getHighlightPadding();
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourComponent.prototype, "overlayLeft", {
        get: /**
         * @return {?}
         */
        function () {
            if (this.selectedElementRect) {
                return this.selectedElementRect.left - this.getHighlightPadding();
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourComponent.prototype, "overlayHeight", {
        get: /**
         * @return {?}
         */
        function () {
            if (this.selectedElementRect) {
                return this.selectedElementRect.height + (this.getHighlightPadding() * 2);
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourComponent.prototype, "overlayWidth", {
        get: /**
         * @return {?}
         */
        function () {
            if (this.selectedElementRect) {
                return this.selectedElementRect.width + (this.getHighlightPadding() * 2);
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     * @return {?}
     */
    GuidedTourComponent.prototype.getHighlightPadding = /**
     * @private
     * @return {?}
     */
    function () {
        /** @type {?} */
        var paddingAdjustment = this.currentTourStep.useHighlightPadding ? this.highlightPadding : 0;
        if (this.currentTourStep.highlightPadding) {
            paddingAdjustment = this.currentTourStep.highlightPadding;
        }
        return paddingAdjustment;
    };
    // This calculates a value to add or subtract so the step should not be off screen.
    // This calculates a value to add or subtract so the step should not be off screen.
    /**
     * @private
     * @return {?}
     */
    GuidedTourComponent.prototype.getStepScreenAdjustment = 
    // This calculates a value to add or subtract so the step should not be off screen.
    /**
     * @private
     * @return {?}
     */
    function () {
        if (this.currentTourStep.orientation === Orientation.Left
            || this.currentTourStep.orientation === Orientation.Right) {
            return 0;
        }
        /** @type {?} */
        var elementHeight = this.selectedElementRect.height
            + (this.currentTourStep.scrollAdjustment ? this.currentTourStep.scrollAdjustment : 0)
            + this.tourStep.nativeElement.getBoundingClientRect().height;
        if ((window.innerHeight - this.topOfPageAdjustment) < elementHeight) {
            return elementHeight - (window.innerHeight - this.topOfPageAdjustment);
        }
        return 0;
    };
    GuidedTourComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ngx-guided-tour',
                    template: "\n        <div *ngIf=\"currentTourStep && selectedElementRect && isOrbShowing\"\n                (mouseenter)=\"handleOrb()\"\n                class=\"tour-orb tour-{{ currentTourStep.orientation }}\"\n                [style.top.px]=\"orbTopPosition\"\n                [style.left.px]=\"orbLeftPosition\"\n                [style.transform]=\"orbTransform\">\n                <div class=\"tour-orb-ring\"></div>\n        </div>\n        <div *ngIf=\"currentTourStep && !isOrbShowing\">\n            <div class=\"guided-tour-user-input-mask\" (click)=\"backdropClick($event)\"></div>\n            <div class=\"guided-tour-spotlight-overlay\"\n                [style.top.px]=\"overlayTop\"\n                [style.left.px]=\"overlayLeft\"\n                [style.height.px]=\"overlayHeight\"\n                [style.width.px]=\"overlayWidth\">\n            </div>\n        </div>\n        <div *ngIf=\"currentTourStep && !isOrbShowing\">\n            <div #tourStep *ngIf=\"currentTourStep\"\n                class=\"tour-step tour-{{ currentTourStep.orientation }}\"\n                [ngClass]=\"{\n                    'page-tour-step': !currentTourStep.selector\n                }\"\n                [style.top.px]=\"(currentTourStep.selector && selectedElementRect ? topPosition : null)\"\n                [style.left.px]=\"(currentTourStep.selector && selectedElementRect ? leftPosition : null)\"\n                [style.width.px]=\"(currentTourStep.selector && selectedElementRect ? calculatedTourStepWidth : null)\"\n                [style.transform]=\"(currentTourStep.selector && selectedElementRect ? transform : null)\">\n                <div *ngIf=\"currentTourStep.selector\" class=\"tour-arrow\"></div>\n                <div class=\"tour-block\">\n                    <h3 class=\"tour-title\" *ngIf=\"currentTourStep.title && currentTourStep.selector\">\n                        {{ currentTourStep.title }}\n                    </h3>\n                    <h2 class=\"tour-title\" *ngIf=\"currentTourStep.title && !currentTourStep.selector\">\n                        {{ currentTourStep.title }}\n                    </h2>\n                    <div class=\"tour-content\" [innerHTML]=\"currentTourStep.content\"></div>\n                    <div class=\"tour-buttons\">\n                        <button *ngIf=\"!guidedTourService.onResizeMessage\"\n                            (click)=\"guidedTourService.skipTour()\"\n                            class=\"skip-button link-button\">\n                            Skip\n                        </button>\n                        <button *ngIf=\"!guidedTourService.onLastStep && !guidedTourService.onResizeMessage\"\n                            class=\"next-button\"\n                            (click)=\"guidedTourService.nextStep()\">\n                            Next&nbsp;&nbsp;{{ guidedTourService.currentTourStepDisplay }}/{{ guidedTourService.currentTourStepCount }}\n                        </button>\n                        <button *ngIf=\"guidedTourService.onLastStep\"\n                            class=\"next-button\"\n                            (click)=\"guidedTourService.nextStep()\">\n                            Done\n                        </button>\n\n                        <button *ngIf=\"guidedTourService.onResizeMessage\"\n                            class=\"next-button\"\n                            (click)=\"guidedTourService.resetTour()\">\n                            Close\n                        </button>\n                        <button *ngIf=\"!guidedTourService.onFirstStep && !guidedTourService.onResizeMessage\"\n                            class=\"back-button link-button\"\n                            (click)=\"guidedTourService.backStep()\">\n                            Back\n                        </button>\n                    </div>\n                </div>\n            </div>\n        </div>\n    ",
                    encapsulation: ViewEncapsulation.None,
                    styles: ["ngx-guided-tour .guided-tour-user-input-mask{position:fixed;top:0;left:0;display:block;height:100%;width:100%;max-height:100vh;text-align:center;opacity:0}ngx-guided-tour .guided-tour-spotlight-overlay{position:fixed;box-shadow:0 0 0 9999px rgba(0,0,0,.7),0 0 1.5rem rgba(0,0,0,.5)}ngx-guided-tour .tour-orb{position:fixed;width:20px;height:20px;border-radius:50%}ngx-guided-tour .tour-orb .tour-orb-ring{width:35px;height:35px;position:relative;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);-webkit-animation:2s linear infinite pulse;animation:2s linear infinite pulse}ngx-guided-tour .tour-orb .tour-orb-ring:after{content:'';display:inline-block;height:100%;width:100%;border-radius:50%}@-webkit-keyframes pulse{from{-webkit-transform:translate(-50%,-50%) scale(.45);transform:translate(-50%,-50%) scale(.45);opacity:1}to{-webkit-transform:translate(-50%,-50%) scale(1);transform:translate(-50%,-50%) scale(1);opacity:0}}@keyframes pulse{from{-webkit-transform:translate(-50%,-50%) scale(.45);transform:translate(-50%,-50%) scale(.45);opacity:1}to{-webkit-transform:translate(-50%,-50%) scale(1);transform:translate(-50%,-50%) scale(1);opacity:0}}ngx-guided-tour .tour-step{position:fixed}ngx-guided-tour .tour-step.page-tour-step{max-width:400px;width:50%;left:50%;top:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}ngx-guided-tour .tour-step.tour-bottom .tour-arrow::before,ngx-guided-tour .tour-step.tour-bottom-left .tour-arrow::before,ngx-guided-tour .tour-step.tour-bottom-right .tour-arrow::before{position:absolute}ngx-guided-tour .tour-step.tour-bottom .tour-block,ngx-guided-tour .tour-step.tour-bottom-left .tour-block,ngx-guided-tour .tour-step.tour-bottom-right .tour-block{margin-top:10px}ngx-guided-tour .tour-step.tour-top,ngx-guided-tour .tour-step.tour-top-left,ngx-guided-tour .tour-step.tour-top-right{margin-bottom:10px}ngx-guided-tour .tour-step.tour-top .tour-arrow::before,ngx-guided-tour .tour-step.tour-top-left .tour-arrow::before,ngx-guided-tour .tour-step.tour-top-right .tour-arrow::before{position:absolute;bottom:0}ngx-guided-tour .tour-step.tour-top .tour-block,ngx-guided-tour .tour-step.tour-top-left .tour-block,ngx-guided-tour .tour-step.tour-top-right .tour-block{margin-bottom:10px}ngx-guided-tour .tour-step.tour-bottom .tour-arrow::before,ngx-guided-tour .tour-step.tour-top .tour-arrow::before{-webkit-transform:translateX(-50%);transform:translateX(-50%);left:50%}ngx-guided-tour .tour-step.tour-bottom-right .tour-arrow::before,ngx-guided-tour .tour-step.tour-top-right .tour-arrow::before{-webkit-transform:translateX(-100%);transform:translateX(-100%);left:calc(100% - 5px)}ngx-guided-tour .tour-step.tour-bottom-left .tour-arrow::before,ngx-guided-tour .tour-step.tour-top-left .tour-arrow::before{left:5px}ngx-guided-tour .tour-step.tour-left .tour-arrow::before{position:absolute;left:100%;-webkit-transform:translateX(-100%);transform:translateX(-100%);top:5px}ngx-guided-tour .tour-step.tour-left .tour-block{margin-right:10px}ngx-guided-tour .tour-step.tour-right .tour-arrow::before{position:absolute;left:0;top:5px}ngx-guided-tour .tour-step.tour-right .tour-block{margin-left:10px}ngx-guided-tour .tour-step .tour-block{padding:15px 25px}ngx-guided-tour .tour-step .tour-title{font-weight:700!important;padding-bottom:20px}ngx-guided-tour .tour-step h3.tour-title{font-size:20px}ngx-guided-tour .tour-step h2.tour-title{font-size:30px}ngx-guided-tour .tour-step .tour-content{min-height:80px;padding-bottom:30px;font-size:15px}ngx-guided-tour .tour-step .tour-buttons{overflow:hidden}ngx-guided-tour .tour-step .tour-buttons button.link-button{font-size:15px;font-weight:700;max-width:none!important;cursor:pointer;text-align:center;white-space:nowrap;vertical-align:middle;border:1px solid transparent;line-height:1.5;background-color:transparent;position:relative;outline:0;padding:0 15px;-webkit-appearance:button}ngx-guided-tour .tour-step .tour-buttons button.skip-button.link-button{padding-left:0;border-left:0}ngx-guided-tour .tour-step .tour-buttons .back-button{float:right}ngx-guided-tour .tour-step .tour-buttons .next-button{cursor:pointer;border-radius:1px;float:right;font-size:14px;border:none;outline:0;padding-left:10px;padding-right:10px}"]
                }] }
    ];
    /** @nocollapse */
    GuidedTourComponent.ctorParameters = function () { return [
        { type: GuidedTourService }
    ]; };
    GuidedTourComponent.propDecorators = {
        topOfPageAdjustment: [{ type: Input }],
        tourStepWidth: [{ type: Input }],
        minimalTourStepWidth: [{ type: Input }],
        tourStep: [{ type: ViewChild, args: ['tourStep',] }]
    };
    return GuidedTourComponent;
}());
export { GuidedTourComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZGVkLXRvdXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWd1aWRlZC10b3VyLyIsInNvdXJjZXMiOlsibGliL2d1aWRlZC10b3VyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFpQixTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBYSxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckgsT0FBTyxFQUFFLFNBQVMsRUFBZ0IsTUFBTSxNQUFNLENBQUM7QUFDL0MsT0FBTyxFQUFFLFdBQVcsRUFBWSxNQUFNLHlCQUF5QixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRTFEO0lBd0ZJLDZCQUNXLGlCQUFvQztRQUFwQyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBZC9CLHdCQUFtQixHQUFJLENBQUMsQ0FBQztRQUN6QixrQkFBYSxHQUFJLEdBQUcsQ0FBQztRQUNyQix5QkFBb0IsR0FBSSxHQUFHLENBQUM7UUFFckMscUJBQWdCLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLG9CQUFlLEdBQWEsSUFBSSxDQUFDO1FBQ2pDLHdCQUFtQixHQUFZLElBQUksQ0FBQztRQUNwQyxpQkFBWSxHQUFHLEtBQUssQ0FBQztRQUVwQix3QkFBbUIsR0FBRyxDQUFDLENBQUM7SUFNNUIsQ0FBQztJQUVMLHNCQUFZLDhEQUE2Qjs7Ozs7UUFBekM7WUFDSSxPQUFPLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDO1FBQzFELENBQUM7OztPQUFBO0lBRUQsc0JBQVksOERBQTZCOzs7OztRQUF6QztZQUNJLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNoQixPQUFPLENBQUMsQ0FBQzthQUNaOztnQkFDRyxVQUFVLEdBQUcsQ0FBQztZQUNsQixJQUFJLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxDQUFDLEVBQUU7Z0JBQ2pDLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQzthQUM3QztZQUNELElBQUksSUFBSSxDQUFDLHNCQUFzQixHQUFHLE1BQU0sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRTtnQkFDdEUsVUFBVSxHQUFHLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2FBQ3ZGO1lBRUQsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyw2QkFBNkIsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNwRSxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLHdEQUF1Qjs7OztRQUFsQztZQUNJLE9BQU8sSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsNkJBQTZCLENBQUM7UUFDbkUsQ0FBQzs7O09BQUE7Ozs7SUFFTSw2Q0FBZTs7O0lBQXRCO1FBQUEsaUJBMEJDO1FBekJHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQywyQkFBMkIsQ0FBQyxTQUFTOzs7O1FBQUMsVUFBQyxJQUFjO1lBQ3hFLEtBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1lBQzVCLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7O29CQUNqQixlQUFlLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUM3RCxJQUFJLGVBQWUsRUFBRTtvQkFDakIsS0FBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7aUJBQ2hDO3FCQUFNO29CQUNILEtBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7aUJBQ25DO2FBQ0o7aUJBQU07Z0JBQ0gsS0FBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQzthQUNuQztRQUNMLENBQUMsRUFBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGlCQUFpQixDQUFDLDBCQUEwQixDQUFDLFNBQVM7Ozs7UUFBQyxVQUFDLEtBQWM7WUFDdkUsS0FBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7UUFDOUIsQ0FBQyxFQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxTQUFTOzs7UUFBQztZQUM1RCxLQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUM5QixDQUFDLEVBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxrQkFBa0IsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLFNBQVM7OztRQUFDO1lBQzVELEtBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzlCLENBQUMsRUFBQyxDQUFDO0lBQ1AsQ0FBQzs7OztJQUVNLHlDQUFXOzs7SUFBbEI7UUFDSSxJQUFJLENBQUMsa0JBQWtCLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdEMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzFDLENBQUM7Ozs7SUFFTSxtREFBcUI7OztJQUE1QjtRQUFBLGlCQTZDQztRQTVDRyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUMxQiwyREFBMkQ7UUFDM0QsVUFBVTs7O1FBQUM7WUFDUCxJQUFJLENBQUMsS0FBSSxDQUFDLFlBQVksSUFBSSxDQUFDLEtBQUksQ0FBQyxjQUFjLEVBQUUsRUFBRTtnQkFDOUMsSUFBSSxLQUFJLENBQUMsbUJBQW1CLElBQUksS0FBSSxDQUFDLFFBQVEsRUFBRSxFQUFFOzs7d0JBRXZDLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFJLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSSxDQUFDLG1CQUFtQixDQUFDOzBCQUNyRixDQUFDLEtBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzswQkFDbkYsS0FBSSxDQUFDLHVCQUF1QixFQUFFO29CQUNwQyxJQUFJO3dCQUNBLE1BQU0sQ0FBQyxRQUFRLENBQUM7NEJBQ1osSUFBSSxFQUFFLElBQUk7NEJBQ1YsR0FBRyxFQUFFLE1BQU07NEJBQ1gsUUFBUSxFQUFFLFFBQVE7eUJBQ3JCLENBQUMsQ0FBQztxQkFDTjtvQkFBQyxPQUFPLEdBQUcsRUFBRTt3QkFDVixJQUFJLEdBQUcsWUFBWSxTQUFTLEVBQUU7NEJBQzFCLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO3lCQUM1Qjs2QkFBTTs0QkFDSCxNQUFNLEdBQUcsQ0FBQzt5QkFDYjtxQkFDSjtpQkFDSjtxQkFBTTs7O3dCQUVHLE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDOzBCQUMxRixNQUFNLENBQUMsV0FBVzswQkFDbEIsQ0FBQyxLQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7MEJBQ25GLEtBQUksQ0FBQyx1QkFBdUIsRUFBRTtvQkFDcEMsSUFBSTt3QkFDQSxNQUFNLENBQUMsUUFBUSxDQUFDOzRCQUNaLElBQUksRUFBRSxJQUFJOzRCQUNWLEdBQUcsRUFBRSxNQUFNOzRCQUNYLFFBQVEsRUFBRSxRQUFRO3lCQUNyQixDQUFDLENBQUM7cUJBQ047b0JBQUMsT0FBTyxHQUFHLEVBQUU7d0JBQ1YsSUFBSSxHQUFHLFlBQVksU0FBUyxFQUFFOzRCQUMxQixNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQzt5QkFDNUI7NkJBQU07NEJBQ0gsTUFBTSxHQUFHLENBQUM7eUJBQ2I7cUJBQ0o7aUJBQ0o7YUFDSjtRQUNMLENBQUMsRUFBQyxDQUFDO0lBQ1AsQ0FBQzs7OztJQUVNLHVDQUFTOzs7SUFBaEI7UUFDSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckMsSUFBSSxJQUFJLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFO1lBQ3ZELElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1NBQ2hDO0lBQ0wsQ0FBQzs7Ozs7SUFFTyw0Q0FBYzs7OztJQUF0QjtRQUNJLE9BQU8sSUFBSSxDQUFDLFFBQVE7ZUFDYixJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2VBQzdFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRCwySEFBMkg7Ozs7Ozs7SUFDbkgsK0NBQWlCOzs7Ozs7O0lBQXpCLFVBQTBCLE9BQW9COztZQUN0QyxHQUFHLEdBQUcsT0FBTyxDQUFDLFNBQVM7O1lBQ3JCLE1BQU0sR0FBRyxPQUFPLENBQUMsWUFBWTtRQUVuQyxPQUFPLE9BQU8sQ0FBQyxZQUFZLEVBQUU7WUFDekIsT0FBTyxHQUFHLENBQUMsbUJBQUEsT0FBTyxDQUFDLFlBQVksRUFBZSxDQUFDLENBQUM7WUFDaEQsR0FBRyxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUM7U0FDNUI7UUFDRCxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUNqQixPQUFPLENBQ0gsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVc7a0JBQ3BCLElBQUksQ0FBQyxtQkFBbUI7a0JBQ3hCLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2tCQUNuRixJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQzttQkFDbEMsQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FDakUsQ0FBQztTQUNMO2FBQU07WUFDSCxPQUFPLENBQ0gsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7bUJBQ3BGLENBQUMsR0FBRyxHQUFHLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FDdkosQ0FBQztTQUNMO0lBQ0wsQ0FBQzs7Ozs7SUFFTSwyQ0FBYTs7OztJQUFwQixVQUFxQixLQUFZO1FBQzdCLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLDRCQUE0QixFQUFFO1lBQ3JELEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztTQUMzQjthQUFNO1lBQ0gsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ3JDO0lBQ0wsQ0FBQzs7OztJQUVNLGdEQUFrQjs7O0lBQXpCO1FBQ0ksSUFBSSxJQUFJLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFOztnQkFDakQsZUFBZSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUM7WUFDN0UsSUFBSSxlQUFlLEVBQUU7Z0JBQ2pCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxDQUFDLG1CQUFBLGVBQWUsQ0FBQyxxQkFBcUIsRUFBRSxFQUFXLENBQUMsQ0FBQzthQUNuRjtpQkFBTTtnQkFDSCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO2FBQ25DO1NBQ0o7YUFBTTtZQUNILElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7U0FDbkM7SUFDTCxDQUFDOzs7OztJQUVPLHNDQUFROzs7O0lBQWhCO1FBQ0ksT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVc7ZUFDaEMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsS0FBSyxXQUFXLENBQUMsTUFBTTttQkFDeEQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLEtBQUssV0FBVyxDQUFDLFVBQVU7bUJBQzNELElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxLQUFLLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRUQsc0JBQVcsNENBQVc7Ozs7UUFBdEI7O2dCQUNVLGlCQUFpQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtZQUVwRCxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRTtnQkFDakIsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEdBQUcsaUJBQWlCLENBQUM7YUFDN0Y7WUFFRCxPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDckUsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVywrQ0FBYzs7OztRQUF6QjtZQUNJLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFO2dCQUNqQixPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQzthQUN6RTtZQUVELElBQ0ksSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLEtBQUssV0FBVyxDQUFDLEtBQUs7bUJBQ25ELElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxLQUFLLFdBQVcsQ0FBQyxJQUFJLEVBQzFEO2dCQUNFLE9BQU8sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2pGO1lBRUQsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDO1FBQ3hDLENBQUM7OztPQUFBO0lBRUQsc0JBQVksdURBQXNCOzs7OztRQUFsQzs7Z0JBQ1UsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixFQUFFO1lBRXBELElBQ0ksSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLEtBQUssV0FBVyxDQUFDLFFBQVE7bUJBQ3RELElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxLQUFLLFdBQVcsQ0FBQyxXQUFXLEVBQ2pFO2dCQUNFLE9BQU8sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQzthQUNoRTtZQUVELElBQ0ksSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLEtBQUssV0FBVyxDQUFDLE9BQU87bUJBQ3JELElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxLQUFLLFdBQVcsQ0FBQyxVQUFVLEVBQ2hFO2dCQUNFLE9BQU8sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDMUM7WUFFRCxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxLQUFLLFdBQVcsQ0FBQyxJQUFJLEVBQUU7Z0JBQ3ZELE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxHQUFHLGlCQUFpQixDQUFDO2FBQ2pGO1lBRUQsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsS0FBSyxXQUFXLENBQUMsS0FBSyxFQUFFO2dCQUN4RCxPQUFPLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxHQUFHLGlCQUFpQixDQUFDLENBQUM7YUFDL0Y7WUFFRCxPQUFPLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUcsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVyw2Q0FBWTs7OztRQUF2QjtZQUNJLElBQUksSUFBSSxDQUFDLHNCQUFzQixJQUFJLENBQUMsRUFBRTtnQkFDbEMsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUM7YUFDdEM7O2dCQUNLLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQzs7Z0JBQ3RELGFBQWEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyw2QkFBNkIsRUFBRSxVQUFVLENBQUM7WUFDOUUsT0FBTyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsYUFBYSxDQUFDO1FBQ3ZELENBQUM7OztPQUFBO0lBRUQsc0JBQVcsZ0RBQWU7Ozs7UUFBMUI7WUFDSSxJQUNJLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxLQUFLLFdBQVcsQ0FBQyxRQUFRO21CQUN0RCxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsS0FBSyxXQUFXLENBQUMsV0FBVyxFQUNqRTtnQkFDRSxPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUM7YUFDekM7WUFFRCxJQUNJLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxLQUFLLFdBQVcsQ0FBQyxPQUFPO21CQUNyRCxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsS0FBSyxXQUFXLENBQUMsVUFBVSxFQUNoRTtnQkFDRSxPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUM7YUFDeEM7WUFFRCxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxLQUFLLFdBQVcsQ0FBQyxJQUFJLEVBQUU7Z0JBQ3ZELE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQzthQUN4QztZQUVELElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLEtBQUssV0FBVyxDQUFDLEtBQUssRUFBRTtnQkFDeEQsT0FBTyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQzNFO1lBRUQsT0FBTyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkYsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVywwQ0FBUzs7OztRQUFwQjtZQUNJLElBQ0ksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVc7bUJBQzlCLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxLQUFLLFdBQVcsQ0FBQyxHQUFHO21CQUNwRCxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsS0FBSyxXQUFXLENBQUMsUUFBUTttQkFDekQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLEtBQUssV0FBVyxDQUFDLE9BQU8sRUFDN0Q7Z0JBQ0UsT0FBTyxtQkFBbUIsQ0FBQzthQUM5QjtZQUNELE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBRUQsc0JBQVcsNkNBQVk7Ozs7UUFBdkI7WUFDSSxJQUNJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXO21CQUM5QixJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsS0FBSyxXQUFXLENBQUMsR0FBRzttQkFDcEQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLEtBQUssV0FBVyxDQUFDLE1BQU07bUJBQ3ZELElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxLQUFLLFdBQVcsQ0FBQyxPQUFPO21CQUN4RCxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsS0FBSyxXQUFXLENBQUMsVUFBVSxFQUNoRTtnQkFDRSxPQUFPLGtCQUFrQixDQUFDO2FBQzdCO1lBRUQsSUFDSSxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsS0FBSyxXQUFXLENBQUMsUUFBUTttQkFDdEQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLEtBQUssV0FBVyxDQUFDLFdBQVcsRUFDakU7Z0JBQ0UsT0FBTyx3QkFBd0IsQ0FBQzthQUNuQztZQUVELElBQ0ksSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLEtBQUssV0FBVyxDQUFDLEtBQUs7bUJBQ25ELElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxLQUFLLFdBQVcsQ0FBQyxJQUFJLEVBQzFEO2dCQUNFLE9BQU8sdUJBQXVCLENBQUM7YUFDbEM7WUFFRCxPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDOzs7T0FBQTtJQUVELHNCQUFXLDJDQUFVOzs7O1FBQXJCO1lBQ0ksSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUU7Z0JBQzFCLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzthQUNwRTtZQUNELE9BQU8sQ0FBQyxDQUFDO1FBQ2IsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVyw0Q0FBVzs7OztRQUF0QjtZQUNJLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFO2dCQUMxQixPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7YUFDckU7WUFDRCxPQUFPLENBQUMsQ0FBQztRQUNiLENBQUM7OztPQUFBO0lBRUQsc0JBQVcsOENBQWE7Ozs7UUFBeEI7WUFDSSxJQUFJLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtnQkFDMUIsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDN0U7WUFDRCxPQUFPLENBQUMsQ0FBQztRQUNiLENBQUM7OztPQUFBO0lBRUQsc0JBQVcsNkNBQVk7Ozs7UUFBdkI7WUFDSSxJQUFJLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtnQkFDMUIsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDNUU7WUFDRCxPQUFPLENBQUMsQ0FBQztRQUNiLENBQUM7OztPQUFBOzs7OztJQUVPLGlEQUFtQjs7OztJQUEzQjs7WUFDUSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUYsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixFQUFFO1lBQ3ZDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUM7U0FDN0Q7UUFDRCxPQUFPLGlCQUFpQixDQUFDO0lBQzdCLENBQUM7SUFFRCxtRkFBbUY7Ozs7OztJQUMzRSxxREFBdUI7Ozs7OztJQUEvQjtRQUNJLElBQ0ksSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLEtBQUssV0FBVyxDQUFDLElBQUk7ZUFDbEQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLEtBQUssV0FBVyxDQUFDLEtBQUssRUFDM0Q7WUFDRSxPQUFPLENBQUMsQ0FBQztTQUNaOztZQUNLLGFBQWEsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTTtjQUMvQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztjQUNuRixJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLE1BQU07UUFFaEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsYUFBYSxFQUFFO1lBQ2pFLE9BQU8sYUFBYSxHQUFHLENBQUMsTUFBTSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztTQUMxRTtRQUNELE9BQU8sQ0FBQyxDQUFDO0lBQ2IsQ0FBQzs7Z0JBemJKLFNBQVMsU0FBQztvQkFDUCxRQUFRLEVBQUUsaUJBQWlCO29CQUMzQixRQUFRLEVBQUUscTBIQW9FVDtvQkFFRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTs7aUJBQ3hDOzs7O2dCQTNFUSxpQkFBaUI7OztzQ0E2RXJCLEtBQUs7Z0NBQ0wsS0FBSzt1Q0FDTCxLQUFLOzJCQUNMLFNBQVMsU0FBQyxVQUFVOztJQTRXekIsMEJBQUM7Q0FBQSxBQTFiRCxJQTBiQztTQWhYWSxtQkFBbUI7OztJQUM1QixrREFBeUM7O0lBQ3pDLDRDQUFxQzs7SUFDckMsbURBQTRDOztJQUM1Qyx1Q0FBbUQ7O0lBQ25ELCtDQUE0Qjs7SUFDNUIsOENBQXdDOztJQUN4QyxrREFBMkM7O0lBQzNDLDJDQUE0Qjs7Ozs7SUFFNUIsa0RBQWdDOzs7OztJQUNoQyxpREFBeUM7Ozs7O0lBQ3pDLGlEQUF5Qzs7SUFHckMsZ0RBQTJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBJbnB1dCwgT25EZXN0cm95LCBWaWV3Q2hpbGQsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBmcm9tRXZlbnQsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgT3JpZW50YXRpb24sIFRvdXJTdGVwIH0gZnJvbSAnLi9ndWlkZWQtdG91ci5jb25zdGFudHMnO1xuaW1wb3J0IHsgR3VpZGVkVG91clNlcnZpY2UgfSBmcm9tICcuL2d1aWRlZC10b3VyLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ25neC1ndWlkZWQtdG91cicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiAqbmdJZj1cImN1cnJlbnRUb3VyU3RlcCAmJiBzZWxlY3RlZEVsZW1lbnRSZWN0ICYmIGlzT3JiU2hvd2luZ1wiXG4gICAgICAgICAgICAgICAgKG1vdXNlZW50ZXIpPVwiaGFuZGxlT3JiKClcIlxuICAgICAgICAgICAgICAgIGNsYXNzPVwidG91ci1vcmIgdG91ci17eyBjdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gfX1cIlxuICAgICAgICAgICAgICAgIFtzdHlsZS50b3AucHhdPVwib3JiVG9wUG9zaXRpb25cIlxuICAgICAgICAgICAgICAgIFtzdHlsZS5sZWZ0LnB4XT1cIm9yYkxlZnRQb3NpdGlvblwiXG4gICAgICAgICAgICAgICAgW3N0eWxlLnRyYW5zZm9ybV09XCJvcmJUcmFuc2Zvcm1cIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidG91ci1vcmItcmluZ1wiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiAqbmdJZj1cImN1cnJlbnRUb3VyU3RlcCAmJiAhaXNPcmJTaG93aW5nXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ3VpZGVkLXRvdXItdXNlci1pbnB1dC1tYXNrXCIgKGNsaWNrKT1cImJhY2tkcm9wQ2xpY2soJGV2ZW50KVwiPjwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImd1aWRlZC10b3VyLXNwb3RsaWdodC1vdmVybGF5XCJcbiAgICAgICAgICAgICAgICBbc3R5bGUudG9wLnB4XT1cIm92ZXJsYXlUb3BcIlxuICAgICAgICAgICAgICAgIFtzdHlsZS5sZWZ0LnB4XT1cIm92ZXJsYXlMZWZ0XCJcbiAgICAgICAgICAgICAgICBbc3R5bGUuaGVpZ2h0LnB4XT1cIm92ZXJsYXlIZWlnaHRcIlxuICAgICAgICAgICAgICAgIFtzdHlsZS53aWR0aC5weF09XCJvdmVybGF5V2lkdGhcIj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiAqbmdJZj1cImN1cnJlbnRUb3VyU3RlcCAmJiAhaXNPcmJTaG93aW5nXCI+XG4gICAgICAgICAgICA8ZGl2ICN0b3VyU3RlcCAqbmdJZj1cImN1cnJlbnRUb3VyU3RlcFwiXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJ0b3VyLXN0ZXAgdG91ci17eyBjdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gfX1cIlxuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cIntcbiAgICAgICAgICAgICAgICAgICAgJ3BhZ2UtdG91ci1zdGVwJzogIWN1cnJlbnRUb3VyU3RlcC5zZWxlY3RvclxuICAgICAgICAgICAgICAgIH1cIlxuICAgICAgICAgICAgICAgIFtzdHlsZS50b3AucHhdPVwiKGN1cnJlbnRUb3VyU3RlcC5zZWxlY3RvciAmJiBzZWxlY3RlZEVsZW1lbnRSZWN0ID8gdG9wUG9zaXRpb24gOiBudWxsKVwiXG4gICAgICAgICAgICAgICAgW3N0eWxlLmxlZnQucHhdPVwiKGN1cnJlbnRUb3VyU3RlcC5zZWxlY3RvciAmJiBzZWxlY3RlZEVsZW1lbnRSZWN0ID8gbGVmdFBvc2l0aW9uIDogbnVsbClcIlxuICAgICAgICAgICAgICAgIFtzdHlsZS53aWR0aC5weF09XCIoY3VycmVudFRvdXJTdGVwLnNlbGVjdG9yICYmIHNlbGVjdGVkRWxlbWVudFJlY3QgPyBjYWxjdWxhdGVkVG91clN0ZXBXaWR0aCA6IG51bGwpXCJcbiAgICAgICAgICAgICAgICBbc3R5bGUudHJhbnNmb3JtXT1cIihjdXJyZW50VG91clN0ZXAuc2VsZWN0b3IgJiYgc2VsZWN0ZWRFbGVtZW50UmVjdCA/IHRyYW5zZm9ybSA6IG51bGwpXCI+XG4gICAgICAgICAgICAgICAgPGRpdiAqbmdJZj1cImN1cnJlbnRUb3VyU3RlcC5zZWxlY3RvclwiIGNsYXNzPVwidG91ci1hcnJvd1wiPjwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0b3VyLWJsb2NrXCI+XG4gICAgICAgICAgICAgICAgICAgIDxoMyBjbGFzcz1cInRvdXItdGl0bGVcIiAqbmdJZj1cImN1cnJlbnRUb3VyU3RlcC50aXRsZSAmJiBjdXJyZW50VG91clN0ZXAuc2VsZWN0b3JcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt7IGN1cnJlbnRUb3VyU3RlcC50aXRsZSB9fVxuICAgICAgICAgICAgICAgICAgICA8L2gzPlxuICAgICAgICAgICAgICAgICAgICA8aDIgY2xhc3M9XCJ0b3VyLXRpdGxlXCIgKm5nSWY9XCJjdXJyZW50VG91clN0ZXAudGl0bGUgJiYgIWN1cnJlbnRUb3VyU3RlcC5zZWxlY3RvclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge3sgY3VycmVudFRvdXJTdGVwLnRpdGxlIH19XG4gICAgICAgICAgICAgICAgICAgIDwvaDI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0b3VyLWNvbnRlbnRcIiBbaW5uZXJIVE1MXT1cImN1cnJlbnRUb3VyU3RlcC5jb250ZW50XCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0b3VyLWJ1dHRvbnNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gKm5nSWY9XCIhZ3VpZGVkVG91clNlcnZpY2Uub25SZXNpemVNZXNzYWdlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwiZ3VpZGVkVG91clNlcnZpY2Uuc2tpcFRvdXIoKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJza2lwLWJ1dHRvbiBsaW5rLWJ1dHRvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNraXBcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiAqbmdJZj1cIiFndWlkZWRUb3VyU2VydmljZS5vbkxhc3RTdGVwICYmICFndWlkZWRUb3VyU2VydmljZS5vblJlc2l6ZU1lc3NhZ2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwibmV4dC1idXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjbGljayk9XCJndWlkZWRUb3VyU2VydmljZS5uZXh0U3RlcCgpXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTmV4dCZuYnNwOyZuYnNwO3t7IGd1aWRlZFRvdXJTZXJ2aWNlLmN1cnJlbnRUb3VyU3RlcERpc3BsYXkgfX0ve3sgZ3VpZGVkVG91clNlcnZpY2UuY3VycmVudFRvdXJTdGVwQ291bnQgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiAqbmdJZj1cImd1aWRlZFRvdXJTZXJ2aWNlLm9uTGFzdFN0ZXBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwibmV4dC1idXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjbGljayk9XCJndWlkZWRUb3VyU2VydmljZS5uZXh0U3RlcCgpXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRG9uZVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gKm5nSWY9XCJndWlkZWRUb3VyU2VydmljZS5vblJlc2l6ZU1lc3NhZ2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwibmV4dC1idXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjbGljayk9XCJndWlkZWRUb3VyU2VydmljZS5yZXNldFRvdXIoKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENsb3NlXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gKm5nSWY9XCIhZ3VpZGVkVG91clNlcnZpY2Uub25GaXJzdFN0ZXAgJiYgIWd1aWRlZFRvdXJTZXJ2aWNlLm9uUmVzaXplTWVzc2FnZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJiYWNrLWJ1dHRvbiBsaW5rLWJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNsaWNrKT1cImd1aWRlZFRvdXJTZXJ2aWNlLmJhY2tTdGVwKClcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBCYWNrXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBzdHlsZVVybHM6IFsnLi9ndWlkZWQtdG91ci5jb21wb25lbnQuc2NzcyddLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgR3VpZGVkVG91ckNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gICAgQElucHV0KCkgcHVibGljIHRvcE9mUGFnZUFkanVzdG1lbnQgPz0gMDtcbiAgICBASW5wdXQoKSBwdWJsaWMgdG91clN0ZXBXaWR0aCA/PSAzMDA7XG4gICAgQElucHV0KCkgcHVibGljIG1pbmltYWxUb3VyU3RlcFdpZHRoID89IDIwMDtcbiAgICBAVmlld0NoaWxkKCd0b3VyU3RlcCcpIHB1YmxpYyB0b3VyU3RlcDogRWxlbWVudFJlZjtcbiAgICBwdWJsaWMgaGlnaGxpZ2h0UGFkZGluZyA9IDQ7XG4gICAgcHVibGljIGN1cnJlbnRUb3VyU3RlcDogVG91clN0ZXAgPSBudWxsO1xuICAgIHB1YmxpYyBzZWxlY3RlZEVsZW1lbnRSZWN0OiBET01SZWN0ID0gbnVsbDtcbiAgICBwdWJsaWMgaXNPcmJTaG93aW5nID0gZmFsc2U7XG5cbiAgICBwcml2YXRlIF9hbm5vdW5jZW1lbnRzQ291bnQgPSAwO1xuICAgIHByaXZhdGUgcmVzaXplU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gICAgcHJpdmF0ZSBzY3JvbGxTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwdWJsaWMgZ3VpZGVkVG91clNlcnZpY2U6IEd1aWRlZFRvdXJTZXJ2aWNlXG4gICAgKSB7IH1cblxuICAgIHByaXZhdGUgZ2V0IG1heFdpZHRoQWRqdXN0bWVudEZvclRvdXJTdGVwKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvdXJTdGVwV2lkdGggLSB0aGlzLm1pbmltYWxUb3VyU3RlcFdpZHRoO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IHdpZHRoQWRqdXN0bWVudEZvclNjcmVlbkJvdW5kKCk6IG51bWJlciB7XG4gICAgICAgIGlmICghdGhpcy50b3VyU3RlcCkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGFkanVzdG1lbnQgPSAwO1xuICAgICAgICBpZiAodGhpcy5jYWxjdWxhdGVkTGVmdFBvc2l0aW9uIDwgMCkge1xuICAgICAgICAgICAgYWRqdXN0bWVudCA9IC10aGlzLmNhbGN1bGF0ZWRMZWZ0UG9zaXRpb247XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2FsY3VsYXRlZExlZnRQb3NpdGlvbiA+IHdpbmRvdy5pbm5lcldpZHRoIC0gdGhpcy50b3VyU3RlcFdpZHRoKSB7XG4gICAgICAgICAgICBhZGp1c3RtZW50ID0gdGhpcy5jYWxjdWxhdGVkTGVmdFBvc2l0aW9uIC0gKHdpbmRvdy5pbm5lcldpZHRoIC0gdGhpcy50b3VyU3RlcFdpZHRoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBNYXRoLm1pbih0aGlzLm1heFdpZHRoQWRqdXN0bWVudEZvclRvdXJTdGVwLCBhZGp1c3RtZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGNhbGN1bGF0ZWRUb3VyU3RlcFdpZHRoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50b3VyU3RlcFdpZHRoIC0gdGhpcy53aWR0aEFkanVzdG1lbnRGb3JTY3JlZW5Cb3VuZDtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmd1aWRlZFRvdXJTZXJ2aWNlLmd1aWRlZFRvdXJDdXJyZW50U3RlcFN0cmVhbS5zdWJzY3JpYmUoKHN0ZXA6IFRvdXJTdGVwKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUb3VyU3RlcCA9IHN0ZXA7XG4gICAgICAgICAgICBpZiAoc3RlcCAmJiBzdGVwLnNlbGVjdG9yKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzdGVwLnNlbGVjdG9yKTtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG9BbmRTZXRFbGVtZW50KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZ3VpZGVkVG91clNlcnZpY2UuZ3VpZGVkVG91ck9yYlNob3dpbmdTdHJlYW0uc3Vic2NyaWJlKCh2YWx1ZTogYm9vbGVhbikgPT4ge1xuICAgICAgICAgICAgdGhpcy5pc09yYlNob3dpbmcgPSB2YWx1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5yZXNpemVTdWJzY3JpcHRpb24gPSBmcm9tRXZlbnQod2luZG93LCAncmVzaXplJykuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU3RlcExvY2F0aW9uKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2Nyb2xsU3Vic2NyaXB0aW9uID0gZnJvbUV2ZW50KHdpbmRvdywgJ3Njcm9sbCcpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVN0ZXBMb2NhdGlvbigpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMucmVzaXplU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIHRoaXMuc2Nyb2xsU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHNjcm9sbFRvQW5kU2V0RWxlbWVudCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy51cGRhdGVTdGVwTG9jYXRpb24oKTtcbiAgICAgICAgLy8gQWxsb3cgdGhpbmdzIHRvIHJlbmRlciB0byBzY3JvbGwgdG8gdGhlIGNvcnJlY3QgbG9jYXRpb25cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNPcmJTaG93aW5nICYmICF0aGlzLmlzVG91ck9uU2NyZWVuKCkpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0ICYmIHRoaXMuaXNCb3R0b20oKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBTY3JvbGwgc28gdGhlIGVsZW1lbnQgaXMgb24gdGhlIHRvcCBvZiB0aGUgc2NyZWVuLlxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0b3BQb3MgPSAoKHdpbmRvdy5zY3JvbGxZICsgdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LnRvcCkgLSB0aGlzLnRvcE9mUGFnZUFkanVzdG1lbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAtICh0aGlzLmN1cnJlbnRUb3VyU3RlcC5zY3JvbGxBZGp1c3RtZW50ID8gdGhpcy5jdXJyZW50VG91clN0ZXAuc2Nyb2xsQWRqdXN0bWVudCA6IDApXG4gICAgICAgICAgICAgICAgICAgICAgICArIHRoaXMuZ2V0U3RlcFNjcmVlbkFkanVzdG1lbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IHRvcFBvcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZWhhdmlvcjogJ3Ntb290aCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBUeXBlRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsKDAsIHRvcFBvcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNjcm9sbCBzbyB0aGUgZWxlbWVudCBpcyBvbiB0aGUgYm90dG9tIG9mIHRoZSBzY3JlZW4uXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvcFBvcyA9ICh3aW5kb3cuc2Nyb2xsWSArIHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC50b3AgKyB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QuaGVpZ2h0KVxuICAgICAgICAgICAgICAgICAgICAgICAgLSB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgICAgICsgKHRoaXMuY3VycmVudFRvdXJTdGVwLnNjcm9sbEFkanVzdG1lbnQgPyB0aGlzLmN1cnJlbnRUb3VyU3RlcC5zY3JvbGxBZGp1c3RtZW50IDogMClcbiAgICAgICAgICAgICAgICAgICAgICAgIC0gdGhpcy5nZXRTdGVwU2NyZWVuQWRqdXN0bWVudCgpO1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogdG9wUG9zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlaGF2aW9yOiAnc21vb3RoJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIFR5cGVFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zY3JvbGwoMCwgdG9wUG9zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaGFuZGxlT3JiKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmd1aWRlZFRvdXJTZXJ2aWNlLmFjdGl2YXRlT3JiKCk7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb3VyU3RlcCAmJiB0aGlzLmN1cnJlbnRUb3VyU3RlcC5zZWxlY3Rvcikge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxUb0FuZFNldEVsZW1lbnQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaXNUb3VyT25TY3JlZW4oKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvdXJTdGVwXG4gICAgICAgICAgICAmJiB0aGlzLmVsZW1lbnRJblZpZXdwb3J0KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5jdXJyZW50VG91clN0ZXAuc2VsZWN0b3IpKVxuICAgICAgICAgICAgJiYgdGhpcy5lbGVtZW50SW5WaWV3cG9ydCh0aGlzLnRvdXJTdGVwLm5hdGl2ZUVsZW1lbnQpO1xuICAgIH1cblxuICAgIC8vIE1vZGlmaWVkIGZyb20gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTIzOTk5L2hvdy10by10ZWxsLWlmLWEtZG9tLWVsZW1lbnQtaXMtdmlzaWJsZS1pbi10aGUtY3VycmVudC12aWV3cG9ydFxuICAgIHByaXZhdGUgZWxlbWVudEluVmlld3BvcnQoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcbiAgICAgICAgbGV0IHRvcCA9IGVsZW1lbnQub2Zmc2V0VG9wO1xuICAgICAgICBjb25zdCBoZWlnaHQgPSBlbGVtZW50Lm9mZnNldEhlaWdodDtcblxuICAgICAgICB3aGlsZSAoZWxlbWVudC5vZmZzZXRQYXJlbnQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQgPSAoZWxlbWVudC5vZmZzZXRQYXJlbnQgYXMgSFRNTEVsZW1lbnQpO1xuICAgICAgICAgICAgdG9wICs9IGVsZW1lbnQub2Zmc2V0VG9wO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlzQm90dG9tKCkpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgdG9wID49ICh3aW5kb3cucGFnZVlPZmZzZXRcbiAgICAgICAgICAgICAgICAgICAgKyB0aGlzLnRvcE9mUGFnZUFkanVzdG1lbnRcbiAgICAgICAgICAgICAgICAgICAgKyAodGhpcy5jdXJyZW50VG91clN0ZXAuc2Nyb2xsQWRqdXN0bWVudCA/IHRoaXMuY3VycmVudFRvdXJTdGVwLnNjcm9sbEFkanVzdG1lbnQgOiAwKVxuICAgICAgICAgICAgICAgICAgICArIHRoaXMuZ2V0U3RlcFNjcmVlbkFkanVzdG1lbnQoKSlcbiAgICAgICAgICAgICAgICAmJiAodG9wICsgaGVpZ2h0KSA8PSAod2luZG93LnBhZ2VZT2Zmc2V0ICsgd2luZG93LmlubmVySGVpZ2h0KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgdG9wID49ICh3aW5kb3cucGFnZVlPZmZzZXQgKyB0aGlzLnRvcE9mUGFnZUFkanVzdG1lbnQgLSB0aGlzLmdldFN0ZXBTY3JlZW5BZGp1c3RtZW50KCkpXG4gICAgICAgICAgICAgICAgJiYgKHRvcCArIGhlaWdodCArICh0aGlzLmN1cnJlbnRUb3VyU3RlcC5zY3JvbGxBZGp1c3RtZW50ID8gdGhpcy5jdXJyZW50VG91clN0ZXAuc2Nyb2xsQWRqdXN0bWVudCA6IDApKSA8PSAod2luZG93LnBhZ2VZT2Zmc2V0ICsgd2luZG93LmlubmVySGVpZ2h0KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBiYWNrZHJvcENsaWNrKGV2ZW50OiBFdmVudCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5ndWlkZWRUb3VyU2VydmljZS5wcmV2ZW50QmFja2Ryb3BGcm9tQWR2YW5jaW5nKSB7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZ3VpZGVkVG91clNlcnZpY2UubmV4dFN0ZXAoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyB1cGRhdGVTdGVwTG9jYXRpb24oKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb3VyU3RlcCAmJiB0aGlzLmN1cnJlbnRUb3VyU3RlcC5zZWxlY3Rvcikge1xuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmN1cnJlbnRUb3VyU3RlcC5zZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0ID0gKHNlbGVjdGVkRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSBhcyBET01SZWN0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0ID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGlzQm90dG9tKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb25cbiAgICAgICAgICAgICYmICh0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uQm90dG9tXG4gICAgICAgICAgICB8fCB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uQm90dG9tTGVmdFxuICAgICAgICAgICAgfHwgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLkJvdHRvbVJpZ2h0KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHRvcFBvc2l0aW9uKCk6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IHBhZGRpbmdBZGp1c3RtZW50ID0gdGhpcy5nZXRIaWdobGlnaHRQYWRkaW5nKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNCb3R0b20oKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC50b3AgKyB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QuaGVpZ2h0ICsgcGFkZGluZ0FkanVzdG1lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LnRvcCAtIHRoaXMuZ2V0SGlnaGxpZ2h0UGFkZGluZygpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgb3JiVG9wUG9zaXRpb24oKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMuaXNCb3R0b20oKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC50b3AgKyB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QuaGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLlJpZ2h0XG4gICAgICAgICAgICB8fCB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uTGVmdFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LnRvcCArICh0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QuaGVpZ2h0IC8gMikpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC50b3A7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgY2FsY3VsYXRlZExlZnRQb3NpdGlvbigpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBwYWRkaW5nQWRqdXN0bWVudCA9IHRoaXMuZ2V0SGlnaGxpZ2h0UGFkZGluZygpO1xuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5Ub3BSaWdodFxuICAgICAgICAgICAgfHwgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLkJvdHRvbVJpZ2h0XG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QucmlnaHQgLSB0aGlzLnRvdXJTdGVwV2lkdGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLlRvcExlZnRcbiAgICAgICAgICAgIHx8IHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5Cb3R0b21MZWZ0XG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QubGVmdCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLkxlZnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QubGVmdCAtIHRoaXMudG91clN0ZXBXaWR0aCAtIHBhZGRpbmdBZGp1c3RtZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5SaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QubGVmdCArIHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC53aWR0aCArIHBhZGRpbmdBZGp1c3RtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAodGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LnJpZ2h0IC0gKHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC53aWR0aCAvIDIpIC0gKHRoaXMudG91clN0ZXBXaWR0aCAvIDIpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGxlZnRQb3NpdGlvbigpOiBudW1iZXIge1xuICAgICAgICBpZiAodGhpcy5jYWxjdWxhdGVkTGVmdFBvc2l0aW9uID49IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhbGN1bGF0ZWRMZWZ0UG9zaXRpb247XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYWRqdXN0bWVudCA9IE1hdGgubWF4KDAsIC10aGlzLmNhbGN1bGF0ZWRMZWZ0UG9zaXRpb24pXG4gICAgICAgIGNvbnN0IG1heEFkanVzdG1lbnQgPSBNYXRoLm1pbih0aGlzLm1heFdpZHRoQWRqdXN0bWVudEZvclRvdXJTdGVwLCBhZGp1c3RtZW50KTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsY3VsYXRlZExlZnRQb3NpdGlvbiArIG1heEFkanVzdG1lbnQ7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBvcmJMZWZ0UG9zaXRpb24oKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLlRvcFJpZ2h0XG4gICAgICAgICAgICB8fCB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uQm90dG9tUmlnaHRcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LnJpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLlRvcExlZnRcbiAgICAgICAgICAgIHx8IHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5Cb3R0b21MZWZ0XG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC5sZWZ0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5MZWZ0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LmxlZnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLlJpZ2h0KSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC5sZWZ0ICsgdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LndpZHRoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAodGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LnJpZ2h0IC0gKHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC53aWR0aCAvIDIpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHRyYW5zZm9ybSgpOiBzdHJpbmcge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICAhdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb25cbiAgICAgICAgICAgIHx8IHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5Ub3BcbiAgICAgICAgICAgIHx8IHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5Ub3BSaWdodFxuICAgICAgICAgICAgfHwgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLlRvcExlZnRcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3RyYW5zbGF0ZVkoLTEwMCUpJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IG9yYlRyYW5zZm9ybSgpOiBzdHJpbmcge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICAhdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb25cbiAgICAgICAgICAgIHx8IHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5Ub3BcbiAgICAgICAgICAgIHx8IHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5Cb3R0b21cbiAgICAgICAgICAgIHx8IHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5Ub3BMZWZ0XG4gICAgICAgICAgICB8fCB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uQm90dG9tTGVmdFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiAndHJhbnNsYXRlWSgtNTAlKSc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uVG9wUmlnaHRcbiAgICAgICAgICAgIHx8IHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5Cb3R0b21SaWdodFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiAndHJhbnNsYXRlKC0xMDAlLCAtNTAlKSc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uUmlnaHRcbiAgICAgICAgICAgIHx8IHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5MZWZ0XG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuICd0cmFuc2xhdGUoLTUwJSwgLTUwJSknO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBvdmVybGF5VG9wKCk6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QudG9wIC0gdGhpcy5nZXRIaWdobGlnaHRQYWRkaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBvdmVybGF5TGVmdCgpOiBudW1iZXIge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LmxlZnQgLSB0aGlzLmdldEhpZ2hsaWdodFBhZGRpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IG92ZXJsYXlIZWlnaHQoKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC5oZWlnaHQgKyAodGhpcy5nZXRIaWdobGlnaHRQYWRkaW5nKCkgKiAyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IG92ZXJsYXlXaWR0aCgpOiBudW1iZXIge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LndpZHRoICsgKHRoaXMuZ2V0SGlnaGxpZ2h0UGFkZGluZygpICogMik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRIaWdobGlnaHRQYWRkaW5nKCk6IG51bWJlciB7XG4gICAgICAgIGxldCBwYWRkaW5nQWRqdXN0bWVudCA9IHRoaXMuY3VycmVudFRvdXJTdGVwLnVzZUhpZ2hsaWdodFBhZGRpbmcgPyB0aGlzLmhpZ2hsaWdodFBhZGRpbmcgOiAwO1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50VG91clN0ZXAuaGlnaGxpZ2h0UGFkZGluZykge1xuICAgICAgICAgICAgcGFkZGluZ0FkanVzdG1lbnQgPSB0aGlzLmN1cnJlbnRUb3VyU3RlcC5oaWdobGlnaHRQYWRkaW5nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYWRkaW5nQWRqdXN0bWVudDtcbiAgICB9XG5cbiAgICAvLyBUaGlzIGNhbGN1bGF0ZXMgYSB2YWx1ZSB0byBhZGQgb3Igc3VidHJhY3Qgc28gdGhlIHN0ZXAgc2hvdWxkIG5vdCBiZSBvZmYgc2NyZWVuLlxuICAgIHByaXZhdGUgZ2V0U3RlcFNjcmVlbkFkanVzdG1lbnQoKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLkxlZnRcbiAgICAgICAgICAgIHx8IHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5SaWdodFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGVsZW1lbnRIZWlnaHQgPSB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QuaGVpZ2h0XG4gICAgICAgICAgICArICh0aGlzLmN1cnJlbnRUb3VyU3RlcC5zY3JvbGxBZGp1c3RtZW50ID8gdGhpcy5jdXJyZW50VG91clN0ZXAuc2Nyb2xsQWRqdXN0bWVudCA6IDApXG4gICAgICAgICAgICArIHRoaXMudG91clN0ZXAubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG5cbiAgICAgICAgaWYgKCh3aW5kb3cuaW5uZXJIZWlnaHQgLSB0aGlzLnRvcE9mUGFnZUFkanVzdG1lbnQpIDwgZWxlbWVudEhlaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRIZWlnaHQgLSAod2luZG93LmlubmVySGVpZ2h0IC0gdGhpcy50b3BPZlBhZ2VBZGp1c3RtZW50KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG59XG4iXX0=