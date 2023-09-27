# Upgrade MUI v4 to MUI v5

This migration handles some of the cases not covered in the [official codemod](https://mui.com/material-ui/migration/migration-v4/):

- Renames `theme.palette.type` to `theme.palette.mode`

- Changes `ThemeProvider` import from `@mui/styles` to `@mui/material/styles`

- Changes default theme.palette.info colors from `cyan` to `lightBlue`
- Changes default theme.palette.info colors from `cyan[300]` to `lightBlue[500]`
- Changes default theme.palette.info colors from `cyan[500]` to `lightBlue[700]`
- Changes default theme.palette.info colors from `cyan[700]` to `lightBlue[900]`

tags: #react, #migration, #complex, #alpha, #hidden #mui

```grit
engine marzano(0.1)
language js

pattern rename_palette_type ($x) {
  `createTheme($theme)` where {
    $theme <: contains `palette: { $palette }`,
    $palette <: contains `type: $arg` => `mode: $arg`
  }
}

pattern replace_theme_provider_import ($x) {
   `ThemeProvider` as $target where {
    $target <: replace_import(old= `'@mui/styles'`, new=`'@mui/material/styles'`),
  }
}

pattern upgrade_info_palette ($x) {
    `main: $color[$value]` where {
          $color <: r"cyan" => `lightBlue`,
      or {
          $value <: `300` => `500`,
          $value <: `500` => `700`,
          $value <: `700` => `900`
      }
  }
}

or {
  rename_palette_type(),
  replace_theme_provider_import(),
  upgrade_info_palette()
}
```

## Rename palette type property to mode for palette

```js
const theme = createTheme({ palette: { type: 'dark' } });
```

```ts
const theme = createTheme({ palette: { mode: 'dark' } });
```

## Test when palette type value is light > MUI v4 to MUI v5

```js
const theme = createTheme({ palette: { type: 'light' } });
```

```ts
const theme = createTheme({ palette: { mode: 'light' } });
```

## Test when palette object is empty > MUI v4 to MUI v5

```js
const theme = createTheme({ palette: {} });
```

```ts
const theme = createTheme({ palette: {} });
```

## Test when palette object has multiple properties > MUI v4 to MUI v5

```js
const theme = createTheme({ palette: { type: 'dark', color: 'black' } });
```

```ts
const theme = createTheme({ palette: { mode: 'dark', color: 'black' } });
```

## Test when palette object mode is valid and has multiple properties > MUI v4 to MUI v5

```js
const theme = createTheme({ palette: { type: '', color: 'black' } });
```

```ts
const theme = createTheme({ palette: { mode: '', color: 'black' } });
```

## Test when theme object has multiple properties > MUI v4 to MUI v5

```js
const theme = createTheme({ color: 'black', palette: { type: 'dark' } });
```

```ts
const theme = createTheme({ color: 'black', palette: { mode: 'dark' } });
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



## Test when palette info color is `cyan[300]`: MUIv4 > MUIv5

```js
main: cyan[300];
```

```ts
main: lightBlue[500];
```

## Test when palette info color is `cyan[500]`: MUIv4 > MUIv5

```js
main: cyan[500];
```

```ts
main: lightBlue[700];
```

## Test when palette info color is `cyan[700]`: MUIv4 > MUIv5

```js
main: cyan[700];
```

```ts
main: lightBlue[900];
```

## Test when palette info color is `cyan[0]`: MUIv4 > MUIv5

```js
main: cyan[0];
```

```ts
main: cyan[0];
```

## Test when palette info color is `cyan[710]`: MUIv4 > MUIv5

```js
main: cyan[710];
```

```ts
main: cyan[710];
```

## Test when palette info color is empty: `cyan[]`; MUIv4 > MUIv5

```js
main: cyan[];
```

```ts
main: cyan[];