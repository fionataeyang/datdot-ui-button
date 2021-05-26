(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (__filename){(function (){
const bel = require('bel')
const csjs = require('csjs-inject')
const path = require('path')
const filename = path.basename(__filename)
const button = require('..')
const svg = require('datdot-ui-graphic')
const domlog = require('ui-domlog')

function demoComponent() {
    let recipients = []
    // icons
    let iconCancel = svg({css: css.icon, path: 'assets/cancel.svg'})
    let iconConfirm = svg({css: css.icon, path: 'assets/check.svg'})
    // UI element settings
    let option = {
        page: 'USER',
        name: 'button1',
        content: 'Confirm',
        themeName: 'default',
        widgetTheme: 'confirm'
    }

    let option1 = {
        page: 'demo',
        name: 'button2',
        content: 'Cancel',
        themeName: 'default',
        widgetTheme: 'cancel',
    }

    let option2 = {
        page: 'demo',
        flow: 'toggle',
        name: 'date',
        content: 'Date',
        themeName: 'default',
        widgetTheme: 'toggle',
        isActive: true,
    }

    let tabOption1 = {
        page: 'demo',
        flow: 'tab',
        name: 'hourly',
        content: '1H',
        themeName: 'default',
        widgetTheme: 'tab',
        isActive: true
    }

    let tabOption2 = {
        page: 'demo',
        flow: 'tab',
        name: 'daily',
        content: '1D',
        themeName: 'default',
        widgetTheme: 'tab'
    }

    let tabOption3 = {
        page: 'demo',
        flow: 'tab',
        name: 'monthly',
        content: '1M',
        themeName: 'default',
        widgetTheme: 'tab'
    }

    let tabOption4 = {
        page: 'demo',
        flow: 'tab',
        name: 'yearly',
        content: '1Y',
        themeName: 'default',
        widgetTheme: 'tab',
        isDisabled: true
    }

    let confirmOption = {
        page: 'PLAN',
        name: 'confirm',
        content: iconConfirm,
        themeName: 'default',
        widgetTheme: 'confirm'
    }

    let cancelOption = {
        page: 'PLAN',
        name: 'cancel',
        content: iconCancel,
        themeName: 'default',
        widgetTheme: 'cancel'
    }

    // UI elements
    // primary
    const btn1 = button({...option}, protocol(option.name))
    const btn2 = button({...option1}, protocol(option1.name))
    // toggle
    const btn3 = button({...option2}, protocol(option2.name))
    // tab
    const tab1 = button({...tabOption1}, protocol(tabOption1.name))
    const tab2 = button({...tabOption2}, protocol(tabOption2.name))
    const tab3 = button({...tabOption3}, protocol(tabOption3.name))
    const tab4 = button({...tabOption4}, protocol(tabOption4.name))
    // icon
    const confirm = button({...confirmOption}, protocol(confirmOption.name))
    const cancel = button({...cancelOption}, protocol(cancelOption.name))

    // define css variables
    // document.documentElement.style.setProperty('--button-bg-color', 'hsl(223, 100%, 61%)')
    // document.documentElement.style.setProperty('--button-bg-color-hover', 'hsl(223, 100%, 48%)')
    tab1.style.setProperty('--button-bg-color-active', 'hsl(223, 100%, 61%)')
    // document.body.style.backgroundColor = '#000'

    // content
    const content = bel`
    <div class=${css.content}>
        <section>
            <h2>Button</h2>
            <div>${btn1}${btn2}</div>
        </section>
        <section>
            <h2>Toggle</h2>
            <div>${btn3}</div>
        </section>
        <section>
            <h2>Tab</h2>
            <div class=${css.tab}>${tab1}${tab2}${tab3}${tab4}</div>
        </section>
        <section>
            <h2>Icon</h2>
            <div>${confirm}${cancel}</div>
        </section>
    </div>`

    // show logs
    let terminal = bel`<div class=${css.terminal}></div>`
    // container
    const container = wrap(content, terminal)
    return container

    function wrap (content, terminal) {
        const container = bel`
        <div class=${css.wrap}>
            <section class=${css.container}>
                ${content}
            </section>
            ${terminal}
        </div>
        `

        return container
    }

    /*************************
    * ------ Actions -------
    *************************/
    function toggle(message) {
        const { page, from, flow, type, action, state, body } = message
        let update
        if (state === 'inactive') update = 'active' 
        if (state === 'active') update = 'inactive'
        return recipients[from]({page, from, flow, type: 'clicked', state: update })
    }

    function tab(message) {
        const { page, from, flow, type, action, state, body } = message
        const tab = document.querySelector(`.${css.tab}`)
        const { children } = tab
        const items = [...children]
        // if tab is active then do nothing
        if (state === 'active') return
        items.forEach( item => {
            let name = item.dataset.name
            // make all tabs are inactive, expact current one 
            recipients[name]({page, from, flow, type: 'clicked', state: 'inactive' })
            // make tab active
            if (name === from) recipients[name]({page, from, flow, type: 'clicked', state: 'active' })
            
        })
    }

    /*************************
    * ------ Receivers -------
    *************************/
    function receive (message) {
        const { page, from, flow, type, body } = message
        showLog(message)
        if (type === 'init') return showLog({page, from, flow, type: 'ready', body, filename, line: 51})
        if (type === 'click') { 
            // send log to child module and require to do actions
            if (flow.split('/').includes('toggle')) return toggle(message)
            if (flow.split('/').includes('tab')) return tab(message)
            recipients[from](message)
            showLog({page, from, flow, type: 'clicked', body, filename, line: 52})
        }
    }

    /*************************
    * ------ Protocols -------
    *************************/
    // original protocol for all use
    function protocol (name) {
        return send => {
            recipients[name] = send
            return receive
        }
    }

    /*********************************
    * ------ Promise() Element -------
    *********************************/
    // keep the scroll on bottom when the log displayed on the terminal
    function showLog (message) { 
        sendMessage(message)
        .then( log => {
            terminal.append(log)
            terminal.scrollTop = terminal.scrollHeight
        }
    )}

    async function sendMessage (message) {
        return await new Promise( (resolve, reject) => {
            if (message === undefined) reject('no message import')
            const log = domlog(message)
            return resolve(log)
        }).catch( err => { throw new Error(err) } )
    }
}

const css = csjs`
:root {
    --h: 0;
    --s: 0%;
    --l: 50%;
    --color: var(--h), var(--s);
    --color-black: hsl(var(--color), calc(var(--l) - 50%));
    --color-white: hsl(var(--color), calc(var(--l) + 50%));
    --color-red: hsl(358, 99%, calc(var(--l) + 3%));
    --color-blue: hsl(223, 100%, 61%);
    --font-primary: 1.6rem;
    --font-smaller: calc(var(--font-primary) - 0.4rem);
    --font-small: calc(var(--font-primary) - 0.2rem);
    --font-mediuem: calc(var(--font-primary) + 0.2rem);
    --font-big: calc(var(--font-primary) + 0.4rem);
    --font-bigger: calc(var(--font-primary) + 0.6rem);
    --font-large: calc(var(--font-primary) + 0.8rem);
    --font-larger: calc(var(--font-primary) + 1rem);
    --position-abs: absolute;
}
html {
    box-sizing: border-box;
    height: 100%;
    font-size: 62.5%;
}
*, *:before, *:after {
    box-sizing: inherit;
}
body {
    margin: 0;
    padding: 0;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 1.6rem;
    background-color: rgba(0, 0, 0, .1);
    height: 100%;
}
.wrap {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 75vh 25vh;
}
.container {
    padding: 25px;
    overflow-y: auto;
}
.content > div {
    margin-bottom: 20px;
}
.terminal {
    background-color: #212121;
    color: #f2f2f2;
    font-size: 13px;
    overflow-y: auto;
}
.tab {}
.icon {}
`

document.body.append( demoComponent() )
}).call(this)}).call(this,"/demo/demo.js")
},{"..":30,"bel":3,"csjs-inject":6,"datdot-ui-graphic":23,"path":27,"ui-domlog":29}],2:[function(require,module,exports){
var trailingNewlineRegex = /\n[\s]+$/
var leadingNewlineRegex = /^\n[\s]+/
var trailingSpaceRegex = /[\s]+$/
var leadingSpaceRegex = /^[\s]+/
var multiSpaceRegex = /[\n\s]+/g

var TEXT_TAGS = [
  'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'data', 'dfn', 'em', 'i',
  'kbd', 'mark', 'q', 'rp', 'rt', 'rtc', 'ruby', 's', 'amp', 'small', 'span',
  'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr'
]

var VERBATIM_TAGS = [
  'code', 'pre', 'textarea'
]

module.exports = function appendChild (el, childs) {
  if (!Array.isArray(childs)) return

  var nodeName = el.nodeName.toLowerCase()

  var hadText = false
  var value, leader

  for (var i = 0, len = childs.length; i < len; i++) {
    var node = childs[i]
    if (Array.isArray(node)) {
      appendChild(el, node)
      continue
    }

    if (typeof node === 'number' ||
      typeof node === 'boolean' ||
      typeof node === 'function' ||
      node instanceof Date ||
      node instanceof RegExp) {
      node = node.toString()
    }

    var lastChild = el.childNodes[el.childNodes.length - 1]

    // Iterate over text nodes
    if (typeof node === 'string') {
      hadText = true

      // If we already had text, append to the existing text
      if (lastChild && lastChild.nodeName === '#text') {
        lastChild.nodeValue += node

      // We didn't have a text node yet, create one
      } else {
        node = document.createTextNode(node)
        el.appendChild(node)
        lastChild = node
      }

      // If this is the last of the child nodes, make sure we close it out
      // right
      if (i === len - 1) {
        hadText = false
        // Trim the child text nodes if the current node isn't a
        // node where whitespace matters.
        if (TEXT_TAGS.indexOf(nodeName) === -1 &&
          VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, '')
            .replace(trailingSpaceRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          if (value === '') {
            el.removeChild(lastChild)
          } else {
            lastChild.nodeValue = value
          }
        } else if (VERBATIM_TAGS.indexOf(nodeName) === -1) {
          // The very first node in the list should not have leading
          // whitespace. Sibling text nodes should have whitespace if there
          // was any.
          leader = i === 0 ? '' : ' '
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, leader)
            .replace(leadingSpaceRegex, ' ')
            .replace(trailingSpaceRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          lastChild.nodeValue = value
        }
      }

    // Iterate over DOM nodes
    } else if (node && node.nodeType) {
      // If the last node was a text node, make sure it is properly closed out
      if (hadText) {
        hadText = false

        // Trim the child text nodes if the current node isn't a
        // text node or a code node
        if (TEXT_TAGS.indexOf(nodeName) === -1 &&
          VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')

          // Remove empty text nodes, append otherwise
          if (value === '') {
            el.removeChild(lastChild)
          } else {
            lastChild.nodeValue = value
          }
        // Trim the child nodes if the current node is not a node
        // where all whitespace must be preserved
        } else if (VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingSpaceRegex, ' ')
            .replace(leadingNewlineRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          lastChild.nodeValue = value
        }
      }

      // Store the last nodename
      var _nodeName = node.nodeName
      if (_nodeName) nodeName = _nodeName.toLowerCase()

      // Append the node to the DOM
      el.appendChild(node)
    }
  }
}

},{}],3:[function(require,module,exports){
var hyperx = require('hyperx')
var appendChild = require('./appendChild')

var SVGNS = 'http://www.w3.org/2000/svg'
var XLINKNS = 'http://www.w3.org/1999/xlink'

var BOOL_PROPS = [
  'autofocus', 'checked', 'defaultchecked', 'disabled', 'formnovalidate',
  'indeterminate', 'readonly', 'required', 'selected', 'willvalidate'
]

var COMMENT_TAG = '!--'

var SVG_TAGS = [
  'svg', 'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor',
  'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile',
  'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix',
  'feComponentTransfer', 'feComposite', 'feConvolveMatrix',
  'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood',
  'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage',
  'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight',
  'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter',
  'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src',
  'font-face-uri', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image',
  'line', 'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph',
  'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect',
  'set', 'stop', 'switch', 'symbol', 'text', 'textPath', 'title', 'tref',
  'tspan', 'use', 'view', 'vkern'
]

function belCreateElement (tag, props, children) {
  var el

  // If an svg tag, it needs a namespace
  if (SVG_TAGS.indexOf(tag) !== -1) {
    props.namespace = SVGNS
  }

  // If we are using a namespace
  var ns = false
  if (props.namespace) {
    ns = props.namespace
    delete props.namespace
  }

  // Create the element
  if (ns) {
    el = document.createElementNS(ns, tag)
  } else if (tag === COMMENT_TAG) {
    return document.createComment(props.comment)
  } else {
    el = document.createElement(tag)
  }

  // Create the properties
  for (var p in props) {
    if (props.hasOwnProperty(p)) {
      var key = p.toLowerCase()
      var val = props[p]
      // Normalize className
      if (key === 'classname') {
        key = 'class'
        p = 'class'
      }
      // The for attribute gets transformed to htmlFor, but we just set as for
      if (p === 'htmlFor') {
        p = 'for'
      }
      // If a property is boolean, set itself to the key
      if (BOOL_PROPS.indexOf(key) !== -1) {
        if (val === 'true') val = key
        else if (val === 'false') continue
      }
      // If a property prefers being set directly vs setAttribute
      if (key.slice(0, 2) === 'on') {
        el[p] = val
      } else {
        if (ns) {
          if (p === 'xlink:href') {
            el.setAttributeNS(XLINKNS, p, val)
          } else if (/^xmlns($|:)/i.test(p)) {
            // skip xmlns definitions
          } else {
            el.setAttributeNS(null, p, val)
          }
        } else {
          el.setAttribute(p, val)
        }
      }
    }
  }

  appendChild(el, children)
  return el
}

module.exports = hyperx(belCreateElement, {comments: true})
module.exports.default = module.exports
module.exports.createElement = belCreateElement

},{"./appendChild":2,"hyperx":25}],4:[function(require,module,exports){
(function (global){(function (){
'use strict';

var csjs = require('csjs');
var insertCss = require('insert-css');

function csjsInserter() {
  var args = Array.prototype.slice.call(arguments);
  var result = csjs.apply(null, args);
  if (global.document) {
    insertCss(csjs.getCss(result));
  }
  return result;
}

module.exports = csjsInserter;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"csjs":9,"insert-css":26}],5:[function(require,module,exports){
'use strict';

module.exports = require('csjs/get-css');

},{"csjs/get-css":8}],6:[function(require,module,exports){
'use strict';

var csjs = require('./csjs');

module.exports = csjs;
module.exports.csjs = csjs;
module.exports.getCss = require('./get-css');

},{"./csjs":4,"./get-css":5}],7:[function(require,module,exports){
'use strict';

module.exports = require('./lib/csjs');

},{"./lib/csjs":13}],8:[function(require,module,exports){
'use strict';

module.exports = require('./lib/get-css');

},{"./lib/get-css":17}],9:[function(require,module,exports){
'use strict';

var csjs = require('./csjs');

module.exports = csjs();
module.exports.csjs = csjs;
module.exports.noScope = csjs({ noscope: true });
module.exports.getCss = require('./get-css');

},{"./csjs":7,"./get-css":8}],10:[function(require,module,exports){
'use strict';

/**
 * base62 encode implementation based on base62 module:
 * https://github.com/andrew/base62.js
 */

var CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

module.exports = function encode(integer) {
  if (integer === 0) {
    return '0';
  }
  var str = '';
  while (integer > 0) {
    str = CHARS[integer % 62] + str;
    integer = Math.floor(integer / 62);
  }
  return str;
};

},{}],11:[function(require,module,exports){
'use strict';

var makeComposition = require('./composition').makeComposition;

module.exports = function createExports(classes, keyframes, compositions) {
  var keyframesObj = Object.keys(keyframes).reduce(function(acc, key) {
    var val = keyframes[key];
    acc[val] = makeComposition([key], [val], true);
    return acc;
  }, {});

  var exports = Object.keys(classes).reduce(function(acc, key) {
    var val = classes[key];
    var composition = compositions[key];
    var extended = composition ? getClassChain(composition) : [];
    var allClasses = [key].concat(extended);
    var unscoped = allClasses.map(function(name) {
      return classes[name] ? classes[name] : name;
    });
    acc[val] = makeComposition(allClasses, unscoped);
    return acc;
  }, keyframesObj);

  return exports;
}

function getClassChain(obj) {
  var visited = {}, acc = [];

  function traverse(obj) {
    return Object.keys(obj).forEach(function(key) {
      if (!visited[key]) {
        visited[key] = true;
        acc.push(key);
        traverse(obj[key]);
      }
    });
  }

  traverse(obj);
  return acc;
}

},{"./composition":12}],12:[function(require,module,exports){
'use strict';

module.exports = {
  makeComposition: makeComposition,
  isComposition: isComposition,
  ignoreComposition: ignoreComposition
};

/**
 * Returns an immutable composition object containing the given class names
 * @param  {array} classNames - The input array of class names
 * @return {Composition}      - An immutable object that holds multiple
 *                              representations of the class composition
 */
function makeComposition(classNames, unscoped, isAnimation) {
  var classString = classNames.join(' ');
  return Object.create(Composition.prototype, {
    classNames: { // the original array of class names
      value: Object.freeze(classNames),
      configurable: false,
      writable: false,
      enumerable: true
    },
    unscoped: { // the original array of class names
      value: Object.freeze(unscoped),
      configurable: false,
      writable: false,
      enumerable: true
    },
    className: { // space-separated class string for use in HTML
      value: classString,
      configurable: false,
      writable: false,
      enumerable: true
    },
    selector: { // comma-separated, period-prefixed string for use in CSS
      value: classNames.map(function(name) {
        return isAnimation ? name : '.' + name;
      }).join(', '),
      configurable: false,
      writable: false,
      enumerable: true
    },
    toString: { // toString() method, returns class string for use in HTML
      value: function() {
        return classString;
      },
      configurable: false,
      writeable: false,
      enumerable: false
    }
  });
}

/**
 * Returns whether the input value is a Composition
 * @param value      - value to check
 * @return {boolean} - whether value is a Composition or not
 */
function isComposition(value) {
  return value instanceof Composition;
}

function ignoreComposition(values) {
  return values.reduce(function(acc, val) {
    if (isComposition(val)) {
      val.classNames.forEach(function(name, i) {
        acc[name] = val.unscoped[i];
      });
    }
    return acc;
  }, {});
}

/**
 * Private constructor for use in `instanceof` checks
 */
function Composition() {}

},{}],13:[function(require,module,exports){
'use strict';

var extractExtends = require('./css-extract-extends');
var composition = require('./composition');
var isComposition = composition.isComposition;
var ignoreComposition = composition.ignoreComposition;
var buildExports = require('./build-exports');
var scopify = require('./scopeify');
var cssKey = require('./css-key');
var extractExports = require('./extract-exports');

module.exports = function csjsTemplate(opts) {
  opts = (typeof opts === 'undefined') ? {} : opts;
  var noscope = (typeof opts.noscope === 'undefined') ? false : opts.noscope;

  return function csjsHandler(strings, values) {
    // Fast path to prevent arguments deopt
    var values = Array(arguments.length - 1);
    for (var i = 1; i < arguments.length; i++) {
      values[i - 1] = arguments[i];
    }
    var css = joiner(strings, values.map(selectorize));
    var ignores = ignoreComposition(values);

    var scope = noscope ? extractExports(css) : scopify(css, ignores);
    var extracted = extractExtends(scope.css);
    var localClasses = without(scope.classes, ignores);
    var localKeyframes = without(scope.keyframes, ignores);
    var compositions = extracted.compositions;

    var exports = buildExports(localClasses, localKeyframes, compositions);

    return Object.defineProperty(exports, cssKey, {
      enumerable: false,
      configurable: false,
      writeable: false,
      value: extracted.css
    });
  }
}

/**
 * Replaces class compositions with comma seperated class selectors
 * @param  value - the potential class composition
 * @return       - the original value or the selectorized class composition
 */
function selectorize(value) {
  return isComposition(value) ? value.selector : value;
}

/**
 * Joins template string literals and values
 * @param  {array} strings - array of strings
 * @param  {array} values  - array of values
 * @return {string}        - strings and values joined
 */
function joiner(strings, values) {
  return strings.map(function(str, i) {
    return (i !== values.length) ? str + values[i] : str;
  }).join('');
}

/**
 * Returns first object without keys of second
 * @param  {object} obj      - source object
 * @param  {object} unwanted - object with unwanted keys
 * @return {object}          - first object without unwanted keys
 */
function without(obj, unwanted) {
  return Object.keys(obj).reduce(function(acc, key) {
    if (!unwanted[key]) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}

},{"./build-exports":11,"./composition":12,"./css-extract-extends":14,"./css-key":15,"./extract-exports":16,"./scopeify":22}],14:[function(require,module,exports){
'use strict';

var makeComposition = require('./composition').makeComposition;

var regex = /\.([^\s]+)(\s+)(extends\s+)(\.[^{]+)/g;

module.exports = function extractExtends(css) {
  var found, matches = [];
  while (found = regex.exec(css)) {
    matches.unshift(found);
  }

  function extractCompositions(acc, match) {
    var extendee = getClassName(match[1]);
    var keyword = match[3];
    var extended = match[4];

    // remove from output css
    var index = match.index + match[1].length + match[2].length;
    var len = keyword.length + extended.length;
    acc.css = acc.css.slice(0, index) + " " + acc.css.slice(index + len + 1);

    var extendedClasses = splitter(extended);

    extendedClasses.forEach(function(className) {
      if (!acc.compositions[extendee]) {
        acc.compositions[extendee] = {};
      }
      if (!acc.compositions[className]) {
        acc.compositions[className] = {};
      }
      acc.compositions[extendee][className] = acc.compositions[className];
    });
    return acc;
  }

  return matches.reduce(extractCompositions, {
    css: css,
    compositions: {}
  });

};

function splitter(match) {
  return match.split(',').map(getClassName);
}

function getClassName(str) {
  var trimmed = str.trim();
  return trimmed[0] === '.' ? trimmed.substr(1) : trimmed;
}

},{"./composition":12}],15:[function(require,module,exports){
'use strict';

/**
 * CSS identifiers with whitespace are invalid
 * Hence this key will not cause a collision
 */

module.exports = ' css ';

},{}],16:[function(require,module,exports){
'use strict';

var regex = require('./regex');
var classRegex = regex.classRegex;
var keyframesRegex = regex.keyframesRegex;

module.exports = extractExports;

function extractExports(css) {
  return {
    css: css,
    keyframes: getExport(css, keyframesRegex),
    classes: getExport(css, classRegex)
  };
}

function getExport(css, regex) {
  var prop = {};
  var match;
  while((match = regex.exec(css)) !== null) {
    var name = match[2];
    prop[name] = name;
  }
  return prop;
}

},{"./regex":19}],17:[function(require,module,exports){
'use strict';

var cssKey = require('./css-key');

module.exports = function getCss(csjs) {
  return csjs[cssKey];
};

},{"./css-key":15}],18:[function(require,module,exports){
'use strict';

/**
 * djb2 string hash implementation based on string-hash module:
 * https://github.com/darkskyapp/string-hash
 */

module.exports = function hashStr(str) {
  var hash = 5381;
  var i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i)
  }
  return hash >>> 0;
};

},{}],19:[function(require,module,exports){
'use strict';

var findClasses = /(\.)(?!\d)([^\s\.,{\[>+~#:)]*)(?![^{]*})/.source;
var findKeyframes = /(@\S*keyframes\s*)([^{\s]*)/.source;
var ignoreComments = /(?!(?:[^*/]|\*[^/]|\/[^*])*\*+\/)/.source;

var classRegex = new RegExp(findClasses + ignoreComments, 'g');
var keyframesRegex = new RegExp(findKeyframes + ignoreComments, 'g');

module.exports = {
  classRegex: classRegex,
  keyframesRegex: keyframesRegex,
  ignoreComments: ignoreComments,
};

},{}],20:[function(require,module,exports){
var ignoreComments = require('./regex').ignoreComments;

module.exports = replaceAnimations;

function replaceAnimations(result) {
  var animations = Object.keys(result.keyframes).reduce(function(acc, key) {
    acc[result.keyframes[key]] = key;
    return acc;
  }, {});
  var unscoped = Object.keys(animations);

  if (unscoped.length) {
    var regexStr = '((?:animation|animation-name)\\s*:[^};]*)('
      + unscoped.join('|') + ')([;\\s])' + ignoreComments;
    var regex = new RegExp(regexStr, 'g');

    var replaced = result.css.replace(regex, function(match, preamble, name, ending) {
      return preamble + animations[name] + ending;
    });

    return {
      css: replaced,
      keyframes: result.keyframes,
      classes: result.classes
    }
  }

  return result;
}

},{"./regex":19}],21:[function(require,module,exports){
'use strict';

var encode = require('./base62-encode');
var hash = require('./hash-string');

module.exports = function fileScoper(fileSrc) {
  var suffix = encode(hash(fileSrc));

  return function scopedName(name) {
    return name + '_' + suffix;
  }
};

},{"./base62-encode":10,"./hash-string":18}],22:[function(require,module,exports){
'use strict';

var fileScoper = require('./scoped-name');
var replaceAnimations = require('./replace-animations');
var regex = require('./regex');
var classRegex = regex.classRegex;
var keyframesRegex = regex.keyframesRegex;

module.exports = scopify;

function scopify(css, ignores) {
  var makeScopedName = fileScoper(css);
  var replacers = {
    classes: classRegex,
    keyframes: keyframesRegex
  };

  function scopeCss(result, key) {
    var replacer = replacers[key];
    function replaceFn(fullMatch, prefix, name) {
      var scopedName = ignores[name] ? name : makeScopedName(name);
      result[key][scopedName] = name;
      return prefix + scopedName;
    }
    return {
      css: result.css.replace(replacer, replaceFn),
      keyframes: result.keyframes,
      classes: result.classes
    };
  }

  var result = Object.keys(replacers).reduce(scopeCss, {
    css: css,
    keyframes: {},
    classes: {}
  });

  return replaceAnimations(result);
}

},{"./regex":19,"./replace-animations":20,"./scoped-name":21}],23:[function(require,module,exports){
module.exports = svg

function svg(opts) {
    var { css = null, path }  = opts
    
    const el = document.createElement('div')
    
    async function load(done) {
        const res = await fetch(path)
        const parse = document.createElement('div')

        if (res.status == 200) {
            let graphic = await res.text()
            parse.innerHTML = graphic
            return done(null, parse.children[0])
        }
        throw new Error(res.status)
    }

    load((err, svg) => {
        if (err) console.error(err)
        if (css) el.className = css
        el.append(svg)
    })
    
    return el
}   
},{}],24:[function(require,module,exports){
module.exports = attributeToProperty

var transform = {
  'class': 'className',
  'for': 'htmlFor',
  'http-equiv': 'httpEquiv'
}

function attributeToProperty (h) {
  return function (tagName, attrs, children) {
    for (var attr in attrs) {
      if (attr in transform) {
        attrs[transform[attr]] = attrs[attr]
        delete attrs[attr]
      }
    }
    return h(tagName, attrs, children)
  }
}

},{}],25:[function(require,module,exports){
var attrToProp = require('hyperscript-attribute-to-property')

var VAR = 0, TEXT = 1, OPEN = 2, CLOSE = 3, ATTR = 4
var ATTR_KEY = 5, ATTR_KEY_W = 6
var ATTR_VALUE_W = 7, ATTR_VALUE = 8
var ATTR_VALUE_SQ = 9, ATTR_VALUE_DQ = 10
var ATTR_EQ = 11, ATTR_BREAK = 12
var COMMENT = 13

module.exports = function (h, opts) {
  if (!opts) opts = {}
  var concat = opts.concat || function (a, b) {
    return String(a) + String(b)
  }
  if (opts.attrToProp !== false) {
    h = attrToProp(h)
  }

  return function (strings) {
    var state = TEXT, reg = ''
    var arglen = arguments.length
    var parts = []

    for (var i = 0; i < strings.length; i++) {
      if (i < arglen - 1) {
        var arg = arguments[i+1]
        var p = parse(strings[i])
        var xstate = state
        if (xstate === ATTR_VALUE_DQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_SQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_W) xstate = ATTR_VALUE
        if (xstate === ATTR) xstate = ATTR_KEY
        if (xstate === OPEN) {
          if (reg === '/') {
            p.push([ OPEN, '/', arg ])
            reg = ''
          } else {
            p.push([ OPEN, arg ])
          }
        } else if (xstate === COMMENT && opts.comments) {
          reg += String(arg)
        } else if (xstate !== COMMENT) {
          p.push([ VAR, xstate, arg ])
        }
        parts.push.apply(parts, p)
      } else parts.push.apply(parts, parse(strings[i]))
    }

    var tree = [null,{},[]]
    var stack = [[tree,-1]]
    for (var i = 0; i < parts.length; i++) {
      var cur = stack[stack.length-1][0]
      var p = parts[i], s = p[0]
      if (s === OPEN && /^\//.test(p[1])) {
        var ix = stack[stack.length-1][1]
        if (stack.length > 1) {
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === OPEN) {
        var c = [p[1],{},[]]
        cur[2].push(c)
        stack.push([c,cur[2].length-1])
      } else if (s === ATTR_KEY || (s === VAR && p[1] === ATTR_KEY)) {
        var key = ''
        var copyKey
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_KEY) {
            key = concat(key, parts[i][1])
          } else if (parts[i][0] === VAR && parts[i][1] === ATTR_KEY) {
            if (typeof parts[i][2] === 'object' && !key) {
              for (copyKey in parts[i][2]) {
                if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
                  cur[1][copyKey] = parts[i][2][copyKey]
                }
              }
            } else {
              key = concat(key, parts[i][2])
            }
          } else break
        }
        if (parts[i][0] === ATTR_EQ) i++
        var j = i
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_VALUE || parts[i][0] === ATTR_KEY) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][1])
            else parts[i][1]==="" || (cur[1][key] = concat(cur[1][key], parts[i][1]));
          } else if (parts[i][0] === VAR
          && (parts[i][1] === ATTR_VALUE || parts[i][1] === ATTR_KEY)) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][2])
            else parts[i][2]==="" || (cur[1][key] = concat(cur[1][key], parts[i][2]));
          } else {
            if (key.length && !cur[1][key] && i === j
            && (parts[i][0] === CLOSE || parts[i][0] === ATTR_BREAK)) {
              // https://html.spec.whatwg.org/multipage/infrastructure.html#boolean-attributes
              // empty string is falsy, not well behaved value in browser
              cur[1][key] = key.toLowerCase()
            }
            if (parts[i][0] === CLOSE) {
              i--
            }
            break
          }
        }
      } else if (s === ATTR_KEY) {
        cur[1][p[1]] = true
      } else if (s === VAR && p[1] === ATTR_KEY) {
        cur[1][p[2]] = true
      } else if (s === CLOSE) {
        if (selfClosing(cur[0]) && stack.length) {
          var ix = stack[stack.length-1][1]
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === VAR && p[1] === TEXT) {
        if (p[2] === undefined || p[2] === null) p[2] = ''
        else if (!p[2]) p[2] = concat('', p[2])
        if (Array.isArray(p[2][0])) {
          cur[2].push.apply(cur[2], p[2])
        } else {
          cur[2].push(p[2])
        }
      } else if (s === TEXT) {
        cur[2].push(p[1])
      } else if (s === ATTR_EQ || s === ATTR_BREAK) {
        // no-op
      } else {
        throw new Error('unhandled: ' + s)
      }
    }

    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
      tree[2].shift()
    }

    if (tree[2].length > 2
    || (tree[2].length === 2 && /\S/.test(tree[2][1]))) {
      if (opts.createFragment) return opts.createFragment(tree[2])
      throw new Error(
        'multiple root elements must be wrapped in an enclosing tag'
      )
    }
    if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === 'string'
    && Array.isArray(tree[2][0][2])) {
      tree[2][0] = h(tree[2][0][0], tree[2][0][1], tree[2][0][2])
    }
    return tree[2][0]

    function parse (str) {
      var res = []
      if (state === ATTR_VALUE_W) state = ATTR
      for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i)
        if (state === TEXT && c === '<') {
          if (reg.length) res.push([TEXT, reg])
          reg = ''
          state = OPEN
        } else if (c === '>' && !quot(state) && state !== COMMENT) {
          if (state === OPEN && reg.length) {
            res.push([OPEN,reg])
          } else if (state === ATTR_KEY) {
            res.push([ATTR_KEY,reg])
          } else if (state === ATTR_VALUE && reg.length) {
            res.push([ATTR_VALUE,reg])
          }
          res.push([CLOSE])
          reg = ''
          state = TEXT
        } else if (state === COMMENT && /-$/.test(reg) && c === '-') {
          if (opts.comments) {
            res.push([ATTR_VALUE,reg.substr(0, reg.length - 1)])
          }
          reg = ''
          state = TEXT
        } else if (state === OPEN && /^!--$/.test(reg)) {
          if (opts.comments) {
            res.push([OPEN, reg],[ATTR_KEY,'comment'],[ATTR_EQ])
          }
          reg = c
          state = COMMENT
        } else if (state === TEXT || state === COMMENT) {
          reg += c
        } else if (state === OPEN && c === '/' && reg.length) {
          // no-op, self closing tag without a space <br/>
        } else if (state === OPEN && /\s/.test(c)) {
          if (reg.length) {
            res.push([OPEN, reg])
          }
          reg = ''
          state = ATTR
        } else if (state === OPEN) {
          reg += c
        } else if (state === ATTR && /[^\s"'=/]/.test(c)) {
          state = ATTR_KEY
          reg = c
        } else if (state === ATTR && /\s/.test(c)) {
          if (reg.length) res.push([ATTR_KEY,reg])
          res.push([ATTR_BREAK])
        } else if (state === ATTR_KEY && /\s/.test(c)) {
          res.push([ATTR_KEY,reg])
          reg = ''
          state = ATTR_KEY_W
        } else if (state === ATTR_KEY && c === '=') {
          res.push([ATTR_KEY,reg],[ATTR_EQ])
          reg = ''
          state = ATTR_VALUE_W
        } else if (state === ATTR_KEY) {
          reg += c
        } else if ((state === ATTR_KEY_W || state === ATTR) && c === '=') {
          res.push([ATTR_EQ])
          state = ATTR_VALUE_W
        } else if ((state === ATTR_KEY_W || state === ATTR) && !/\s/.test(c)) {
          res.push([ATTR_BREAK])
          if (/[\w-]/.test(c)) {
            reg += c
            state = ATTR_KEY
          } else state = ATTR
        } else if (state === ATTR_VALUE_W && c === '"') {
          state = ATTR_VALUE_DQ
        } else if (state === ATTR_VALUE_W && c === "'") {
          state = ATTR_VALUE_SQ
        } else if (state === ATTR_VALUE_DQ && c === '"') {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_SQ && c === "'") {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_W && !/\s/.test(c)) {
          state = ATTR_VALUE
          i--
        } else if (state === ATTR_VALUE && /\s/.test(c)) {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE || state === ATTR_VALUE_SQ
        || state === ATTR_VALUE_DQ) {
          reg += c
        }
      }
      if (state === TEXT && reg.length) {
        res.push([TEXT,reg])
        reg = ''
      } else if (state === ATTR_VALUE && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_DQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_SQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_KEY) {
        res.push([ATTR_KEY,reg])
        reg = ''
      }
      return res
    }
  }

  function strfn (x) {
    if (typeof x === 'function') return x
    else if (typeof x === 'string') return x
    else if (x && typeof x === 'object') return x
    else if (x === null || x === undefined) return x
    else return concat('', x)
  }
}

