# Use Oso for authorization

```grit
language js

// Look for conditionals
`if ($cond) { $effect }` where {
    $cond <: contains or {
        // Find any of our hand-rolled functions
        `$user.isAdmin`, `$user.isManager`
    } => `await oso.authorize($user, $action, $resource)` where {
        // Guess the action
        $action = guess(hint="action to take")
        // Guess the target:
        $resource = guess(hint="resource to check")
    }
}
```

## Next.js sample

```js
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { Octokit } from "octokit";

import type { Endpoints } from "@octokit/types";
import { NextApiRequest, NextApiResponse } from "next";

export type Events =
  Endpoints["GET /users/{username}/events"]["response"]["data"];

const octokit = new Octokit();

async function eventsRoute(req: NextApiRequest, res: NextApiResponse<Events>) {
  const user = req.session.user;
  const targetUser = req.body.data.user;

  if (!user || user.isLoggedIn === false || !user.isAdmin()) {
    res.status(401).end();
    return;
  }

  try {
    const { data: events } =
      await octokit.rest.activity.listPublicEventsForUser({
        username: user.login,
      });

    res.json(events);
  } catch (error) {
    res.status(200).json([]);
  }
}

export default withIronSessionApiRoute(eventsRoute, sessionOptions);
```
