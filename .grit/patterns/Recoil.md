# Migrate to Recoil.js

(Alpha) Replaces raw React state management (via `useState`) with Recoil.js.

```grit
language js

// This pattern is just a prototype. It's not ready for production.

// Look at each file as a whole
Program(body=$body) where {
    // Start an array of new atoms to add
    $atoms = []
    $body <: contains bubble($atoms) `const [$val, $set] = $useState($initial)` where {
        $atom = s"${val}State"
        $atoms = [...$atoms, `const $atom = atom({
            key: $val,
            default: $initial
        })`]
        $useState <: `useState` => `useRecoilState`
        $initial => Identifier(name=$atom)
    }
    InsertAfterImports($atoms)
}
```

## Simple useState

```js
import React, { useState } from "react";

const Counter = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  return (
    <div>
      <h2>{name || "Counter"}</h2>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <div>
        <label htmlFor="name">Name: </label>
        <input type="text" id="name" value={name} onChange={handleNameChange} />
      </div>
    </div>
  );
};

export default Counter;
```

```js
import React, { useState } from "react";

const countState = atom({
  key: count,
  default: 0
});

const nameState = atom({
  key: name,
  default: ""
});

const Counter = () => {
  const [count, setCount] = useRecoilState(countState);
  const [name, setName] = useRecoilState(nameState);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  return (
    <div>
      <h2>{name || "Counter"}</h2>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <div>
        <label htmlFor="name">Name: </label>
        <input type="text" id="name" value={name} onChange={handleNameChange} />
      </div>
    </div>
  );
};

export default Counter;
```
