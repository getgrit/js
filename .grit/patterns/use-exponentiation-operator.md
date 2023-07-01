---
title: Rewrite `Math.pow` ⇒ `**`
---

# {{ page.title }}

ES7 introduced the exponentiation operator `**` so that using `Math.pow` is no longer necessary.

tags: #ES7, #SE

```grit
engine marzano(0.1)
language js

`Math.pow($base, $exponent)` as $expression where {
    $args = [],
    if (! $base <: number()) {
        $args += `($base)`
    } else {
        $args += $base
    },
    if (! $exponent <: number()) {
        $args += `($exponent)`
    } else {
        $args += $exponent
    },
    $separator = ` ** `,
    $newExpression = join(list = $args, $separator),
    $expression => `$newExpression`
}
```

## Transforms Math.pow to exponentiation operator

```javascript
var a = Math.pow(0, 1);
var a = Math.pow(0, b - 1);
var a = Math.pow(b + 1, b - 1);
var a = Math.pow(b + 1, 1);
```

```typescript
var a = 0 ** 1;
var a = 0 ** (b - 1);
var a = (b + 1) ** (b - 1);
var a = (b + 1) ** 1;
```
