#!/usr/bin/env sh

cat \
  src/parser/classes.pegjs \
  src/parser/statements.pegjs \
  src/parser/expressions.pegjs \
  src/parser/patterns.pegjs \
  src/parser/terminals.pegjs \
  src/parser/whitespace.pegjs
