import VNode from "./vnode";

export function createComponent(ctor, data, context, children, tag) {
  if (typeof ctor === 'object') {
    // context.$options._base => Vue
    ctor = context.$options._base.extend(ctor)
  }

  data.hook = {
    init(vnode) {
      const child = vnode.componentInstance = new ctor({
        _isComponent: true,
        _parentVnode: vnode,
        parent: context,
      })
      child.$mount()
    }
  }

  const vnode = new VNode(
    {
      tag: `vue-component-${ctor.cid}${tag ? `-${tag}` : ""}`,
      data,
      children: undefined,
      context,
      componentOptions:  {
        Ctor: ctor,
      }
    }
  )
  return vnode;
}


