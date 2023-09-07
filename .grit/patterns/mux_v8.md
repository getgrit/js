---
title: Upgrade Mux SDK to v8
---

Upgrade the Mux SDK to v8

tags: #js, #ts, #npm, #upgrade, #mux, #migration

```grit
engine marzano(0.1)
language js

pattern convert_config() {
    object($properties) => $properties where {
        $properties <: contains bubble pair($key, $value) where or {
            $key <: `baseUrl` => js"'baseURL'",
            $key <: `platform` => js"'fetch'" where {
                $name = raw``,
                $version = raw``,
                $value <: contains bubble($name, $version) pair($key, $value) where or {
                    $key <: `name` where {
                        $value <: maybe string(fragment = $val) where {
                            $name = $val
                        }
                    },
                    $key <: `version` where {
                        $value <: maybe string(fragment = $val) where  {
                            $version = $val
                        }
                    }
                },
                $value => `(url, opts) => {
                    let opts = opts ?? { headers: {} };

                    opts.headers['x-source-platform'] = '$name | $version';

                    return fetch(url, opts)
                }`
            }
        },
    }
}

pattern change_constructors() {
    `const $props = new Mux($params)` => `const mux = new Mux($params)` where and {
        $params <: or {
            [$tokenId, $tokenSecret, $config] where {
                $config <: convert_config() as $parsed_config where {
                    $params => `{
                        tokenId: $tokenId,
                        tokenSecret: $tokenSecret,
                        $parsed_config
                    }`
                }
            },
            [$tokenId, $tokenSecret] => `{
                tokenId: $tokenId,
                tokenSecret: $tokenSecret,
            }`,
            convert_config() as $config => $config,
            . => .
        },
    },
}

pattern change_destructured_property_call() {
    `$prop.$field.$action` => `mux.$prop.$field.$action` where {
        $program <: contains or {
            `const { $props } = new Mux()`,
            `const { $props } = new Mux($_)`
        } where {
            $props <: contains $prop where {
                $low_prop = lowercase(string = $prop),
                $low_field = lowercase(string = $field),
                $prop => `$low_prop`,
                $field => `$low_field`,
            }
        }
    }
}

sequential {
    es6_imports(),
    maybe change_destructured_property_call(),
    maybe change_constructors(),
}

```

## Creating Mux instance

```js
const Mux = require('@mux/mux-node');

const { Video, Data } = new Mux({
  baseUrl: 'test.com',
  platform: {
    name: 'Test',
    version: '0.0.1',
  },
});

const { Video, Data } = new Mux(accessToken, secret);

const { Video, Data } = new Mux();

const { Video, Data } = new Mux(accessToken, secret, {
  baseUrl: 'test.com',
  platform: {
    name: 'Test',
    version: '0.0.1',
  },
});
```

```ts
import Mux from '@mux/mux-node';

const mux = new Mux({
  baseURL: 'test.com',
  fetch: (url, opts) => {
    let opts = opts ?? { headers: {} };

    opts.headers['x-source-platform'] = 'Test | 0.0.1';

    return fetch(url, opts);
  },
});

const mux = new Mux({
  tokenId: accessToken,
  tokenSecret: secret,
});

const mux = new Mux();

const mux = new Mux({
  tokenId: accessToken,
  tokenSecret: secret,
  baseURL: 'test.com',
  fetch: (url, opts) => {
    let opts = opts ?? { headers: {} };

    opts.headers['x-source-platform'] = 'Test | 0.0.1';

    return fetch(url, opts);
  },
});
```

# Replace destructured properties with field access

```js
const Mux = require('@mux/mux-node');

const { Video, Data } = new Mux();

const upload = await Video.Uploads.create({
  new_asset_settings: { playback_policy: 'public' },
  cors_origin: '*',
});

const breakdown = await Data.Metrics.breakdown('aggregate_startup_time', {
  group_by: 'browser',
});
```

```ts
import Mux from '@mux/mux-node';

const mux = new Mux();

const upload = await mux.video.uploads.create({
  new_asset_settings: { playback_policy: 'public' },
  cors_origin: '*',
});

const breakdown = await mux.data.metrics.breakdown('aggregate_startup_time', {
  group_by: 'browser',
});
```
