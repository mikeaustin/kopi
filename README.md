# kopi

### A simple, immutable, 100% asynchronous programming language.

What started out as an exercise turned into a real language. Kopi has a Haskell/ML/Scala style (minimal) syntax, behaves kind of like a LISP, and is interpreted in JavaScript. It has coroutines, and will support sevaral literal syntaxes (map, set). More details can be found here:

https://docs.google.com/presentation/d/1NtJtgIilqQv2XBoCmybcQU_IsEcylMOcLYXkgB5dQoM/edit?usp=sharing

> **NOTE**: Kopi is still in the experimental phase. Lots of things are changing, and new functionality is being added.
> It's not ready to be used in production environments, but please try it out, experiment with it, and have fun!

### There are no keywords

'match' is simply a function, and pattern matching is just an n-tuple of anonymous functions.

    factorial = n => match n (
      0 => 1
      n => n * (factorial n - 1)
    )

    print (factorial 170)

### There is no mutation

Shared mutable data is evil, but some impure functions such as 'print' and 'random' are handy.

    x = 1
    f = () => x

    x = "hi"
    print (f (), x)

    > (1, "hi")

### No more async awaits

'input' simply waits for user input and resolves as an argument to 'match'. 'sleep' does the same.


    match (input "Amount?") (
      "0" => print "> Zero"
       n  => sleep n
    )

    (sleep 1) + (sleep 1)

### Other examples

    1..2, "a".."z" | map (a, b) => a, b
    
    1..5 | map () => sleep 1
    
    1..3 | map 'toString
    
    coroutine = spawn () => {
      loop = () => {
        yield x => x * x
        loop ()
      }
      loop ()
    }
    
    send coroutine 5  # prints '25'

## Installation and running tests

Install the project

    > git clone https://github.com/mikeaustin/kopi.git
    > cd kopi/packages/kopi
    > npm install

To start the REPL

    > npm start

To run a specific test

    > npm start test/basics.kopi

To run all tests

    > npm test
