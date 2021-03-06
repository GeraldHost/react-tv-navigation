class Shim {
  constructor() {
    if (!Shim.instance) {
      this.shims = {};
      Shim.instance = this;
    }
    return Shim.instance;
  }
  register(name, type, fn) {
    const currentShims = this.shims[name];
    this.shims[name] = currentShims
      ? { ...currentShims, [type]: fn }
      : { [type]: fn };
  }
  unregister(name, type) {
    if (this.shims?.[name]?.[type]) {
      this.shims[name] = {};
    }
  }
  run(_node, previousNode, type, ...args) {
    let node = _node;
    while (this.shims[node.name]?.[type]) {
      node = this.shims[node.name][type](node, previousNode, ...args);
    }
    return node;
  }
}

const instance = new Shim();
Object.freeze(instance);
export default instance;
