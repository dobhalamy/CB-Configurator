import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';

import {
  FIND_STEP_CUSTOM_REQUEST,
  FIND_STEP_CUSTOM_REQUEST_CREDIT,
} from 'app/core/constant';
import { IStore } from 'app/shared/interfaces/store.interface';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  animations: [
    trigger('fade', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate(300)]),
      transition(':leave', [animate(500)]),
    ]),
  ],
})
export class LayoutComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  public showSubMenu: Boolean = true;
  public currentUrl: String;
  public currentPage: String;

  constructor(
    private router: Router,
    private store$: Store<IStore>,
    @Inject(DOCUMENT) document
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngOnInit() {
    this.store$
      .select(stor