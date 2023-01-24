# Migrate Protractor Tests to Playwright

This pattern helps to automatically transform Protractor tests to Playwright tests, following [this guide](https://playwright.dev/docs/protractor).

```grit
pattern Elements() = or { `element`, `element.all`}
pattern ByChange($selector, $locator) = or {
        `model` where $locator = s"[ng-model=\"${selector}\"]"
        `css` where $locator = $selector
        `repeater` where $locator = s"[ng-repeat=\"${selector}\"]"
    }
pattern ByHandler() = bubble `$element(by.$by($selector))` => `page.locator($locator)` where {
    $by <: ByChange($selector, $locator)
    $element <: Elements()
    
}

`$it($_, $body)` where {
    $it <: `it` => `test`
    AddImport(`test`, `"@playwright/test"`)

    $body <: maybe contains bubble `$_.$act($_)` as $original => `await $original` where {
        $act <: or { `click`, `sendKeys` => `fill` }
    }

    $body <: maybe contains bubble ExpressionStatement(expression=$exp) => `await $exp` where {
        $exp <: contains `expect($expect)`
        $expect <: contains semantic ByHandler()
        $expect <: maybe contains bubble($exp) `$f.$op()` => $f where {
            $op <: or {
                `count` where $exp <: contains `toEqual` => `toHaveCount`
                `getText` where $exp <: contains `toEqual` => `toHaveText`
            } 
        }
    }

    $body <: maybe contains bubble `browser.get($url)` => `await page.goto($url)`
    $body <: maybe contains bubble ByHandler()
    $body <: maybe contains bubble `$other.$element(by.$by($selector))` => `$other.locator($locator)` where {
        $by <: ByChange($selector, $locator)
        $element <: Elements()
        $element <: Elements()
    }

    $body <: maybe contains bubble `get` => `nth`

    $it <: within `$describe($_, $_)` where {
        $describe <: `describe` => `test.describe`
        
    }
}
```

## Simple Example

```js
describe('angularjs homepage todo list', function() {
  it('should add a todo', function() {
    browser.get('https://angularjs.org');

    element(by.model('todoList.todoText')).sendKeys('first test');
    element(by.css('[value="add"]')).click();

    var todoList = element.all(by.repeater('todo in todoList.todos'));
    expect(todoList.count()).toEqual(3);
    expect(todoList.get(2).getText()).toEqual('first test');

    expect(3).toBe(5)

    // You wrote your first test, cross it off the list
    todoList.get(2).element(by.css('input')).click();
    var completedAmount = element.all(by.css('.done-true'));
    expect(completedAmount.count()).toEqual(2);
  });
});
```

```
import { test } from '@playwright/test';
test.describe('angularjs homepage todo list', function() {
  test('should add a todo', function() {
    await page.goto('https://angularjs.org');

    await page.locator('[ng-model="todoList.todoText"]').fill('first test');
    await page.locator('[value="add"]').click();

    var todoList = page.locator('[ng-repeat="todo in todoList.todos"]');
    await expect(todoList).toHaveCount(3);
    await expect(todoList.nth(2)).toHaveText('first test');

    expect(3).toBe(5)

    // You wrote your first test, cross it off the list
    await todoList.nth(2).locator('input').click();
    var completedAmount = page.locator('.done-true');
    await expect(completedAmount).toHaveCount(2);
  });
});
```
