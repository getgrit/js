---
title: Convert AWS Lambda Functions to Fermyon Spin
---

This pattern converts a serverless function to a spin function designed to run on [Fermyon](https://www.fermyon.com/).

tags: #js, #migration, #serverless, #fermyon, #alpha

```grit
engine marzano(0.1)
language js

predicate insert_statement($statement) {
    $program <: or {
        contains `"use strict"` as $old => `$old\n\n$statement`,
        $program => js"$statement\n\n$program"
    }
}

pattern encode() {
    $old => js"encoder.encode($old).buffer"
}

pattern spin_fix_response() {
     or {
         object($properties) where {
            $properties <: contains bubble {
                pair($key, $value) where {
                    $key <: "body",
                    $value <: $old => js"encoder.encode($old).buffer"
                }
            },
            $properties <: contains bubble {
                pair($key, $value) where {
                    $key <: "statusCode",
                    $key => js"status"
                }
            },
        },
        object() as $obj where { $obj <: encode() }
    } where {
        insert_statement(statement=js"const encoder = new TextEncoder('utf-8');")
    }
}

pattern spin_fix_request($request) {
    `$request.$prop` => `JSON.parse(decoder.decode($request)).$prop` where {
        insert_statement(statement=js"const decoder = new TextDecoder('utf-8')")
    }
}

pattern spin_main_fix_handler() {
  js"module.exports.$_ = ($args) => { $body }" as $func where {
        $request = `request`,
        $args <: or { [$event], [$event, $context, $callback] },
        $body <: contains or {
            `return $response`,
            `callback(null, $response)` => `return $response`
        } where {
            $response <: or {
                spin_fix_response(),
                identifier() where { $body <: contains `$response = $def` where $def <: spin_fix_response() }
            }
        },
        $event => `request`,
        $body <: contains $event => `request`
    } => js"export async function handleRequest($event) {
        $body
    }"
}

pattern spin_main_fix_request() {
    `function handleRequest($request) { $body }` where {
        $body <: contains spin_fix_request(request=`request`)
    }
}


sequential {
    contains spin_main_fix_handler(),
    maybe contains spin_main_fix_request()
}
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
      2,
    ),
  };
};
```

```js
const encoder = new TextEncoder('utf-8');

export async function handleRequest(request) {
  return {
    status: 200,
    body: encoder.encode(
      JSON.stringify(
        {
          message: 'Go Serverless v3.0! Your function executed successfully!',
          input: request,
        },
        null,
        2,
      ),
    ).buffer,
  };
}
```

## With inputs

This example is based on [serverless example](https://github.com/custodian-sample-org/serverless-examples/blob/v3/aws-node-alexa-skill/handler.js).

```
'use strict';

// Returns a random integer between min (inclusive) and max (inclusive)
const getRandomInt = (min, max) => Math.floor(Math.random() * ((max - min) + 1)) + min;

module.exports.luckyNumber = (event, context, callback) => {
  const upperLimit = event.request.intent.slots.UpperLimit.value || 100;
  const number = getRandomInt(0, upperLimit);
  const response = {
    version: '1.0',
    response: {
      outputSpeech: {
        type: 'PlainText',
        text: `Your lucky number is ${number}`,
      },
      shouldEndSession: false,
    },
  };

  callback(null, response);
};
```

```
"use strict";

const decoder = new TextDecoder("utf-8");

const encoder = new TextEncoder("utf-8");

// Returns a random integer between min (inclusive) and max (inclusive)
const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export async function handleRequest(request) {
  const upperLimit =
    JSON.parse(decoder.decode(request)).request.intent.slots.UpperLimit.value ||
    100;
  const number = getRandomInt(0, upperLimit);
  const response = encoder.encode({
    version: "1.0",
    response: {
      outputSpeech: {
        type: "PlainText",
        text: `Your lucky number is ${number}`,
      },
      shouldEndSession: false,
    },
  }).buffer;

  return response;
}
```
