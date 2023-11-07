# Upgrade Hathora to Dedicated TS SDK

```grit
engine marzano(0.1)
language js

pattern rewrite_method_call() {
  or {
     `await $x.createApp($args)` => `(await $x.createApp($args)).application`,
    `$x.createBuild($args)` where or {
      $args <: [$a, $b] => `$a`
    },
    `await $x.createBuild($args)` where or {
      $args <: [$a, $b] => `$a`
    } => `(await $x.createBuild($args)).build`,
    `$x.createDeployment($args)` where or {
      $args <: [$a, $b, $c] => `$c, $a, $b`,
      $args <: [$a, $b, $c, $d] => `$c, $a, $b, $d`
    },
    `await $x.createDeployment($args)` where or {
      $args <: [$a, $b, $c] => `$c, $a, $b`,
      $args <: [$a, $b, $c, $d] => `$c, $a, $b, $d`
    } => `(await $x.createDeployment($args)).deployment`,
    `$x.createLobby($args)` where or {
      $args <: [$a, $b, $c] => `$c, $a`,
      $args <: [$a, $b, $c, $d] => `$c, $a, $d`,
      $args <: [$a, $b, $c, $d, $e] => `$c, $a, $d, $e`
    },
    `await $x.createLobby($args)` where or {
      $args <: [$a, $b, $c] => `$c, $a`,
      $args <: [$a, $b, $c, $d] => `$c, $a, $d`,
      $args <: [$a, $b, $c, $d, $e] => `$c, $a, $d, $e`
    } => `(await $x.createLobby($args)).lobby`,
    `$x.createLocalLobby($args)` where or {
      $args <: [$a, $b, $c] => `$c, $a`,
      $args <: [$a, $b, $c, $d] => `$c, $a, $d`,
      $args <: [$a, $b, $c, $d, $e] => `$c, $a, $d, $e`
    },
    `await $x.createLocalLobby($args)` where or {
      $args <: [$a, $b, $c] => `$c, $a`,
      $args <: [$a, $b, $c, $d] => `$c, $a, $d`,
      $args <: [$a, $b, $c, $d, $e] => `$c, $a, $d, $e`
    } => `(await $x.createLocalLobby($args)).lobby`,
    `$x.createPrivateLobby($args)` where or {
      $args <: [$a, $b, $c] => `$c, $a`,
      $args <: [$a, $b, $c, $d] => `$c, $a, $d`,
      $args <: [$a, $b, $c, $d, $e] => `$c, $a, $d, $e`
    } => `$x.createPrivateLobbyDeprecated($args)`,
    `await $x.createPrivateLobby($args)` where or {
      $args <: [$a, $b, $c] => `$c, $a`,
      $args <: [$a, $b, $c, $d] => `$c, $a, $d`,
      $args <: [$a, $b, $c, $d, $e] => `$c, $a, $d, $e`
    } => `(await $x.createPrivateLobbyDeprecated($args)).lobby`,
    `$x.createPrivateLobbyDeprecated($args)` where or {
      $args <: [$a, $b] => `$a`,
      $args <: [$a, $b, $c] => `$a, $c`,
      $args <: [$a, $b, $c, $d] => `$a, $d, $c`,
      $args <: [$a, $b, $c, $d, $e] => `$a, $d, $c, $e`
    },
    `await $x.createPrivateLobbyDeprecated($args)` where or {
      $args <: [$a, $b] => `$a`,
      $args <: [$a, $b, $c] => `$a, $c`,
      $args <: [$a, $b, $c, $d] => `$a, $d, $c`,
      $args <: [$a, $b, $c, $d, $e] => `$a, $d, $c, $e`
    } => `(await $x.createPrivateLobbyDeprecated($args)).roomId`,
    `$x.createPublicLobby($args)` where or {
      $args <: [$a, $b, $c] => `$c, $a, $b`,
      $args <: [$a, $b, $c, $d] => `$c, $a, $b, $d`
    } => `$x.createPublicLobbyDeprecated($args)`,
    `await $x.createPublicLobby($args)` where or {
      $args <: [$a, $b, $c] => `$c, $a, $b`,
      $args <: [$a, $b, $c, $d] => `$c, $a, $b, $d`
    } => `(await $x.createPublicLobbyDeprecated($args)).lobby`,
    `$x.createPublicLobbyDeprecated($args)` where or {
      $args <: [$a, $b] => `$a`,
      $args <: [$a, $b, $c] => `$a, $c`,
      $args <: [$a, $b, $c, $d] => `$a, $d, $c`,
      $args <: [$a, $b, $c, $d, $e] => `$a, $d, $c, $e`
    },
    `await $x.createPublicLobbyDeprecated($args)` where or {
      $args <: [$a, $b] => `$a`,
      $args <: [$a, $b, $c] => `$a, $c`,
      $args <: [$a, $b, $c, $d] => `$a, $d, $c`,
      $args <: [$a, $b, $c, $d, $e] => `$a, $d, $c, $e`
    } => `(await $x.createPublicLobbyDeprecated($args)).roomId`,
    `$x.createRoom($args)` where or {
      $args <: [$a, $b] => `$a, $b`,
      $args <: [$a, $b, $c] => `$c, $a, $b`,
      $args <: [$a, $b, $c, $d] => `$c, $a, $b, $d`
    } => `$x.createRoomDeprecated($args)`,
    `await $x.createRoom($args)` where or {
      $args <: [$a, $b] => `$a, $b`,
      $args <: [$a, $b, $c] => `$c, $a, $b`,
      $args <: [$a, $b, $c, $d] => `$c, $a, $b, $d`
    } => `(await $x.createRoomDeprecated($args)).connectionInfoV2`,
    `$x.createRoomDeprecated($args)` where or {
      $args <: [$a, $b] => `$b, $a`,
      $args <: [$a, $b, $c] => `$b, $a, $c`,
      $args <: [$a, $b, $c, $d] => `$b, $a, $c, $d`
    },
    `await $x.createRoomDeprecated($args)` where or {
      $args <: [$a, $b] => `$b, $a`,
      $args <: [$a, $b, $c] => `$b, $a, $c`,
      $args <: [$a, $b, $c, $d] => `$b, $a, $c, $d`
    } => `(await $x.createRoomDeprecated($args)).roomId`,
    `$x.destroyRoom($args)` => `$x.destroyRoomDeprecated($args)`,
    `await $x.destroyRoom($args)` => `await $x.destroyRoomDeprecated($args)`,
    `$x.getActiveRoomsForProcess($args)` => `$x.getActiveRoomsForProcessDeprecated($args)`,
    `await $x.getActiveRoomsForProcess($args)` => `(await $x.getActiveRoomsForProcessDeprecated($args)).roomWithoutAllocations`,
    `await $x.getActiveRoomsForProcessDeprecated($args)` => `(await $x.getActiveRoomsForProcessDeprecated($args)).roomWithoutAllocations`,
    `await $x.getAppInfo($args)` => `(await $x.getAppInfo($args)).application`,
    `await $x.getApps($args)` => `(await $x.getApps($args)).applicationWithDeployments`,
    `await $x.getBalance($args)` => `(await $x.getBalance($args)).getBalance200ApplicationJSONDoubleNumber`,
    `await $x.getBuildInfo($args)` => `(await $x.getBuildInfo($args)).build`,
    `await $x.getBuilds($args)` => `(await $x.getBuilds($args)).builds`,
    `$x.getConnectionInfo($args)` => `$x.getConnectionInfoDeprecated($args)`,
    `await $x.getConnectionInfo($args)` => `(await $x.getConnectionInfoDeprecated($args)).connectionInfoV2`,
    `await $x.getConnectionInfoDeprecated($args)` => `(await $x.getConnectionInfoDeprecated($args)).connectionInfo`,
    `await $x.getDeploymentInfo($args)` => `(await $x.getDeploymentInfo($args)).deployment`,
    `await $x.getDeployments($args)` => `(await $x.getDeployments($args)).deployments`,
    `$x.getInactiveRoomsForProcess($args)` => `$x.getInactiveRoomsForProcessDeprecated($args)`,
    `await $x.getInactiveRoomsForProcess($args)` => `(await $x.getInactiveRoomsForProcessDeprecated($args)).roomWithoutAllocations`,
    `await $x.getInactiveRoomsForProcessDeprecated($args)` => `(await $x.getInactiveRoomsForProcessDeprecated($args)).roomWithoutAllocations`,
    `await $x.getInvoices($args)` => `(await $x.getInvoices($args)).invoices`,
    `await $x.getLobbyInfo($args)` => `(await $x.getLobbyInfo($args)).lobby`,
    `await $x.getLogsForApp($args)` => `(await $x.getLogsForApp($args)).getLogsForApp200TextPlainByteString`,
    `await $x.getLogsForDeployment($args)` => `(await $x.getLogsForDeployment($args)).getLogsForDeployment200TextPlainByteString`,
    `await $x.getLogsForProcess($args)` => `(await $x.getLogsForProcess($args)).getLogsForProcess200TextPlainByteString`,
    `await $x.getMetrics($args)` => `(await $x.getMetrics($args)).metricsResponse`,
    `await $x.getPaymentMethod($args)` => `(await $x.getPaymentMethod($args)).paymentMethod`,
    `await $x.getPingServiceEndpoints($args)` => `(await $x.getPingServiceEndpoints($args)).discoveryResponse`,
    `await $x.getProcessInfo($args)` => `(await $x.getProcessInfo($args)).process`,
    `$x.getRoomInfo($args)` => `$x.getRoomInfoDeprecated($args)`,
    `await $x.getRoomInfo($args)` => `(await $x.getRoomInfoDeprecated($args)).room`,
    `await $x.getRoomInfoDeprecated($args)` => `(await $x.getRoomInfoDeprecated($args)).room`,
    `await $x.getRunningProcesses($args)` => `(await $x.getRunningProcesses($args)).processWithRooms`,
    `await $x.getStoppedProcesses($args)` => `(await $x.getStoppedProcesses($args)).processes`,
    `await $x.initStripeCustomerPortalUrl($args)` => `(await $x.initStripeCustomerPortalUrl($args)).initStripeCustomerPortalUrl200ApplicationJSONString`,
    `$x.listActivePublicLobbies($args)` => `$x.listActivePublicLobbiesDeprecated($args)`,
    `await $x.listActivePublicLobbies($args)` => `(await $x.listActivePublicLobbiesDeprecated($args)).lobbies`,
    `$x.listActivePublicLobbiesDeprecated($args)` where or {
      $args <: [$a, $b] => `$a`,
      $args <: [$a, $b, $c] => `$a, $c`,
      $args <: [$a, $b, $c, $d] => `$a, $c, $d`,
      $args <: [$a, $b, $c, $d, $e] => `$a, $c, $d, $e`
    },
    `await $x.listActivePublicLobbiesDeprecated($args)` where or {
      $args <: [$a, $b] => `$a`,
      $args <: [$a, $b, $c] => `$a, $c`,
      $args <: [$a, $b, $c, $d] => `$a, $c, $d`,
      $args <: [$a, $b, $c, $d, $e] => `$a, $c, $d, $e`
    } => `(await $x.listActivePublicLobbiesDeprecated($args)).lobbies`,
    `await $x.loginAnonymous($args)` => `(await $x.loginAnonymous($args)).loginResponse`,
    `$x.loginGoogle($args)` where or {
      $args <: [$a, $b] => `$b, $a`,
      $args <: [$a, $b, $c] => `$b, $a, $c`
    },
    `await $x.loginGoogle($args)` where or {
      $args <: [$a, $b] => `$b, $a`,
      $args <: [$a, $b, $c] => `$b, $a, $c`
    } => `(await $x.loginGoogle($args)).loginResponse`,
    `$x.loginNickname($args)` where or {
      $args <: [$a, $b] => `$b, $a`,
      $args <: [$a, $b, $c] => `$b, $a, $c`
    },
    `await $x.loginNickname($args)` where or {
      $args <: [$a, $b] => `$b, $a`,
      $args <: [$a, $b, $c] => `$b, $a, $c`
    } => `(await $x.loginNickname($args)).loginResponse`,
    `$x.runBuild($args)` where or {
      $args <: [$a, $b, $c] => `$c, $a, $b`,
      $args <: [$a, $b, $c, $d] => `$c, $a, $b, $d`
    },
    `await $x.runBuild($args)` where or {
      $args <: [$a, $b, $c] => `$c, $a, $b`,
      $args <: [$a, $b, $c, $d] => `$c, $a, $b, $d`
    } => `(await $x.runBuild($args)).runBuild200TextPlainByteString`,
    `await $x.sendVerificationEmail($args)` => `(await $x.sendVerificationEmail($args)).verificationEmailResponse`,
    `$x.setLobbyState($args)` where or {
      $args <: [$a, $b, $c] => `$c, $a, $b`,
      $args <: [$a, $b, $c, $d] => `$c, $a, $b, $d`
    },
    `await $x.setLobbyState($args)` where or {
      $args <: [$a, $b, $c] => `$c, $a, $b`,
      $args <: [$a, $b, $c, $d] => `$c, $a, $b, $d`
    } => `(await $x.setLobbyState($args)).lobby`,
    `$x.suspendRoom($args)` => `$x.suspendRoomDeprecated($args)`,
    `await $x.suspendRoom($args)` => `await $x.suspendRoomDeprecated($args)`,
    `$x.updateApp($args)` where or {
      $args <: [$a, $b] => `$b, $a`,
      $args <: [$a, $b, $c] => `$b, $a, $c`
    },
    `await $x.updateApp($args)` where or {
      $args <: [$a, $b] => `$b, $a`,
      $args <: [$a, $b, $c] => `$b, $a, $c`
    } => `(await $x.updateApp($args)).application`
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
  bubble rewrite_method_call()
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

## Renames deprecated methods

```js
import { RoomV1Api } from "@hathora/hathora-cloud-sdk";
const roomClient = new RoomV1Api();

roomClient.destroyRoom(process.env.HATHORA_APP_ID!,
  roomId,
  { headers: { Authorization: `Bearer ${getDeveloperToken()}`, "Content-Type": "application/json" } }
);
```

```js
import { HathoraCloud } from "@hathora/cloud-sdk-typescript";

const roomClient = new HathoraCloud().roomV1;

roomClient.destroyRoomDeprecated(process.env.HATHORA_APP_ID!,
  roomId,
  { headers: { Authorization: `Bearer ${getDeveloperToken()}`, "Content-Type": "application/json" } }
);
```

## Unwraps responses in-place

Responses often have a new intervening wrapper key for the response data. For instance, `setLobbyState` returns data under `.lobby`.

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
