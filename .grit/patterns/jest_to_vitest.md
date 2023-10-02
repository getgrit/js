---
title: Jest to Vitest
---

Convert Jest test to Vitest.

tags: #migration, #js

```grit
engine marzano(0.1)
language js

pattern updated_imports() {
  call_expression($function) where {
    $function <: or {
      js"test",
      js"expect",
      js"describe",
      js"it",
      js"beforeEach",
      js"afterEach",
      js"beforeAll",
      js"afterAll"
    } where {
      $source = `'vitest'`,
      $function <: ensure_import_from($source),
      $vi = `vi`,
      $vi <: ensure_import_from($source)
    }
  }
}

or {
  // Imports
  updated_imports(),
  `import $_ from 'jest'` => .,

  `jest.requireActual($module)` => `await vi.importActual($module)`,

  `JEST_WORKER_ID` => `VITEST_POOL_ID`,

  // module mocks
  `jest.mock($module, $mockImplementation)` where { 
    $mockImplementation <: arrow_function($body) where { 
      $body <: literal_value() => `({ 
        default: $body 
      })`
    }
  } => `vi.mock($module, $mockImplementation)`,
  `jest.mock` => `vi.mock`,

  // done callback
  `$sym($description, $callback)` where {
    and {
        $sym <: contains {
            or { `it`, `test`}
        },
        $callback <: arrow_function($body, $parameters, $parameter) where {
            or {
                // For matching `done => { ... }`
                ! $parameter <: .,
                // For matching `(done) => { ... }`
                $parameters <: contains r"\w+",
            }
        } => `() => new Promise($callback)`,
    }
  } => `$sym($description, $callback)`,

  // beforeAll, beforeEach, afterAll, afterEach hooks
  `$sym($callback)` where {
    and {
      $sym <: contains {
            or { `beforeAll`, `beforeEach`, `afterAll`, `afterEach`}
        },
      $callback <: arrow_function($body, $parameters, $parameter) where {
        $body <: call_expression() => `{ $body }`
      }
    }
  } => `$sym($callback)`,
  
}
```

## Convert assertions

```javascript
import { runCLI } from 'jest';
jest.mock("./some-path", () => "hello");
jest.mock("./some-path", () => {
  return {
    name: 'hello'
  }
});
const { cloneDeep } = jest.requireActual("lodash/cloneDeep");
it("is 1", done => {
  expect("1").toBe("1")
  done()
});
test("is 1", done => {
  expect("1").toBe("1");
  done();
});
test("is 1", (done) => {
  expect("1").toBe("1");
  done();
});
beforeAll(() => setActivePinia(createTestingPinia()));
beforeEach(() => setActivePinia(createTestingPinia()));
afterAll(() => setActivePinia(createTestingPinia()));
afterEach(() => setActivePinia(createTestingPinia()));
beforeAll(async () => {
  await expect("1").toBe("1");
  await expect("2").toBe("2");
})
```

```javascript
import { it, vi, expect, test, beforeAll, beforeEach, afterAll, afterEach } from "vitest";

vi.mock("./some-path", () => ({
   default: "hello",
}));
vi.mock("./some-path", () => {
  return {
    name: 'hello'
  }
});
const { cloneDeep } = await vi.importActual('lodash/cloneDeep');
it("is 1", () => new Promise(done => {
    expect("1").toBe("1");
    done();
}));
test("is 1", () => new Promise(done => {
    expect("1").toBe("1");
    done();
}));
test("is 1", () => new Promise(done => {
    expect("1").toBe("1");
    done();
}));
beforeAll(() => { setActivePinia(createTestingPinia()) });
beforeEach(() => { setActivePinia(createTestingPinia()) });
afterAll(() => { setActivePinia(createTestingPinia()) });
afterEach(() => { setActivePinia(createTestingPinia()) });
beforeAll(async () => {
  await expect("1").toBe("1");
  await expect("2").toBe("2");
})
```
