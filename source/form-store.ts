import {Injectable} from '@angular/core';
import {NgForm} from '@angular/forms';

import {NgRedux} from 'ng2-redux';

import {Action, Store, Unsubscribe} from 'redux';

export interface AbstractStore<RootState> {
  /// Dispatch an action
  dispatch(action: Action & {payload}): void;

  /// Retrieve the current application state
  getState(): RootState;

  /// Subscribe to changes in the store
  subscribe(fn: (state: RootState) => void): Unsubscribe;
}

export const FORM_CHANGED = '@@ng2-redux-form/FORM_CHANGED';

@Injectable()
export class FormStore<RootState> {
  /// NOTE(cbond): The declaration of store is misleading. This class is
  /// actually capable of taking a plain Redux store or an NgRedux instance.
  /// But in order to make the ng dependency injector work properly, we
  /// declare it as an NgRedux type, since the non-ng2-redux use case involves
  /// calling the constructor of this class manually (from configure.ts),
  /// where a plain store can be cast to an NgRedux. (For our purposes, they
  /// have almost identical shapes.)
  constructor(private store: NgRedux<RootState>) {}

  getState() {
    return this.store.getState();
  }

  subscribe(fn: (state: RootState) => void): Unsubscribe {
    return this.store.subscribe(() => fn(this.getState()));
  }

  valueChanged<T>(path: string[], form: NgForm, value: T) {
    this.store.dispatch({
      type: FORM_CHANGED,
      payload: {
        path,
        valid: form.valid === true,
        value
      }
    });
  }
}
