# Fix types on AWS Lambda

See https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html

```
language js

or {
    `const $handler = ($event, $context, $callback) => { $body }`
} where {
    $handler => `$handler: Handler`
    $event <: or {`event: any` => `event`, `event`}
    $context <: or {`context: any` => `event`, `event`}
    $callback <: or {`callback: any` => `event`, `event`}
    ensureImportFrom(`Handler`, `aws-lambda`)
}
```
