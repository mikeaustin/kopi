def f():
   res = yield
   yield res * res

gen = f()
value = gen.send(None)
value = gen.send(5.0)

'''

function *f() {
  res = yield;
  while (true) {
    res = yield res.toString();
  }
}

gen = f();
gen.next();
gen.next(1);
gen.next(2);
gen.next(3);

'''
