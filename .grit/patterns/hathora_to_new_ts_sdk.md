# Upgrade Hathora to Dedicated TS SDK

```grit
engine marzano(0.1)
language js

// some functions have changed names to reflect deprecation.
// XXX not all of them, eg lobby v2 `createLocalLobby` is deprecated,
// but not renamed.
function deprecated_suffix($method) {
  if ($method <: or {
    `createPrivateLobby`,
    `createPublicLobby`,
    `listActivePublicLobbies`,
    `createRoom`,
    `destroyRoom`,
    `getActiveRoomsForProcess`,
    `getConnectionInfo`,
    `getInactiveRoomsForProcess`,
    `getRoomInfo`,
    `suspendRoom`
    }) {
    return `Deprecated`
  },
  return ``
}

// TODO the rest of the unwrappings
function wrapper_key($method) {
  if ($method <: or {`loginAnonymous`, `loginGoogle`, `loginNickName`}) {
    return `loginResponse`,
  } else if ($method <: or {`getLobbyInfo`, `setLobbyState`}) {
    return `lobby`,
  } else if ($method <: or {`createApp`, `getAppInfo`, `updateApp`}) {
    return `application`,
  } else if ($method <: or {`getApps`}) {
    return `applicationWithDeployments`,
  } else if ($method <: `getBalance`) {
    return `getBalance200ApplicationJSONDoubleNumber`,
  } else if ($method <: `getInvoices`) {
    return `invoicesResponse`,
  } else if ($method <: `getPaymentMethod`) {
    return `paymentMethod`,
  } else if ($method <: `initStripeCustomerPortalUrl`) {
    return `initStripeCustomerPortalUrl200ApplicationJSONString`
  } else if ($method <: or {`createBuild`, `getBuildInfo`}) {
    return `build`
  } else if ($method <: or {`getBuilds`}) {
    return `builds`
  } else if ($method <: or {`runBuild`}) {
    return `runBuild200TextPlainByteString`
  } else if ($method <: or {`createDeployment`, `getDeploymentInfo`}) {
    return `deployment`
  } else if ($method <: or {`getDeployments`}) {
    return `deployments`
  } else if ($method <: `getPingServiceEndpoints`) {
    return `discoveryResponse`
  } else if ($method <: `createPrivateLobby`) {
    return `roomid`
  } ,
  return ``,
}

// many request funs have a different arg order, usually shifting the request to the beginning,
// so we need to rearrange $args
// TODO: the rest of the functions
function reorder_args($method, $args) {
  if ($method <: `setLobbyState`) {
    // TODO how do we match and use rest-of-args without so much copypasta?
    if ($args <: [$app_id, $room_id, $req, $opts]) {
      $use_args = join(list=[$req, $app_id, $room_id, $opts], separator=", ")
    } else if ($args <: [$app_id, $room_id, $req]) {
      $use_args = join(list=[$req, $room_id, $app_id], separator=", ")
    } else {
      $use_args = $args
    }
  } else if ($method <: `loginGoogle`) {
    if ($args <: [$app_id, $req, $opts]) {
      $use_args = join(list=[$req, $app_id, $opts], separator=", ")
    } else if ($args <: [$app_id, $req]) {
      $use_args = join(list=[$req, $app_id], separator=", ")
    } else {
      $use_args = $args
    }
  } else {
    $use_args = join(list=$args, separator=", ")
  },
  return $use_args
}

pattern hathora_method() {
  or {
    `destroyRoom`,
    `loginAnonymous`,
    `getLobbyInfo`,
    `setLobbyState`,
  },
}

pattern rewrite_method_calls() {
  or {
    `await $callee.$method($args)` as $body where and {
      $method <: hathora_method(),
      $suffix = deprecated_suffix(method=$method),
      $use_args = reorder_args($method, $args),
      $unwrap_at = wrapper_key(method=$method),
      $body => `(await $callee.$[method]$[suffix]($use_args)).$unwrap_at`
    },
    `$callee.$method($args)` as $body where and {
      $method <: hathora_method(),
      $suffix = deprecated_suffix(method=$method),
      $use_args = reorder_args($method, $args),
      $body => `$callee.$[method]$[suffix]($use_args)`
    }
  }
}

pattern resource_name() {
  or {
    `AuthV1Api`,
    `RoomV1Api`,
    `LobbyV2Api`,
  }
}

pattern sdk_member() {
  or {
    `AuthV1Api` => `authV1`,
    `RoomV1Api` => `roomV1`,
    `LobbyV2Api` => `lobbyV2`,
  }
}

pattern resourceTypeName() {
    or {
      `AuthV1Api` => `AuthV1`,
      `LobbyV1Api` => `LobbyV1`,
      `LobbyV2Api` => `LobbyV2`,
      `RoomV1Api` => `RoomV1`,
      $x
    }
}

function new_resource_name($old_name) {
  if ($old_name <: `AuthV1Api`) {
    return `AuthV1`
  } else if ($old_name <: `LobbyV1Api`) {
    return `LobbyV1`
  } else if ($old_name <: `LobbyV2Api`) {
    return `LobbyV2`
  } else if ($old_name <: `RoomV1Api`) {
    return `RoomV1`
  }, 
  return $old_name
}

any {
  // update constructors
  bubble `new $class($_)` as $constructor where {
    $class <: remove_import(from=`"@hathora/hathora-cloud-sdk"`),
    $class <: sdk_member(),
    $cloud = `HathoraCloud`,
    $src = `"@hathora/cloud-sdk-typescript"`,
    $cloud <: ensure_import_from(source=$src),
    $constructor => `new $cloud().$class`,
  },
  $refs = [],
  bubble($refs) $x where $x <: and {
    imported_from(from=`"@hathora/hathora-cloud-sdk"`),
    $refs += $x,
    not within `new $_`,
    $x => new_resource_name(old_name=$x),
    not within `import $_`,
    remove_import(from=`"@hathora/hathora-cloud-sdk"`),
    $x where {
      $replacement_import = new_resource_name(old_name=$x),
      $replacement_import <: ensure_import_from(source=`"@hathora/cloud-sdk-typescript"`)
    },
  },
  bubble maybe rewrite_method_calls()
}
```

