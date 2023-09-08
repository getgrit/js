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
    or {
        `const { $props } = new Mux($params)` => `const mux = new Mux($params)` where and {
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
            },
        },
        `const { $props } = new Mux()` => `const mux = new Mux()`,
    }

}

pattern as_lower_camel_case($formatted) {
    r"([A-Z])([a-zA-Z]*)"($first_char, $rest) where {
        $first_char = lowercase(string = $first_char),
        $formatted = join(list = [$first_char, $rest], separator = ""),
    }
}

pattern change_destructured_property_call() {
    `$prop.$field.$action` => `mux.$prop.$field.$action` where {
        $program <: contains or {
            `const { $props } = new Mux()`,
            `const { $props } = new Mux($_)`
        } where {
            $props <: contains $prop where {
                $formatted = ``,
                $prop <: as_lower_camel_case($formatted) where {
                    $prop => `$formatted`
                },
                $field <: as_lower_camel_case($formatted) where {
                    $field => `$formatted`
                },
                $prop <: maybe `Video` where or {
                    $field <: `Assets`,
                    $field <: `DeliveryUsage`,
                    $field <: `LiveStreams`,
                    $field <: `PlaybackIDs`,
                    $field <: `PlaybackRestrictions`,
                    $field <: `Spaces`,
                    $field <: `TranscriptionVocabularies`,
                    $field <: `Uploads`,
                } where {
                    $action <: `get` where {
                        $action => `retrieve`,
                    }
                }
            }
        }
    }
}

pattern replace_verify_headers() {
    or {
        `Mux.Webhooks.verifyHeader($body, $headers['mux-signature'], $secret)` => `Mux.Webhooks.prototype.verifySignature(Buffer.isBuffer($body) ? $body.toString('utf8') : $body, $headers, $secret)`,
        `Mux.Webhooks.verifyHeader($body, $headers['mux-signature'] as $_, $secret)` => `Mux.Webhooks.prototype.verifySignature(Buffer.isBuffer($body) ? $body.toString('utf8') : $body, $headers, $secret)`,
    }
}

sequential {
    maybe es6_imports(),
    maybe change_destructured_property_call(),
    maybe change_constructors(),
    maybe replace_verify_headers(),
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

const usage = await Video.LiveStreams.create({});
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

const usage = await mux.video.liveStreams.create({});
```

# No import fixes

```js
const { Video, Data } = new Mux();
```

```ts
const mux = new Mux();
```

# Fix assets get

```js
const { Video, Data } = new Mux();

const asset = await Video.Assets.get(req.query.id as string);
const upload = await Video.Uploads.get(req.query.id as string);
```

```ts
const mux = new Mux();

const asset = await mux.video.assets.retrieve(req.query.id as string);
const upload = await mux.video.uploads.retrieve(req.query.id as string);
```

# Replace verifyHeader with verifySignature

```ts
Mux.Webhooks.verifyHeader(rawBody, req.headers['mux-signature'] as string, webhookSignatureSecret);
```

```ts
Mux.Webhooks.prototype.verifySignature(
  Buffer.isBuffer(rawBody) ? rawBody.toString('utf8') : rawBody,
  req.headers,
  webhookSignatureSecret,
);
```
