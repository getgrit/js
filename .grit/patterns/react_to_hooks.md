---
title: Convert React Class Components to Functional Components
---

This pattern converts React class components to functional components, with hooks.

tags: #react, #migration, #complex

```grit

// Most of the logic for this pattern is in react_hooks.grit
// https://github.com/getgrit/js/blob/main/.grit/patterns/react_hooks.grit

sequential {
    file(body = program(statements = some bubble($program) first_step())),
    file(body = second_step()),
    file(body = second_step()),
    file(body = second_step()),
    file($body) where {
      $body <: program($statements),
      $use_ref_from = .,
      $statements <: bubble($body, $program) and {
        maybe adjust_imports($use_ref_from),
        add_more_imports($use_ref_from),
      }
    }
}
```

## Input for playground

```js
import { Component } from 'react';
class App extends Component {
  constructor(...args) {
    super(args);
    this.state = {
      name: '',
      another: 3,
    };
  }
  static foo = 1;
  static fooBar = 21;
  static bar = (input) => {
    console.log(input);
  };
  static another(input) {
    console.error(input);
  }
  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }
  componentDidUpdate(prevProps) {
    // alert("This component was mounted");
    document.title = `You clicked ${this.state.count} times`;
    const { isOpen } = this.state;
    if (isOpen && !prevProps.isOpen) {
      alert('You just opened the modal!');
    }
  }
  alertName = () => {
    alert(this.state.name);
  };

  handleNameInput = (e) => {
    this.setState({ name: e.target.value, another: 'cooler' });
  };
  async asyncAlert() {
    await alert('async alert');
  }
  render() {
    return (
      <div>
        <h3>This is a Class Component</h3>
        <input
          type='text'
          onChange={this.handleNameInput}
          value={this.state.name}
          placeholder='Your Name'
        />
        <button onClick={this.alertName}>Alert</button>
        <button onClick={this.asyncAlert}>Alert</button>
      </div>
    );
  }
}
```

```ts
import { useState, useEffect, useCallback } from 'react';
const App = () => {
  const [name, setName] = useState('');
  const [another, setAnother] = useState(3);
  const [isOpen, setIsOpen] = useState();

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, []);
  useEffect(() => {
    // alert("This component was mounted");
    document.title = `You clicked ${count} times`;

    if (isOpen && !prevProps.isOpen) {
      alert('You just opened the modal!');
    }
  }, [isOpen]);
  const alertNameHandler = useCallback(() => {
    alert(name);
  }, [name]);
  const handleNameInputHandler = useCallback((e) => {
    setName(e.target.value);
    setAnother('cooler');
  }, []);
  const asyncAlertHandler = useCallback(async () => {
    await alert('async alert');
  }, []);

  return (
    <div>
      <h3>This is a Class Component</h3>
      <input type='text' onChange={handleNameInputHandler} value={name} placeholder='Your Name' />
      <button onClick={alertNameHandler}>Alert</button>
      <button onClick={asyncAlertHandler}>Alert</button>
    </div>
  );
};

App.foo = 1;
App.fooBar = 21;
App.bar = (input) => {
  console.log(input);
};
App.another = (input) => {
  console.error(input);
};
```

## MobX - Observables and Computed

```js
import React from 'react';

class SampleComponent extends React.Component {
  onClick = () => {
    this.clicks = this.clicks + 1;
  };

  @observable
  private clicks = this.props.initialCount;

  @computed
  private get isEven() {
    return this.clicks % 2 === 0;
  }


  render() {
    return (
        <>
            <p>Clicks: {this.clicks}</p>
            <p>Is even: {this.isEven}</p>
            <a onClick={this.onClick}>click</a>
        </>
    );
  }
}
```

```js
import React, { useState, useCallback } from 'react';

const SampleComponent = (props) => {
  const [clicks, setClicks] = useState(props.initialCount);

  const onClickHandler = useCallback(() => {
    setClicks(clicks + 1);
  }, [clicks]);
  const isEven = useMemo(() => {
    return clicks % 2 === 0;
  }, [clicks]);

  return (
    <>
      <p>Clicks: {clicks}</p>
      <p>Is even: {isEven}</p>
      <a onClick={onClickHandler}>click</a>
    </>
  );
};
```

## MobX - reactions

```js
import React from 'react';

class SampleComponent extends React.Component {
  onClick = () => {
    this.clicks = this.clicks + 1;
  };

  @observable
  private clicks = this.props.initialCount;

  @disposeOnUnmount
  disposer = reaction(
   () => this.clicks,
   (clicks) => {
     console.log("clicks", clicks);
   }
  );

  @disposeOnUnmount
  propReaction = reaction(
   () => this.props.initialValue,
   () => {
     console.log("second click handler");
   }
  );

  render() {
    return (
        <>
            <p>Clicks: {this.clicks}</p>
            <a onClick={this.onClick}>click</a>
        </>
    );
  }
}
```

