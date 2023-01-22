# Migrate Enzyme to React Testing Library

This is the pattern.

```grit
Program(body=and {
    maybe contains `import { $imports } from "$lib"` where {
        $lib <: `"enzyme"` => `"@testing-library/react"`
        $imports <: contains {
            `shallow` as $shallow => `render`
        }
    }
    maybe contains `import $renderer from "react-test-renderer"` => `import { render } from "@testing-library/react"`
    contains bubble($shallow, $renderer) `$test($name, $body)` where {
        $body <: and {
            maybe contains VariableDeclaration() as $var where {
                $var <: contains `$wrapper = $shallow($comp)`
                $var => `render($comp)`
            }
            maybe contains bubble($wrapper) {
                `expect($expect).$compare` where {
                    $expect <: contains `$wrapper.find($selector).$get()` as $finder => `screen.getByRole($role)` where {
                        $selector <: or {`"h1"`, `"h2"`, `"h3"`, `"h4"`, `"h5"`, `"h6"`}
                        $role = `"heading"`
                        $get <: `text`
                        $compare => `toHaveTextContent`
                    }
                }
            }
            maybe contains `$renderer.create($comp).toJSON()` => `render($comp)`
            maybe contains `expect($expectation)` where {
                $expectation <: semantic `$renderer.create($comp).toJSON()`
                $expectation => `$expectation.container`
            }
        }
    }
})
```

## Static Components

Before:

```js
import renderer from "react-test-renderer";
import MyComponent from "../MyComponent";

describe("<MyComponent />", () => {
  const props = {
    addLetter: jest.fn(),
    message: "Hello World",
  };

  it("matches snapshot", () => {
    const rendered = renderer.create(<MyComponent {...props} />).toJSON();

    expect(rendered).toMatchSnapshot();
  });
});
```

After:

```js
import { render } from "@testing-library/react";
import MyComponent from "../MyComponent";

describe("<MyComponent />", () => {
  const props = {
    addLetter: jest.fn(),
    message: "Hello World",
  };

  it("matches snapshot", () => {
    const { container } = render(<MyComponent {...props} />);

    expect(container).toMatchSnapshot();
  });
});
```

## Shallow Mount

Before:

```js
import { shallow } from "enzyme";

test("has correct welcome text", () => {
  const wrapper = shallow(<Welcome firstName="John" lastName="Doe" />);
  expect(wrapper.find("h1").text()).toEqual("Welcome, John Doe");
  expect(wrapper.find("h5").text()).toEqual("Welcome, John Doe");
});
```

After:

```js
import { render } from "@testing-library/react";

test("has correct welcome text", () => {
  render(<Welcome firstName="John" lastName="Doe" />);
  expect(screen.getByRole("heading")).toHaveTextContent("Welcome, John Doe");
  expect(screen.getByRole("heading")).toHaveTextContent("Welcome, John Doe");
});
```

## Pull requests

### [Framepay](https://github.com/Rebilly/framepay-react/pull/69/files#diff-f01aa844e2e3d3c8a17adb7da42e7862f0e3da0170d334f0f4e8c493c99c4545)

Before:

```
import { Substitute } from '@fluffy-spoon/substitute';
import { mount } from 'enzyme';
import * as React from 'react';
import BaseElement from '../../../../../../src/lib/components/elements/base-element';

describe('lib/components/elements/BaseElement', () => {
    it('should unregister any event handlers on destroy', done => {
        const element = Substitute.for<PaymentElement>();
        const eventHandler = (token: string) => {};

        const props = {
            Rebilly: {
                ready: true,
                on: jest.fn(),
                off: jest.fn()
            }
        };

        class TmpComponent extends BaseElement<
            PaymentComponentProps,
            PaymentComponentState
        > {
            setupElement() {
                this.addEventHandler('token-ready', eventHandler);
                this.setState({ element });
            }
        }

        const wrapper = mount(
            <TmpComponent {...props} Rebilly={props.Rebilly} />
        );
        process.nextTick(() => {
            wrapper.unmount();

            expect(props.Rebilly.on).toHaveBeenCalledTimes(1);
            expect(props.Rebilly.on).toHaveBeenLastCalledWith(
                'token-ready',
                eventHandler
            );

            expect(props.Rebilly.off).toHaveBeenCalledTimes(1);
            expect(props.Rebilly.off).toHaveBeenLastCalledWith(
                'token-ready',
                eventHandler
            );

            done();
        });
    });
});
```

After:

```js
import { Substitute } from '@fluffy-spoon/substitute';
import { render } from '@testing-library/react';
import * as React from 'react';
import BaseElement from './base-element';

describe('BaseElement', () => {
    it('should unregister any event handlers on destroy', () => {
        const element = Substitute.for<PaymentElement>();
        const eventHandler = (token: string) => undefined;

        const props = {
            Rebilly: {
                off: jest.fn(),
                on: jest.fn(),
                ready: true
            }
        };

        class TmpComponent extends BaseElement<
            PaymentComponentProps,
            PaymentComponentState
        > {
            setupElement() {
                this.addEventHandler('token-ready', eventHandler);
                this.setState({ element });
            }
        }

        const { unmount } = render(
            <TmpComponent {...props} Rebilly={props.Rebilly} />
        );
        unmount();

        expect(props.Rebilly.on).toHaveBeenCalledTimes(1);
        expect(props.Rebilly.on).toHaveBeenLastCalledWith(
            'token-ready',
            eventHandler
        );

        expect(props.Rebilly.off).toHaveBeenCalledTimes(1);
        expect(props.Rebilly.off).toHaveBeenLastCalledWith(
            'token-ready',
            eventHandler
        );
    });
});
```

## Prior Art

Blog posts:

- https://testing-library.com/docs/react-testing-library/migrate-from-enzyme/
- https://medium.com/john-lewis-software-engineering/migrating-from-enzyme-to-react-testing-library-f271bd05295d
- https://chariotsolutions.com/blog/post/migrating-from-enzyme-to-react-testing-library/
- https://www.boyney.io/blog/2019-05-21-my-experience-moving-from-enzyme-to-react-testing-library
