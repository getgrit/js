# Upgrade Hathora to Dedicated TS SDK

```
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
  if ($method <: or {`loginAnonymous`, `loginGoogle`}) {
    return `loginResponse`
  } else if ($method <: or {`getLobbyInfo`, `setLobbyState`}) {
    return `lobby`
  } else {
    return `connectionInfo`
  },
  return `connectionInfo`
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

pattern rewrite_method_calls() {
  maybe any {
    bubble `await $callee.$method($args)` as $body where {
      $suffix = deprecated_suffix(method=$method),
      $use_args = reorder_args($method, $args),
      $unwrap_at = wrapper_key(method=$method),
      $body => `(await $callee.$[method]$[suffix]($use_args)).$unwrap_at`
    },
    bubble `$callee.$method($args)` as $body where {
      $suffix = deprecated_suffix(method=$method),
      $use_args = reorder_args($method, $args),
      $body => `$callee.$[method]$[suffix]($use_args)`
    }
  }
}

pattern generic_replace_resource($resource) {
  rewrite_method_calls(),
}

pattern gather_calls() {
  maybe any {
    bubble any {
      generic_replace_resource(resource=`RoomV1Api`),
    },
    bubble and {
      $resource = `LobbyV1Api`,
      any {
        generic_replace_resource(resource=$resource),
      }
    },
    bubble and {
      $resource = `AuthV1Api`,
      any {
        generic_replace_resource(resource=$resource),
      }
    },
    bubble and {
      $resource = `LobbyV2Api`,
      any {
        generic_replace_resource(resource=$resource),
      }
    }
  }
}

sequential {
  $name where and {
    $name <: imported_from(from = `"@hathora/hathora-cloud-sdk"`),
    $name <: replace_import(old=`"@hathora/hathora-cloud-sdk"`, new=`"@hathora/cloud-sdk-typescript"`),
  },
  any {
    and {
      $name where {
        $name <: or {
          `new AuthV1Api($_)` => `new HathoraCloud().authV1`,
          `new LobbyV1Api($_)` => `new HathoraCloud().lobbyV1`,
          `new LobbyV2Api($_)` => `new HathoraCloud().lobbyV2`,
          `new RoomV1Api($_)` => `new HathoraCloud().roomV1`,
        },
        $cloud = `HathoraCloud`,
        $src = `"@hathora/cloud-sdk-typescript"`,
        $cloud <: ensure_import_from(source=$src),
      }
    },
    $name where $name <: or {
      `AuthV1Api` => `AuthV1`,
      `LobbyV1Api` => `LobbyV1`,
      `LobbyV2Api` => `LobbyV2`,
      `RoomV1Api` => `RoomV1`,
    },
  },
  gather_calls(),
}
```