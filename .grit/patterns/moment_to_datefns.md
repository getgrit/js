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

now = datefns.add({ [normalizeMomentJSUnit(unit) + 's']: 10 })
now = datefns.sub({ [normalizeMomentJSUnit(unit) + 's']: (then instanceof Date) ? datefns.getDay(then) : (then.days ?? 0) })
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
    [/\b(?:ms|millisecond?)\b/, 'millisecond']
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
moment().endOf('y')
console.log(moment().startOf('s'))
```

```ts
date = datefns.setWeek(date, datefns.startOfWeek(date))
date = datefns.setWeek(date, datefns.startOfWeek(date))
date = datefns.setSeconds(date, datefns.endOfSecond(date));
/* TODO: date-fns objects are immutable, propagate this value appropriately */
((date) => datefns.setYear(date, datefns.endOfYear(date)))(new Date());
console.log(((date) => datefns.setSeconds(date, datefns.startOfSecond(date)))(new Date()))
```

## Constructing and serializing durations (JSON)

```js
const duration = moment.duration(10, "d")
duration.toJSON()
```

```ts
let duration = ({ days: 10 })
dateOrDuration2JSON(duration)
/* Helper function inserted by Grit */
function dateOrDuration2JSON(d) {
  if (d instanceof Date) {
    return datefns.formatISO(d);
  } else if (durationfns.UNITS.some((unit) => Object.hasOwnProperty.call(d, unit))) {
    return durationfns.toJSON(d)
  }

  return d.toJSON()
}
```

## Get + Set

```js
const a = moment()
const b = moment()
a.seconds(30).valueOf() === new Date().setSeconds(30);
b.seconds() === new Date().getSeconds();

moment().date(10)

function f() {
  return moment()
}
f().days(a.days())
```


```ts
let a = new Date()
let b = new Date();
(a instanceof Date ? (a = a.setSeconds(30)) : (a.seconds = 30)).valueOf() === new Date().setSeconds(30);
(b instanceof Date ? datefns.getSeconds(b) : (b.seconds ?? 0)) === new Date().getSeconds()

/*TODO: date-fns objects are immutable, feed this value back through properly*/
datefns.setMonth(new Date(), 10)

function f() {
  return new Date()
}
/* TODO: moment-js objects are mutable - feed this value through appropriately */
((d, val) => (d instanceof Date ? d.setDay(val) : (d.days = val)))(f(), (a instanceof Date ? datefns.getDay(a) : (a.days ?? 0)))
```

## Miscellaneous methods

```js
const date = moment()

console.log(date.toJSON())
console.log(date.clone())

const duration = moment.duration(10, "d")
const humanized = duration.humanize()
```

```ts
let date = new Date()

console.log(dateOrDuration2JSON(date))
console.log(((date instanceof Date) ? new Date(date.getTime()) : structuredClone(date)))

let duration = { days: 10 };
const humanized = datefns.formatDuration(duration)
/* Helper function inserted by Grit */
function dateOrDuration2JSON(d) {
  if (d instanceof Date) {
    return datefns.formatISO(d)
  } else if (durationfns.UNITS.some((unit) => Object.hasOwnProperty.call(d, unit))) {
    return durationfns.toJSON(d)
  }

  return d.toJSON();
}
```
