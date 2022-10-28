// Generated by Peggy 2.0.1.
//
// https://peggyjs.org/

"use strict";

function peg$subclass(child, parent) {
  function C() { this.constructor = child; }
  C.prototype = parent.prototype;
  child.prototype = new C();
}

function peg$SyntaxError(message, expected, found, location) {
  var self = Error.call(this, message);
  // istanbul ignore next Check is a necessary evil to support older environments
  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(self, peg$SyntaxError.prototype);
  }
  self.expected = expected;
  self.found = found;
  self.location = location;
  self.name = "SyntaxError";
  return self;
}

peg$subclass(peg$SyntaxError, Error);

function peg$padEnd(str, targetLength, padString) {
  padString = padString || " ";
  if (str.length > targetLength) { return str; }
  targetLength -= str.length;
  padString += padString.repeat(targetLength);
  return str + padString.slice(0, targetLength);
}

peg$SyntaxError.prototype.format = function(sources) {
  var str = "Error: " + this.message;
  if (this.location) {
    var src = null;
    var k;
    for (k = 0; k < sources.length; k++) {
      if (sources[k].source === this.location.source) {
        src = sources[k].text.split(/\r\n|\n|\r/g);
        break;
      }
    }
    var s = this.location.start;
    var loc = this.location.source + ":" + s.line + ":" + s.column;
    if (src) {
      var e = this.location.end;
      var filler = peg$padEnd("", s.line.toString().length, ' ');
      var line = src[s.line - 1];
      var last = s.line === e.line ? e.column : line.length + 1;
      var hatLen = (last - s.column) || 1;
      str += "\n --> " + loc + "\n"
          + filler + " |\n"
          + s.line + " | " + line + "\n"
          + filler + " | " + peg$padEnd("", s.column - 1, ' ')
          + peg$padEnd("", hatLen, "^");
    } else {
      str += "\n at " + loc;
    }
  }
  return str;
};

peg$SyntaxError.buildMessage = function(expected, found) {
  var DESCRIBE_EXPECTATION_FNS = {
    literal: function(expectation) {
      return "\"" + literalEscape(expectation.text) + "\"";
    },

    class: function(expectation) {
      var escapedParts = expectation.parts.map(function(part) {
        return Array.isArray(part)
          ? classEscape(part[0]) + "-" + classEscape(part[1])
          : classEscape(part);
      });

      return "[" + (expectation.inverted ? "^" : "") + escapedParts.join("") + "]";
    },

    any: function() {
      return "any character";
    },

    end: function() {
      return "end of input";
    },

    other: function(expectation) {
      return expectation.description;
    }
  };

  function hex(ch) {
    return ch.charCodeAt(0).toString(16).toUpperCase();
  }

  function literalEscape(s) {
    return s
      .replace(/\\/g, "\\\\")
      .replace(/"/g,  "\\\"")
      .replace(/\0/g, "\\0")
      .replace(/\t/g, "\\t")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/[\x00-\x0F]/g,          function(ch) { return "\\x0" + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return "\\x"  + hex(ch); });
  }

  function classEscape(s) {
    return s
      .replace(/\\/g, "\\\\")
      .replace(/\]/g, "\\]")
      .replace(/\^/g, "\\^")
      .replace(/-/g,  "\\-")
      .replace(/\0/g, "\\0")
      .replace(/\t/g, "\\t")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/[\x00-\x0F]/g,          function(ch) { return "\\x0" + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return "\\x"  + hex(ch); });
  }

  function describeExpectation(expectation) {
    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
  }

  function describeExpected(expected) {
    var descriptions = expected.map(describeExpectation);
    var i, j;

    descriptions.sort();

    if (descriptions.length > 0) {
      for (i = 1, j = 1; i < descriptions.length; i++) {
        if (descriptions[i - 1] !== descriptions[i]) {
          descriptions[j] = descriptions[i];
          j++;
        }
      }
      descriptions.length = j;
    }

    switch (descriptions.length) {
      case 1:
        return descriptions[0];

      case 2:
        return descriptions[0] + " or " + descriptions[1];

      default:
        return descriptions.slice(0, -1).join(", ")
          + ", or "
          + descriptions[descriptions.length - 1];
    }
  }

  function describeFound(found) {
    return found ? "\"" + literalEscape(found) + "\"" : "end of input";
  }

  return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
};