```js
import React, { useState, useCallback, useEffect } from 'react';

const SampleComponent = (props) => {
  const [clicks, setClicks] = useState(props.initialCount);

  const onClickHandler = useCallback(() => {
    setClicks(clicks + 1);
  }, [clicks]);
  useEffect(() => {
    console.log('clicks', clicks);
  }, [clicks]);
  useEffect(() => {
    console.log('second click handler');
  }, []);

  return (
    <>
      <p>Clicks: {clicks}</p>
      <a onClick={onClickHandler}>click</a>
    </>
  );
};
```

## Only processes top-level components

```js
import React from 'react';

class FooClass {
  static component = class extends React.Component {
    render() {
      return <div>Foo</div>;
    }
  };
}
```

## MobX - ViewState

```js
import { Component } from 'react';

class SampleComponent extends Component {

  private viewState = new ViewState();

  render() {
    return (
        <p>This component has a <span onClick={this.viewState.click}>ViewState</span></p>
    );
  }
}
```

```js
import { observer } from 'mobx-react';
import { useRef } from 'react';

const SampleComponentBase = () => {
  const viewState = useRef(new ViewState());

  return (
    <p>
      This component has a <span onClick={viewState.current.click}>ViewState</span>
    </p>
  );
};

export const SampleComponent = observer(SampleComponentBase);
```

## Prop types are preserved

```js
import React from 'react';

interface Props {
  name: string;
}

class SampleComponent extends React.Component<Props> {
  render() {
    return (
      <>
        <p>Hello {this.props.name}</p>
      </>
    );
  }
}
```

```ts
import React from 'react';

interface Props {
  name: string;
}

const SampleComponent = (props: Props) => {
  return (
    <>
      <p>Hello {props.name}</p>
    </>
  );
};
```

## Handle lifecycle events

```js
import { Component } from 'react';
import PropTypes from 'prop-types';

class Foo extends Component {
  componentDidMount() {
    console.log('mounted');
  }

  componentWillUnmount() {
    console.log('unmounted');
  }

  render() {
    return <p>Foo</p>;
  }
}

export default Foo;
```

```js
import { useEffect } from 'react';
import PropTypes from 'prop-types';

const Foo = () => {
  useEffect(() => {
    console.log('mounted');
  }, []);
  useEffect(() => {
    return () => {
      console.log('unmounted');
    };
  }, []);

  return <p>Foo</p>;
};

export default Foo;
```

## Pure JavaScript works, with no types inserted

```js
import { Component } from 'react';
import PropTypes from 'prop-types';

class Link extends Component {
  static propTypes = {
    href: PropTypes.string.isRequired,
  };

  render() {
    const { href } = this.props;

    return <a href={href}>Link Text</a>;
  }
}

export default Link;
```

```js
import { Component } from 'react';
import PropTypes from 'prop-types';

const Link = (props) => {
  const { href } = props;

  return <a href={href}>Link Text</a>;
};

Link.propTypes = {
  href: PropTypes.string.isRequired,
};

export default Link;
```

## Null observables work

```js
import React from "react";

class ObservedComponent extends React.Component {
  @observable
  private name?: string;

  @observable
  private age = 21;

  render() {
    const { name } = this;

    return (
      <>
        <p>Hello {name}, you are {this.age}</p>
      </>
    );
  }
}
```

```ts
import React, { useState } from 'react';

const ObservedComponent = () => {
  const [name, setName] = useState<string>(undefined);
  const [age, setAge] = useState(21);

  return (
    <>
      <p>
        Hello {name}, you are {age}
      </p>
    </>
  );
};
```

## MobX types are preserved and default props are good

```js
import React from "react";

interface Person {
  name: string;
}

class ObservedComponent extends React.Component {
  static defaultProps = { king: "viking" };

  @observable
  private me: Person = {
    name: "John",
  };

  render() {
    return (
      <>
        <p>This is {this.me.name}, {this.props.king}</p>
      </>
    );
  }
}
```

```ts
import React, { useState } from 'react';

interface Person {
  name: string;
}

const ObservedComponent = (inputProps) => {
  const [me, setMe] = useState<Person>({
    name: 'John',
  });

  const props = {
    king: 'viking',
    ...inputProps,
  };

  return (
    <>
      <p>
        This is {me.name}, {props.king}
      </p>
    </>
  );
};
```

