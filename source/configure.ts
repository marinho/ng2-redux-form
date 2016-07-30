import { provide } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { Store } from 'redux';

import { FormActions } from './form-actions';

export const provideReduceForms = <T>(arg: Store<T> | NgRedux<T>) => {
  const redux = arg as NgRedux<T>;
  if (typeof redux.select === 'function') {
    return [
      provide(FormActions, {
        useFactory: (ngRedux: NgRedux<T>) => new FormActions(ngRedux.select(s => s))
      })
    ];
  }
  else {
    return [
      provide(FormActions, {
        useFactory: () => new FormActions(arg as Store<T>)
      })
    ];
  }
};