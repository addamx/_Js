import Vue from "./vue";

let cid = 0;

export function createVnode(tag, data = {}, children) {
  if (data.on) {
    Object.entries(data.on).forEach(([key, handler]) => {
      data.on[key] = handler.bind(this);
    })
  }
  if (typeof tag === 'string') {
    if (isReservedTag(tag)) {
      return {
        tag,
        data,
        children,
        el: null,
      }
    } else if (this.components[tag]) {
      return createComponent(this.$options.components[tag], data)
    } else {
      return {
        tag,
        isComment: true,
        text: tag
      }
    }
  } else {
    return createComponent(tag, data)
  }
}

function createComponent(tag, data) {
  cid++;
  return {
    tag: `vue-component-${cid}`,
    data: {
      ...data,
      hook: {
        init(vnode) {
          const child = vnode.componentInstance = new Vue({
            propsData: data.props,
            on: data.on,
            ...tag,
          });
          child.$mount(); // 生成 $el
        },
        patch(oldVnode, vnode) {
          const child = vnode.componentInstance = oldVnode.componentInstance;
          const propsData = vnode.data.props ?? {};
          child.updateProps(propsData);
        }
      }
    },
    children: undefined,
    component: tag
  }
}

function isReservedTag(tag) {
  return ('html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot').includes(tag);
}
