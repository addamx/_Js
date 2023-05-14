
function createElement(vnode) {
  if (createComponent(vnode)) {
    return vnode.el;
  }

  let { tag, data, children } = vnode;
  const dom = document.createElement(tag)
  if (data) {
    const { style = {},  attrs = {}, on = {} } = data;
    let classNames = data.class;

    Object.entries(style).forEach(([key, val]) => {
      dom.style[key] = val;
    })
    Object.entries(attrs).forEach(([key, val]) => {
      dom.setAttribute(key, val)
    })
    if (classNames) {
      if (typeof classNames === 'string') {
        classNames = [classNames]
      } else if (!Array.isArray(classNames)) {
        classNames = Object.entries(classNames).reduce((acc, [key, val]) => {
          if (val) {
            acc.push(key)
          }
          return acc;
        }, [])
      }
      dom.classList.add(...classNames);
    }
    Object.entries(on).forEach(([key, val]) => {
      dom.addEventListener(key, (ev) => val(ev))
    })
  }
  if (children) {
    if (!Array.isArray(children)) {
      children = [children]
    }
    children.forEach(child => {
      if (typeof child === 'string') {
        child = document.createTextNode(child)
      } else {
        child = createElement(child)
      }
      dom.appendChild(child)
    })
  }
  vnode.el = dom;
  return dom;
}

function createComponent(vnode) {
  const { data } = vnode;
  if (data?.hook?.init) {
    data.hook.init(vnode);
    if (vnode.componentInstance) {
      vnode.el = vnode.componentInstance.$el;
      return true
    }
  }
}


export function patch(oldVnode, vnode) {
  if (vnode.isComment) {
    return document.createComment(vnode.text)
  }

  if (!oldVnode) {
    return createElement(vnode);
  }

  if (oldVnode.component && vnode.component && (oldVnode.component === vnode.component)) {
    if (vnode.data?.hook?.patch) {
      vnode.data.hook.patch(oldVnode, vnode)
    }
    return vnode.el = oldVnode.el;
  }

  if (oldVnode.tag !== vnode.tag) {
    oldVnode.el.parentElement.replaceChild(createElement(vnode), oldVnode.el);
  } else {
    /**
     * @type {HTMLElement}
     */
    const el = vnode.el = oldVnode.el;
    const { data: newData = {}, children: newChildren = [] } = vnode;
    const { data: oldData = {}, children: oldChildren = [] } = oldVnode;

    const { style: newStyle = {}, attrs: newAttrs = {}, on: newOn = {} } = newData;
    const { style: oldStyle = {}, attrs: oldAttrs = {}, on: oldOn = {} } = oldData;
    Object.entries(newStyle).forEach(([key, val]) => {
      if (oldStyle[key] !== val) {
        el.style[key] = val;
      }
    })
    Object.keys(oldStyle).forEach((key) => {
      if (!newStyle[key] && newStyle[key] !== 0) {
        el.style[key] = '';
      }
    })
    Object.entries(newAttrs).forEach(([key, val]) => {
      if (!oldAttrs[key] !== val) {
        el.setAttribute(key, val)
      }
    })
    Object.keys(oldAttrs).forEach((key) => {
      if (!oldAttrs[key] && oldAttrs[key] !== 0) {
        el.removeAttribute(key)
      }
    })
    Object.entries(newOn).forEach(([key, val]) => {
      if (oldOn[key] !== val) {
        el.addEventListener(key, (ev) => val(ev))
      }
    })
    Object.entries(oldOn).forEach(([key, val]) => {
      if (!newOn[key] && newOn[key] !== 0) {
        el.removeEventListener(key, val)
      }
    })

    if (typeof newChildren === 'string') {
      if (typeof oldChildren === 'string') {
        if (newChildren !== oldChildren) {
          el.textContent = newChildren;
        }
      } else {
        el.textContent = newChildren;
      }
    } else {
      if (typeof oldChildren === 'string') {
        el.innerHTML = '';
        newChildren.forEach(child => {
          el.appendChild(createElement(child))
        })
      } else {
        const len = Math.max(newChildren.length, oldChildren.length);
        for (let i = 0; i < len; i++) {
          const oldChildNode = oldChildren[i];
          const newChildNode = newChildren[i];

          if (typeof newChildNode === 'string') {
            const oldChild = el.childNodes[i];
            if (!oldChild) {
              el.appendChild(document.createTextNode(newChildNode))
            } else {
              oldChild.textContent = newChildNode;
            }
            continue;
          }

          if (!oldChildNode) {
            el.appendChild(createElement(newChildNode))
          } else if (!newChildNode) {
            el.removeChild(oldChildNode.el)
          } else {
            const dom = patch(oldChildNode, newChildNode)
            if (dom && dom !== oldChildNode.el) {
              el.replaceChild(dom, oldChildNode.el)
            }
          }

        }
      }
    }

    return el;
  }
}


