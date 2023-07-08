export default class VNode {
  constructor({tag, data, children, context, componentOptions, text}) {
    this.tag = tag
    this.data = data
    this.children = children
    this.context = context
    this.componentOptions = componentOptions
    this.text = text
  }
}

export function createTextVNode(val) {
  return new VNode({
    text: String(val)
  })
}
