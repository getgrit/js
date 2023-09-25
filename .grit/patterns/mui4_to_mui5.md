## title: Convert Rename theme.palette.type In MUI v4 To MUI v5

This pattern Rename theme.palette.type in MUI v4 to MUI v5

tags: #react, #migration, #complex

```grit
engine marzano(0.1)
language js

`createTheme($theme)` where {
  $theme <: contains `palette: { $palette }`,
  $palette <: contains `type: $arg` => `mode: $arg`
}
```

## Replace Rename theme.palette.type in MUI v4 to MUI v5

```js
const theme = createTheme({ palette: { type: 'dark' } });
```

```ts
const theme = createTheme({ palette: { mode: 'dark' } });
```


```js
const theme = createTheme({ palette: { type: 'light' } });
```

```ts
const theme = createTheme({ palette: { mode: 'light' } });
```


```js
const theme = createTheme({ palette: { } });
```

```ts
const theme = createTheme({ palette: { } });
```


```js
const theme = createTheme({ palette: { type: 'dark', color: 'black' } });
```

```ts
const theme = createTheme({ palette: { mode: 'dark', color: 'black' } });
```

```js
const theme = createTheme({ palette: { type: '', color: 'black' } });
```

```ts
const theme = createTheme({ palette: { mode: '', color: 'black' } });
```

```js
const theme = createTheme({ palette: { type: '', color: 'black' } });
```

```ts
const theme = createTheme({ palette: { mode: '', color: 'black' } });
```

```js
const theme = createTheme({ color: 'black', palette: { } });
```

```ts
const theme = createTheme({ color: 'black', palette: { }});
```

```js
const theme = createTheme({ color: 'black', palette: { type: 'dark' } });
```

```ts
const theme = createTheme({ color: 'black', palette: { mode: 'dark' } });
```
