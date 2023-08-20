import { isArray, isFunction, isObject } from 'lib/utils';
import { Values } from 'lib/types';

export const is = (o1: object, o2: object) => Object.is(o1, o2);

export const has = (o: object, k: PropertyKey) => Reflect.has(o, k);

export const get = (o: object, k: PropertyKey, r: any = o) =>
  Reflect.get(o, k, r);

export const set = (o: object, k: PropertyKey, v: any, r: any = o) =>
  Reflect.set(o, k, v, r);

export const keys = <T extends object>(o: T) => Reflect.ownKeys(o);

export const entries = <T extends object>(o: T) => Object.entries(o);

export const values = <T extends object>(o: T): Values<T> => Object.values(o);

export const deepClone = <T extends Object | Function | Array<any>>(
  source: T
): T => {
  if (!source || !isObject(source) || source instanceof HTMLElement)
    return source;
  if (isFunction(source)) {
    const fn = source.bind(null);
    fn.prototype = deepClone(source.prototype);
    return fn;
  }

  return entries(source).reduce((newObj, [k, v]) => {
    switch (Object.prototype.toString.call(v)) {
      case '[object Date]':
        const d = new Date();
        d.setTime(v.getTime());
        set(newObj, k, d);
        break;
      case '[object RegExp]':
        set(newObj, k, new RegExp(v));
        break;
      case '[object Object]':
      case '[object Array]':
        set(
          newObj,
          k,
          keys(v).reduce(
            (subObj, subK) => {
              set(subObj, subK, deepClone(v[subK]));
              return subObj;
            },
            isArray(v) ? [] : {}
          )
        );
        break;
      default:
        set(newObj, k, v);
    }

    return newObj;
  }, (isArray(source) ? [] : {}) as T);
};

export const assign = (
  target: object,
  ...sources: Array<object | undefined | null>
) => Object.assign(target, ...sources);

export const mixin = <T extends object, U extends object>(
  target: T,
  source?: U
) => {
  if (!source) return deepClone(target);

  return entries(source).reduce((newObj, [key, value]) => {
    if (isObject(value)) {
      const maybeObj = get(target, key);
      if (maybeObj && isObject(maybeObj)) {
        set(newObj, key, mixin(maybeObj, value));
      } else {
        set(newObj, key, deepClone(value));
      }
    } else if (isArray(value)) {
      set(newObj, key, deepClone(value));
    } else {
      set(newObj, key, value);
    }

    return newObj;
  }, deepClone(target));
};

export function enumToMap<K = string, V = any>(e: object): Map<K, V>;
export function enumToMap<K = string, V = any>(
  e: object,
  reverseKeyAndValue: false
): Map<K, V>;
export function enumToMap<K = string, V = any>(
  e: object,
  reverseKeyAndValue: true
): Map<V, K>;
export function enumToMap(
  e: object,
  reverseKeyAndValue = false
): Map<any, any> {
  return reverseKeyAndValue
    ? entries(e).reduce<Map<any, any>>((m, [k, v]) => {
        m.set(v, k);
        return m;
      }, new Map())
    : new Map(entries(e));
}
