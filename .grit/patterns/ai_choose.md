# Ask an AI

GritQL includes built-in support for querying an AI to answer questions in patterns via the `ai_choose` function.

For example, you can use the `ai_choose` function to choose a name for a function.

```grit
`function $name($_) { $_}` as $func where {
  $name <: . => ai_ask(choices=["adder", "remover", "divider"], question="What should I name this function? $func")
}
```

## Solve a basic case

```js
function (x) { return x + 1 }
```

```ts
function adder(x) {
  return x + 1;
}
```

## Divide too

```js
function (x) { return x / 2 }
```

```ts
function divider(x) {
  return x / 2;
}
```
