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

export const httpStatusMsg = (res) => {
  const status = typeof res === "number" ? res : res.status ? res.status : null;
  const prefix = "HTTP-status: ";

  const msg = () => {
    switch (status) {
      case status <= 199:
        return "the request was received, continuing process...";

      case status <= 299:
        return "The request was successfully received, understood, and accepted.";

      case status <= 399:
        return "Further action needs to be taken in order to complete the request.";

      case status <= 499:
        return "The request contains bad syntax or cannot be fulfilled.";

      default:
        return "The server failed to fulfil an apparently valid request";
    }
  };

  return prefix + msg();
};

export const timeStamp = (tags = [], input = 0) => {
  const d = new Date(Date.now() + input);

  const date = d.toLocaleDateString();
  const time = d.toLocaleTimeString();

  const obj = {
    year: d.getFullYear(),
    month: d.getMonth(),
    date: d.getDate(),
    weekday: d.getDay() === 0 ? 6 : d.getDay() === 1 ? 0 : d.getDay(),
    min: d.getMinutes(),
    sec: d.getSeconds(),
  };

  if (!Array.isArray(tags)) tags = [tags];

  let res = {
    date,
    time,
    obj,
    tags,
  };

  return res;
};

export const storageAvailable = () => {
  if (typeof window === "undefined") {
    console.log("window and local storage not available");
    return false;
  }

  try {
    localStorage.setItem("test", "test");
    localStorage.removeItem("test");

    console.log("local storage not available");
    return true;
  } catch (e) {
    return false;
  }
};

export const storage = {
  set: (key, val) =>
    storageAvailable() ? localStorage.setItem(key, JSON.stringify(val)) : false,
  get: (key) =>
    storageAvailable() ? JSON.parse(localStorage.getItem(key)) : false,
  remove: (key) => (storageAvailable() ? localStorage.removeItem(key) : false),
};

export const clickOutside = (node) => {
  const handleClick = (event) => {
    if (node && !node.contains(event.target) && !event.defaultPrevented) {
      node.dispatchEvent(new CustomEvent("click_outside", node));
    }
  };

  document.addEventListener("click", handleClick, true);

  return {
    destroy() {
      document.removeEventListener("click", handleClick, true);
    },
  };
};
