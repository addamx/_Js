import { createComponent } from "./create-component";
import VNode, { createTextVNode } from "./vnode";

function isReservedTag(tag) {
  return true;
}

export function createElement(vm, tag, data = {}, children) {
  let vnode;

  if (!Array.isArray(children)) {
    children = [children];
  }

  const childrenVnodes = normalizeChildren(children);

  if(typeof tag === 'string') {
    if (isReservedTag(tag)) {
      vnode = new VNode(
        {
          tag,
          data,
          children: childrenVnodes,
          context: vm
        })
    }
  } else {
    vnode = createComponent(tag, data, vm, childrenVnodes)
  }

  return vnode;
}


function normalizeChildren(children) {
  return children.map(child => {
    if (typeof child === 'string' || typeof child === 'number') {
      return createTextVNode(child)
    } else {
      return child;
    }
  })
}
