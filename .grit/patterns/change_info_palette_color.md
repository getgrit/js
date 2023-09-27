---
title: Change default theme.palette.info colors for MUI v4 to v5
---

This migration handles the changing of the default theme.palette.info colors from `cyan` to `lightBlue` for `300`, `500` and `700` as specified in the MUI documentation for switching from v4 to v5.

- Changes default theme.palette.info colors from `cyan` to `lightBlue`
- Changes default theme.palette.info colors from `cyan[300]` to `lightBlue[500]`
- Changes default theme.palette.info colors from `cyan[500]` to `lightBlue[700]`
- Changes default theme.palette.info colors from `cyan[700]` to `lightBlue[900]`

tags: #react, #migration, #complex #mui

```grit
engine marzano(0.1)
language js

 `main: $color[$value]` where {
        $color <: r"cyan" => `lightBlue`,
    or {
        $value <: `300` => `500`,
        $value <: `500` => `700`,
        $value <: `700` => `900`
    }
}
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
```