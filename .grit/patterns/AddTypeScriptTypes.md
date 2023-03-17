# Add TypeScript Types

Replace `$TSFixMe` or `any` types with an inferred type. This should primarily be used to fix up TypeScript type annotations auto-generated during migration.

<!-- **NOTE**: This file is not directly used yet. It's just here for reference.
Copy the actual pattern into ../workflows/js-to-ts.ts as well. -->

```grit
language js

or {
    ClassMethod(params=$params)
    FunctionDeclaration(params=$params)
} where {
    $params <: contains bubble {
        or {
            Identifier(name="$TSFixMe"),
            TSAnyKeyword() as $any
        } => guess(codePrefix="// add TypeScript type declarations", fallback="any", stop=["function"])
    }
}
```

## Simple Function Parameters

```grit
function getKey(userId: $TSFixMe) {
  return `some-key-${userId}`;
}

function somethingElse(num: any) {
    console.log(1 + num)
}
```

```grit
function getKey(userId: string) {
  return `some-key-${userId}`;
}
```

## Class Definitions

```js
class Foo {
  message = "";

  constructor(foo: any) {
    this.bar = 1;
    this.message = foo;
  }
}
```

```js
class Foo {
  message = "";

  constructor(foo: string) {
    this.bar = 1;
    this.message = foo;
  }
}
```