## Instantiates API Resources 

```js
import { AuthV1Api } from "@hathora/hathora-cloud-sdk";
const authClient = new AuthV1Api();
```

```js
import { HathoraCloud } from "@hathora/cloud-sdk-typescript";
const authClient = new HathoraCloud().authV1;
```

## Reorders method arguments

```js
import { LobbyV2Api } from "@hathora/hathora-cloud-sdk";
const lobbyClient = new LobbyV2Api();
lobbyClient.setLobbyState("my-app", "my-room", {some: "data"}, {request: "ops"});
```

```js
import { HathoraCloud } from "@hathora/hathora-cloud-sdk";
const lobbyClient = new HathoraCloud().lobbyV2;
lobbyClient.setLobbyState({some: "data"}, "my-app", "my-room", {request: "ops"});
```

## Renames types

```js
import { LobbyV2Api } from "@hathora/hathora-cloud-sdk";
const lobbyClient: LobbyV2Api = new LobbyV2Api();
```

```js
import { LobbyV2, HathoraCloud } from "@hathora/hathora-cloud-sdk";
const lobbyClient: LobbyV2 = new HathoraCloud().lobbyV2;
```


## Unwraps responses in-place

```js
import { LobbyV2Api } from "@hathora/hathora-cloud-sdk";
const lobbyClient = new LobbyV2Api();
const {state} = await lobbyClient.setLobbyState("my-app", "my-room", {some: "data"}, {request: "ops"});
```

```js
import { HathoraCloud } from "@hathora/hathora-cloud-sdk";
const lobbyClient = new HathoraCloud().lobbyV2;
const {state} = (await lobbyClient.setLobbyState("my-app", "my-room", {some: "data"}, {request: "ops"})).lobby;
```
