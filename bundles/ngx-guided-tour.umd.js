(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs/internal/operators'), require('lodash'), require('rxjs'), require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('ngx-guided-tour', ['exports', 'rxjs/internal/operators', 'lodash', 'rxjs', '@angular/core', '@angular/common'], factory) :
    (factory((global['ngx-guided-tour'] = {}),global.rxjs['internal/operators'],global.lodash,global.rxjs,global.ng.core,global.ng.common));
}(this, (function (exports,operators,lodash,rxjs,core,common) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
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

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var GuidedTourService = /** @class */ (function () {
        function GuidedTourService(errorHandler) {
            var _this = this;
            this.errorHandler = errorHandler;
            this._guidedTourCurrentStepSubject = new rxjs.Subject();
            this._guidedTourOrbShowingSubject = new rxjs.Subject();
            this._currentTourStepIndex = 0;
            this._currentTour = null;
            this._onFirstStep = true;
            this._onLastStep = true;
            this._onResizeMessage = false;
            this.guidedTourCurrentStepStream = this._guidedTourCurrentStepSubject.asObservable();
            this.guidedTourOrbShowingStream = this._guidedTourOrbShowingSubject.asObservable();
            rxjs.fromEvent(window, 'resize').pipe(operators.debounceTime(200)).subscribe(( /**
             * @return {?}
             */function () {
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
                        setTimeout(( /**
                         * @return {?}
                         */function () {
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
                        setTimeout(( /**
                         * @return {?}
                         */function () {
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
                this._currentTour = lodash.cloneDeep(tour);
                this._currentTour.steps = this._currentTour.steps.filter(( /**
                 * @param {?} step
                 * @return {?}
                 */function (step) { return !step.skipStep; }));
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
             */ function () {
                return this._onLastStep;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GuidedTourService.prototype, "onFirstStep", {
            get: /**
             * @return {?}
             */ function () {
                return this._onFirstStep;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GuidedTourService.prototype, "onResizeMessage", {
            get: /**
             * @return {?}
             */ function () {
                return this._onResizeMessage;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GuidedTourService.prototype, "currentTourStepDisplay", {
            get: /**
             * @return {?}
             */ function () {
                return this._currentTourStepIndex + 1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GuidedTourService.prototype, "currentTourStepCount", {
            get: /**
             * @return {?}
             */ function () {
                return this._currentTour && this._currentTour.steps ? this._currentTour.steps.length : 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GuidedTourService.prototype, "preventBackdropFromAdvancing", {
            get: /**
             * @return {?}
             */ function () {
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
                var convertedStep = lodash.cloneDeep(step);
                if (convertedStep.orientation
                    && !(typeof convertedStep.orientation === 'string')
                    && (( /** @type {?} */(convertedStep.orientation))).length) {
                    (( /** @type {?} */(convertedStep.orientation))).sort(( /**
                     * @param {?} a
                     * @param {?} b
                     * @return {?}
                     */function (a, b) {
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
                    (( /** @type {?} */(convertedStep.orientation))).forEach(( /**
                     * @param {?} orientationConfig
                     * @return {?}
                     */function (orientationConfig) {
                        if (!orientationConfig.maximumSize || window.innerWidth <= orientationConfig.maximumSize) {
                            currentOrientation_1 = orientationConfig.orientationDirection;
                        }
                    }));
                    convertedStep.orientation = currentOrientation_1;
                }
                return convertedStep;
            };
        GuidedTourService.decorators = [
            { type: core.Injectable }
        ];
        /** @nocollapse */
        GuidedTourService.ctorParameters = function () {
            return [
                { type: core.ErrorHandler }
            ];
        };
        return GuidedTourService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
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
             */ function () {
                return this.tourStepWidth - this.minimalTourStepWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GuidedTourComponent.prototype, "widthAdjustmentForScreenBound", {
            get: /**
             * @private
             * @return {?}
             */ function () {
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
             */ function () {
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
                this.guidedTourService.guidedTourCurrentStepStream.subscribe(( /**
                 * @param {?} step
                 * @return {?}
                 */function (step) {
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
                this.guidedTourService.guidedTourOrbShowingStream.subscribe(( /**
                 * @param {?} value
                 * @return {?}
                 */function (value) {
                    _this.isOrbShowing = value;
                }));
                this.resizeSubscription = rxjs.fromEvent(window, 'resize').subscribe(( /**
                 * @return {?}
                 */function () {
                    _this.updateStepLocation();
                }));
                this.scrollSubscription = rxjs.fromEvent(window, 'scroll').subscribe(( /**
                 * @return {?}
                 */function () {
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
                setTimeout(( /**
                 * @return {?}
                 */function () {
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
                    element = (( /** @type {?} */(element.offsetParent)));
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
                        this.selectedElementRect = (( /** @type {?} */(selectedElement.getBoundingClientRect())));
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
             */ function () {
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
             */ function () {
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
             */ function () {
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
             */ function () {
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
             */ function () {
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
             */ function () {
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
             */ function () {
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
             */ function () {
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
             */ function () {
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
             */ function () {
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
             */ function () {
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
            { type: core.Component, args: [{
                        selector: 'ngx-guided-tour',
                        template: "\n        <div *ngIf=\"currentTourStep && selectedElementRect && isOrbShowing\"\n                (mouseenter)=\"handleOrb()\"\n                class=\"tour-orb tour-{{ currentTourStep.orientation }}\"\n                [style.top.px]=\"orbTopPosition\"\n                [style.left.px]=\"orbLeftPosition\"\n                [style.transform]=\"orbTransform\">\n                <div class=\"tour-orb-ring\"></div>\n        </div>\n        <div *ngIf=\"currentTourStep && !isOrbShowing\">\n            <div class=\"guided-tour-user-input-mask\" (click)=\"backdropClick($event)\"></div>\n            <div class=\"guided-tour-spotlight-overlay\"\n                [style.top.px]=\"overlayTop\"\n                [style.left.px]=\"overlayLeft\"\n                [style.height.px]=\"overlayHeight\"\n                [style.width.px]=\"overlayWidth\">\n            </div>\n        </div>\n        <div *ngIf=\"currentTourStep && !isOrbShowing\">\n            <div #tourStep *ngIf=\"currentTourStep\"\n                class=\"tour-step tour-{{ currentTourStep.orientation }}\"\n                [ngClass]=\"{\n                    'page-tour-step': !currentTourStep.selector\n                }\"\n                [style.top.px]=\"(currentTourStep.selector && selectedElementRect ? topPosition : null)\"\n                [style.left.px]=\"(currentTourStep.selector && selectedElementRect ? leftPosition : null)\"\n                [style.width.px]=\"(currentTourStep.selector && selectedElementRect ? calculatedTourStepWidth : null)\"\n                [style.transform]=\"(currentTourStep.selector && selectedElementRect ? transform : null)\">\n                <div *ngIf=\"currentTourStep.selector\" class=\"tour-arrow\"></div>\n                <div class=\"tour-block\">\n                    <h3 class=\"tour-title\" *ngIf=\"currentTourStep.title && currentTourStep.selector\">\n                        {{ currentTourStep.title }}\n                    </h3>\n                    <h2 class=\"tour-title\" *ngIf=\"currentTourStep.title && !currentTourStep.selector\">\n                        {{ currentTourStep.title }}\n                    </h2>\n                    <div class=\"tour-content\" [innerHTML]=\"currentTourStep.content\"></div>\n                    <div class=\"tour-buttons\">\n                        <button *ngIf=\"!guidedTourService.onResizeMessage\"\n                            (click)=\"guidedTourService.skipTour()\"\n                            class=\"skip-button link-button\">\n                            Skip\n                        </button>\n                        <button *ngIf=\"!guidedTourService.onLastStep && !guidedTourService.onResizeMessage\"\n                            class=\"next-button\"\n                            (click)=\"guidedTourService.nextStep()\">\n                            Next&nbsp;&nbsp;{{ guidedTourService.currentTourStepDisplay }}/{{ guidedTourService.currentTourStepCount }}\n                        </button>\n                        <button *ngIf=\"guidedTourService.onLastStep\"\n                            class=\"next-button\"\n                            (click)=\"guidedTourService.nextStep()\">\n                            Done\n                        </button>\n\n                        <button *ngIf=\"guidedTourService.onResizeMessage\"\n                            class=\"next-button\"\n                            (click)=\"guidedTourService.resetTour()\">\n                            Close\n                        </button>\n                        <button *ngIf=\"!guidedTourService.onFirstStep && !guidedTourService.onResizeMessage\"\n                            class=\"back-button link-button\"\n                            (click)=\"guidedTourService.backStep()\">\n                            Back\n                        </button>\n                    </div>\n                </div>\n            </div>\n        </div>\n    ",
                        encapsulation: core.ViewEncapsulation.None,
                        styles: ["ngx-guided-tour .guided-tour-user-input-mask{position:fixed;top:0;left:0;display:block;height:100%;width:100%;max-height:100vh;text-align:center;opacity:0}ngx-guided-tour .guided-tour-spotlight-overlay{position:fixed;box-shadow:0 0 0 9999px rgba(0,0,0,.7),0 0 1.5rem rgba(0,0,0,.5)}ngx-guided-tour .tour-orb{position:fixed;width:20px;height:20px;border-radius:50%}ngx-guided-tour .tour-orb .tour-orb-ring{width:35px;height:35px;position:relative;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);-webkit-animation:2s linear infinite pulse;animation:2s linear infinite pulse}ngx-guided-tour .tour-orb .tour-orb-ring:after{content:'';display:inline-block;height:100%;width:100%;border-radius:50%}@-webkit-keyframes pulse{from{-webkit-transform:translate(-50%,-50%) scale(.45);transform:translate(-50%,-50%) scale(.45);opacity:1}to{-webkit-transform:translate(-50%,-50%) scale(1);transform:translate(-50%,-50%) scale(1);opacity:0}}@keyframes pulse{from{-webkit-transform:translate(-50%,-50%) scale(.45);transform:translate(-50%,-50%) scale(.45);opacity:1}to{-webkit-transform:translate(-50%,-50%) scale(1);transform:translate(-50%,-50%) scale(1);opacity:0}}ngx-guided-tour .tour-step{position:fixed}ngx-guided-tour .tour-step.page-tour-step{max-width:400px;width:50%;left:50%;top:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}ngx-guided-tour .tour-step.tour-bottom .tour-arrow::before,ngx-guided-tour .tour-step.tour-bottom-left .tour-arrow::before,ngx-guided-tour .tour-step.tour-bottom-right .tour-arrow::before{position:absolute}ngx-guided-tour .tour-step.tour-bottom .tour-block,ngx-guided-tour .tour-step.tour-bottom-left .tour-block,ngx-guided-tour .tour-step.tour-bottom-right .tour-block{margin-top:10px}ngx-guided-tour .tour-step.tour-top,ngx-guided-tour .tour-step.tour-top-left,ngx-guided-tour .tour-step.tour-top-right{margin-bottom:10px}ngx-guided-tour .tour-step.tour-top .tour-arrow::before,ngx-guided-tour .tour-step.tour-top-left .tour-arrow::before,ngx-guided-tour .tour-step.tour-top-right .tour-arrow::before{position:absolute;bottom:0}ngx-guided-tour .tour-step.tour-top .tour-block,ngx-guided-tour .tour-step.tour-top-left .tour-block,ngx-guided-tour .tour-step.tour-top-right .tour-block{margin-bottom:10px}ngx-guided-tour .tour-step.tour-bottom .tour-arrow::before,ngx-guided-tour .tour-step.tour-top .tour-arrow::before{-webkit-transform:translateX(-50%);transform:translateX(-50%);left:50%}ngx-guided-tour .tour-step.tour-bottom-right .tour-arrow::before,ngx-guided-tour .tour-step.tour-top-right .tour-arrow::before{-webkit-transform:translateX(-100%);transform:translateX(-100%);left:calc(100% - 5px)}ngx-guided-tour .tour-step.tour-bottom-left .tour-arrow::before,ngx-guided-tour .tour-step.tour-top-left .tour-arrow::before{left:5px}ngx-guided-tour .tour-step.tour-left .tour-arrow::before{position:absolute;left:100%;-webkit-transform:translateX(-100%);transform:translateX(-100%);top:5px}ngx-guided-tour .tour-step.tour-left .tour-block{margin-right:10px}ngx-guided-tour .tour-step.tour-right .tour-arrow::before{position:absolute;left:0;top:5px}ngx-guided-tour .tour-step.tour-right .tour-block{margin-left:10px}ngx-guided-tour .tour-step .tour-block{padding:15px 25px}ngx-guided-tour .tour-step .tour-title{font-weight:700!important;padding-bottom:20px}ngx-guided-tour .tour-step h3.tour-title{font-size:20px}ngx-guided-tour .tour-step h2.tour-title{font-size:30px}ngx-guided-tour .tour-step .tour-content{min-height:80px;padding-bottom:30px;font-size:15px}ngx-guided-tour .tour-step .tour-buttons{overflow:hidden}ngx-guided-tour .tour-step .tour-buttons button.link-button{font-size:15px;font-weight:700;max-width:none!important;cursor:pointer;text-align:center;white-space:nowrap;vertical-align:middle;border:1px solid transparent;line-height:1.5;background-color:transparent;position:relative;outline:0;padding:0 15px;-webkit-appearance:button}ngx-guided-tour .tour-step .tour-buttons button.skip-button.link-button{padding-left:0;border-left:0}ngx-guided-tour .tour-step .tour-buttons .back-button{float:right}ngx-guided-tour .tour-step .tour-buttons .next-button{cursor:pointer;border-radius:1px;float:right;font-size:14px;border:none;outline:0;padding-left:10px;padding-right:10px}"]
                    }] }
        ];
        /** @nocollapse */
        GuidedTourComponent.ctorParameters = function () {
            return [
                { type: GuidedTourService }
            ];
        };
        GuidedTourComponent.propDecorators = {
            topOfPageAdjustment: [{ type: core.Input }],
            tourStepWidth: [{ type: core.Input }],
            minimalTourStepWidth: [{ type: core.Input }],
            tourStep: [{ type: core.ViewChild, args: ['tourStep',] }]
        };
        return GuidedTourComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
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
                        core.ErrorHandler,
                        GuidedTourService
                    ]
                };
            };
        GuidedTourModule.decorators = [
            { type: core.NgModule, args: [{
                        declarations: [
                            GuidedTourComponent
                        ],
                        imports: [
                            common.CommonModule
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

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    exports.GuidedTourModule = GuidedTourModule;
    exports.GuidedTourComponent = GuidedTourComponent;
    exports.GuidedTourService = GuidedTourService;
    exports.Orientation = Orientation;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=ngx-guided-tour.umd.js.map