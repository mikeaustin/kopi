/*
 * Generated by PEG.js 0.10.0.
 *
 * http://pegjs.org/
 */

"use strict";

function peg$subclass(child, parent) {
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
}

function peg$SyntaxError(message, expected, found, location) {
  this.message  = message;
  this.expected = expected;
  this.found    = found;
  this.location = location;
  this.name     = "SyntaxError";

  if (typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(this, peg$SyntaxError);
  }
}

peg$subclass(peg$SyntaxError, Error);

peg$SyntaxError.buildMessage = function(expected, found) {
  var DESCRIBE_EXPECTATION_FNS = {
        literal: function(expectation) {
          return "\"" + literalEscape(expectation.text) + "\"";
        },

        "class": function(expectation) {
          var escapedParts = "",
              i;

          for (i = 0; i < expectation.parts.length; i++) {
            escapedParts += expectation.parts[i] instanceof Array
              ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1])
              : classEscape(expectation.parts[i]);
          }

          return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
        },

        any: function(expectation) {
          return "any character";
        },

        end: function(expectation) {
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
      .replace(/\\/g, '\\\\')
      .replace(/"/g,  '\\"')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
  }

  function classEscape(s) {
    return s
      .replace(/\\/g, '\\\\')
      .replace(/\]/g, '\\]')
      .replace(/\^/g, '\\^')
      .replace(/-/g,  '\\-')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
  }

  function describeExpectation(expectation) {
    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
  }

  function describeExpected(expected) {
    var descriptions = new Array(expected.length),
        i, j;

    for (i = 0; i < expected.length; i++) {
      descriptions[i] = describeExpectation(expected[i]);
    }

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
  options = options !== void 0 ? options : {};

  var peg$FAILED = {},

      peg$startRuleFunctions = { Block: peg$parseBlock },
      peg$startRuleFunction  = peg$parseBlock,

      peg$c0 = function(head, tail) {
            return new Block({
              statements: tail.reduce((block, [, statement]) => (
                statement ? [...block, statement] : block
              ), [head])
            });
          },
      peg$c1 = "=",
      peg$c2 = peg$literalExpectation("=", false),
      peg$c3 = function(pattern, expr) {
            return new Assignment({ pattern, expr })
          },
      peg$c4 = function(expr, args) {
            return args.reduce((expr, [, args]) => (
              new ApplyExpression({ expr, args })
            ), expr)
          },
      peg$c5 = "()",
      peg$c6 = peg$literalExpectation("()", false),
      peg$c7 = "=>",
      peg$c8 = peg$literalExpectation("=>", false),
      peg$c9 = function(expr) {
            return new FunctionExpression({ params: new TuplePattern({ elements: [] }), expr });
          },
      peg$c10 = function(params, expr) {
            return new FunctionExpression({ params, expr });
          },
      peg$c11 = function() {
          return new TupleExpression({ elements: [] });
        },
      peg$c12 = ",",
      peg$c13 = peg$literalExpectation(",", false),
      peg$c14 = function(head, tail) {
        	  return new TupleExpression({
              elements: tail.reduce((expressions, [, , expression]) => [
                ...expressions,
                expression
              ], [head])
            });
          },
      peg$c15 = "+",
      peg$c16 = peg$literalExpectation("+", false),
      peg$c17 = "-",
      peg$c18 = peg$literalExpectation("-", false),
      peg$c19 = function(head, tail) {
            return tail.reduce((left, [, op, , right]) => (
              new OperatorExpression({ op, left, right })
            ), head);
          },
      peg$c20 = "*",
      peg$c21 = peg$literalExpectation("*", false),
      peg$c22 = "/",
      peg$c23 = peg$literalExpectation("/", false),
      peg$c24 = "..",
      peg$c25 = peg$literalExpectation("..", false),
      peg$c26 = function(from, to) {
            return new RangeExpression({ from, to });
          },
      peg$c27 = "(",
      peg$c28 = peg$literalExpectation("(", false),
      peg$c29 = ")",
      peg$c30 = peg$literalExpectation(")", false),
      peg$c31 = function(expr) { return expr; },
      peg$c32 = function(head, tail) {
            return new TuplePattern({
              elements: tail.reduce((elements, [, , element]) => [...elements, element], [head])
            })
          },
      peg$c33 = function(number) {
            return new NumericLiteralPattern({ value: number.value });
          },
      peg$c34 = function(ident) {
            return new IdentifierPattern({ name: ident.name });
          },
      peg$c35 = function(ident, params) {
            return new FunctionPattern({ name: ident.name, params });
          },
      peg$c36 = function(pattern) { return pattern; },
      peg$c37 = /^[a-z]/,
      peg$c38 = peg$classExpectation([["a", "z"]], false, false),
      peg$c39 = /^[a-zA-Z0-9]/,
      peg$c40 = peg$classExpectation([["a", "z"], ["A", "Z"], ["0", "9"]], false, false),
      peg$c41 = function(name) { return new Identifier({ name: text() }); },
      peg$c42 = peg$otherExpectation("number"),
      peg$c43 = /^[0-9]/,
      peg$c44 = peg$classExpectation([["0", "9"]], false, false),
      peg$c45 = function() { return new NumericLiteral({ value: Number(text()) }); },
      peg$c46 = peg$otherExpectation("whitespace"),
      peg$c47 = /^[ \t]/,
      peg$c48 = peg$classExpectation([" ", "\t"], false, false),
      peg$c49 = peg$otherExpectation("newline"),
      peg$c50 = /^[\n\r]/,
      peg$c51 = peg$classExpectation(["\n", "\r"], false, false),

      peg$currPos          = 0,
      peg$savedPos         = 0,
      peg$posDetailsCache  = [{ line: 1, column: 1 }],
      peg$maxFailPos       = 0,
      peg$maxFailExpected  = [],
      peg$silentFails      = 0,

      peg$result;

  if ("startRule" in options) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
    }

    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
  }

  function text() {
    return input.substring(peg$savedPos, peg$currPos);
  }

  function location() {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }

  function expected(description, location) {
    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

    throw peg$buildStructuredError(
      [peg$otherExpectation(description)],
      input.substring(peg$savedPos, peg$currPos),
      location
    );
  }

  function error(message, location) {
    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

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
    var details = peg$posDetailsCache[pos], p;

    if (details) {
      return details;
    } else {
      p = pos - 1;
      while (!peg$posDetailsCache[p]) {
        p--;
      }

      details = peg$posDetailsCache[p];
      details = {
        line:   details.line,
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
    var startPosDetails = peg$computePosDetails(startPos),
        endPosDetails   = peg$computePosDetails(endPos);

    return {
      start: {
        offset: startPos,
        line:   startPosDetails.line,
        column: startPosDetails.column
      },
      end: {
        offset: endPos,
        line:   endPosDetails.line,
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

  function peg$parseBlock() {
    var s0, s1, s2, s3, s4, s5, s6;

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parseNewline();
    while (s2 !== peg$FAILED) {
      s1.push(s2);
      s2 = peg$parseNewline();
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseStatement();
      if (s2 !== peg$FAILED) {
        s3 = [];
        s4 = peg$currPos;
        s5 = [];
        s6 = peg$parseNewline();
        if (s6 !== peg$FAILED) {
          while (s6 !== peg$FAILED) {
            s5.push(s6);
            s6 = peg$parseNewline();
          }
        } else {
          s5 = peg$FAILED;
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parseStatement();
          if (s6 !== peg$FAILED) {
            s5 = [s5, s6];
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
          s5 = [];
          s6 = peg$parseNewline();
          if (s6 !== peg$FAILED) {
            while (s6 !== peg$FAILED) {
              s5.push(s6);
              s6 = peg$parseNewline();
            }
          } else {
            s5 = peg$FAILED;
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parseStatement();
            if (s6 !== peg$FAILED) {
              s5 = [s5, s6];
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
        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$parseNewline();
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            s5 = peg$parseNewline();
          }
          if (s4 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c0(s2, s3);
            s0 = s1;
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
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseStatement() {
    var s0;

    s0 = peg$parseAssignment();
    if (s0 === peg$FAILED) {
      s0 = peg$parseApplyExpression();
    }

    return s0;
  }

  function peg$parseAssignment() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$parsePattern();
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 61) {
          s3 = peg$c1;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c2); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseApplyExpression();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c3(s1, s5);
              s0 = s1;
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
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseApplyExpression() {
    var s0, s1, s2, s3, s4, s5, s6;

    s0 = peg$currPos;
    s1 = peg$parseFunctionExpression();
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        s3 = [];
        s4 = peg$currPos;
        s5 = peg$parse_();
        if (s5 !== peg$FAILED) {
          s6 = peg$parseFunctionExpression();
          if (s6 !== peg$FAILED) {
            s5 = [s5, s6];
            s4 = s5;
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
        if (s4 !== peg$FAILED) {
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$currPos;
            s5 = peg$parse_();
            if (s5 !== peg$FAILED) {
              s6 = peg$parseFunctionExpression();
              if (s6 !== peg$FAILED) {
                s5 = [s5, s6];
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
        } else {
          s3 = peg$FAILED;
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c4(s1, s3);
          s0 = s1;
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
      s0 = peg$parseFunctionExpression();
    }

    return s0;
  }

  function peg$parseFunctionExpression() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 2) === peg$c5) {
      s1 = peg$c5;
      peg$currPos += 2;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c6); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c7) {
          s3 = peg$c7;
          peg$currPos += 2;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c8); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseApplyExpression();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c9(s5);
              s0 = s1;
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
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parsePattern();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c7) {
            s3 = peg$c7;
            peg$currPos += 2;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c8); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseApplyExpression();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c10(s1, s5);
                s0 = s1;
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
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parseTupleExpression();
      }
    }

    return s0;
  }

  function peg$parseTupleExpression() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 2) === peg$c5) {
      s1 = peg$c5;
      peg$currPos += 2;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c6); }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c11();
    }
    s0 = s1;
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parseAddExpression();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 44) {
            s5 = peg$c12;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c13); }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parse_();
            if (s6 !== peg$FAILED) {
              s7 = peg$parseAddExpression();
              if (s7 !== peg$FAILED) {
                s5 = [s5, s6, s7];
                s4 = s5;
              } else {
                peg$currPos = s4;
                s4 = peg$FAILED;
              }
            } else {
              peg$currPos = s4;
              s4 = peg$FAILED;
            }
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
          if (s4 !== peg$FAILED) {
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 44) {
                s5 = peg$c12;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c13); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseAddExpression();
                  if (s7 !== peg$FAILED) {
                    s5 = [s5, s6, s7];
                    s4 = s5;
                  } else {
                    peg$currPos = s4;
                    s4 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s4;
                  s4 = peg$FAILED;
                }
              } else {
                peg$currPos = s4;
                s4 = peg$FAILED;
              }
            }
          } else {
            s3 = peg$FAILED;
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c14(s1, s3);
            s0 = s1;
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
      if (s4 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 43) {
          s5 = peg$c15;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c16); }
        }
        if (s5 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 45) {
            s5 = peg$c17;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c18); }
          }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          if (s6 !== peg$FAILED) {
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
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      if (s3 !== peg$FAILED) {
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 43) {
              s5 = peg$c15;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c16); }
            }
            if (s5 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 45) {
                s5 = peg$c17;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c18); }
              }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parse_();
              if (s6 !== peg$FAILED) {
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
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
      } else {
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c19(s1, s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseMultiplyExpression();
    }

    return s0;
  }

  function peg$parseMultiplyExpression() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$parseRangeExpression();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      s4 = peg$parse_();
      if (s4 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 42) {
          s5 = peg$c20;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c21); }
        }
        if (s5 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 47) {
            s5 = peg$c22;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c23); }
          }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          if (s6 !== peg$FAILED) {
            s7 = peg$parseRangeExpression();
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
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      if (s3 !== peg$FAILED) {
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 42) {
              s5 = peg$c20;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c21); }
            }
            if (s5 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 47) {
                s5 = peg$c22;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c23); }
              }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parse_();
              if (s6 !== peg$FAILED) {
                s7 = peg$parseRangeExpression();
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
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
      } else {
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c19(s1, s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseRangeExpression();
    }

    return s0;
  }

  function peg$parseRangeExpression() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$parsePrimaryExpression();
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c24) {
          s3 = peg$c24;
          peg$currPos += 2;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c25); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            s5 = peg$parsePrimaryExpression();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c26(s1, s5);
              s0 = s1;
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
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parsePrimaryExpression();
    }

    return s0;
  }

  function peg$parsePrimaryExpression() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 40) {
      s1 = peg$c27;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c28); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseApplyExpression();
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 41) {
              s5 = peg$c29;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c30); }
            }
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c31(s3);
              s0 = s1;
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
        s0 = peg$parseIdentifier();
      }
    }

    return s0;
  }

  function peg$parsePattern() {
    var s0;

    s0 = peg$parseFunctionPattern();
    if (s0 === peg$FAILED) {
      s0 = peg$parseTuplePattern();
    }

    return s0;
  }

  function peg$parseTuplePattern() {
    var s0, s1, s2, s3, s4, s5, s6;

    s0 = peg$currPos;
    s1 = peg$parsePrimaryPattern();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 44) {
        s4 = peg$c12;
        peg$currPos++;
      } else {
        s4 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c13); }
      }
      if (s4 !== peg$FAILED) {
        s5 = peg$parse_();
        if (s5 !== peg$FAILED) {
          s6 = peg$parsePrimaryPattern();
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
      if (s3 !== peg$FAILED) {
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 44) {
            s4 = peg$c12;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c13); }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parse_();
            if (s5 !== peg$FAILED) {
              s6 = peg$parsePrimaryPattern();
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
        }
      } else {
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c32(s1, s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parsePrimaryPattern();
    }

    return s0;
  }

  function peg$parseNumericLiteralPattern() {
    var s0, s1;

    s0 = peg$currPos;
    s1 = peg$parseNumericLiteral();
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c33(s1);
    }
    s0 = s1;

    return s0;
  }

  function peg$parseIdentifierPattern() {
    var s0, s1;

    s0 = peg$currPos;
    s1 = peg$parseIdentifier();
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c34(s1);
    }
    s0 = s1;

    return s0;
  }

  function peg$parseFunctionPattern() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parseIdentifier();
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        s3 = peg$parsePattern();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c35(s1, s3);
          s0 = s1;
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

    return s0;
  }

  function peg$parsePrimaryPattern() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 40) {
      s1 = peg$c27;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c28); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsePattern();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 41) {
          s3 = peg$c29;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c30); }
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c36(s2);
          s0 = s1;
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
      s0 = peg$parseNumericLiteralPattern();
      if (s0 === peg$FAILED) {
        s0 = peg$parseIdentifierPattern();
      }
    }

    return s0;
  }

  function peg$parseIdentifier() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    if (peg$c37.test(input.charAt(peg$currPos))) {
      s1 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c38); }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      if (peg$c39.test(input.charAt(peg$currPos))) {
        s3 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c40); }
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        if (peg$c39.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c40); }
        }
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c41(s1);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseNumericLiteral() {
    var s0, s1, s2, s3;

    peg$silentFails++;
    s0 = peg$currPos;
    s1 = peg$parse_();
    if (s1 !== peg$FAILED) {
      s2 = [];
      if (peg$c43.test(input.charAt(peg$currPos))) {
        s3 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c44); }
      }
      if (s3 !== peg$FAILED) {
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          if (peg$c43.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c44); }
          }
        }
      } else {
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c45();
        s0 = s1;
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
      if (peg$silentFails === 0) { peg$fail(peg$c42); }
    }

    return s0;
  }

  function peg$parse_() {
    var s0, s1;

    s0 = [];
    s1 = peg$parseWhitespace();
    while (s1 !== peg$FAILED) {
      s0.push(s1);
      s1 = peg$parseWhitespace();
    }

    return s0;
  }

  function peg$parseWhitespace() {
    var s0, s1;

    peg$silentFails++;
    if (peg$c47.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c48); }
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c46); }
    }

    return s0;
  }

  function peg$parseNewline() {
    var s0, s1;

    peg$silentFails++;
    if (peg$c50.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c51); }
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c49); }
    }

    return s0;
  }


    class Node {
      constructor(args) {
        Object.assign(this, args);
      }
    }

    class Block extends Node { }
    class Assignment extends Node { }

    class OperatorExpression extends Node { }
    class FunctionExpression extends Node { }
    class ApplyExpression extends Node { }
    class TupleExpression extends Node { }
    class RangeExpression extends Node { }

    class NumericLiteral extends Node { }
    class Identifier extends Node { }

    class TuplePattern extends Node { }
    class IdentifierPattern extends Node { }
    class NumericLiteralPattern extends Node { }
    class FunctionPattern extends Node { }


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
  parse:       peg$parse
};
