import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';

import { NOTIFICATION_LIST } from 'app/core/constant';
import { IStore } from 'app/shared/interfaces/store.interface';
import { CustomOverlayService } from 'app/shared/services/custom-overlay.service';
import * as AuthActions from 'app/shared/states/auth/auth.actions';
import { IProfile } from 'app/shared/states/auth/auth.interfaces';
import { getUserData } from 'app/shared/states/auth/auth.selectors';
import { AuthServiceImpl } from 'app/shared/states/auth/auth.service';
import { IRequest } from 'app/shared/states/my-request/myrequests.interfaces';
import { selectCurrentMyRequest } from 'app/shared/states/my-request/myrequests.selectors';
import { FetchSearchList } from 'app/shared/states/search/search.actions';
import { IRequestFecthList } from 'app/shared/states/search/search.interfaces';
import { getKeyword } from 'app/shared/states/search/search.selectors';
import * as UiActions from 'app/shared/states/ui/ui.actions';
import {
  getNavOpened,
  getSearchOpened,
} from 'app/shared/states/ui/ui.selectors';
import {
  getSubHeaderTitle,
  showBackIcon,
} from 'app/shared/states/ui/ui.selectors';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();
  public userData$: Observable<IProfile>;
  public searchString$: Observable<string>;
  public selectedRequest$: Observable<IRequest>;

  public userData: IProfile;
  
      .select(getSearchOpened)
      .pipe(
        debounceTime(10),
        takeUntil(this.onDestroy$),
        tap(value => (this.searchOpened = value))
      )
      .subscribe();

    this.selectedRequest$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(item => (this.requestItem = item))
      )
      .subscribe();
  }

  onCreditAppClick() {
    if (!this.requestItem) {
      this.store$.dispatch(
        new UiActions.SetNotificationMessage(NOTIFICATION_LIST.noMyRequestItem)
      );
      this.overlayService$.open();
      this.router$.navigate(['my-request']);
    } else {
      this.router$.navigate(['credit-application'], {
        queryParams: { request_id: this.requestItem.id },
        queryParamsHandling: 'merge',
      });
      return false;
    }
  }

  isLoggedIn() {
    return this.authService.getToken();
  }

  signIn() {
    this.store$.dispatch(new AuthActions.RegisterUser('signIn'));
  }

  register() {
    this.store$.dispatch(new AuthActions.RegisterUser('register'));
  }

  onBackIconClick() {
    this.store$.dispatch(
      new UiActions.NavigateButtonClick({
        type: 'previous',
        click: true,
      })
    );
  }

  toggleNavbar() {
    this.store$.dispatch(new UiActions.SetNavOpened(!this.navbarOpen));
  }

  toggleSearch(status: boolean) {
    if (status) {
      this.router$.navigate(['find-my-car/search']);
    } else {
      this.store$.dispatch(new UiActions.SetSearchOpened(status));
      this.router$.navigate(['find-my-car']);
    }
  }

  onKeyUp() {
    this.keyDown = false;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      const payload: IRequestFecthList = {
        keyword: this.searchString,
        page: 1,
        count: 60,
      };
      this.store$.dispatch(new FetchSearchList(payload));
    }, 800);
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
