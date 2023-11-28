---
title: Convert CodeceptJS to Playwright
---

Migrate from CodeceptJS to Playwright.

tags: #hidden

```grit
engine marzano(0.1)
language js

pattern convert_test() {
    `Scenario($description, async ({ $params }) => { $body })` as $scenario where {
        $params <: contains `I`,
        $program <: maybe contains call_expression($function) as $tagger where {
            $function <: contains $scenario,
            $tagger => $scenario,
        },
        $body <: maybe contains bubble or {
            `I.say($log)` => `console.log($log)`,
            expression_statement($expression) where {
                $expression <: call_expression(),
                $expression => `await $expression`,
            },
            `I.haveWithCachePing($client)` => `factory.create($client)`,
            convert_locators(page=`page`),
        },
        $pages = [],
        $body <: maybe contains bubble($pages) r"[a-zA-Z]*Page" as $page where {
            $page <: identifier(),
            $page_class = capitalize(string=$page),
            $pages += `var $page = new $page_class(page, context)`,
        },
        $body <: maybe contains bubble($pages) r"[a-zA-Z]*Modal" as $modal where {
            $modal <: identifier(),
            $modal_class = capitalize(string=$modal),
            $pages += `var $modal = new $modal_class(page, context)`,
        },
        $pages = distinct(list=$pages),
        $pages = join(list=$pages, separator=`;\n`),
        $body => `$pages\n$body`,
    } => `test($description, async ({ page, factory, context }) => {
        $body
    })`
}

pattern convert_locators($page) {
    or {
        `locate($locator).as($_)` => `$page.locator($locator)`,
        `locate($locator).find($sub)` => `$page.locator($locator).locator($sub)`,
        `locate($locator)` => `$page.locator($locator)`,
        `I.waitInUrl($url)` => `await $page.waitForURL(new RegExp($url))`,
        `I.waitForLoader()` => `await this.waitForLoader()`,
        `I.waitForText($text, $timeout, $target)` => `await expect($target).toHaveText($text, {
            timeout: $timeout * 1000,
            ignoreCase: true,
        })`,
        `I.wait($timeout)` => `await $page.waitForTimeout($timeout * 1000)`,
        `I.seeElement($element)` => `await expect($element).toBeVisible()`,
        `I.dontSeeElement($element)` => `await expect($element).toBeHidden()`,
        `I.see($text, $target)` => `await expect($target).toContainText($text)`,
        `I.see($text)` => `await expect($target).toBeVisible()`,
        `I.dontSee($text, $target)` => `await expect($target).not.toContainText($text)`,
        `I.seeCssPropertiesOnElements($target, { $css })` as $orig where {
            $css_assertions = [],
            $css <: some bubble($target, $css_assertions) pair($key, $value) where {
                or {
                    and {
                        $key <: string(),
                        $string_key = $key,
                    },
                    $string_key = `'$key'`,
                },
                $css_assertions += `await expect($target).toHaveCSS($string_key, $value)`,
            },
            $css_assertions = join(list=$css_assertions, separator=`;\n`),
            $orig => $css_assertions,
        },
        `I.seeInField($target, $value)` => `await expect($target).toHaveValue($value)`,
        `I.seeTextEquals($text, $target)` => `await expect($target).toHaveText($text)`,
        `I.waitForElement($target, $timeout)` => `await $target.waitFor({ state: 'attached', timeout: $timeout * 1000 })`,
        `I.waitForElement($target)` => `await $target.waitFor({ state: 'attached' })`,
        `I.waitForVisible($target, $timeout)` => `await $target.waitFor({ state: 'visible', timeout: $timeout * 1000 })`,
        `I.waitForVisible($target)` => `await $target.waitFor({ state: 'visible' })`,
        `I.waitForInvisible($target, $timeout)` => `await $target.waitFor({ state: 'hidden', timeout: $timeout * 1000 })`,
        `I.waitForInvisible($target)` => `await $target.waitFor({ state: 'hidden' })`,
        `$locator.withText($text)` => `$locator.and($page.locator(':has-text("$text")'))`,
        `I.forceClick($target, $context)` => `await $context.locator($target).click({ force: true })`,
        `I.forceClick($target)` => `await $target.click({ force: true })`,
        `I.click($target, $context)` => `await $context.locator($target).click()`,
        `I.click($target)` => `await $target.click()`,
        `I.pressKey($key)` => `await $page.keyboard.press($key)`,
        `I.type($keys)` => `await $page.keyboard.type($keys)`,
        `I.refreshPage()` => `await $page.reload()`,
        `I.scrollTo($target)` => `await $target.scrollIntoViewIfNeeded()`,
    }
}

pattern convert_base_page() {
    `export default { $properties }` where {
        $program <: contains `const { I } = inject();` => .,
        $properties <: maybe contains bubble or {
            pair($key, $value) as $pair where or {
                $value <: `($params) => { $body }` where {
                    $pair => `$key($params) { $body }`,
                },
                $value <: `($params) => $exp` where {
                    $pair => `$key($params) { return $exp }`,
                },
                $pair => `get $key() { return $value }`,
            } where {
                $pair <: not within method_definition(),
                $pair <: not within pair() as $outer_pair where {
                    $outer_pair <: not $pair,
                }
            },
            method_definition($async, $static) as $method where {
                $async <: false,
                $method => `async $method`,
            },
            convert_locators(page=`this.page`),
        },
        $filename <: r".*?/?([^/]+)\.[a-zA-Z]*"($base_name),
        $base_name = capitalize(string=$base_name),
    } => `export default class $base_name extends BasePage {
        $properties
    }`
}

or {
    convert_test(),
    convert_base_page(),
}
```

