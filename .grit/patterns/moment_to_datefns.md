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
then.subtract(12, "years")
now.subtract(10, "ms")

foo(now.subtract(12, "month"))
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

## Arithmetic operations wherer specifier is not a literal

```js
const now = moment()
const then = moment("2001-01-02")
const unit = Math.random() > 0.5 ? "d" : "y"

now.add(10, unit)
now.subtract(then.days(), unit)
```

```ts
import { add } from "date-fns/add";
import { sub } from "date-fns/sub";

let now = (new Date())
let then = (new Date("2001-01-02"))
const unit = Math.random() > 0.5 ? "d" : "y"

now = datefns.add({ [normalizeMomentJSUnit(unit)]: 10 })
now = datefns.sub({ [normalizeMomentJSUnit(unit)]: ((x => (x instanceof Date) ? datefns.getDays(x) : x.days)(then)) })
function normalizeMomentJSUnit(fmt) {
  const unitRegexs = [
    [/\b(?:y|years?)\b/, 'year'],
    [/\b(?:q|quarters?)\b/, 'quarter'],
    [/\b(?:M|months?)\b/, 'month'],
    [/\b(?:w|weeks?)\b/, 'week'],
    [/\b(?:d|days?)\b/, 'day'],
    [/\b(?:h|hours?)\b/, 'hour'],
    [/\b(?:m|minutes?)\b/, 'minute'],
    [/\b(?:s|seconds?)\b/, 'second'],
    [/\b(?:ms|milliseconds?)\b/, 'milliseconds']
  ];


  for (const [regex, normalized] of unitRegexs) {
    if (regex.test(fmt)) {
      return normalized;
    }
  }

  return null;
}
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

## Constructing and serializing durations (JSON)

```js
const duration = moment.duration(10, "d")
duration.toJSON()
```

```ts
let duration = ({ days: 10 })
dateOrDuration2JSON(duration)
/* Helper function inserted by Grit: */
function dateOrDuration2JSON(d) {
  if (d instanceof Date) {
    return datefns.formatISO(d);
  } else if (durationfns.UNITS.some((unit) => Object.hasOwnProperty.call(d, unit))) {
    return durationfns.toJSON(d)
  }

  return d.toJSON()
}
```
