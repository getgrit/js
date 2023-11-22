# Update React imports

This pattern:

- Removes imports of React that are unneeded
- Converts default imports if possible:
- If there are named imports, converts `import React from 'react'` into named imports `import { useState } from 'react'`
- If there are no named imports, but the `React` variable is used, converts `import React from 'react'` into `import * as React from "react"`

```grit
engine marzano(0.1)
language js
pattern my_remove_import($from) {
    $name where {
        // Handle named imports
        $program <: maybe contains bubble($name, $from) `import $clause from $raw_source` as $import where {
          $raw_source <: contains $from,
          $clause <: or {
            // Handle module import
            import_clause(default=$name) where {
                $import => .
            },
            // Handle named import
            import_clause(default=$default_export, name=named_imports($imports)) as $clause where {
                $others = `false`,
                if ($imports <: [$name]) {
                    if ($default_export <: .) {
                        $import => .
                    } else {
                        $clause => $default_export
                    }
                } else {
                    $imports <: some $name => .
                }
            },
            //Handle namespace import like import * as $name
            import_clause(name=namespace_import(namespace=$name)) where {
                $import => .
            },
          }
        }
    }
}
//unused
pattern gather_imported_symbols($res) {
    `React.$symbol` as $reactSymbol where {
      $res <: not some $reactSymbol,
      $reactSymbol => $symbol
    }
}


`import $import_clause from $source` as $import_line where {
    $import_clause <: contains `React` as $react where {
        $from = `react`,
        if (!$program <: contains `React.$_`) {
            $react <: my_remove_import($from)
        } else {
            if(!$import_clause <: contains `* as React`) {
                $react => `* as React`
            }
        }
    }
}
//or {
//    `React.$symbol` => $symbol,
//    import_statement(import=import_clause(name=namespace_import(namespace=`React`))) as $star_import where {
//        $star_import => .
//    },
//  `React` as $react where {
//      $from = `react`,
//      $react <: my_remove_import($from)
//  },
//  and {
//    $neededImports = [],
//  }
//}
```

## Test case: jsx-element

```javascript
import * as React from "react";

<div>Hi</div>;
```

```javascript
<div>Hi</div>
```

## Test case: jsx-fragment

```javascript
import * as React from "react";

<></>;
```

```javascript
<></>
```

## Test case: react-not-removed

```javascript
import React from "react";

React.createElement("div", {});

Promise.resolve(React);

<div>Hi</div>;
```

```javascript
import * as React from "react";

React.createElement("div", {});

Promise.resolve(React);

<div>Hi</div>;
```

## Test case: variable-already-used

```javascript
import * as React from "react";

React.createElement("div", {});

createElement("someFunction");

<div>Hi</div>;
```

## Test case: default-and-multiple-specifiers-import-react-variable

```javascript
import React, { createElement, useState } from "react";

React.createElement("div", {});

<div>Hi</div>;
```

```javascript
import { createElement, useState } from "react";
import * as React from "react";

React.createElement("div", {});

<div>Hi</div>;
```

## Test case: default-and-multiple-specifiers-import

```javascript
import React, { type Element, createElement, useState } from "react";

<div>Hi</div>;
```

```javascript
import type { Element } from "react";
import { createElement, useState } from "react";

<div>Hi</div>;
```

## Test case: leading-comment

```javascript
/**
 * Hello world.
 */

import * as React from "react";

<div></div>;
```

```javascript
/**
 * Hello world.
 */

<div></div>
```

## Test case: react-already-used-named-export

```javascript
import * as React from "react";

React.useState(false);
```

## Test case: react-basic-default-export-jsx-element-react-variable

```javascript
import React from "react";

React.createElement("div", {});

<div></div>;
```

```javascript
import { createElement } from "react";

createElement("div", {});

<div></div>;
```

## Test case: react-basic-default-export-jsx-element

```javascript
import React from "react";

<div></div>;
```

```javascript
<div></div>
```

## Test case: react-basic-default-export

```javascript
import React from "react";

React.createElement("div", "la");
```

```javascript
import { createElement } from "react";

createElement("div", "la");
```

## Test case: react-jsx-member-expression

```javascript
import React, { useState } from "react";

<React.Fragment />;
```

```javascript
import { Fragment, useState } from "react";

<Fragment />;
```

## Test case: react-type-default-export

```javascript
import type React from "react";
import * as React from "react";

<div>Hi</div>;
```

```javascript
import type React from "react";

<div>Hi</div>;
```

## Test case: react-type-not-removed

```javascript
import type React, { Node } from "react";
import * as React from "react";

<div>Hi</div>;
```

```javascript
import type React, { Node } from "react";

<div>Hi</div>;
```

## Test case: destructure-named-imports-react-not-removed

```javascript
import * as React from "react";

React.createElement("div", {});

Promise.resolve(React);

<div>Hi</div>;
```

## Test case: destructure-named-imports-variable-used

```javascript
import * as React from "react";
import { createElement } from "react";

React.createElement("div", {});

<div>Hi</div>;
```

## Test case: destructure-named-imports

```javascript
import * as React from "react";

React.useState(false);

<div />;
```

```javascript
import { useState } from "react";

useState(false);

<div />;
```
