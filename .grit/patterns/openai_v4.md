---
title: Pattern Name
---
# {{ page.title }}

Pattern Description

tags: #JS

```grit
engine marzano(0.1)
language js

// Rewrite the constructor
`new $constructor($params)` where {
    $constructor <: `OpenAIApi` => `OpenAI`,
    $params <: [$config],
    $program <: contains or {
        `const $config = new Configuration($details)`,
        `let $config = new Configuration($details)`,
        `var $config = new Configuration($details)`
    } => .,
    $params => `$details`
}
```

## grit/example.js

```js
// Old
import { Configuration, OpenAIApi } from "openai";

const bob = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(bob);

// New
import OpenAI from 'openai';

const openAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});
```
```js
// Old
import { Configuration, OpenAIApi } from "openai";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// New
import OpenAI from 'openai';

const openAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});
```