## Converts Codecept property

```js
// @file test.js
const { I } = inject();

export default {
  url: 'https://grit.io',
  selector: locate('#migration-selector').as('Selector'),
  openai: locate('text=custodian-sample-org/openai-quickstart-python').as('Openai'),
};
```

```js
// @file test.js

export default class Test extends BasePage {
  get url() {
    return 'https://grit.io';
  }
  get selector() {
    return this.page.locator('#migration-selector');
  }
  get openai() {
    return this.page.locator('text=custodian-sample-org/openai-quickstart-python');
  }
}
```

## Converts waiters

```js
// @file someFolder/test.js
const { I } = inject();

export default {
  url: 'https://grit.io',

  waitForGrit() {
    I.waitInUrl(this.url);
    I.waitForText('Studio', 10, this.heading);
    I.see('Function expressions to arrow functions', this.rewrite);
    I.click(this.button);
    I.waitForVisible(this.rewritten);
  },
};
```

```js
// @file someFolder/test.js

export default class Test extends BasePage {
  get url() {
    return 'https://grit.io';
  }

  async waitForGrit() {
    await this.page.waitForURL(new RegExp(this.url));
    await expect(this.heading).toHaveText('Studio', {
      timeout: 10 * 1000,
      ignoreCase: true,
    });
    await expect(this.rewrite).toContainText('Function expressions to arrow functions');
    await this.button.click();
    await this.rewritten.waitFor({ state: 'visible' });
  }
}
```

## Converts complex locators

```js
// @file someFolder/test.js
const { I } = inject();

export default {
  studio: locate('.studio'),
  message: 'Hello world',
  button: (name) => locate(`//button[contains(text(), "${name}")]`).as(name),

  waitForGrit() {
    I.waitForVisible(this.studio.withText(this.message), 5);
    I.click(this.button('grit'), this.studio);
    I.seeCssPropertiesOnElements(this.studio, {
      'background-color': '#3570b6',
      display: 'flex',
    });
  },
};
```

```js
// @file someFolder/test.js

export default class Test extends BasePage {
  get studio() {
    return this.page.locator('.studio');
  }
  get message() {
    return 'Hello world';
  }
  button(name) {
    return this.page.locator(`//button[contains(text(), "${name}")]`);
  }

  async waitForGrit() {
    await this.studio
      .and(this.page.locator(':has-text("this.message")'))
      .waitFor({ state: 'visible', timeout: 5 * 1000 });
    await this.studio.locator(this.button('grit')).click();
    await expect(this.studio).toHaveCSS('background-color', '#3570b6');
    await expect(this.studio).toHaveCSS('display', 'flex');
  }
}
```

## Converts Codecept scenario

```js
Scenario('Trivial test', async ({ I }) => {
  projectPage.open();
  I.waitForVisible(projectPage.list);
  I.refreshPage();
  I.see(projectPage.demo, projectPage.list);
  expect(true).toBe(true);
  projectPage.close();
})
  .tag('Email')
  .tag('Studio')
  .tag('Projects');
```

```js
test('Trivial test', async ({ page, factory, context }) => {
  var projectPage = new ProjectPage(page, context);
  await projectPage.open();
  await projectPage.list.waitFor({ state: 'visible' });
  await page.reload();
  await expect(projectPage.list).toContainText(projectPage.demo);
  await expect(true).toBe(true);
  await projectPage.close();
});
```

## Does not convert inner object properties to getters

```js
// @file someFolder/test.js
const { I } = inject();

export default {
  studio: locate('.studio'),
  message: 'Hello world',

  section: {
    editor: locate('#editor'),
    title: 'Apply a GritQL pattern',
  },
  someMethod() {
    return {
      foo: bar,
    };
  },
};
```

```js
// @file someFolder/test.js

export default class Test extends BasePage {
  get studio() {
    return this.page.locator('.studio');
  }
  get message() {
    return 'Hello world';
  }

  get section() {
    return {
      editor: this.page.locator('#editor'),
      title: 'Apply a GritQL pattern',
    };
  }
  async someMethod() {
    return {
      foo: bar,
    };
  }
}
```

## Converts Codecept scenario with multiple args

```js
Scenario('Trivial test', async ({ I, loginAs }) => {
  projectPage.open();
  listModal.open();
  I.waitForVisible(projectPage.list);
})
  .tag('Email')
  .tag('Studio')
  .tag('Projects');
```

```js
test('Trivial test', async ({ page, factory, context }) => {
  var projectPage = new ProjectPage(page, context);
  var listModal = new ListModal(page, context);
  await projectPage.open();
  await listModal.open();
  await projectPage.list.waitFor({ state: 'visible' });
});
```
