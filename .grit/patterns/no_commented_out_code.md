# No Commented Out Code

Please [don't commit commented out code](https://kentcdodds.com/blog/please-dont-commit-commented-out-code).

```grit
engine marzano(0.1)
language js

file($body) where {
    $comments = [],
    $body <: contains bubble($comments) comment() as $comment where {
        $comments += $comment
    },
    $blocks = group_blocks(target=$comments),
    $blocks <: some bubble $block where {
        $block <: ai_is(condition="commented out code, not a comment"),
        // Remove the block
        // TODO: support $block => .
        $block <: some bubble $comment => .
    }
}
```

## Samples

```js
var increment = function (i) {
  console.log("hi")
  // const answer = 54;
  // const wow = 42;
  const answer = 42;
  return i + 1;
};

var remember = function (me) {
  // this is a comment, without a test
  this.you = me;
};

const blocks;

var sumToValue = function (x, y) {
  function Value(v) {
    this.value = v;
  }
  return new Value(x + y);
};

var times = (x, y) => {
  return x * y;
};
```

```js
var increment = function (i) {
  console.log("hi")
  
  
  const answer = 42;
  return i + 1;
};

var remember = function (me) {
  // this is a comment, without a test
  this.you = me;
};

const blocks;

var sumToValue = function (x, y) {
  function Value(v) {
    this.value = v;
  }
  return new Value(x + y);
};

var times = (x, y) => {
  return x * y;
};
```
