export const has = (o: object, k: PropertyKey) => Reflect.has(o, k);

export const get = (o: object, k: PropertyKey) => Reflect.get(o, k);

export const set = (o: object, k: PropertyKey, v: any) => Reflect.set(o, k, v);

export const keys = (o: object) => Reflect.ownKeys(o);

export const entries = (o: object) => Object.entries(o);

export const values = (o: object) => Object.values(o);

export const deepClone = <T extends Object | Function | Array<any>>(
  source: T
): T => {
  if (!source || typeof source !== 'object' || source instanceof HTMLElement)
    return source;
  if (typeof source === 'function') {
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
          Reflect.ownKeys(v).reduce(
            (subObj, subK) => {
              set(subObj, subK, deepClone(v[subK]));
              return subObj;
            },
            Array.isArray(v) ? [] : {}
          )
        );
        break;
      default:
        set(newObj, k, v);
    }

    return newObj;
  }, (Array.isArray(source) ? [] : {}) as T);
};
