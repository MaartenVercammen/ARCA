import { inject, Injectable } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { Observable, Subject } from 'rxjs';

export type SlideInCloseReason = 'success' | 'close';
export type SlideInCloseResult = { reason: SlideInCloseReason };

@Injectable({
  providedIn: 'root',
})
export class SlideInControllerService {
  private _overlay = inject(Overlay);
  private _overlayRef?: OverlayRef;
  private _slideInSuccess = new Subject<void>();
  private _slideInLifecycle?: Subject<SlideInCloseResult>;
  private _slideInCloseReason: SlideInCloseReason = 'close';

  public readonly slideInSuccess$ = this._slideInSuccess.asObservable();

  public notifySlideInSuccess() {
    this._slideInCloseReason = 'success';
    this._slideInSuccess.next();
  }

  public openSlideIn(
    component: ComponentType<unknown>,
    inputs: Record<string, unknown> = {},
  ): Observable<SlideInCloseResult> {
    this.closeSlideIn();

    this._slideInLifecycle = new Subject<SlideInCloseResult>();
    this._slideInCloseReason = 'close';

    this._overlayRef = this._overlay.create({
      width: '30%',
      height: '100%',
      positionStrategy: this._overlay.position().global().right('0').top('0'),
      scrollStrategy: this._overlay.scrollStrategies.block(),
      hasBackdrop: true,
      backdropClass: 'fullscreen-overlay-backdrop',
    });

    const componentRef = this._overlayRef.attach(new ComponentPortal(component));
    Object.entries(inputs).forEach(([name, value]) => componentRef.setInput(name, value));
    this._overlayRef.backdropClick().subscribe(() => this.closeSlideIn());

    return this._slideInLifecycle.asObservable();
  }

  public closeSlideIn() {
    const overlayRef = this._overlayRef;
    const lifecycle = this._slideInLifecycle;
    const closeResult = { reason: this._slideInCloseReason };

    this._overlayRef = undefined;
    this._slideInLifecycle = undefined;
    this._slideInCloseReason = 'close';

    overlayRef?.dispose();
    lifecycle?.next(closeResult);
    lifecycle?.complete();
  }
}
