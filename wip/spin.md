---
title: Pattern Name
---
# {{ page.title }}

Pattern Description

tags: #JS

```grit
engine marzano(0.1)
language js

pattern fix_response() {
     object($properties) where {
        $properties <: contains bubble {
            pair($key, $value) where {
                $key <: "body",
                $value <: maybe js"JSON.stringify($data)" => `encoder.encode($data).buffer` where { $program => js"const encoder = new TextEncoder('utf-8');\n\n$program"}
            }
        },
        $properties <: contains bubble {
            pair($key, $value) where {
                $key <: "statusCode",
                $key => js"status"
            }
        },
    }
}

or {
    js"module.exports.$_ = ($args) => { $body }"
    //     \`module.exports.$name = $handler\` => \`export async function handleRequest(request) { $handler }\` where $handler <: not arrow_function(),
//     \`export const $_ = ($event) => { $response };\` => \`export async function handleRequest($event) { $response }\`,
//     export_statement($declaration) where $declaration <: contains object() as $response where {$response <: contains \`status\`, $response <: contains \`body\`}
} where {
    $body <: maybe contains `return $response` where $response <: fix_response(),
    $args <: [$event],
    $event => `request`,
    $body <: contains $event => `request`
} => js"export async function handleRequest($event) {
    $body
}"
```

## grit/example.js

```js
module.exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v3.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };
};
```
```js
const encoder = new TextEncoder('utf-8');

export async function handleRequest(request) {
    return {
    status: 200,
    body: encoder.encode({
        message: 'Go Serverless v3.0! Your function executed successfully!',
        input: request,
      },
      null,
      2).buffer,
  };
};
```


