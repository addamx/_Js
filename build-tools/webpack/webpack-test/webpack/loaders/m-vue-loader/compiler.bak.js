const startTagOpenReg = /<([a-z0-9-]+)/;
const startTagCloseReg = /^\s*(\/?)>/;
const attributeReg =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const endTagReg = /<\/([a-z0-9-]+)>/;

// vue-template-compiler
module.exports = {
  parse({ content }) {
    const sfc = {
      template: null,
      scirpt: null,
      syltes: [],
      customBlocks: [],
    };

    let depth = 0;
    let currentBlock = null;

    return parseHTML(content, {
      start(tag, attrs, unary, start, end) {
        if (depth === 0) {
          currentBlock = {
            type: tag,
            content: '',
            start: end,
            attrs: {}
          }
          if (['template', 'script', 'style'].includes(tag)) {
            if (tag === 'style') {
              sfc.styles.push(currentBlock);
            } else {
              sfc[tag] = currentBlock;
            }
          } else {
            sfc.customBlocks.push(currentBlock);
          }
        }
        if (!unary) {
          depth++;
        }
      },
      end(tag, start) {
        //
      },
    });
  },
};

function parseHTML(html, options) {
  let index = 0;
  const stack = [];
  let last, lastTag;

  // 循环解析html
  // 1. 解析开始标签

  while (html) {
    last = html;
    const isInHtmlScope = !lastTag || !['script', 'style'].includes(lastTag);
    // 处理 template
    if (isInHtmlScope) {
      let textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // End tag:
        const endTagMatch = html.match(endTagReg);
        if (endTagMatch) {
          const curIndex = index;
          advance(endTagMatch[0].length);
          // parseEndTag(endTagMatch[1], curIndex, index);
          continue;
        }

        // Start tag:
        const startTagMatch = parseStartTag();
        if (startTagMatch) {
          handleStartTag(startTagMatch);
          continue;
        }
      }

      let text; // 标签之间的内容
      if (textEnd >= 0) {
        let rest = html.slice(textEnd);
        let next;
        while (
          !endTagReg.test(rest) &&
          !startTagOpenReg.test(rest)
        ) {
          next += rest.indexOf('<', 1);
          if (next < 0) break;
          textEnd += next;
          rest = html.slice(textEnd);
        }
        text = html.substring(0, textEnd);
      }

      if (text) {
        // 移动到下一个标签处
        advance(text.length);
        // 处理标签间内容
        if (options.chars) {
          options.chars(text, index - text.length, index);
        }
      }
    } else {
      let endTagLength = 0;
    }
  }

  /**
   * 移动指针
   * @param {number} n
   */
  function advance(n) {
    index += n;
    html = html.substring(n);
  }

  function parseStartTag() {
    const start = html.match(startTagOpenReg);
    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
        start: index,
        end: undefined,
        unarySlash: undefined, // 是否是自闭合标签
      };
      advance(start[0].length);

      let end, attr;
      // 收集tag的属性
      while (
        !(end = html.match(startTagCloseReg)) &&
        (attr = html.match(attributeReg))
      ) {
        advance(attr[0].length);
        match.attrs.push(attr);
      }
      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match;
      }
    }
  }

  function handleStartTag(startTagMatch) {
    const tagName = startTagMatch.tagName;
    const attrs = startTagMatch.attrs;
    const unary = startTagMatch.unarySlash;

    if (!unary) {
      stack.push({
        tag: tagName,
        start: startTagMatch.start,
        end: startTagMatch.end,
      });
      lastTag = tagName;
    }

    if (options.start) {
      options.start(
        tagName,
        attrs,
        unary,
        index,
        index + startTagMatch[0].length
      );
    }
  }
}

/*
{
  "template": {
    "type": "template",
    "content": "\n<div class=\"app-class\">\n  {{appTitle}}\n</div>\n",
    "start": 10,
    "attrs": {},
    "end": 63
  },
  "script": {
    "type": "script",
    "content": "//\n//\n//\n//\n//\n//\n\nexport default {\n  data() {\n    return {\n      appTitle: 'Hello World'\n    }\n  }\n}\n",
    "start": 84,
    "attrs": {},
    "end": 168
  },
  "styles": [
    {
      "type": "style",
      "content": "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.app-class {\n  color: red;\n}\n",
      "start": 186,
      "attrs": {},
      "end": 216
    }
  ],
  "customBlocks": [],
  "errors": []
}


*/
