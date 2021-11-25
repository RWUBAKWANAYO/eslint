/**
 * @fileoverview Tests for quotes rule.
 * @author Matt DuVall <http://www.mattduvall.com/>, Michael Paulukonis
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/quotes"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("quotes", rule, {
    valid: [
        "var foo = \"bar\";",
        { code: "var foo = 'bar';", options: [{ precedence: ["single"] }] },
        { code: "var foo = \"bar\";", options: [{ precedence: ["double"] }] },
        { code: "var foo = 1;", options: [{ precedence: ["single"] }] },
        { code: "var foo = 1;", options: [{ precedence: ["double"] }] },
        { code: "var foo = \"'\";", options: [{ precedence: ["single"], avoidEscape: true }] },
        { code: "var foo = '\"';", options: [{ precedence: ["double"], avoidEscape: true }] },
        { code: "var foo = <>Hello world</>;", options: [{ precedence: ["single"] }], parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } } },
        { code: "var foo = <>Hello world</>;", options: [{ precedence: ["double"] }], parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } } },
        { code: "var foo = <>Hello world</>;", options: [{ precedence: ["double"], avoidEscape: true }], parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } } },
        { code: "var foo = <>Hello world</>;", options: [{ precedence: ["backtick"] }], parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } } },
        { code: "var foo = <div>Hello world</div>;", options: [{ precedence: ["single"] }], parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } } },
        { code: "var foo = <div id=\"foo\"></div>;", options: [{ precedence: ["single"] }], parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } } },
        { code: "var foo = <div>Hello world</div>;", options: [{ precedence: ["double"] }], parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } } },
        { code: "var foo = <div>Hello world</div>;", options: [{ precedence: ["double"], avoidEscape: true }], parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } } },
        { code: "var foo = `bar`;", options: [{ precedence: ["backtick"] }], parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `bar 'baz'`;", options: [{ precedence: ["backtick"] }], parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `bar \"baz\"`;", options: [{ precedence: ["backtick"] }], parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = 1;", options: [{ precedence: ["backtick"] }] },
        { code: "var foo = \"a string containing `backtick` quotes\";", options: [{ precedence: ["backtick"], avoidEscape: true }] },
        { code: "var foo = <div id=\"foo\"></div>;", options: [{ precedence: ["backtick"] }], parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } } },
        { code: "var foo = <div>Hello world</div>;", options: [{ precedence: ["backtick"] }], parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } } },
        { code: "class C { \"f\"; \"m\"() {} }", options: [{ precedence: ["double"] }], parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { 'f'; 'm'() {} }", options: [{ precedence: ["single"] }], parserOptions: { ecmaVersion: 2022 } },

        // Backticks are only okay if they have substitutions, contain a line break, or are tagged
        { code: "var foo = `back\ntick`;", options: [{ precedence: ["single"] }], parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `back\rtick`;", options: [{ precedence: ["single"] }], parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `back\u2028tick`;", options: [{ precedence: ["single"] }], parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `back\u2029tick`;", options: [{ precedence: ["single"] }], parserOptions: { ecmaVersion: 6 } },
        {
            code: "var foo = `back\\\\\ntick`;", // 2 backslashes followed by a newline
            options: [{ precedence: ["single"] }],
            parserOptions: { ecmaVersion: 6 }
        },
        { code: "var foo = `back\\\\\\\\\ntick`;", options: [{ precedence: ["single"] }], parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `\n`;", options: [{ precedence: ["single"] }], parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `back${x}tick`;", options: [{ precedence: ["double"] }], parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = tag`backtick`;", options: [{ precedence: ["double"] }], parserOptions: { ecmaVersion: 6 } },

        // Backticks are also okay if allowTemplateLiterals
        { code: "var foo = `bar 'foo' baz` + 'bar';", options: [{ precedence: ["single", "backtick"] }], parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `bar 'foo' baz` + \"bar\";", options: [{ precedence: ["double", "backtick"] }], parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `bar 'foo' baz` + `bar`;", options: [{ precedence: ["backtick"] }], parserOptions: { ecmaVersion: 6 } },

        // `backtick` should not warn the directive prologues.
        { code: "\"use strict\"; var foo = `backtick`;", options: [{ precedence: ["backtick"] }], parserOptions: { ecmaVersion: 6 } },
        { code: "\"use strict\"; 'use strong'; \"use asm\"; var foo = `backtick`;", options: [{ precedence: ["backtick"] }], parserOptions: { ecmaVersion: 6 } },
        { code: "function foo() { \"use strict\"; \"use strong\"; \"use asm\"; var foo = `backtick`; }", options: [{ precedence: ["backtick"] }], parserOptions: { ecmaVersion: 6 } },
        { code: "(function() { 'use strict'; 'use strong'; 'use asm'; var foo = `backtick`; })();", options: [{ precedence: ["backtick"] }], parserOptions: { ecmaVersion: 6 } },
        { code: "(() => { \"use strict\"; \"use strong\"; \"use asm\"; var foo = `backtick`; })();", options: [{ precedence: ["backtick"] }], parserOptions: { ecmaVersion: 6 } },

        // `backtick` should not warn import/export sources.
        { code: "import \"a\"; import 'b';", options: [{ precedence: ["backtick"] }], parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "import a from \"a\"; import b from 'b';", options: [{ precedence: ["backtick"] }], parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export * from \"a\"; export * from 'b';", options: [{ precedence: ["backtick"] }], parserOptions: { ecmaVersion: 6, sourceType: "module" } },

        // `backtick` should not warn property/method names (not computed).
        { code: "var obj = {\"key0\": 0, 'key1': 1};", options: [{ precedence: ["backtick"] }], parserOptions: { ecmaVersion: 6 } },
        { code: "class Foo { 'bar'(){} }", options: [{ precedence: ["backtick"] }], parserOptions: { ecmaVersion: 6 } },
        { code: "class Foo { static ''(){} }", options: [{ precedence: ["backtick"] }], parserOptions: { ecmaVersion: 6 } },
        { code: "class C { \"double\"; 'single'; }", options: [{ precedence: ["backtick"] }], parserOptions: { ecmaVersion: 2022 } }
    ],
    invalid: [
        {
            code: "var foo = 'bar';",
            output: "var foo = \"bar\";",
            errors: [{
                messageId: "wrongQuotes",
                data: { description: "doublequote" },
                type: "Literal"
            }]
        },
        {
            code: "var foo = \"bar\";",
            output: "var foo = 'bar';",
            options: [{ precedence: ["single"] }],
            errors: [{
                messageId: "wrongQuotes",
                data: { description: "singlequote" },
                type: "Literal"
            }]
        },
        {
            code: "var foo = `bar`;",
            output: "var foo = 'bar';",
            options: [{ precedence: ["single"] }],
            parserOptions: {
                ecmaVersion: 6
            },
            errors: [{
                messageId: "wrongQuotes",
                data: { description: "singlequote" },
                type: "TemplateLiteral"
            }]
        },
        {
            code: "var foo = 'don\\'t';",
            output: "var foo = \"don't\";",
            errors: [{
                messageId: "wrongQuotes",
                data: { description: "doublequote" },
                type: "Literal"
            }]
        },
        {
            code: "var msg = \"Plugin '\" + name + \"' not found\"",
            output: "var msg = 'Plugin \\'' + name + '\\' not found'",
            options: [{ precedence: ["single"] }],
            errors: [
                {
                    messageId: "wrongQuotes",
                    data: { description: "singlequote" },
                    type: "Literal",
                    column: 11
                },
                {
                    messageId: "wrongQuotes",
                    data: { description: "singlequote" },
                    type: "Literal",
                    column: 31
                }
            ]
        },
        {
            code: "var foo = 'bar';",
            output: "var foo = \"bar\";",
            options: [{ precedence: ["double"] }],
            errors: [{
                messageId: "wrongQuotes",
                data: { description: "doublequote" },
                type: "Literal"
            }]
        },
        {
            code: "var foo = `bar`;",
            output: "var foo = \"bar\";",
            options: [{ precedence: ["double"] }],
            parserOptions: {
                ecmaVersion: 6
            },
            errors: [{
                messageId: "wrongQuotes",
                data: { description: "doublequote" },
                type: "TemplateLiteral"
            }]
        },
        {
            code: "var foo = \"bar\";",
            output: "var foo = 'bar';",
            options: [{ precedence: ["single"], avoidEscape: true }],
            errors: [{
                messageId: "wrongQuotes",
                data: { description: "singlequote" },
                type: "Literal"
            }]
        },
        {
            code: "var foo = 'bar';",
            output: "var foo = \"bar\";",
            options: [{ precedence: ["double"], avoidEscape: true }],
            errors: [{
                messageId: "wrongQuotes",
                data: { description: "doublequote" },
                type: "Literal"
            }]
        },
        {
            code: "var foo = '\\\\';",
            output: "var foo = \"\\\\\";",
            options: [{ precedence: ["double"], avoidEscape: true }],
            errors: [{
                messageId: "wrongQuotes",
                data: { description: "doublequote" },
                type: "Literal"
            }]
        },
        {
            code: "var foo = \"bar\";",
            output: "var foo = 'bar';",
            options: [{ precedence: ["single", "backtick"] }],
            errors: [{
                messageId: "wrongQuotes",
                data: { description: "singlequote" },
                type: "Literal"
            }]
        },
        {
            code: "var foo = 'bar';",
            output: "var foo = \"bar\";",
            options: [{ precedence: ["double", "backtick"] }],
            errors: [{
                messageId: "wrongQuotes",
                data: { description: "doublequote" },
                type: "Literal"
            }]
        },
        {
            code: "var foo = 'bar';",
            output: "var foo = `bar`;",
            options: [{ precedence: ["backtick"] }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "wrongQuotes",
                data: { description: "backtick" },
                type: "Literal"
            }]
        },
        {
            code: "var foo = 'b${x}a$r';",
            output: "var foo = `b\\${x}a$r`;",
            options: [{ precedence: ["backtick"] }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "wrongQuotes",
                data: { description: "backtick" },
                type: "Literal"
            }]
        },
        {
            code: "var foo = \"bar\";",
            output: "var foo = `bar`;",
            options: [{ precedence: ["backtick"] }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "wrongQuotes",
                data: { description: "backtick" },
                type: "Literal"
            }]
        },
        {
            code: "var foo = \"bar\";",
            output: "var foo = `bar`;",
            options: [{ precedence: ["backtick"], avoidEscape: true }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "wrongQuotes",
                data: { description: "backtick" },
                type: "Literal"
            }]
        },
        {
            code: "var foo = 'bar';",
            output: "var foo = `bar`;",
            options: [{ precedence: ["backtick"], avoidEscape: true }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "wrongQuotes",
                data: { description: "backtick" },
                type: "Literal"
            }]
        },

        // "use strict" is *not* a directive prologue in these statements so is subject to the rule
        {
            code: "var foo = `backtick`; \"use strict\";",
            output: "var foo = `backtick`; `use strict`;",
            options: [{ precedence: ["backtick"] }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "wrongQuotes",
                data: { description: "backtick" },
                type: "Literal"
            }]
        },
        {
            code: "{ \"use strict\"; var foo = `backtick`; }",
            output: "{ `use strict`; var foo = `backtick`; }",
            options: [{ precedence: ["backtick"] }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "wrongQuotes",
                data: { description: "backtick" },
                type: "Literal"
            }]
        },
        {
            code: "if (1) { \"use strict\"; var foo = `backtick`; }",
            output: "if (1) { `use strict`; var foo = `backtick`; }",
            options: [{ precedence: ["backtick"] }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "wrongQuotes",
                data: { description: "backtick" },
                type: "Literal"
            }]
        },

        // `backtick` should warn computed property names.
        {
            code: "var obj = {[\"key0\"]: 0, ['key1']: 1};",
            output: "var obj = {[`key0`]: 0, [`key1`]: 1};",
            options: [{ precedence: ["backtick"] }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "wrongQuotes",
                    data: { description: "backtick" },
                    type: "Literal"
                },
                {
                    messageId: "wrongQuotes",
                    data: { description: "backtick" },
                    type: "Literal"
                }
            ]
        },
        {
            code: "class Foo { ['a'](){} static ['b'](){} }",
            output: "class Foo { [`a`](){} static [`b`](){} }",
            options: [{ precedence: ["backtick"] }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "wrongQuotes",
                    data: { description: "backtick" },
                    type: "Literal"
                },
                {
                    messageId: "wrongQuotes",
                    data: { description: "backtick" },
                    type: "Literal"
                }
            ]
        },

        // https://github.com/eslint/eslint/issues/7084
        {
            code: "<div blah={\"blah\"} />",
            output: "<div blah={'blah'} />",
            options: [{ precedence: ["single"] }],
            parserOptions: { ecmaFeatures: { jsx: true } },
            errors: [
                {
                    messageId: "wrongQuotes",
                    data: { description: "singlequote" },
                    type: "Literal"
                }
            ]
        },
        {
            code: "<div blah={'blah'} />",
            output: "<div blah={\"blah\"} />",
            options: [{ precedence: ["double"] }],
            parserOptions: { ecmaFeatures: { jsx: true } },
            errors: [
                {
                    messageId: "wrongQuotes",
                    data: { description: "doublequote" },
                    type: "Literal"
                }
            ]
        },
        {
            code: "<div blah={'blah'} />",
            output: "<div blah={`blah`} />",
            options: [{ precedence: ["backtick"] }],
            parserOptions: { ecmaFeatures: { jsx: true }, ecmaVersion: 2015 },
            errors: [
                {
                    messageId: "wrongQuotes",
                    data: { description: "backtick" },
                    type: "Literal"
                }
            ]
        },

        // https://github.com/eslint/eslint/issues/7610
        {
            code: "`use strict`;",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "wrongQuotes",
                data: { description: "doublequote" },
                type: "TemplateLiteral"
            }]
        },
        {
            code: "function foo() { `use strict`; foo(); }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "wrongQuotes",
                data: { description: "doublequote" },
                type: "TemplateLiteral"
            }]
        },
        {
            code: "foo = function() { `use strict`; foo(); }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "wrongQuotes",
                data: { description: "doublequote" },
                type: "TemplateLiteral"
            }]
        },
        {
            code: "() => { `use strict`; foo(); }",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "wrongQuotes",
                data: { description: "doublequote" },
                type: "TemplateLiteral"
            }]
        },
        {
            code: "() => { foo(); `use strict`; }",
            output: "() => { foo(); \"use strict\"; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "wrongQuotes",
                data: { description: "doublequote" },
                type: "TemplateLiteral"
            }]
        },
        {
            code: "foo(); `use strict`;",
            output: "foo(); \"use strict\";",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "wrongQuotes",
                data: { description: "doublequote" },
                type: "TemplateLiteral"
            }]
        },

        // https://github.com/eslint/eslint/issues/7646
        {
            code: "var foo = `foo\\nbar`;",
            output: "var foo = \"foo\\nbar\";",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "wrongQuotes",
                data: { description: "doublequote" },
                type: "TemplateLiteral"
            }]
        },
        {
            code: "var foo = `foo\\\nbar`;", // 1 backslash followed by a newline
            output: "var foo = \"foo\\\nbar\";",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "wrongQuotes",
                data: { description: "doublequote" },
                type: "TemplateLiteral"
            }]
        },
        {
            code: "var foo = `foo\\\\\\\nbar`;", // 3 backslashes followed by a newline
            output: "var foo = \"foo\\\\\\\nbar\";",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "wrongQuotes",
                data: { description: "doublequote" },
                type: "TemplateLiteral"
            }]
        },
        {
            code: "````",
            output: "\"\"``",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "wrongQuotes",
                data: { description: "doublequote" },
                type: "TemplateLiteral",
                line: 1,
                column: 1
            }]
        },

        // Strings containing octal escape sequences. Don't autofix to backticks.
        {
            code: "var foo = \"\\1\"",
            output: "var foo = '\\1'",
            options: [{ precedence: ["single"] }],
            errors: [
                {
                    messageId: "wrongQuotes",
                    data: { description: "singlequote" },
                    type: "Literal"
                }
            ]
        },
        {
            code: "var foo = '\\1'",
            output: "var foo = \"\\1\"",
            options: [{ precedence: ["double"] }],
            errors: [
                {
                    messageId: "wrongQuotes",
                    data: { description: "doublequote" },
                    type: "Literal"
                }
            ]
        },
        {
            code: "var notoctal = '\\0'",
            output: "var notoctal = `\\0`",
            options: [{ precedence: ["backtick"] }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "wrongQuotes",
                    data: { description: "backtick" },
                    type: "Literal"
                }
            ]
        },
        {
            code: "var foo = '\\1'",
            output: null,
            options: [{ precedence: ["backtick"] }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "wrongQuotes",
                    data: { description: "backtick" },
                    type: "Literal"
                }
            ]
        },
        {
            code: "var foo = \"\\1\"",
            output: null,
            options: [{ precedence: ["backtick"] }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "wrongQuotes",
                    data: { description: "backtick" },
                    type: "Literal"
                }
            ]
        },
        {
            code: "var foo = '\\01'",
            output: null,
            options: [{ precedence: ["backtick"] }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "wrongQuotes",
                    data: { description: "backtick" },
                    type: "Literal"
                }
            ]
        },
        {
            code: "var foo = '\\0\\1'",
            output: null,
            options: [{ precedence: ["backtick"] }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "wrongQuotes",
                    data: { description: "backtick" },
                    type: "Literal"
                }
            ]
        },
        {
            code: "var foo = '\\08'",
            output: null,
            options: [{ precedence: ["backtick"] }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "wrongQuotes",
                    data: { description: "backtick" },
                    type: "Literal"
                }
            ]
        },
        {
            code: "var foo = 'prefix \\33'",
            output: null,
            options: [{ precedence: ["backtick"] }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "wrongQuotes",
                    data: { description: "backtick" },
                    type: "Literal"
                }
            ]
        },
        {
            code: "var foo = 'prefix \\75 suffix'",
            output: null,
            options: [{ precedence: ["backtick"] }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "wrongQuotes",
                    data: { description: "backtick" },
                    type: "Literal"
                }
            ]
        },
        {
            code: "var nonOctalDecimalEscape = '\\8'",
            output: null,
            options: [{ precedence: ["backtick"] }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "wrongQuotes",
                    data: { description: "backtick" },
                    type: "Literal"
                }
            ]
        },


        // class members
        {
            code: "class C { 'foo'; }",
            output: "class C { \"foo\"; }",
            options: [{ precedence: ["double"] }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    messageId: "wrongQuotes",
                    data: { description: "doublequote" },
                    type: "Literal"
                }
            ]
        },
        {
            code: "class C { 'foo'() {} }",
            output: "class C { \"foo\"() {} }",
            options: [{ precedence: ["double"] }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    messageId: "wrongQuotes",
                    data: { description: "doublequote" },
                    type: "Literal"
                }
            ]
        },
        {
            code: "class C { \"foo\"; }",
            output: "class C { 'foo'; }",
            options: [{ precedence: ["single"] }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    messageId: "wrongQuotes",
                    data: { description: "singlequote" },
                    type: "Literal"
                }
            ]
        },
        {
            code: "class C { \"foo\"() {} }",
            output: "class C { 'foo'() {} }",
            options: [{ precedence: ["single"] }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    messageId: "wrongQuotes",
                    data: { description: "singlequote" },
                    type: "Literal"
                }
            ]
        },
        {
            code: "class C { [\"foo\"]; }",
            output: "class C { [`foo`]; }",
            options: [{ precedence: ["backtick"] }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    messageId: "wrongQuotes",
                    data: { description: "backtick" },
                    type: "Literal"
                }
            ]
        },
        {
            code: "class C { foo = \"foo\"; }",
            output: "class C { foo = `foo`; }",
            options: [{ precedence: ["backtick"] }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                {
                    messageId: "wrongQuotes",
                    data: { description: "backtick" },
                    type: "Literal"
                }
            ]
        }
    ]
});
