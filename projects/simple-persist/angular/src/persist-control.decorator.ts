import { AbstractControl } from '@angular/forms';
import { PersistConfig, JsonMiddleware, Persistor } from '@simple-persist/core';
import { Subscription } from 'rxjs';

const defaultConfig: Required<PersistConfig> = {
  keygens: [],
  middlewares: [new JsonMiddleware()],
  storage: window.localStorage,
};

export const PersistControl = (config?: PersistConfig) => (target: any, memberName: string): void => {
  const persistor = new Persistor({
    keygens: [() => memberName, ...(config?.keygens ?? defaultConfig.keygens)],
    middlewares: config?.middlewares ?? defaultConfig.middlewares,
    storage: config?.storage ?? defaultConfig.storage,
  });

  let control: AbstractControl<any>;
  let subscription: Subscription;

  Object.defineProperty(target, memberName, {
    set: (newControl: any) => {
      // Check type
      if (!(newControl instanceof AbstractControl)) {
        throw new TypeError(`PersistControl() only accepts a subclass of AbstractControl, received ${newControl.constructor.name} instead.`);
      }

      // Clear up previous state
      if (control) {
        persistor.delete();
        subscription?.unsubscribe();
      }

      // Set up new state
      control = newControl;

      // Load or set initial value
      const persistedValue = persistor.get();
      if (persistedValue !== undefined && persistedValue !== null) {
        control.setValue(persistedValue);
      } else {
        persistor.set(control.value);
      }

      // Subscribe to changes
      subscription = control.valueChanges.subscribe((value) => {
        if (value === undefined) {
          persistor.delete();
        } else {
          persistor.set(value);
        }
      });
    },
    get: () => control,
  });
};
