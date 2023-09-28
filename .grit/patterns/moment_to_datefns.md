---
title: Migrate from moment.js to date-fns
---

Moment.js is an older date manipulation framework that has reached end of life.
Maintainers of the library now advise migrating to modern atlernatives like `date-fns`.

tags: #migration, #alpha, #hidden

```grit
engine marzano(0.1)
language js

sequential {
  or {
    // Replace moment-js imports with date-fns
    rewrite_moment_imports(),
    // Re-write all `const` declarations to `let`.
    rewrite_const_to_let(),
    // Rewrite all moment-js expressions to equivalent date-fns expressions
    moment_exp_to_datefns_exp(),
  },
  add_helper_functions()
}
```

## Date construction 

```javascript
const date = moment();
```

```typescript
let date = new Date();
```

## Arithmetic operations where specifier is a literal

```js
const now = moment()
const then = moment("2001-01-01")

now.add(10, "d")
then.sub(12, "years")
now.sub(10, "ms")

foo(now.sub(12, "month"))
```

```ts
import { add } from "date-fns/add";
import { sub } from "date-fns/sub";

let now = new Date()
let then = new Date("2001-01-01")

now = add(now, { days: 10 })
then = sub(then, { years: 12 })
now = sub(now, { seconds: 10 / 1000 }) 


foo((now = sub(now, { months: 12 })))
```

## startOf/endOf

```js
date.startOf('week')
date.startOf('w')
date.endOf('seconds')
date.endOf('y')
```

```ts
date = datefns.setWeek(date, datefns.startOfWeek(date))
date = datefns.setWeek(date, datefns.startOfWeek(date))
date = datefns.setSeconds(date, datefns.endOfSecond(date))
date = datefns.setYear(date, datefns.endOfYear(date))
```