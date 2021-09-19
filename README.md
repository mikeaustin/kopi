# kopi

## A simple, immutable, 100% asynchronous programming language.

What started out as an excersize turned into a real language. I has a Haskell/ML/Scala style (minimal) syntax, behaves kind of like a LISP, and is interpreted in JavaScript.

<br />

## There are no keywords

'match' is simply a function, and pattern matching is just a n-tuple of anonymous functions.

    factorial = n => match n (
      0 => 1
      n => n * (factorial n - 1)
    )

    print (factorial 170)

<br />

## There is no mutation

Shared mutable data is evil, but some impure functions such as 'print' and 'random' are handy.

    x = 1
    f = () => x

    x = "hi"
    print (f (), x)

    > (1, "hi")

<br />

## No more async awaits

'input' simply waits for user input and resolves as an argument to 'match'. 'sleep' does the same.


    match (input "Amount?") (
      "0" => print "> Zero"
       n  => sleep n
    )

    (sleep 1) + (sleep 1)

<br />

# Installation and running tests

Install the project

    git clone https://github.com/mikeaustin/kopi.git
    cd kopi/packages/kopi
    > npm install

<br />

To start the REPL

    > npm start

<br />

To run a specific test

    > npm start test/basics.kopi

<br />

Run all tests

    > npm test