## Use function component type definitions

If the codebase already uses `FunctionComponent`, use it.

```js
import { Component } from 'react';

const OtherComponent: React.FunctionComponent<{}> = () => {
  return <>Other</>;
};

class Link extends Component {
  state = {
    visible: false,
  };

  render() {
    return <></>;
  }
}

export default Link;
```

```js
import { useState } from 'react';

const OtherComponent: React.FunctionComponent<{}> = () => {
  return <>Other</>;
};

const Link: React.FunctionComponent<{}> = () => {
  const [visible, setVisible] = useState(false);

  return <></>;
};

export default Link;
```

## State defined as class attribute

```js
import { Component } from 'react';

class Link extends Component {
  state = {
    visible: false,
  };

  render() {
    return <></>;
  }
}

export default Link;
```

```js
import { useState } from 'react';

const Link = () => {
  const [visible, setVisible] = useState(false);

  return <></>;
};

export default Link;
```

## Identifier conflicts

Notice how the showDetails in `show()` should _not_ be replaced.

```js
import React, { Component, ReactNode } from 'react'

class InnerStuff extends Component<Props, State> {
    override state: State = { visible: false, showDetails: true }

    constructor(props: Props) {
        super(props)
    }

    render() {
        return <>Component</>
    }

    show(options: Options): void {
        const {
            otherStuff,
            showDetails = true,
        } = options;

        console.log("options are", showDetails);
    }
}
```

```ts
import React, { useState, useCallback, ReactNode } from 'react';

const InnerStuff = () => {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  const showHandler = useCallback(
    (options: Options) => {
      const { otherStuff, showDetails = true } = options;

      console.log('options are', showDetails);
    },
    [showDetails],
  );

  return <>Component</>;
};
```

## State defined in interface

```js
import { Component } from 'react';

class Link extends Component<Props, State> {
  render() {
    return <></>;
  }
}

interface State {
  visible?: boolean;
}

export default Link;
```

```ts
import { useState } from 'react';

const Link = () => {
  const [visible, setVisible] = useState<boolean | undefined>(undefined);

  return <></>;
};

interface State {
  visible?: boolean;
}

export default Link;
```

## Preserves constructor logic

```js
import { Component } from 'react';

class MyComponent extends Component {
  constructor(props: Props) {
    const five = 2 + 3;
    this.state = {
      secret: five;
    }
  }

  render() {
    return <></>
  }
}
```

```ts
import { useState } from 'react';

const MyComponent = () => {
  const five = 2 + 3;

  const [secret, setSecret] = useState(five);

  return <></>;
};
```

## Initializes and sets refs correctly

```js
import { Component } from 'react';

class Link extends Component {
  input = React.createRef<string>()
  private previouslyFocusedTextInput: InputHandle = {}
  show(options: Options): void {
    this.input.current = 'Hello world'
    this.previouslyFocusedTextInput = KeyboardHelper.currentlyFocusedInput()
  }

  render() {
    return <></>;
  }
}

export default Link;
```

```ts
import { useRef, useCallback } from 'react';

const Link = () => {
  const input = useRef<string>();
  const previouslyFocusedTextInput = useRef<InputHandle>({});
  const showHandler = useCallback((options: Options) => {
    input.current = 'Hello world';
    previouslyFocusedTextInput.current = KeyboardHelper.currentlyFocusedInput();
  }, []);

  return <></>;
};

export default Link;
```

## Preserves comments

```js
class MyComponent extends Component<PropsWithChildren> {
  /**
   * Comment on a static variable
   */
  private static someVariable: number | undefined

  /**
   * Comment on a private class property
   */
  private lucy = 'good'

  render() {
      return <></>
  }
}
```

```ts
const MyComponent = () => {
  /**
   * Comment on a private class property
   */
  const lucy = useRef('good');

  return <></>;
};

/**
 * Comment on a static variable
 */
MyComponent.someVariable = undefined;
```

# Examples

## From gutenberg

https://github.com/WordPress/gutenberg/pull/27682

