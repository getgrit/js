# Upgrade Hathora to Dedicated TS SDK

```grit
engine marzano(0.1)
language js

function wrapper_key($method) {
  if ($method <: or {`deleteApp`, `destroyRoomDeprecated`, `destroyRoom`, `suspendRoom`, `deleteBuild`, `suspendRoomDeprecated`}) {
      return ``
  } else if ($method <: or {`getBalance`}) {
      return `getBalance200ApplicationJSONDoubleNumber`
  } else if ($method <: or {`getStoppedProcesses`}) {
      return `processes`
  } else if ($method <: or {`getLogsForDeployment`}) {
      return `getLogsForDeployment200TextPlainByteString`
  } else if ($method <: or {`initStripeCustomerPortalUrl`}) {
      return `initStripeCustomerPortalUrl200ApplicationJSONString`
  } else if ($method <: or {`getLogsForApp`}) {
      return `getLogsForApp200TextPlainByteString`
  } else if ($method <: or {`getBuilds`}) {
      return `builds`
  } else if ($method <: or {`getProcessInfo`}) {
      return `process`
  } else if ($method <: or {`getLogsForProcess`}) {
      return `getLogsForProcess200TextPlainByteString`
  } else if ($method <: or {`getConnectionInfoDeprecated`}) {
      return `connectionInfo`
  } else if ($method <: or {`getAppInfo`, `createApp`, `updateApp`}) {
      return `application`
  } else if ($method <: or {`getPingServiceEndpoints`}) {
      return `discoveryResponse`
  } else if ($method <: or {`createLocalLobby`, `setLobbyState`, `createPrivateLobby`, `createPublicLobby`, `getLobbyInfo`, `createLobby`}) {
      return `lobby`
  } else if ($method <: or {`getApps`}) {
      return `applicationWithDeployments`
  } else if ($method <: or {`createBuild`, `getBuildInfo`}) {
      return `build`
  } else if ($method <: or {`getDeploymentInfo`, `createDeployment`}) {
      return `deployment`
  } else if ($method <: or {`sendVerificationEmail`}) {
      return `verificationEmailResponse`
  } else if ($method <: or {`createRoom`, `getConnectionInfo`}) {
      return `connectionInfoV2`
  } else if ($method <: or {`getActiveRoomsForProcessDeprecated`, `getActiveRoomsForProcess`, `getInactiveRoomsForProcessDeprecated`, `getInactiveRoomsForProcess`}) {
      return `roomWithoutAllocations`
  } else if ($method <: or {`getRunningProcesses`}) {
      return `processWithRooms`
  } else if ($method <: or {`runBuild`}) {
      return `runBuild200TextPlainByteString`
  } else if ($method <: or {`getPaymentMethod`}) {
      return `paymentMethod`
  } else if ($method <: or {`getRoomInfoDeprecated`, `getRoomInfo`}) {
      return `room`
  } else if ($method <: or {`createPrivateLobbyDeprecated`, `createRoomDeprecated`, `createPublicLobbyDeprecated`}) {
      return `roomId`
  } else if ($method <: or {`getMetrics`}) {
      return `metricsResponse`
  } else if ($method <: or {`listActivePublicLobbiesDeprecated`, `listActivePublicLobbies`}) {
      return `lobbies`
  } else if ($method <: or {`getDeployments`}) {
      return `deployments`
  } else if ($method <: or {`getInvoices`}) {
      return `invoices`
  } else if ($method <: or {`loginNickname`, `loginGoogle`, `loginAnonymous`}) {
      return `loginResponse`
  },
  return ``,
}

pattern hathora_method() {
  or {
    `createApp`,
`createAppRaw`,
`createBuild`,
`createBuildRaw`,
`createDeployment`,
`createDeploymentRaw`,
`createLobby`,
`createLobbyRaw`,
`createLocalLobby`,
`createLocalLobbyRaw`,
`createPrivateLobby`,
`createPrivateLobbyDeprecated`,
`createPrivateLobbyDeprecatedRaw`,
`createPrivateLobbyRaw`,
`createPublicLobby`,
`createPublicLobbyDeprecated`,
`createPublicLobbyDeprecatedRaw`,
`createPublicLobbyRaw`,
`createRoom`,
`createRoomDeprecated`,
`createRoomDeprecatedRaw`,
`createRoomRaw`,
`deleteApp`,
`deleteAppRaw`,
`deleteBuild`,
`deleteBuildRaw`,
`destroyRoom`,
`destroyRoomDeprecated`,
`destroyRoomDeprecatedRaw`,
`destroyRoomRaw`,
`getActiveRoomsForProcess`,
`getActiveRoomsForProcessDeprecated`,
`getActiveRoomsForProcessDeprecatedRaw`,
`getActiveRoomsForProcessRaw`,
`getAppInfo`,
`getAppInfoRaw`,
`getApps`,
`getAppsRaw`,
`getBalance`,
`getBalanceRaw`,
`getBuildInfo`,
`getBuildInfoRaw`,
`getBuilds`,
`getBuildsRaw`,
`getConnectionInfo`,
`getConnectionInfoDeprecated`,
`getConnectionInfoDeprecatedRaw`,
`getConnectionInfoRaw`,
`getDeploymentInfo`,
`getDeploymentInfoRaw`,
`getDeployments`,
`getDeploymentsRaw`,
`getInactiveRoomsForProcess`,
`getInactiveRoomsForProcessDeprecated`,
`getInactiveRoomsForProcessDeprecatedRaw`,
`getInactiveRoomsForProcessRaw`,
`getInvoices`,
`getInvoicesRaw`,
`getLobbyInfo`,
`getLobbyInfoRaw`,
`getLogsForApp`,
`getLogsForAppRaw`,
`getLogsForDeployment`,
`getLogsForDeploymentRaw`,
`getLogsForProcess`,
`getLogsForProcessRaw`,
`getMetrics`,
`getMetricsRaw`,
`getPaymentMethod`,
`getPaymentMethodRaw`,
`getPingServiceEndpoints`,
`getPingServiceEndpointsRaw`,
`getProcessInfo`,
`getProcessInfoRaw`,
`getRoomInfo`,
`getRoomInfoDeprecated`,
`getRoomInfoDeprecatedRaw`,
`getRoomInfoRaw`,
`getRunningProcesses`,
`getRunningProcessesRaw`,
`getStoppedProcesses`,
`getStoppedProcessesRaw`,
`initStripeCustomerPortalUrl`,
`initStripeCustomerPortalUrlRaw`,
`listActivePublicLobbies`,
`listActivePublicLobbiesDeprecated`,
`listActivePublicLobbiesDeprecatedRaw`,
`listActivePublicLobbiesRaw`,
`loginAnonymous`,
`loginAnonymousRaw`,
`loginGoogle`,
`loginGoogleRaw`,
`loginNickname`,
`loginNicknameRaw`,
`request`,
`runBuild`,
`runBuildRaw`,
`sendVerificationEmail`,
`sendVerificationEmailRaw`,
`setLobbyState`,
`setLobbyStateRaw`,
`suspendRoom`,
`suspendRoomDeprecated`,
`suspendRoomDeprecatedRaw`,
`suspendRoomRaw`,
`updateApp`,
`updateAppRaw`,
`value`,
  },
}

// some functions have changed names to reflect deprecation.
// XXX not all of them, eg lobby v2 `createLocalLobby` is deprecated,
// but not renamed.
pattern deprecated_suffix($method) {
  $method where $method <: or {
    and {
      or {
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
    }, 
    $method => `$[method]Deprecated`
    },
    $method
  }
}

pattern reorder_args($method, $args) {
  $method where $method <: or {
    `getLobbyInfo` where or {
      $args <: [$a, $b]  => `($b, $a)`,
      $args <: [$a, $b, $c]  => `($b, $a, $c)`,
    },
    or {`loginNickname`, `loginGoogle`} where or {
      $args <: [$a, $b, $c] => `($b, $a, $c)`
    },
    `createRoom` where or {
      $args <: [$a, $b] => `($b, $a)`,
      $args <: [$a, $b, $c] => `($b, $a, $c)`,
      $args <: [$a, $b, $c, $d] => `($b, $a, $c, $d)`,
    },
    or {`setLobbyState`, `createDeployment`, `runBuild`} where or {
      $args <: [$a, $b, $c] => `($c, $a, $b)`,
      $args <: [$a, $b, $c, $d] => `($c, $a, $b, $d)`
    },
    or {`createPublicLobby`, `createLobby`, `createPrivateLobby`} where or {
      $args <: [$a, $b, $c] => `($c, $a)`,
      $args <: [$a, $b, $c, $d] => `($c, $a, $d)`,
      $args <: [$a, $b, $c, $d, $e] => `($c, $a, $d, $e)`
    }
  } => `$method$args`
}

pattern rewrite_method_calls() {
  or {
    `await $callee.$method($args)` as $body where and {
      $method <: hathora_method(),
      $unwrap_at = wrapper_key(method=$method),
      $method <: deprecated_suffix(method=$method),
      $method <: maybe reorder_args(method=$method, args=$args),
      $body => `(await $callee.$[method]).$unwrap_at`
    },
    `$callee.$method($args)` as $body where and {
      $method <: hathora_method(),
      $method <: deprecated_suffix(method=$method),
      $method <: maybe reorder_args(method=$method, args=$args),
      $body => `$callee.$[method]`
    }
  }
}

pattern sdk_member() {
  or {
    `AppV1Api` => `appV1`,
    `AuthV1Api` => `authV1`,
    `BillingV1Api` => `billingV1`,
    `BuildV1Api` => `buildV1`,
    `DeploymentV1Api` => `deploymentV1`,
    `DiscoveryV1Api` => `discoveryV1`,
    `LobbyV1Api` => `lobbyV1`,
    `LobbyV2Api` => `lobbyV2`,
    `LogV1Api` => `logV1`,
    `ManagementV1Api` => `managementV1`,
    `MetricsV1Api` => `metricsV1`,
    `ProcessesV1Api` => `processesV1`,
    `RoomV1Api` => `roomV1`,
    `RoomV2Api` => `roomV2`,
  }
}

function new_resource_name($old_name) {
  if ($old_name <: `AppV1Api`) {
    return `AppV1`
  } else if ($old_name <: `AuthV1Api`) {
    return `AuthV1`
  } else if ($old_name <: `BillingV1Api`) {
    return `BillingV1`
  } else if ($old_name <: `BuildV1Api`) {
    return `BuildV1`
  } else if ($old_name <: `DeploymentV1Api`) {
    return `DeploymentV1`
  } else if ($old_name <: `DiscoveryV1Api`) {
    return `DiscoveryV1`
  } else if ($old_name <: `LobbyV1Api`) {
    return `LobbyV1`
  } else if ($old_name <: `LobbyV2Api`) {
    return `LobbyV2`
  } else if ($old_name <: `LogV1Api`) {
    return `LogV1`
  } else if ($old_name <: `ManagementV1Api`) {
    return `ManagementV1`
  } else if ($old_name <: `MetricsV1Api`) {
    return `MetricsV1`
  } else if ($old_name <: `ProcessesV1Api`) {
    return `ProcessesV1`
  } else if ($old_name <: `RoomV1Api`) {
    return `RoomV1`
  } else if ($old_name <: `RoomV2Api`) {
    return `RoomV2`
  },
  return $old_name
}

any {
  $old=`"@hathora/hathora-cloud-sdk"`,
  $new = `"@hathora/cloud-sdk-typescript"`,
  // update constructors
  bubble($old, $new) `new $class($_)` as $constructor where {
    $class <: remove_import(from=$old),
    $class <: sdk_member(),
    $cloud = `HathoraCloud`,
    $cloud <: ensure_import_from(source=$new),
    $constructor => `new $cloud().$class`,
  },
  bubble($old, $new) $x where {
    $x <: and {
      imported_from(from=$old),
      not within `new $_`,
      not within `import $_`,
      remove_import(from=$old)
    },
    $replacement_import = new_resource_name(old_name=$x),
    $x => $replacement_import,
    $replacement_import <: ensure_import_from(source=$new),
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
import { HathoraCloud } from "@hathora/cloud-sdk-typescript";

const lobbyClient = new HathoraCloud().lobbyV2;
lobbyClient.setLobbyState({ some: "data" }, "my-app", "my-room",{ 
  request: "ops" 
});
```

## Renames types

```js
import { LobbyV2Api } from "@hathora/hathora-cloud-sdk";
const lobbyClient: LobbyV2Api = new LobbyV2Api();
```

```js
import { LobbyV2, HathoraCloud } from "@hathora/cloud-sdk-typescript";

const lobbyClient: LobbyV2 = new HathoraCloud().lobbyV2;
```


## Unwraps responses in-place

```js
import { LobbyV2Api } from "@hathora/hathora-cloud-sdk";
const lobbyClient = new LobbyV2Api();
const {state} = await lobbyClient.setLobbyState("my-app", "my-room", {some: "data"}, {request: "ops"});
```

```js
import { HathoraCloud } from "@hathora/cloud-sdk-typescript";

const lobbyClient = new HathoraCloud().lobbyV2;
const { state } = (
  await lobbyClient.setLobbyState({ some: "data" }, "my-app", "my-room", {
    request: "ops",
  })
).lobby;
```
