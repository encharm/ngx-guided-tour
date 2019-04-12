import { AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { TourStep } from './guided-tour.constants';
import { GuidedTourService } from './guided-tour.service';
export declare class GuidedTourComponent implements AfterViewInit, OnDestroy {
    guidedTourService: GuidedTourService;
    topOfPageAdjustment?: number;
    tourStepWidth?: number;
    minimalTourStepWidth?: number;
    tourStep: ElementRef;
    highlightPadding: number;
    currentTourStep: TourStep;
    selectedElementRect: DOMRect;
    isOrbShowing: boolean;
    private _announcementsCount;
    private resizeSubscription;
    private scrollSubscription;
    constructor(guidedTourService: GuidedTourService);
    private readonly maxWidthAdjustmentForTourStep;
    private readonly widthAdjustmentForScreenBound;
    readonly calculatedTourStepWidth: number;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    scrollToAndSetElement(): void;
    handleOrb(): void;
    private isTourOnScreen;
    private elementInViewport;
    backdropClick(event: Event): void;
    updateStepLocation(): void;
    private isBottom;
    readonly topPosition: number;
    readonly orbTopPosition: number;
    private readonly calculatedLeftPosition;
    readonly leftPosition: number;
    readonly orbLeftPosition: number;
    readonly transform: string;
    readonly orbTransform: string;
    readonly overlayTop: number;
    readonly overlayLeft: number;
    readonly overlayHeight: number;
    readonly overlayWidth: number;
    private getHighlightPadding;
    private getStepScreenAdjustment;
}
