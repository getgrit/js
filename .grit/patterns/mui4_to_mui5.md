## title: Convert Rename theme.palette.type In MUI v4 To MUI v5

This pattern Rename theme.palette.type in MUI v4 to MUI v5

tags: #react, #migration, #complex

```grit
engine marzano(0.1)
language js

// Most of the logic for this pattern is in mui4_to_mui5.grit
// https://github.com/getgrit/js/blob/main/.grit/patterns/mui4_to_mui5.grit

`createTheme({ palette: { type: $arg } })` => `createTheme({ palette: { mode: $arg } })` where {
  $arg <: within `palette: { $_ }`
}
```

## Replace Rename theme.palette.type in MUI v4 to MUI v5

```js
const theme = createTheme({ palette: { type: 'dark' } });
```

```ts
const theme = createTheme({ palette: { mode: 'dark' } });
```
