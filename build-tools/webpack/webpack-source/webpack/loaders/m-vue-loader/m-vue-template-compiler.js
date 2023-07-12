module.exports = {
  parse({ content }) {
    const sfc = {
      template: null,
      script: null,
      styles: [],
    };

    const res =
      /(<template>([\s\S]*?)<\/template>)|(<script\>([\s\S]*?)<\/script>)|(<style>([\s\S]*?)<\/style>)/g;

    let match;
    while ((match = res.exec(content))) {
      const [
        _,
        template,
        templateContent,
        script,
        scriptContent,
        style,
        styleContent,
      ] = match;
      const type = template ? 'template' : script ? 'script' : 'style';
      const content = templateContent || scriptContent || styleContent;
      const startIndex = match.index;
      const endIndex = startIndex + match[0].length;
      const block = {
        type,
        content,
        start: startIndex,
        end: endIndex,
      };
      if (type === 'style') {
        sfc.styles.push(block);
      } else {
        sfc[type] = block;
      }
    }
    return sfc;
  },
};

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
