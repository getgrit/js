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
    // Re-write all `const` declarations that initialize a moment object to `let`.
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

now = addDate(now, { days: 10 })
then = subDate(then, { years: 12 })
now = subDate(now, { milliseconds: 10 }) 

foo((now = subDate(now, { months: 12 })))

function addDate(dateOrDuration, duration) {
  if (dateOrDuration instanceof Date) {
    return add(dateOrDuration, duration)
  }
  return durationfns.sum(dateOrDuration, duration)
}

function subDate(dateOrDuration, duration) {
  if (dateOrDuration instanceof Date) {
    return sub(dateOrDuration, duration)
  }
  return durationfns.subtract(dateOrDuration, duration)
}
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

now = addDate(now, { [normalizeMomentJSUnit(unit) + 's']: 10 })
now = subDate(now, { [normalizeMomentJSUnit(unit) + 's']: (then instanceof Date) ? datefns.getDay(then) : (then.days ?? 0) })

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

function addDate(dateOrDuration, duration) {
  if (dateOrDuration instanceof Date) {
    return add(dateOrDuration, duration)
  }
  return durationfns.sum(dateOrDuration, duration)
}

function subDate(dateOrDuration, duration) {
  if (dateOrDuration instanceof Date) {
    return sub(dateOrDuration, duration)
  }
  return durationfns.subtract(dateOrDuration, duration)
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

function dateOrDuration2JSON(d) {
  if (d instanceof Date) {
    return datefns.formatISO(d);
  } else if (durationfns.UNITS.some((unit) => Object.hasOwnProperty.call(d, unit))) {
    return durationfns.toJSON(d)
  }

  return d.toJSON()
}
```

## Getters + Setters

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
((d, val) => (d instanceof Date ? d.setDay(val) : (d.days = val)))
  (f(), (a instanceof Date ? datefns.getDay(a) : (a.days ?? 0)))
```

## Get/Set when specifier is a literal

```js
const d = moment();
d.get('yeaRs')
d.set('M', d.get('y'))
d.get('ms')
```

```ts
let d = new Date();
d instanceof Date ? datefns.getYear(d) : d.years ?? 0;
d = datefns.setMonth(d, d instanceof Date ? datefns.getYear(d) : d.years ?? 0);
d instanceof Date ? datefns.getMilliseconds(d) : d.milliseconds ?? 0;
```

## Get/Set when specifier is a non-literal

```js
const date = moment()
const unit = Math.random() > 0.5 ? "year" : "month"
date.get(unit)
date.set(unit, 10)
moment.normalizeUnits("m")
```

```ts
let date = new Date() 
const unit = Math.random() > 0.5 ? "year" : "month"
getUnitFromDate(date, unit)
setUnitOnDate(date, unit, 10)
normalizeMomentJSUnit("m")

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

function setUnitOnDate(date, unit, value) {
  unit = normalizeMomentJSUnit(unit);
  if (date instanceof Date) {
    switch (unit) {
      case 'year':
        date.setFullYear(value);
        break;
      case 'quarter': {
        const month = datefns.getMonth(datefns.setQuarter(date, value));
        date.setMonth(month);
        break;
      }
      case 'month':
        date.setMonth(value);
        break;
      case 'week': {
        const newDate = datefns.setWeek(date, value);
        date.setDate(newDate.getDate());
        date.setMonth(newDate.getMonth());
        break;
      }
      case 'day':
        date.setDate(value);
        break;
      case 'hour':
        date.setHours(value);
        break;
      case 'minute':
        date.setMinutes(value);
        break;
      case 'second':
        date.setSeconds(value);
        break;
      case 'millisecond':
        date.setMilliseconds(value);
        break;
      default:
        return date;
    }
  } else {
    // duration object
    date[unit + "s"] = value
  }

  return date;
}

function getUnitFromDate(date, unit) {
  unit = normalizeMomentJSUnit(unit);
  if (date instanceof Date) {
    switch (unit) {
      case 'year':
        return date.getFullYear();
      case 'quarter':
        return datefns.getQuarter(date);
      case 'month':
        return date.getMonth();
      case 'week':
        return datefns.getWeek(date);
      case 'day':
        return date.getDate();
      case 'hour':
        return date.getHours();
      case 'minute':
        return date.getMinutes();
      case 'second':
        return date.getSeconds();
      case 'millisecond':
        return date.getMilliseconds();
      default:
        return 0;
    }
  }

  return date[unit + "s"]
}
```

## Miscellaneous methods

```js
const date = moment()

console.log(date.toJSON())
console.log(date.clone())

const duration = moment.duration(10, "d")
const humanized = duration.humanize()
console.log(isValid(date))
date.toObject()
```

```ts
let date = new Date()

console.log(dateOrDuration2JSON(date))
console.log(((date instanceof Date) ? new Date(date.getTime()) : structuredClone(date)))

let duration = { days: 10 };
const humanized = datefns.formatDuration(duration)
console.log(datefns.isValid(date));
((d => ({
  years: d.getFullYear(),
  months: d.getMonth(),
  date: d.getDate(),
  hours: d.getHours(),
  minutes: d.getMinutes(),
  seconds: d.getSeconds(),
  milliseconds: d.getMilliseconds(),
}))(date))

function dateOrDuration2JSON(d) {
  if (d instanceof Date) {
    return datefns.formatISO(d)
  } else if (durationfns.UNITS.some((unit) => Object.hasOwnProperty.call(d, unit))) {
    return durationfns.toJSON(d)
  }

  return d.toJSON();
}
```

## Stateful display methods

These methods have no direct equivalent in date-fns and should not be migrated.

```js
const date = moment()
date.utc()
```

```ts
let date = new Date()
/* (Moment#utc) is not supported in date-fns. Prefer using local state when displaying dates */ date;
```
