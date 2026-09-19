import { inject, Injectable } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root',
})
export class SlideInControllerService {
  private _overlay = inject(Overlay);
  private _overlayRef?: OverlayRef;

  public openSlideIn(component: ComponentType<unknown>) {
    this.closeSlideIn();

    this._overlayRef = this._overlay.create({
      width: '30%',
      height: '100%',
      positionStrategy: this._overlay.position().global().right('0').top('0'),
      scrollStrategy: this._overlay.scrollStrategies.block(),
      hasBackdrop: true,
      backdropClass: 'fullscreen-overlay-backdrop',
    });

    this._overlayRef.attach(new ComponentPortal(component));
    this._overlayRef.backdropClick().subscribe(() => this.closeSlideIn());
  }

  public closeSlideIn() {
    this._overlayRef?.dispose();
    this._overlayRef = undefined;
  }
}
