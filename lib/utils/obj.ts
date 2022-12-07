export const get = (o: Object, k: PropertyKey) => Reflect.get(o, k);

export const set = (o: Object, k: PropertyKey, v: any) => Reflect.set(o, k, v);

export const keys = (o: Object) => Reflect.ownKeys(o);

export const entries = (o: Object) => Object.entries(o);
