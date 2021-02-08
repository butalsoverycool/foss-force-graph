export const clone = (instance) => {
  // arr
  if (Array.isArray(instance)) {
    return [...instance].map((item, nth) => clone(item, nth));
  }

  // obj
  else if (instance !== null && typeof instance === "object") {
    let copy = instance.constructor();
    for (var key in instance) {
      copy[key] = clone(instance[key]);
    }
    return copy;
  }

  // bottom level
  return instance;
};

export const tryCallback = (cb, args = null) => {
  if (typeof cb === "function") {
    !!args ? cb(args) : cb();
  }
};