function quot (state) {
  return state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ
}

var closeRE = RegExp('^(' + [
  'area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed',
  'frame', 'hr', 'img', 'input', 'isindex', 'keygen', 'link', 'meta', 'param',
  'source', 'track', 'wbr', '!--',
  // SVG TAGS
  'animate', 'animateTransform', 'circle', 'cursor', 'desc', 'ellipse',
  'feBlend', 'feColorMatrix', 'feComposite',
  'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
  'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
  'feGaussianBlur', 'feImage', 'feMergeNode', 'feMorphology',
  'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile',
  'feTurbulence', 'font-face-format', 'font-face-name', 'font-face-uri',
  'glyph', 'glyphRef', 'hkern', 'image', 'line', 'missing-glyph', 'mpath',
  'path', 'polygon', 'polyline', 'rect', 'set', 'stop', 'tref', 'use', 'view',
  'vkern'
].join('|') + ')(?:[\.#][a-zA-Z0-9\u007F-\uFFFF_:-]+)*$')
function selfClosing (tag) { return closeRE.test(tag) }

},{"hyperscript-attribute-to-property":24}],26:[function(require,module,exports){
var inserted = {};

module.exports = function (css, options) {
    if (inserted[css]) return;
    inserted[css] = true;
    
    var elem = document.createElement('style');
    elem.setAttribute('type', 'text/css');

    if ('textContent' in elem) {
      elem.textContent = css;
    } else {
      elem.styleSheet.cssText = css;
    }
    
    var head = document.getElementsByTagName('head')[0];
    if (options && options.prepend) {
        head.insertBefore(elem, head.childNodes[0]);
    } else {
        head.appendChild(elem);
    }
};

},{}],27:[function(require,module,exports){
(function (process){(function (){
// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this)}).call(this,require('_process'))
},{"_process":28}],28:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],29:[function(require,module,exports){
const bel = require('bel')
const csjs = require('csjs-inject')

module.exports = domlog

let count = 1

function domlog (message) {
    const { page = 'demo', from, flow, type, body, action, filename, line } = message
    const log = bel`
    <div class=${css.log} role="log">
        <div class=${css.badge}>${count}</div>
        <div class="${css.output} ${type === 'error' ? css.error : '' }">
            <span class=${css.page}>${page}</span>
            <span class=${css.flow}>${flow}</span>
            <span class=${css.from}>${from}</span>
            <span class=${css.type}>${type}</span>
            <span class=${css.info}>${typeof body === 'string' ? body : JSON.stringify(body, ["swarm", "feeds", "links"], 3)}</span>
        </div>
        <div class=${css['code-line']}>${filename}:${line}</div>
    </div>`
    count++
    return log
    
}
const css = csjs`
.log {
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    padding: 2px 12px 0 0;
    border-bottom: 1px solid #333;
}
.log:last-child, .log:last-child .page, .log:last-child .flow, .log:last-child .type {
    color: #FFF500;
    font-weight: bold;
}
.output {}
.badge {
    background-color: #333;
    padding: 6px;
    margin-right: 10px;
    font-size: 14px;
    display: inline-block;
}
.code-line {}
.error {
    
}
.error .type {
    padding: 2px 6px;
    color: white;
    background-color: #AC0000;
    border-radius: 2px;
}
.error .info {
    color: #FF2626;
}
.page {
    display: inline-block;
    color: rgba(255,255,255,.75);
    background-color: #2A2E30;
    padding: 4px 6px;
    border-radius: 4px;
}
.flow {
    color: #1DA5FF;
}
.from {
    color: #fff;
}
.type {
    color: #FFB14A;
}
.info {}
`
},{"bel":3,"csjs-inject":6}],30:[function(require,module,exports){
(function (__filename){(function (){
const bel = require('bel')
const csjs = require('csjs-inject')
const path = require('path')
const filename = path.basename(__filename)
// themes
const mainTheme = require('themes/main-theme')
const whiteTheme = require('themes/dark-theme')

module.exports = button

function button (option, protocol) {
    const widget = 'ui-button'
    const {page, flow, name, content = 'Button', custom, widgetTheme, theme, themeName = 'default', isActive, isDisabled} = option

    const ui_element = (css) => {
        let state = 'inactive'
        const send2Parent = protocol( receive )
        send2Parent({page, from: name, flow: flow ? `${flow}/${widget}` : widget, type: 'init', filename, line: 11})
        // for tab to check isActive is true then set button state to active
        if (isActive) setState('active')
        const button = bel`<button role="button" class="${css.button}${custom ? ` ${custom}` : ''}${isActive ? ` ${css.active}` : ''}${isDisabled ? ` ${css.disabled}` : ''}${widgetTheme ? ` ${css[widgetTheme]}` : ''}" data-name="${name}">${content}</button>`
        
        setTheme(themeName, button)

        button.onclick = (e) => click(button)
        return button

        /*************************
        * ------ Actions -------
        *************************/
        function click(target) {
            if (isDisabled) return
            send2Parent({page, from: name, flow: flow ? `${flow}/${widget}` : widget, type: 'click', state, filename, line: 24})
        }
        function setState(update) {
            return state = update
        }
        /*************************
        * ------ Receivers -------
        *************************/
        function receive(message) {
            const { from, type, state } = message
            console.log('message received from main component:', message)
            if (state === 'inactive') button.classList.remove(css.active)
            if (state === 'active') button.classList.add(css.active)
            return setState(state)
        }
    }

    // if theme is entering as a property then set apply CSS styles
    if (theme) 
        var {
            width, minWidth, maxWidth, 
            height, minHeight, maxHeight, 
            fontFamily, fontSize, fontWeight, 
            textAlign, textTransform,
            borderWidth,  borderColor, borderStyle,
            padding, borderRadius, 
            color, bgColor, colorHover, bgColorHover, colorActive, bgColorActive,
            colorDisabled, bgColorDisabled,
            bgImage, bgImageHover, bgImageActive,
            boxShadow, position, zIndex, top, bottom, left, right, cursor,
            iconSize, iconFillColor, iconStrokeColor
        } = theme


    function setTheme(themeName, target) {
        if (themeName === 'default') return mainTheme(document.documentElement)
        if (themeName === 'dark') return whiteTheme(target)
    }

    const style = csjs`
    .button {
        position: ${position ? position : 'var(--button-position)'};
        z-index: ${zIndex ? zIndex : 'var(--button-z-index)'};
        top: ${top ? top : 'var(--button-position-top)'};
        bottom: ${bottom ? bottom : 'var(--button-position-bottom)'};
        left: ${left ? left : 'var(--button-position-left)' };
        right: ${right ? right : 'var(--button-position-right)'};
        width: ${width ? width : 'var(--button-width)'};
        min-width: ${minWidth ? minWidth : 'var(--button-min-width)'};
        max-width: ${maxWidth ? maxWidth : 'var(--button-max-width)'};
        height: ${height ? height : 'var(--button-height)'};
        min-height: ${minHeight ? minHeight : 'var(--button-min-height)'};
        max-height: ${maxHeight ? maxHeight : 'var(--button-max-height)'};
        font-family: ${fontFamily ? fontFamily : 'var(--button-font-family)'};
        font-size: ${fontSize ? fontSize : 'var(--button-font-size)'};
        font-weight: ${fontWeight ? fontWeight : 'var(--button-font-weight)'};
        color: ${color ? color : 'var(--button-color)'};
        background-color: ${bgColor ? bgColor : 'var(--button-bg-color)'};
        background-image: ${bgImage ? bgImage : 'var(--button-bg-image)'};
        border-width: ${borderWidth ? borderWidth : 'var(--button-border-width)'};
        border-color: ${borderColor ? borderColor : 'var(--button-border-color)'};
        border-style: ${borderStyle ? borderStyle : 'var(--button-border-style)'};
        border-radius: ${borderRadius ? borderRadius : 'var(--button-border-radius)'};
        box-shadow: ${boxShadow ? boxShadow : 'var(--button-box-shadow)'};
        padding: ${padding ? padding : 'var(--button-padding)'};
        text-align:  ${textAlign ? textAlign : 'var(--button-text-align)'};
        text-transform: ${textTransform ? textTransform: 'var(--button-text-transform)'};
        white-space: pre-wrap;
        overflow-wrap: break-word;
        transition: color .3s, background-color .3s ease-in-out;
        cursor: ${cursor ? cursor: 'var(--button-cursor)'};
    }
    .button:hover {
        color: ${colorHover ? colorHover : 'var(--button-color-hover)'};
        background-color: ${bgColorHover ? bgColorHover : 'var(--button-bg-color-hover)'};
        background-image: ${bgImageHover ? bgImageHover : 'var(--button-bg-image-hover)'};
    }
    .button > div {
        width: ${iconSize ? iconSize : 'var(--button-icon-size)'};
    }
    .button > div svg {
        width: 100%;
        height: auto;
    }
    .active, .active:hover {
        color: ${colorActive ? colorActive : 'var(--button-color-active)'};
        background-color: ${bgColorActive ? bgColorActive : 'var(--button-bg-color-active)'};
        background-image: ${bgImageActive ? bgImageActive : 'var(--button-bg-image-active)'};
    }
    .disabled {
        color: ${colorDisabled ? colorDisabled : 'var(--button-color-disabled)'};
        background-color: ${bgColorDisabled ? bgColorDisabled : 'var(--button-bg-color-disabled)'};
        pointer-events: none;
    }
    .cancel {
        color: ${color ? color : 'var(--cancel-color)'};
        background-color: ${bgColor ? bgColor : 'var(--cancel-bg-color)'};
    }
    .cancel:hover {
        color: ${colorHover ? colorHover : 'var(--cancel-color-hover)'};
        background-color: ${bgColorHover ? bgColorHover : 'var(--cancel-bg-color-hover)'};
    }
    .cancel > div svg path {
        fill: none;
        stroke: ${iconStrokeColor ? iconStrokeColor : 'var(--cancel-icon-stroke-color)'};
    }
    .confirm > div svg path {
        fill: none;
        stroke: ${iconStrokeColor ? iconStrokeColor : 'var(--confirm-icon-stroke-color)'};
    }
    .toggle {
        color: ${color ? color : 'var(--toggle-color)'};
        background-color: ${bgColor ? bgColor : 'var(--toggle-bg-color)'};
    }
    .toggle.active, .toggle.active:hover {
        color: ${colorActive ? colorActive : 'var(--button-color-active)'};
        background-color: ${bgColorActive ? bgColorActive : 'var(--button-bg-color-active)'};
    }
    .toggle.active.disabled {
        color: ${colorDisabled ? colorDisabled : 'var(--toggle-color-active-disabled)'};
        background-color: ${bgColorDisabled ? bgColorDisabled : 'var(--toggle-bg-color-active-disabled)'};
    }
    .tab {
        color: ${color ? color : 'var(--tab-color)'};
        background-color: ${bgColor ? bgColor : 'var(--tab-bg-color)'};
    }
    .tab.active {
        color: ${color ? color : 'var(--button-color-active)'};
        background-color: ${bgColor ? bgColor : 'var(--button-bg-color-active)'};
        cursor: default;
    }
    .tab.disabled {
        color: ${colorDisabled ? colorDisabled : 'var(--button-color-disabled)'};
        background-color: ${bgColorDisabled ? bgColorDisabled : 'var(--button-bg-color-disabled)'};
        pointer-events: none;
    }
    `
    return ui_element(style)
}
}).call(this)}).call(this,"/src/index.js")
},{"bel":3,"csjs-inject":6,"path":27,"themes/dark-theme":31,"themes/main-theme":32}],31:[function(require,module,exports){
const themes = (el) => {
    // color define
    el.style.setProperty('--button-black', 'hsl(0, 0%, 0%)')
    el.style.setProperty('--button-white', 'hsl(0, 0%, 100%)')
    el.style.setProperty('--button-grey', 'hsl(0, 0%, 80%)')
    // primary
    el.style.setProperty('--button-color', 'var(--button-black)')
    el.style.setProperty('--button-bg-color', 'var(--button-white)')
    // hover
    el.style.setProperty('--button-color-hover', 'var(--button-black)')
    el.style.setProperty('--button-bg-color-hover', 'var(--button-grey)')
    // active
    el.style.setProperty('--button-color-active', 'var(--button-black)')
    el.style.setProperty('--button-bg-color-active', 'var(--button-white)')
    // disabled
    el.style.setProperty('--button-color-disabled', 'hsla(0, 0%, 100%, .5)')
    el.style.setProperty('--button-bg-color-disabled', 'hsl(0, 0%, 50%)')
    // image
    el.style.setProperty('--button-bg-image', 'unset')
    el.style.setProperty('--button-bg-image-hover', 'unset')
    el.style.setProperty('--button-bg-image-active', 'unset')
    // position
    el.style.setProperty('--button-position', 'inherit')
    el.style.setProperty('--button-z-index', 'inherit')
    el.style.setProperty('--button-position-top', 'unset')
    el.style.setProperty('--button-position-bottom', 'unset')
    el.style.setProperty('--button-position-left', 'unset')
    el.style.setProperty('--button-position-right', 'unset')
    // width
    el.style.setProperty('--button-width', 'auto')
    el.style.setProperty('--button-min-width', 'auto')
    el.style.setProperty('--button-max-width', 'inherfit')
    // height
    el.style.setProperty('--button-height', 'auto')
    el.style.setProperty('--button-min-height', 'auto')
    el.style.setProperty('--button-max-height', 'inherfit')
    // font
    el.style.setProperty('--button-font-family', 'initial')
    el.style.setProperty('--button-font-size', '1.4rem')
    el.style.setProperty('--button-font-weight', '300')
    el.style.setProperty('--button-text-align', 'center')
    el.style.setProperty('--button-text-transform', 'unset')
    // border
    el.style.setProperty('--button-border-width', '0')
    el.style.setProperty('--button-border-color', 'unset')
    el.style.setProperty('--button-border-style', 'unset')
    el.style.setProperty('--button-border-radius', '0')
    el.style.setProperty('--button-box-shadow', 'none')
    // spacing
    el.style.setProperty('--button-padding', '8px 12px')
    // mouse
    el.style.setProperty('--button-cursor', 'pointer')
    // icon
    el.style.setProperty('--button-icon-size', '1.6rem')
    el.style.setProperty('--button-icon-fill-color', 'var(--button-white)')
    el.style.setProperty('--button-icon-stroke-color', 'var(--button-white)')
    // widget theme
    // cancel
    el.style.setProperty('--cancel-color', 'var(--button-black)')
    el.style.setProperty('--cancel-color-hover', 'var(--button-white)')
    el.style.setProperty('--cancel-bg-color', 'hsl(0, 0%, 85%)')
    el.style.setProperty('--cancel-bg-color-hover', 'hsl(0, 0%, 90%)')
    el.style.setProperty('--cancel-icon-stroke-color', 'var(--button-black)')
    // confirm
    el.style.setProperty('--confirm-icon-stroke-color', 'var(--button-black)')
    // toggle
    el.style.setProperty('--toggle-color', 'var(--button-black)')
    el.style.setProperty('--toggle-bg-color', 'var(--button-white)')
    // tab
    el.style.setProperty('--tab-color', 'var(--button-black)')
    el.style.setProperty('--tab-bg-color', 'var(--button-grey)')
    el.style.setProperty('--tab-color-disabled', 'hsla(0, 0%, 100%, .5)')
    el.style.setProperty('--tab-bg-color-disabled', 'hsl(0, 0%, 50%)')
}

module.exports = themes
},{}],32:[function(require,module,exports){
const themes = (el) => {
    // color define
    el.style.setProperty('--button-black', '#000')
    el.style.setProperty('--button-white', 'hsl(0, 0%, 100%)')
    el.style.setProperty('--button-grey', 'hsl(0, 0%, 30%)')
    // primary
    el.style.setProperty('--button-color', 'var(--button-white)')
    el.style.setProperty('--button-bg-color', 'var(--button-black)')
    // hover
    el.style.setProperty('--button-color-hover', 'var(--button-white)')
    el.style.setProperty('--button-bg-color-hover', 'var(--button-grey)')
    // active
    el.style.setProperty('--button-color-active', 'var(--button-white)')
    el.style.setProperty('--button-bg-color-active', 'var(--button-black)')
    // disabled
    el.style.setProperty('--button-color-disabled', 'hsl(0, 0%, 90%)')
    el.style.setProperty('--button-bg-color-disabled', 'hsl(0, 0%, 75%)')
    // image
    el.style.setProperty('--button-bg-image', 'unset')
    el.style.setProperty('--button-bg-image-hover', 'unset')
    el.style.setProperty('--button-bg-image-active', 'unset')
    // position
    el.style.setProperty('--button-position', 'inherit')
    el.style.setProperty('--button-z-index', 'inherit')
    el.style.setProperty('--button-position-top', 'unset')
    el.style.setProperty('--button-position-bottom', 'unset')
    el.style.setProperty('--button-position-left', 'unset')
    el.style.setProperty('--button-position-right', 'unset')
    // width
    el.style.setProperty('--button-width', 'auto')
    el.style.setProperty('--button-min-width', 'auto')
    el.style.setProperty('--button-max-width', 'inherfit')
    // height
    el.style.setProperty('--button-height', 'auto')
    el.style.setProperty('--button-min-height', 'auto')
    el.style.setProperty('--button-max-height', 'inherfit')
    // font
    el.style.setProperty('--button-font-family', 'initial')
    el.style.setProperty('--button-font-size', '1.4rem')
    el.style.setProperty('--button-font-weight', '300')
    el.style.setProperty('--button-text-align', 'center')
    el.style.setProperty('--button-text-transform', 'unset')
    // border
    el.style.setProperty('--button-border-width', '0')
    el.style.setProperty('--button-border-color', 'unset')
    el.style.setProperty('--button-border-style', 'unset')
    el.style.setProperty('--button-border-radius', '0')
    el.style.setProperty('--button-box-shadow', 'none')
    // spacing
    el.style.setProperty('--button-padding', '8px 12px')
    // mouse
    el.style.setProperty('--button-cursor', 'pointer')
    // icon
    el.style.setProperty('--button-icon-size', '1.6rem')
    el.style.setProperty('--button-icon-fill-color', 'var(--button-white)')
    el.style.setProperty('--button-icon-stroke-color', 'var(--button-white)')
    // widget theme
    // cancel
    el.style.setProperty('--cancel-color', 'var(--button-black)')
    el.style.setProperty('--cancel-color-hover', 'var(--button-white)')
    el.style.setProperty('--cancel-bg-color', 'hsl(0, 0%, 85%)')
    el.style.setProperty('--cancel-bg-color-hover', 'hsl(0, 0%, 70%)')
    el.style.setProperty('--cancel-icon-stroke-color', 'var(--button-black)')
    // confirm
    el.style.setProperty('--confirm-icon-stroke-color', 'var(--button-white)')
    // toggle
    el.style.setProperty('--toggle-color', 'var(--button-black)')
    el.style.setProperty('--toggle-bg-color', 'var(--button-white)')
    el.style.setProperty('--toggle-color-active-disabled', 'var(--button-color-disabled)')
    el.style.setProperty('--toggle-bg-color-active-disabled', 'var(--button-bg-color-disabled)')
    // tab
    el.style.setProperty('--tab-color', 'var(--button-black)')
    el.style.setProperty('--tab-bg-color', 'var(--button-white)')
    el.style.setProperty('--tab-color-disabled', 'hsla(0, 0%, 100%, .5)')
    el.style.setProperty('--tab-bg-color-disabled', 'hsl(0, 0%, 50%)')
}

module.exports = themes
},{}]},{},[1]);
