# Upgrade Hathora to Dedicated TS SDK

```
engine marzano(0.1)
language js

pattern replace_resource_import($resource) {
  contains import_statement(import = import_clause(name=named_imports($imports)), source= `"@hathora/hathora-cloud-sdk"`) where {
    if ($imports <: contains $import where $import <: $resource) {
      $sdk = `sdk`,
      // TODO what's the best way to ask them to provide their SDK?
      // emit a file with a TODO? what if they use relative imports?
      // how do we know what import path to use? add that to the TODO?
      $sdk <: ensure_import_from(source=`"./sdk"`),
    } else {
      true
    }
  }
}

// TODO finish these various resource-specific checks.
// if it turns out they're very regular, you could just regex-and-recase them.
function resource_type_import_source($resource) {
  if($resource <: `RoomV1Api`) {
    $result = `"@hathora/cloud-sdk-typescript/dist/sdk/roomv1"`
  } else if ($resource <: `AuthV1Api`) {
    $result = `"@hathora/cloud-sdk-typescript/dist/sdk/authv1"`
  } else if ($resource <: `LobbyV1Api`) {
    $result = `"@hathora/cloud-sdk-typescript/dist/sdk/lobbyv1"`
  } else if ($resource <: `LobbyV2Api`) {
    $result = `"@hathora/cloud-sdk-typescript/dist/sdk/lobbyv2"`
  },
  return $result
}

function resource_type_substitute($resource) {
  if($resource <: `RoomV1Api`) {
    $result = `RoomV1`
  } else if ($resource <: `AuthV1Api`) {
    $result = `AuthV1`
  } else if ($resource <: `LobbyV1Api`) {
    $result = `LobbyV1`
  } else if ($resource <: `LobbyV2Api`) {
    $result = `LobbyV2`
  },
  return $result
}

function sdk_member_name($resource) {
  if($resource <: `RoomV1Api`) {
    $result = `roomV1`
  } else if ($resource <: `AuthV1Api`) {
    $result = `authV1`
  } else if ($resource <: `LobbyV1Api`) {
    $result = `lobbyV1`
  } else if ($resource <: `LobbyV2Api`) {
    $result = `lobbyV2`
  },
  return $result
}

// some functions have changed names to reflect deprecation.
// XXX not all of them, eg lobby v2 `createLocalLobby` is deprecated,
// but not renamed.
function deprecated_suffix($resource, $method) {
  if ($resource <: or {`RoomV1Api`, `LobbyV1Api`}) {
    return `Deprecated`
  },
  return ``
}

// TODO the rest of the unwrappings
function wrapper_key($method) {
  if ($method <: or {`loginAnonymous`, `loginGoogle`}) {
    return `loginResponse`
  } else if ($method <: `getLobbyInfo`) {
    return `lobbyInfo`
  } else {
    return `connectionInfo`
  },
  return `connectionInfo`
}

pattern rewrite_method_calls($resource, $callee) {
  maybe any {
    // TODO more elegant handling of await-or-not, maybe via regex? better idea?
    contains bubble($resource, $callee) `await $callee.$method($args)` as $body where {
      $suffix = deprecated_suffix(resource=$resource, method=$method),
      // TODO extract an unwrap member to replace `connectionInfo`
      // TODO how do we match and use rest-of-args without so much copypasta?
      // TODO finish rearranging methods
      // TODO generalize arg-rearrangement for the non-await case, since they're the same.
      if ($method <: `setLobbyState`) {
        if ($args <: [$app_id, $room_id, $req, $opts]) {
          $use_args = join(list=[$req, $app_id, $room_id, $opts], separator=", ")
        } else if ($args <: [$app_id, $room_id, $req]) {
          $use_args = join(list=[$req, $room_id, $app_id], separator=", ")
        }
      } else if ($method <: `loginGoogle`) {
        if ($args <: [$app_id, $req, $opts]) {
          $use_args = join(list=[$req, $app_id, $opts], separator=", ")
        } else if ($args <: [$app_id, $req]) {
          $use_args = join(list=[$req, $app_id], separator=", ")
        }
      } else {
        $use_args = join(list=$args, separator=", ")
      },
      $unwrap_at = wrapper_key(method=$method),
      $body => `(await $callee.$[method]$[suffix]($use_args)).$unwrap_at`
    },
    contains bubble($resource, $callee) `$callee.$method($args)` as $body where {
      $suffix = deprecated_suffix(resource=$resource, method=$method),
      // TODO: many request funs have a different arg order, usually shifting the request to the beginning,
      // so we need to rearrange $args
      // TODO extract an unwrap member to replace `connectionInfo`
      $body => `$callee.$[method]$[suffix]($args)`
    }
  }
}

pattern generic_replace_resource($resource) {
  and {
      replace_resource_import($resource),
    // TODO what do we do about hygiene when we import names like `sdk`?
    // do we have to worry about shadowing?
      maybe any {
        $member_name = sdk_member_name($resource),      
        and {
          contains `const $binding = new $resource()` => `const $binding = sdk.$member_name;`, 
          rewrite_method_calls(resource=$resource, callee=$binding),
        },
        contains type_annotation(type=$resource) where {
          $source = resource_type_import_source($resource),
          $substitute = resource_type_substitute($resource),
          $substitute <: ensure_import_from(source=$source)
      } => `: $substitute`
    }
  }
}

// v1 functions return an extra layer of indirection now, so eg a login response is at `.loginResponse`
pattern replace_inside_functions($client_type) {
  function_declaration(parameters=$params, body=$body) where {
    // TODO critically, this depends on types. if the target project is pure js, we're SoL.
    // One option is to just assume any name calling a given method like `getConnectionInfo` is using Hathora.
    // Not every method name may be that distinctive, and in any real codebase it could be insanely noisy.
    // A more invasive solution that seems like it would require Grit core support
    // is just following variable refs by substitution (where possible!) and guessing what's what.
    // There is a point at which that's just reproducing a static analyzer.
    $params <: [..., `$client_binding: $client_type`, ...],
    $body <: rewrite_method_calls(resource=$client_type, callee=$client_binding),
  }
}

pattern gather_calls() {
  and { 
    any {
      bubble any {
        generic_replace_resource(resource=`RoomV1Api`),
        replace_inside_functions(client_type=`RoomV1Api`)
      },
      bubble and {
        $resource = `LobbyV1Api`,
        any {
          generic_replace_resource(resource=$resource),
          replace_inside_functions(client_type=$resource)
        }
      },
      bubble and {
        $resource = `AuthV1Api`,
        any {
          generic_replace_resource(resource=$resource),
          replace_inside_functions(client_type=$resource)
        }
      },
      bubble and {
        $resource = `LobbyV2Api`,
        any {
          generic_replace_resource(resource=$resource),
          replace_inside_functions(client_type=$resource)
        }
      }
    }
  }
}

pattern type_imports() {
  or {
    `Region`,
    `Lobby`
  }
}

pattern replace_type_import($imported_type) {
  import_statement(import = import_clause(name=named_imports($imports)), source= $old) where {
    $old <: or {
    `"@hathora/hathora-cloud-sdk"`,
    `"@hathora/hathora-cloud-sdk/src/models/index"`
  },
    if ($imports <: contains $import where $import <: $imported_type) {
      $imports <: contains $import,
      $import <: ensure_import_from(source=`"@hathora/cloud-sdk-typescript/dist/sdk/models/shared"`)
    } else {
      true
    }
  },
}

any {
  replace_type_import(imported_type=`Lobby`),
  replace_type_import(imported_type=`Region`),
  `import $_ from "@hathora/hathora-cloud-sdk";` => .,
  `import $_ from "@hathora/hathora-cloud-sdk/src/models/index"` => .,
  gather_calls(),
}
```