---
title: Upgrade MUI Theme Provider from v4 to v5
---

This migration handles the importing of Theme Provider from `@mui/styles` to `@mui/material/styles` as specified in the MUI documentation for switching from v4 to v5.

- Changes import from `@mui/styles` to `@mui/material/styles`

tags: #react, #migration, #complex #mui

```grit
engine marzano(0.1)
language js

 `ThemeProvider` as $target where {
    $target <: replace_import(old= `'@mui/styles'`, new=`'@mui/material/styles'`),
  }
```

## Test when ThemeProvider is imported from `@mui/styles`: MUIv4 > MUIv5

```js
import { ThemeProvider } from '@mui/styles';
import { color } from '@mui/styles/color';
import { theme } from '@mui/styles/theme';
```

```ts
import { ThemeProvider } from '@mui/material/styles';

import { color } from '@mui/styles/color';
import { theme } from '@mui/styles/theme';
```

## Test when there are multiple packages imported from `@mui/styles`: MUIv4 > MUIv5

```js
import { ThemeProvider, styles } from '@mui/styles';
```

```ts
import { ThemeProvider } from '@mui/material/styles';

import { styles } from '@mui/styles';
```

## Test when ThemeProvider is already imported from `@mui/material/styles`: MUIv4 > MUIv5

```js
import { ThemeProvider, styles } from '@mui/material/styles';
```

```ts
import { ThemeProvider, styles } from '@mui/material/styles';
```

## Test when no package is imported MUIv5 `@mui/styles`: MUIv4 > MUIv5

```js
import {} from '@mui/material/styles';
```

```ts
import {} from '@mui/material/styles';
```