function peg$parse(input, options) {
  options = options !== undefined ? options : {};

  var peg$FAILED = {};
  var peg$source = options.grammarSource;

  var peg$startRuleFunctions = { Expression: peg$parseExpression };
  var peg$startRuleFunction = peg$parseExpression;

  var peg$c0 = "=>";
  var peg$c1 = "+";
  var peg$c2 = "-";
  var peg$c3 = "*";
  var peg$c4 = "/";
  var peg$c5 = "(";
  var peg$c6 = ",";
  var peg$c7 = ")";
  var peg$c8 = ".";
  var peg$c9 = "'";

  var peg$r0 = /^[0-9]/;
  var peg$r1 = /^[_a-zA-Z]/;
  var peg$r2 = /^[_a-zA-Z0-9]/;
  var peg$r3 = /^[ \t]/;

  var peg$e0 = peg$literalExpectation("=>", false);
  var peg$e1 = peg$literalExpectation("+", false);
  var peg$e2 = peg$literalExpectation("-", false);
  var peg$e3 = peg$literalExpectation("*", false);
  var peg$e4 = peg$literalExpectation("/", false);
  var peg$e5 = peg$literalExpectation("(", false);
  var peg$e6 = peg$literalExpectation(",", false);
  var peg$e7 = peg$literalExpectation(")", false);
  var peg$e8 = peg$otherExpectation("number");
  var peg$e9 = peg$classExpectation([["0", "9"]], false, false);
  var peg$e10 = peg$literalExpectation(".", false);
  var peg$e11 = peg$otherExpectation("ast");
  var peg$e12 = peg$literalExpectation("'", false);
  var peg$e13 = peg$otherExpectation("identifier");
  var peg$e14 = peg$classExpectation(["_", ["a", "z"], ["A", "Z"]], false, false);
  var peg$e15 = peg$classExpectation(["_", ["a", "z"], ["A", "Z"], ["0", "9"]], false, false);
  var peg$e16 = peg$otherExpectation("whitespace");
  var peg$e17 = peg$classExpectation([" ", "\t"], false, false);

  var peg$f0 = function(parameterPattern, bodyExpression) {
      return {
        type: "FunctionExpression",
        parameterPattern,
        bodyExpression,
      }
    };
  var peg$f1 = function(head, tail) {
      return tail.reduce((leftExpression, [, operator, , rightExpression]) => ({
        type: 'OperatorExpression',
        operator,
        leftExpression,
        rightExpression,
        location: location(),
       }), head);
    };
  var peg$f2 = function(head, tail) {
      return tail.reduce((leftExpression, [, operator, , rightExpression]) => ({
        type: 'OperatorExpression',
        operator,
        leftExpression,
        rightExpression,
        location: location(),
       }), head);
    };
  var peg$f3 = function(expression, _arguments) {
      return _arguments.reduce((expression, [, argumentExpression]) => ({
        type: 'ApplyExpression',
        expression,
        argumentExpression,
      }), expression);
    };
  var peg$f4 = function(head, tail) {
      return head && tail.length === 0 ? head : {
        type: 'TupleExpression',
        elements: !head ? [] : tail.reduce((elements, [, , , expression]) =>
          [...elements, expression], [head]),
      }
    };
  var peg$f5 = function(value) {
    return ({
      type: 'NumericLiteral',
      value: Number(`${value[0].join('')}.${value[1] ? value[1][2].join('') : ''}`),
      location: location(),
    });
  };
  var peg$f6 = function(expression) {
      return {
        type: 'AstLiteral',
        value: expression,
      };
    };
  var peg$f7 = function(name) {
      return ({
        type: 'Identifier',
        name: name[0] + name[1].join('')
      });
    };
  var peg$f8 = function(head, tail) {
    return head && tail.length === 0 ? head : {
      type: 'TuplePattern',
      patterns: !head ? [] : tail.reduce((patterns, [, , , pattern]) =>
        [...patterns, pattern], [head]),
    }
  };
  var peg$f9 = function(identifier) {
    return {
      type: 'IdentifierPattern',
      name: identifier.name,
    };
  };
  var peg$currPos = 0;
  var peg$savedPos = 0;
  var peg$posDetailsCache = [{ line: 1, column: 1 }];
  var peg$maxFailPos = 0;
  var peg$maxFailExpected = [];
  var peg$silentFails = 0;

  var peg$result;

  if ("startRule" in options) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
    }

    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
  }

  function text() {
    return input.substring(peg$savedPos, peg$currPos);
  }

  function offset() {
    return peg$savedPos;
  }

  function range() {
    return {
      source: peg$source,
      start: peg$savedPos,
      end: peg$currPos
    };
  }

  function location() {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }

  function expected(description, location) {
    location = location !== undefined
      ? location
      : peg$computeLocation(peg$savedPos, peg$currPos);

    throw peg$buildStructuredError(
      [peg$otherExpectation(description)],
      input.substring(peg$savedPos, peg$currPos),
      location
    );
  }

  function error(message, location) {
    location = location !== undefined
      ? location
      : peg$computeLocation(peg$savedPos, peg$currPos);

    throw peg$buildSimpleError(message, location);
  }

  function peg$literalExpectation(text, ignoreCase) {
    return { type: "literal", text: text, ignoreCase: ignoreCase };
  }

  function peg$classExpectation(parts, inverted, ignoreCase) {
    return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
  }

  function peg$anyExpectation() {
    return { type: "any" };
  }

  function peg$endExpectation() {
    return { type: "end" };
  }

  function peg$otherExpectation(description) {
    return { type: "other", description: description };
  }

  function peg$computePosDetails(pos) {
    var details = peg$posDetailsCache[pos];
    var p;

    if (details) {
      return details;
    } else {
      p = pos - 1;
      while (!peg$posDetailsCache[p]) {
        p--;
      }

      details = peg$posDetailsCache[p];
      details = {
        line: details.line,
        column: details.column
      };

      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }

        p++;
      }

      peg$posDetailsCache[pos] = details;

      return details;
    }
  }

  function peg$computeLocation(startPos, endPos) {
    var startPosDetails = peg$computePosDetails(startPos);
    var endPosDetails = peg$computePosDetails(endPos);

    return {
      source: peg$source,
      start: {
        offset: startPos,
        line: startPosDetails.line,
        column: startPosDetails.column
      },
      end: {
        offset: endPos,
        line: endPosDetails.line,
        column: endPosDetails.column
      }
    };
  }

  function peg$fail(expected) {
    if (peg$currPos < peg$maxFailPos) { return; }

    if (peg$currPos > peg$maxFailPos) {
      peg$maxFailPos = peg$currPos;
      peg$maxFailExpected = [];
    }

    peg$maxFailExpected.push(expected);
  }

  function peg$buildSimpleError(message, location) {
    return new peg$SyntaxError(message, null, null, location);
  }

  function peg$buildStructuredError(expected, found, location) {
    return new peg$SyntaxError(
      peg$SyntaxError.buildMessage(expected, found),
      expected,
      found,
      location
    );
  }

  function peg$parseExpression() {
    var s0;

    s0 = peg$parseFunctionExpression();

    return s0;
  }

  function peg$parseFunctionExpression() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$parsePrimaryPattern();
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (input.substr(peg$currPos, 2) === peg$c0) {
        s3 = peg$c0;
        peg$currPos += 2;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e0); }
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        s5 = peg$parseFunctionExpression();
        if (s5 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f0(s1, s5);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseAddExpression();
    }

    return s0;
  }

  function peg$parseAddExpression() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$parseMultiplyExpression();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      s4 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 43) {
        s5 = peg$c1;
        peg$currPos++;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e1); }
      }
      if (s5 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 45) {
          s5 = peg$c2;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e2); }
        }
      }
      if (s5 !== peg$FAILED) {
        s6 = peg$parse_();
        s7 = peg$parseMultiplyExpression();
        if (s7 !== peg$FAILED) {
          s4 = [s4, s5, s6, s7];
          s3 = s4;
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (input.charCodeAt(peg$currPos) === 43) {
          s5 = peg$c1;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e1); }
        }
        if (s5 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 45) {
            s5 = peg$c2;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e2); }
          }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          s7 = peg$parseMultiplyExpression();
          if (s7 !== peg$FAILED) {
            s4 = [s4, s5, s6, s7];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      peg$savedPos = s0;
      s0 = peg$f1(s1, s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseMultiplyExpression() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$parseApplyExpression();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      s4 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 42) {
        s5 = peg$c3;
        peg$currPos++;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e3); }
      }
      if (s5 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 47) {
          s5 = peg$c4;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e4); }
        }
      }
      if (s5 !== peg$FAILED) {
        s6 = peg$parse_();
        s7 = peg$parseApplyExpression();
        if (s7 !== peg$FAILED) {
          s4 = [s4, s5, s6, s7];
          s3 = s4;
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (input.charCodeAt(peg$currPos) === 42) {
          s5 = peg$c3;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e3); }
        }
        if (s5 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 47) {
            s5 = peg$c4;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e4); }
          }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          s7 = peg$parseApplyExpression();
          if (s7 !== peg$FAILED) {
            s4 = [s4, s5, s6, s7];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      peg$savedPos = s0;
      s0 = peg$f2(s1, s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseApplyExpression() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$parsePrimaryExpression();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      s4 = peg$parse_();
      s5 = peg$parsePrimaryExpression();
      if (s5 !== peg$FAILED) {
        s4 = [s4, s5];
        s3 = s4;
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        s4 = peg$parse_();
        s5 = peg$parsePrimaryExpression();
        if (s5 !== peg$FAILED) {
          s4 = [s4, s5];
          s3 = s4;
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      peg$savedPos = s0;
      s0 = peg$f3(s1, s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsePrimaryExpression() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 40) {
      s1 = peg$c5;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e5); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      s3 = peg$parseFunctionExpression();
      if (s3 === peg$FAILED) {
        s3 = null;
      }
      s4 = [];
      s5 = peg$currPos;
      s6 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 44) {
        s7 = peg$c6;
        peg$currPos++;
      } else {
        s7 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e6); }
      }
      if (s7 !== peg$FAILED) {
        s8 = peg$parse_();
        s9 = peg$parseFunctionExpression();
        if (s9 !== peg$FAILED) {
          s6 = [s6, s7, s8, s9];
          s5 = s6;
        } else {
          peg$currPos = s5;
          s5 = peg$FAILED;
        }
      } else {
        peg$currPos = s5;
        s5 = peg$FAILED;
      }
      while (s5 !== peg$FAILED) {
        s4.push(s5);
        s5 = peg$currPos;
        s6 = peg$parse_();
        if (input.charCodeAt(peg$currPos) === 44) {
          s7 = peg$c6;
          peg$currPos++;
        } else {
          s7 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e6); }
        }
        if (s7 !== peg$FAILED) {
          s8 = peg$parse_();
          s9 = peg$parseFunctionExpression();
          if (s9 !== peg$FAILED) {
            s6 = [s6, s7, s8, s9];
            s5 = s6;
          } else {
            peg$currPos = s5;
            s5 = peg$FAILED;
          }
        } else {
          peg$currPos = s5;
          s5 = peg$FAILED;
        }
      }
      s5 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 41) {
        s6 = peg$c7;
        peg$currPos++;
      } else {
        s6 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e7); }
      }
      if (s6 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f4(s3, s4);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseNumericLiteral();
      if (s0 === peg$FAILED) {
        s0 = peg$parseAstLiteral();
        if (s0 === peg$FAILED) {
          s0 = peg$parseIdentifier();
        }
      }
    }

    return s0;
  }

  function peg$parseNumericLiteral() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    peg$silentFails++;
    s0 = peg$currPos;
    s1 = peg$currPos;
    s2 = [];
    if (peg$r0.test(input.charAt(peg$currPos))) {
      s3 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s3 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e9); }
    }
    if (s3 !== peg$FAILED) {
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        if (peg$r0.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e9); }
        }
      }
    } else {
      s2 = peg$FAILED;
    }
    if (s2 !== peg$FAILED) {
      s3 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 46) {
        s4 = peg$c8;
        peg$currPos++;
      } else {
        s4 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e10); }
      }
      if (s4 !== peg$FAILED) {
        s5 = peg$currPos;
        peg$silentFails++;
        if (input.charCodeAt(peg$currPos) === 46) {
          s6 = peg$c8;
          peg$currPos++;
        } else {
          s6 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e10); }
        }
        peg$silentFails--;
        if (s6 === peg$FAILED) {
          s5 = undefined;
        } else {
          peg$currPos = s5;
          s5 = peg$FAILED;
        }
        if (s5 !== peg$FAILED) {
          s6 = [];
          if (peg$r0.test(input.charAt(peg$currPos))) {
            s7 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s7 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e9); }
          }
          if (s7 !== peg$FAILED) {
            while (s7 !== peg$FAILED) {
              s6.push(s7);
              if (peg$r0.test(input.charAt(peg$currPos))) {
                s7 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s7 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$e9); }
              }
            }
          } else {
            s6 = peg$FAILED;
          }
          if (s6 !== peg$FAILED) {
            s4 = [s4, s5, s6];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      if (s3 === peg$FAILED) {
        s3 = null;
      }
      s2 = [s2, s3];
      s1 = s2;
    } else {
      peg$currPos = s1;
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f5(s1);
    }
    s0 = s1;
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e8); }
    }

    return s0;
  }

  function peg$parseAstLiteral() {
    var s0, s1, s2;

    peg$silentFails++;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 39) {
      s1 = peg$c9;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e12); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsePrimaryExpression();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f6(s2);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e11); }
    }

    return s0;
  }

  function peg$parseIdentifier() {
    var s0, s1, s2, s3, s4, s5;

    peg$silentFails++;
    s0 = peg$currPos;
    s1 = peg$parse_();
    s2 = peg$currPos;
    if (peg$r1.test(input.charAt(peg$currPos))) {
      s3 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s3 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e14); }
    }
    if (s3 !== peg$FAILED) {
      s4 = [];
      if (peg$r2.test(input.charAt(peg$currPos))) {
        s5 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e15); }
      }
      while (s5 !== peg$FAILED) {
        s4.push(s5);
        if (peg$r2.test(input.charAt(peg$currPos))) {
          s5 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e15); }
        }
      }
      s3 = [s3, s4];
      s2 = s3;
    } else {
      peg$currPos = s2;
      s2 = peg$FAILED;
    }
    if (s2 !== peg$FAILED) {
      s3 = peg$parse_();
      peg$savedPos = s0;
      s0 = peg$f7(s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e13); }
    }

    return s0;
  }

  function peg$parsePrimaryPattern() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 40) {
      s1 = peg$c5;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e5); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsePrimaryPattern();
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      s3 = [];
      s4 = peg$currPos;
      s5 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 44) {
        s6 = peg$c6;
        peg$currPos++;
      } else {
        s6 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e6); }
      }
      if (s6 !== peg$FAILED) {
        s7 = peg$parse_();
        s8 = peg$parsePrimaryPattern();
        if (s8 !== peg$FAILED) {
          s5 = [s5, s6, s7, s8];
          s4 = s5;
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
      } else {
        peg$currPos = s4;
        s4 = peg$FAILED;
      }
      while (s4 !== peg$FAILED) {
        s3.push(s4);
        s4 = peg$currPos;
        s5 = peg$parse_();
        if (input.charCodeAt(peg$currPos) === 44) {
          s6 = peg$c6;
          peg$currPos++;
        } else {
          s6 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e6); }
        }
        if (s6 !== peg$FAILED) {
          s7 = peg$parse_();
          s8 = peg$parsePrimaryPattern();
          if (s8 !== peg$FAILED) {
            s5 = [s5, s6, s7, s8];
            s4 = s5;
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
      }
      if (input.charCodeAt(peg$currPos) === 41) {
        s4 = peg$c7;
        peg$currPos++;
      } else {
        s4 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e7); }
      }
      if (s4 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f8(s2, s3);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseIdentifierPattern();
    }

    return s0;
  }

  function peg$parseIdentifierPattern() {
    var s0, s1;

    s0 = peg$currPos;
    s1 = peg$parseIdentifier();
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f9(s1);
    }
    s0 = s1;

    return s0;
  }

  function peg$parse_() {
    var s0, s1;

    peg$silentFails++;
    s0 = [];
    if (peg$r3.test(input.charAt(peg$currPos))) {
      s1 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e17); }
    }
    while (s1 !== peg$FAILED) {
      s0.push(s1);
      if (peg$r3.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e17); }
      }
    }
    peg$silentFails--;
    s1 = peg$FAILED;
    if (peg$silentFails === 0) { peg$fail(peg$e16); }

    return s0;
  }

  peg$result = peg$startRuleFunction();

  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation());
    }

    throw peg$buildStructuredError(
      peg$maxFailExpected,
      peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
      peg$maxFailPos < input.length
        ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
        : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
    );
  }
}

module.exports = {
  SyntaxError: peg$SyntaxError,
  parse: peg$parse
};