```js
// before
/**
 * External dependencies
 */
import { debounce, includes } from 'lodash';

/**
 * WordPress dependencies
 */
import {
	Component,
	Children,
	cloneElement,
	concatChildren,
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import Popover from '../popover';
import Shortcut from '../shortcut';

/**
 * Time over children to wait before showing tooltip
 *
 * @type {number}
 */
const TOOLTIP_DELAY = 700;

class Tooltip extends Component {
	constructor() {
		super( ...arguments );

		this.delayedSetIsOver = debounce(
			( isOver ) => this.setState( { isOver } ),
			TOOLTIP_DELAY
		);

		/**
		 * Prebound `isInMouseDown` handler, created as a constant reference to
		 * assure ability to remove in component unmount.
		 *
		 * @type {Function}
		 */
		this.cancelIsMouseDown = this.createSetIsMouseDown( false );

		/**
		 * Whether a the mouse is currently pressed, used in determining whether
		 * to handle a focus event as displaying the tooltip immediately.
		 *
		 * @type {boolean}
		 */
		this.isInMouseDown = false;

		this.state = {
			isOver: false,
		};
	}

	componentWillUnmount() {
		this.delayedSetIsOver.cancel();

		document.removeEventListener( 'mouseup', this.cancelIsMouseDown );
	}

	emitToChild( eventName, event ) {
		const { children } = this.props;
		if ( Children.count( children ) !== 1 ) {
			return;
		}

		const child = Children.only( children );
		if ( typeof child.props[ eventName ] === 'function' ) {
			child.props[ eventName ]( event );
		}
	}

	createToggleIsOver( eventName, isDelayed ) {
		return ( event ) => {
			// Preserve original child callback behavior
			this.emitToChild( eventName, event );

			// Mouse events behave unreliably in React for disabled elements,
			// firing on mouseenter but not mouseleave.  Further, the default
			// behavior for disabled elements in some browsers is to ignore
			// mouse events. Don't bother trying to to handle them.
			//
			// See: https://github.com/facebook/react/issues/4251
			if ( event.currentTarget.disabled ) {
				return;
			}

			// A focus event will occur as a result of a mouse click, but it
			// should be disambiguated between interacting with the button and
			// using an explicit focus shift as a cue to display the tooltip.
			if ( 'focus' === event.type && this.isInMouseDown ) {
				return;
			}

			// Needed in case unsetting is over while delayed set pending, i.e.
			// quickly blur/mouseleave before delayedSetIsOver is called
			this.delayedSetIsOver.cancel();

			const isOver = includes( [ 'focus', 'mouseenter' ], event.type );
			if ( isOver === this.state.isOver ) {
				return;
			}

			if ( isDelayed ) {
				this.delayedSetIsOver( isOver );
			} else {
				this.setState( { isOver } );
			}
		};
	}

	/**
	 * Creates an event callback to handle assignment of the `isInMouseDown`
	 * instance property in response to a `mousedown` or `mouseup` event.
	 *
	 * @param {boolean} isMouseDown Whether handler is to be created for the
	 *                              `mousedown` event, as opposed to `mouseup`.
	 *
	 * @return {Function} Event callback handler.
	 */
	createSetIsMouseDown( isMouseDown ) {
		return ( event ) => {
			// Preserve original child callback behavior
			this.emitToChild(
				isMouseDown ? 'onMouseDown' : 'onMouseUp',
				event
			);

			// On mouse down, the next `mouseup` should revert the value of the
			// instance property and remove its own event handler. The bind is
			// made on the document since the `mouseup` might not occur within
			// the bounds of the element.
			document[
				isMouseDown ? 'addEventListener' : 'removeEventListener'
			]( 'mouseup', this.cancelIsMouseDown );

			this.isInMouseDown = isMouseDown;
		};
	}

	render() {
		const { children, position, text, shortcut } = this.props;
		if ( Children.count( children ) !== 1 ) {
			if ( 'development' === process.env.NODE_ENV ) {
				// eslint-disable-next-line no-console
				console.error(
					'Tooltip should be called with only a single child element.'
				);
			}

			return children;
		}

		const child = Children.only( children );
		const { isOver } = this.state;
		return cloneElement( child, {
			onMouseEnter: this.createToggleIsOver( 'onMouseEnter', true ),
			onMouseLeave: this.createToggleIsOver( 'onMouseLeave' ),
			onClick: this.createToggleIsOver( 'onClick' ),
			onFocus: this.createToggleIsOver( 'onFocus' ),
			onBlur: this.createToggleIsOver( 'onBlur' ),
			onMouseDown: this.createSetIsMouseDown( true ),
			children: concatChildren(
				child.props.children,
				isOver && (
					<Popover
						focusOnMount={ false }
						position={ position }
						className="components-tooltip"
						aria-hidden="true"
						animate={ false }
						noArrow={ true }
					>
						{ text }
						<Shortcut
							className="components-tooltip__shortcut"
							shortcut={ shortcut }
						/>
					</Popover>
				)
			),
		} );
	}
}

export default Tooltip;

// after
/**
 * External dependencies
 */
import { includes } from 'lodash';

/**
 * WordPress dependencies
 */
import {
	Children,
	cloneElement,
	concatChildren,
	useEffect,
	useState,
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import Popover from '../popover';
import Shortcut from '../shortcut';
import { useDebounce } from '@wordpress/compose';

/**
 * Time over children to wait before showing tooltip
 *
 * @type {number}
 */
export const TOOLTIP_DELAY = 700;

const emitToChild = ( children, eventName, event ) => {
	if ( Children.count( children ) !== 1 ) {
		return;
	}

	const child = Children.only( children );
	if ( typeof child.props[ eventName ] === 'function' ) {
		child.props[ eventName ]( event );
	}
};

function Tooltip( { children, position, text, shortcut } ) {
	/**
	 * Whether a mouse is currently pressed, used in determining whether
	 * to handle a focus event as displaying the tooltip immediately.
	 *
	 * @type {boolean}
	 */
	const [ isMouseDown, setIsMouseDown ] = useState( false );
	const [ isOver, setIsOver ] = useState( false );
	const delayedSetIsOver = useDebounce( setIsOver, TOOLTIP_DELAY );

	const createMouseDown = ( event ) => {
		// Preserve original child callback behavior
		emitToChild( children, 'onMouseDown', event );

		// On mouse down, the next `mouseup` should revert the value of the
		// instance property and remove its own event handler. The bind is
		// made on the document since the `mouseup` might not occur within
		// the bounds of the element.
		document.addEventListener( 'mouseup', cancelIsMouseDown );
		setIsMouseDown( true );
	};

	const createMouseUp = ( event ) => {
		emitToChild( children, 'onMouseUp', event );
		document.removeEventListener( 'mouseup', cancelIsMouseDown );
		setIsMouseDown( false );
	};

	const createMouseEvent = ( type ) => {
		if ( type === 'mouseUp' ) return createMouseUp;
		if ( type === 'mouseDown' ) return createMouseDown;
	};

	/**
	 * Prebound `isInMouseDown` handler, created as a constant reference to
	 * assure ability to remove in component unmount.
	 *
	 * @type {Function}
	 */
	const cancelIsMouseDown = createMouseEvent( 'mouseUp' );

	const createToggleIsOver = ( eventName, isDelayed ) => {
		return ( event ) => {
			// Preserve original child callback behavior
			emitToChild( children, eventName, event );

			// Mouse events behave unreliably in React for disabled elements,
			// firing on mouseenter but not mouseleave.  Further, the default
			// behavior for disabled elements in some browsers is to ignore
			// mouse events. Don't bother trying to to handle them.
			//
			// See: https://github.com/facebook/react/issues/4251
			if ( event.currentTarget.disabled ) {
				return;
			}

			// A focus event will occur as a result of a mouse click, but it
			// should be disambiguated between interacting with the button and
			// using an explicit focus shift as a cue to display the tooltip.
			if ( 'focus' === event.type && isMouseDown ) {
				return;
			}

			// Needed in case unsetting is over while delayed set pending, i.e.
			// quickly blur/mouseleave before delayedSetIsOver is called
			delayedSetIsOver.cancel();

			const _isOver = includes( [ 'focus', 'mouseenter' ], event.type );
			if ( _isOver === isOver ) {
				return;
			}

			if ( isDelayed ) {
				delayedSetIsOver( _isOver );
			} else {
				setIsOver( _isOver );
			}
		};
	};
	const clearOnUnmount = () => {
		delayedSetIsOver.cancel();
	};

	useEffect( () => clearOnUnmount, [] );

	if ( Children.count( children ) !== 1 ) {
		if ( 'development' === process.env.NODE_ENV ) {
			// eslint-disable-next-line no-console
			console.error(
				'Tooltip should be called with only a single child element.'
			);
		}

		return children;
	}

	const child = Children.only( children );
	return cloneElement( child, {
		onMouseEnter: createToggleIsOver( 'onMouseEnter', true ),
		onMouseLeave: createToggleIsOver( 'onMouseLeave' ),
		onClick: createToggleIsOver( 'onClick' ),
		onFocus: createToggleIsOver( 'onFocus' ),
		onBlur: createToggleIsOver( 'onBlur' ),
		onMouseDown: createMouseEvent( 'mouseDown' ),
		children: concatChildren(
			child.props.children,
			isOver && (
				<Popover
					focusOnMount={ false }
					position={ position }
					className="components-tooltip"
					aria-hidden="true"
					animate={ false }
					noArrow={ true }
				>
					{ text }
					<Shortcut
						className="components-tooltip__shortcut"
						shortcut={ shortcut }
					/>
				</Popover>
			)
		),
	} );
}

export default Tooltip;
```
