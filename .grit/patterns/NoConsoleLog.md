---
title: Remove `console.log`
---

# {{ page.title }}

Remove `console.log` statements.

tags: #good

```grit
`console.log($arg)` => . where {
  $arg <: not within CatchClause()
}
```

## Removes the statement simple

```javascript
console.log("foo");
```

```

```

## Removes the statement in a function

```javascript
function f() {
  console.log("foo");
}
```

```typescript
function f() {}
```

## Works in a list as well

```javascript
server.listen(PORT, console.log(`Server started on port ${PORT}`));
```

```typescript
server.listen(PORT);
```

## Doesn't remove it in the catch clause

```javascript
try {
} catch (e) {
  console.log("foo");
}
```
