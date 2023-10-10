---
title: Enzyme to React Testing Library
---

(Alpha) This pattern is a work in progress and is not yet ready for use.

tags: #enzyme, #react-testing-library, #rtl

```grit
pattern mount() {
    or {
        `$mount($comp)` as $mountComp where {
            $mount <: or { `mount`, `shallow` },
            $render = `render`,
            $render <: ensure_import_from(source=`"@testing-library/react"`),
            $mountComp => `render($comp)`
        },
        `import { $imports } from 'enzyme'` => .
    }
}

pattern simulate_input() {
    `$inputFind.simulate($type, $value)` as $simulate where {
        $fire_event = `fireEvent`,
        $fire_event <: ensure_import_from(source=`"@testing-library/react"`),
        $simulate => `const selector = $inputFindfireEvent.$eventType(selector, { target: { value: $value } });`
    }
}

predicate is_rtl_query_selector($value) {
    $value <: r"^(?:[a-zA-Z0-9_-]*[#.])+[a-zA-Z0-9_.#-]*"
}

predicate rtl_selector_rewrite($value, $locator, $compVar, $selector) {
    if (is_rtl_query_selector($value)) {
        $locator => `querySelector`
    } else if ($value <: r"input\[name=([^\]]+)]"($formField)) {
        $selector => `["textbox", ObjectExpression(properties=[
            ObjectProperty(key=Identifier(name="name"), value=raw($formField))
        ])]`
    } else {
        $screen = `screen`,
        $screen <: ensure_import_from(source=`"@testing-library/react"`),
        $compVar => `screen`,
        $locator => `getByRole`,
        $selector <: or {
          `h1`,
          // TODO: AI fallback
          // $guessRole = guess(codePrefix="// fix role using HTML tag", fallback=unparse($selector), stop=["function"]),
          // $selector => $guessRole
        }
    }
}

pattern rewrite_selector() {
    `$compVar.$locator($selector)` where {
        $locator <: `find`,
        if ($selector <: string(fragment=$value)) {
            rtl_selector_rewrite($value, $locator, $compVar, $selector)
        } else {
            // If the variable used in the selector has a classname assigned rewrite it
            $program <: contains variable_declaration() as $var where {
                $var <: contains `$selector = $varSelector` where {
                    $varSelector <: string(fragment=$value),
                    rtl_selector_rewrite($value, $locator, $compVar, $selector)
                }
            }
        }
    }
}



pattern rtl_base_rewrite() {
    or {
        `$_.update()` => .,
        `$_.act()` => .,
        `$textFind.text()` => `$textFind.textContent`,
        `$inputFind.prop('value')` => `$inputFind.value`
    }
}

or {
    mount(),
    rewrite_selector(),
    simulate_input(),
    rtl_base_rewrite()
}
```

## Simple example

```js
import { mount } from 'enzyme';
import TestModel from './modal';

describe('Modal', () => {
  describe('render', () => {
    it('should render', () => {
      testObject.render({ showModal: true });
      expect(testObject.component.find('h2').text()).toEqual('Test Modal');
    });

    it('renders header as the first child', () => {
      const header = testObject.component.find('span').at(0);
      expect(header.text()).toEqual('Hello, Header!');
    });
  });
});
```

# Broken examples

These are more complicated and will take AI or other rules to resolve.

## Render and find using role.

```js
import { mount } from 'enzyme';
import TestModel from './modal';

describe('Modal', () => {
  beforeEach(() => {
    closeModal = jest.fn();
    testObject.render = (props = {}) => {
      const element = <TestModel />;
      testObject.component = mount(element);
    };
  });

  describe('render', () => {
    it('should render', () => {
      testObject.render({ showModal: true });
      expect(testObject.component.find('h2').text()).toEqual('Test Modal');
    });

    it('renders header as the first child', () => {
      const header = testObject.component.find('span').at(0);
      expect(header.text()).toEqual('Hello, Header!');
    });
  });
});
```

```js
import { render, screen } from '@testing-library/react';

import TestModel from './modal';

describe('Modal', () => {
  beforeEach(() => {
    closeModal = jest.fn();
    testObject.render = (props = {}) => {
      const element = <TestModel />;
      testObject.component = render(element);
    };
  });

  describe('render', () => {
    it('should render', () => {
      testObject.render({ showModal: true });
      expect(screen.getByRole('heading').textContent).toEqual('Test Modal');
    });

    it('renders header as the first child', () => {
      const header = screen.getByRole('heading').at(0);
      expect(header.textContent).toEqual('Hello, Header!');
    });
  });
});
```

## Use query selector if no role found.

```js
import { mount } from 'enzyme';

describe('Inputs Radio', () => {
  const component = mount(<Radio />);
  const foo = testObject.component.find('input');
  const bar = component.find('.form.tooltip');
  it('should select the correct input', () => {
    const checked = foo.filterWhere((input) => input.prop('value') === 'woohoo!');
    expect(checked.prop('checked')).toEqual(true);
  });

  describe('tooltips', () => {
    it('should not render a tooltip', () => {
      expect(testObject.component.find('p')).toHaveLength(0);
    });
  });
});
```

```js
import { render, screen } from '@testing-library/react';

describe('Inputs Radio', () => {
  const component = render(<Radio />);
  const foo = screen.getByRole('radio');
  const bar = component.querySelector('.form.tooltip');
  it('should select the correct input', () => {
    const checked = foo.filterWhere((input) => input.value === 'woohoo!');
    expect(checked.prop('checked')).toEqual(true);
  });

  describe('tooltips', () => {
    it('should not render a tooltip', () => {
      expect(screen.getByRole('tooltip')).toHaveLength(0);
    });
  });
});
```

## Use textContent to find text data

```js
test('has correct welcome text', () => {
  const wrapper = shallow(<Welcome firstName='John' lastName='Doe' />);
  expect(wrapper.find('h1').text()).toEqual('Welcome, John Doe');
});
```

```js
import { render, screen } from '@testing-library/react';
test('has correct welcome text', () => {
  const wrapper = render(<Welcome firstName='John' lastName='Doe' />);
  expect(screen.getByRole('heading').textContent).toEqual('Welcome, John Doe');
});
```

## Transform input to use correct role

```js
test('has correct input value', () => {
  const wrapper = shallow(<Welcome firstName='John' lastName='Doe' />);
  expect(wrapper.find('input[name="firstName"]').value).toEqual('John');
  expect(wrapper.find('input[name="lastName"]').value).toEqual('Doe');
});
```

```js
import { render } from '@testing-library/react';
test('has correct input value', () => {
  const wrapper = render(<Welcome firstName='John' lastName='Doe' />);
  expect(
    wrapper.find('textbox', {
      name: 'firstName',
    }).value,
  ).toEqual('John');
  expect(
    wrapper.find('textbox', {
      name: 'lastName',
    }).value,
  ).toEqual('Doe');
});
```

## Check variable information to rewrite locator

```js
describe('Using variable', () => {
  it('Check variable contents when checking locator', () => {
    const headingClass = '.visible.heading';
    expect(wrapper.find(headingClass).exists()).toBeTruthy();
    simulateBeginDrag(wrapper);
    wrapper.update();
    expect(wrapper.find(headingClass).exists()).toBeTruthy();
  });
});
```

```js
describe('Using variable', () => {
  it('Check variable contents when checking locator', () => {
    const headingClass = '.visible.heading';
    expect(wrapper.querySelector(headingClass).exists()).toBeTruthy();
    simulateBeginDrag(wrapper);
    expect(wrapper.querySelector(headingClass).exists()).toBeTruthy();
  });
});
```
