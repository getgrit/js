---
title: Rewrite `Material UI` ⇒ `Tailwind Styles`
---

# {{ page.title }}

tags: #React, #MaterualUI, #mui, #Tailwind

```grit
language js

pattern ReactNode($name, $props, $children) {
  or {
    `<$name $props>$children</$name>`,
    `<$name $props />`
  }
}

pattern HTMLProp($name, $value) {
  or {
    `$name="$value"`,
    `$name`
  }
}

pattern ReplaceProps($props) {
    // $props => join(" ", ['class="', ...$acc, '"']) where {
    // $props => $acc where {
    $props => `class="$acc"` where {
        $props <: contains bubble($acc) and {
            HTMLProp($name, $value),
            // $name <: not within {'disabled', 'href'},
            $acc = [...$acc, $name]
        }
    }
}

// IsImported(`Button`, `'@mui/material'`)
ReactNode(`Button` => `button`, ReplaceProps($prop), $_) // where {
//     $button <: semantic within `import $button from '@mui/material/Button'`
// }

```

This example below is just for reference

```javascript
import * as React from 'react';
import Button from '@mui/material/Button';

export default function MyApp() {
  Button(a)
  return (
    <div>
      <Button variant="contained" color="error" href="#text-buttons" disabled>Hello World</Button>
    </div>
  );
}
```

```javascript
import * as React from 'react';

export default function MyApp() {
  Button(a)
  return (
    <div>
      <button class="bg-error text-white px-4 py-2 rounded shadow opacity-50 cursor-not-allowed" href="#text-buttons" disabled>Hello World</button>
    </div>
  );
}
```
