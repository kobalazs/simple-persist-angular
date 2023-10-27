# SimplePersist Angular
[SimplePersist](https://www.npmjs.com/package/@simple-persist/core) decorator to handle Angular forms

#### Table of Contents
* [Installation](#installation)
* [Quick start](#quick-start)
* [Read more](#read-more)
* [Collaboration](#collaboration)

## Installation
```bash
npm install @simple-persist/angular
```

## Quick start
Add `@PersistControl()` decorator to a FormGroup or FormControl class property:
```ts
import { PersistControl } from '@simple-persist/angular';
import { FormControl, FormGroup } from '@angular/forms';

class Foo {
  @PersistControl() public bar?: FormGroup;
  // or
  @PersistControl() public baz?: FormControl;
}
```
> **Note:**  All configuration options of `@Persist()` from
> [@simple-persist/core](https://www.npmjs.com/package/@simple-persist/core)
> are available for `@PersistControl()` as well.
> Use the same syntax to define custom keygens, middlewares or storage for your decorator!

## Read more
For more information (caveats, advanced use, other extensions) see [@simple-persist/core](https://www.npmjs.com/package/@simple-persist/core).

Check out my article about the reasoning behind this package: [Do we need state management in Angular?](https://medium.com/@kobalazs/do-we-need-state-management-in-angular-baf612823b16)

## Collaboration

Feel free to [suggest features](https://github.com/kobalazs), [open issues](https://github.com/kobalazs/simple-persist-angular/issues), or [contribute](https://github.com/kobalazs/simple-persist-angular/pulls)! Also let me know about your extensions, so I can link them in this document.
