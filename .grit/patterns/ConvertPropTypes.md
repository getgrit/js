---
title: Convert React PropTypes to TypeScript
---

Convert prop types to TypeScript interfaces, including default values.

tags: #react, #style, #migration, #typescript, #prop-types

```grit
cv.grit

```

## grit/example.js

```js
import {PropTypes} from 'prop-types';



export type Defaultize<T, D> =
  // The properties that don't have default values
  Omit<T, keyof D> &
    // plus the properties that have default values, but being optional
    Partial<D>;

export type InferDefaultProps<T, D> = Defaultize<InferProps<T>, D>;

export const CardDefaultValues = {
  disabled: false,
  selected: false,
  horizontalPadding: 10,
  verticalPadding: 15,
  radius: 0,
  border: 0,
};

export const CardPropTypes = {
  /** Boolean, disables the component */
  disabled: PropTypes.bool,
  /** Boolean, mark element as selected */
  selected: PropTypes.bool,
  /** Numeric, set the border radius of the component */
  radius: PropTypes.number,
  /** Numeric, set the border width of the component */
  border: PropTypes.number,
  /** Numeric, set the horizontal padding of the component */
  horizontalPadding: PropTypes.number,
  /** Numeric, set the vertical padding width of the component */
  verticalPadding: PropTypes.number,
  /** Node, Body content of component */
  children: PropTypes.node.isRequired,
};

export type CardProps = InferDefaultProps<typeof CardPropTypes, typeof CardDefaultValues>;

export const Card = (props: CardProps) => {
  const {
    disabled,
    selected,
    radius,
    border,
    horizontalPadding,
    verticalPadding,
    children
  } = props;

  return <>Card</>;
};

```

```js
export interface CardProps {
  disabled: boolean;
  selected: boolean;
  radius: number;
  border: number;
  horizontalPadding: number;
  verticalPadding: number;
  children: React.ReactNode;
}

export const Card = (props: CardProps) => {
  const {
    disabled = false,
    selected = false,
    horizontalPadding = 10,
    verticalPadding = 15,
    radius = 0,
    border = 0,
    children,
  } = props;

  return <>Card</>;
};
```

## grit/test-1.js

```js
import PropTypes, { InferProps } from 'prop-types';

type FuncDef = (...args: unknown[]) => unknown

export const CardPropTypes = {
    b: PropTypes.objectOf(PropTypes.number.isRequired),
      enum: PropTypes.oneOf([1, 2, 3]),
    unionType: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  shapely: PropTypes.shape({
    optionalProperty: PropTypes.string,
    requiredProperty: PropTypes.number.isRequired,
    functionProperty: PropTypes.func,
  }),
  funky: PropTypes.func,
  a: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.number.isRequired
  }).isRequired),
  node: PropTypes.node,


numArray: PropTypes.arrayOf(PropTypes.number.isRequired),
  instanceOf: PropTypes.instanceOf(Message),

  /** Boolean, disables the component */
  disabled: PropTypes.bool,
  symbolic: PropTypes.symbol,
  selected: PropTypes.bool,
  things: PropTypes.array,
  border: PropTypes.number.isRequired,
bar: PropTypes.string.isRequired,
  horizontalPadding: PropTypes.number,
  verticalPadding: PropTypes.number,
  children: PropTypes.node.isRequired,
};

export type Defaultize<T, D> =
  // The properties that don't have default values
  Omit<T, keyof D> &
    // plus the properties that have default values, but being optional
    Partial<D>;

export type InferDefaultProps<T, D> = Defaultize<InferProps<T>, D>;

export const CardDefaultValues = {
  disabled: false,
  selected: false,
  horizontalPadding: 10,
  verticalPadding: 15,
  radius: 0,
  border: 0,
};


export type CardProps = InferDefaultProps<typeof CardPropTypes, typeof CardDefaultValues>;

export const Card = (props: CardProps) => {
  const {
    disabled,
    selected,
    radius,
    border,
    horizontalPadding,
    verticalPadding,
    children,
  } = props;

  return <>Card</>;
};

```

```js
type FuncDef = (...args: unknown[]) => unknown

export interface CardProps {
  b: Record<string, number>;
  enum: 1 | 2 | 3;
  unionType: join(
    " | "
    [
      or(variants = [Identifier(name = "string"), JSXIdentifier(name = "string")])
      or(variants = [Identifier(name = "number"), JSXIdentifier(name = "number")])
    ]
  );
  shapely: {
    optionalProperty: string;
    requiredProperty: number;
    functionProperty: (...args: unknown[]) => unknown;
  };
  funky: (...args: unknown[]) => unknown;
  a: unknown[];
  node: React.ReactNode;
  numArray: number[];
  instanceOf: Message;
  disabled: boolean;
  symbolic: symbol;
  selected: boolean;
  things: unknown[];
  border: number;
  bar: string;
  horizontalPadding: number;
  verticalPadding: number;
  children: React.ReactNode;
}

export const Card = (props: CardProps) => {
  const {
    disabled = false,
    selected = false,
    horizontalPadding = 10,
    verticalPadding = 15,
    radius = 0,
    border = 0,
    children
  } = props;

  return <>Card</>;
};

```
