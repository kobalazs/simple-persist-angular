import { PersistControl } from './persist-control.decorator';
import { FormControl, FormGroup } from '@angular/forms';

// https://github.com/jestjs/jest/issues/6798#issuecomment-440988627
const localStorageGetItemSpy = jest.spyOn(window.localStorage['__proto__'], 'getItem');
const localStorageSetItemSpy = jest.spyOn(window.localStorage['__proto__'], 'setItem');
const localStorageRemoveItemSpy = jest.spyOn(window.localStorage['__proto__'], 'removeItem');

class TestBed {
  @PersistControl() public foo: any;
}

class EarlyTestBed {
  @PersistControl() public foo = new FormControl();
}

describe('@PersistControl()', () => {
  let testBed: TestBed;

  beforeEach(() => {
    testBed = new TestBed();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle invalid types', () => {
    expect(() => { (testBed.foo as any) = 'bar'; }).toThrow(TypeError);
    expect(() => { (testBed.foo as any) = {}; }).toThrow(TypeError);
    expect(() => { testBed.foo = new FormControl(); }).not.toThrow(TypeError);
    expect(() => { testBed.foo = new FormGroup({}); }).not.toThrow(TypeError);
  });

  it('should load initial value for FormControl', () => {
    localStorageGetItemSpy.mockReturnValue('"bar"');
    testBed.foo = new FormControl();
    expect(localStorageRemoveItemSpy).toHaveBeenCalledWith('foo');
    expect(localStorageGetItemSpy).toHaveBeenCalledWith('foo');
    expect(testBed.foo.value).toBe('bar');
  });

  it('should load initial value for FormGroup', () => {
    localStorageGetItemSpy.mockReturnValue('{ "a": "bar", "b": "baz" }');
    testBed.foo = new FormGroup({
      a: new FormControl(),
      b: new FormControl(),
    });
    expect(localStorageRemoveItemSpy).toHaveBeenCalledWith('foo');
    expect(localStorageGetItemSpy).toHaveBeenCalledWith('foo');
    expect(testBed.foo.value).toStrictEqual({ a: 'bar', b: 'baz' });
  });

  it('should load initial value for empty FormControl set early', () => {
    localStorageGetItemSpy.mockReturnValue('"bar"');
    const earlyTestBed = new EarlyTestBed();
    expect(localStorageGetItemSpy).toHaveBeenCalledWith('foo');
    expect(localStorageRemoveItemSpy).not.toHaveBeenCalled();
    expect(earlyTestBed.foo.value).toBe('bar');
  });

  it('should set initial value for non-empty BehaviorSubject', () => {
    testBed.foo = new FormControl('bar');
    testBed.foo.value = undefined;
    expect(localStorageRemoveItemSpy).toHaveBeenCalledWith('foo');
    expect(testBed.foo.value).toBeUndefined();
  });

  it('should persist value', () => {
    localStorageGetItemSpy.mockReturnValue(undefined);
    testBed.foo = new FormControl('bar');
    expect(localStorageRemoveItemSpy).toHaveBeenCalledWith('foo');
    expect(localStorageSetItemSpy).toHaveBeenCalledWith('foo', '"bar"');
    expect(testBed.foo.value).toBe('bar');
  });

  it('should remove key from storage if value is undefined', () => {
    testBed.foo = new FormControl('bar');
    testBed.foo.value = undefined;
    expect(localStorageRemoveItemSpy).toHaveBeenCalledWith('foo');
    expect(testBed.foo.value).toBeUndefined();
  });
});
