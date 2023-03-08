# Prefer early returns

```
language js

[
    `let $var`,
    SwitchStatement(cases=$cases, discriminant=$disc)
] => `const $var = $func($disc)` where {
    // note how the name for this is not present in the original, but the LLM guesses it effectively
    $input = guess(hint="Input name", fallback="input")
    $tests = []
    // TODO: we need `all` not `some` (use case for map?)
    $cases <: some bubble($tests) SwitchCase(test=$test, consequent=$dec) where {
        $return = `null`
        $exp = []
        $dec <: some bubble($exp, $return, $var) $x where {
            $x <: not BreakStatement()
            if ($x <: `$var = $val`) {
                $return = $val
            } else {
                $exp = [...$exp, $x]
            }
        }
        $tests = [...$tests, `if ($input === $test) { $exp; return $return; }`]
    }
    $func = `($input) => {
        $tests
        return nice;
    }`
}
```
