module.exports = function (source) {
  const root = parseHTML(source);
  const code = genCode(root);

  const res =  `
  var render = function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h;
    return ${code};
  }
  var staticRenderFns = []
  render._withStripped = true;
  export { render, staticRenderFns };
  `;

  console.log('[templateLoader]gen-render', res);

  return res;
};

function parseHTML(source) {
    let html = source;
    let root;
    let currentElm;
    let elmStack = []
    let c = 10
    while (html && (c > 0)) {
      c--;
      const tagStartIndex = html.indexOf('<');
      const tagEndIndex = html.indexOf('</');

      const startTagMatch = html.match(/<([a-z0-9-]+)\s*?[^>]*?>/);
      if ((!root || tagStartIndex === 0) && (tagStartIndex < tagEndIndex) && startTagMatch) {
        const [matched, tag] = startTagMatch;
        const index = startTagMatch.index;
        const elm = {
          tag: tag,
          attrs: {},
          children: []
        };
        if (currentElm) {
          currentElm.children.push(elm);
        } else {
          root = elm;
        }
        currentElm = elm;
        elmStack.push(elm);

        advance(index + matched.length);
        continue;
      }

      const textMatch = html.match(/([^<]+?)</);
      if (tagEndIndex !== 0 && textMatch) {
        const [, textContent] = textMatch;
        const index = textMatch.index;

        const text = textContent.replace(/{{(.+?)}}/g, function (matched, variable) {
          return `' + _vm._s(_vm.${variable}) + '`;
        }).replace(/\n/g, '');
        if (!/^\s+$/.test(text)) {
          currentElm.children.push(`'${text}'`);
        }

        advance(index + textContent.length);
        continue;
      }


      const endTagMatch = html.match(/<\/\s*?([a-z0-9-]+)>/);
      if (endTagMatch) {
        const [matched, tag] = endTagMatch;
        const index = endTagMatch.index;
        if (currentElm.tag !== tag) {
          throw new Error(`tag not match ${currentElm.tag} !== ${tag}`);
        }
        elmStack.pop();
        currentElm = elmStack[elmStack.length - 1];

        advance(index + matched.length);
        continue;
      }

      if (elmStack.length === 0) {
        break;
      }
    }

    function advance(n) {
      html = html.slice(n);
    }
  return root;
}

function genCode(elm) {
  const { tag, attrs, children } = elm;
  return `_c('${tag}', {}, [
    ${children.map(child => {
      if (typeof child === 'string') {
        return `_vm._v(${child})`;
      }
      return `"${genCode(child)}"`;
    }).join(', ')}
  ])`;
}
