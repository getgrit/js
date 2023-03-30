# Vue 2 to Vue 3

```grit
language js

`@Component({$props})export default class $cls { $body }` => `export default defineComponent({
    name: "$cls",
    $props,
    setup(props, context) {
        $setupBody
    }
})` where {
    $setupBody = []
    $body <: maybe contains bubble($setupBody) `$val: $t = $initial` where {
        $setupBody = [...$setupBody, `const $val: Ref<$t> = ref($initial)`]
    }
}
```

## Simple Components

```js
// OLD:
@Component({
  components: {DependencyComponent1,DependencyComponent2},
})
export default class MyComponent extends Vue {
    myDataValue: string = "";
}
// NEW:
export default defineComponent({
  name: "MyComponent",
  components: {DependencyComponent1,DependencyComponent2},
  setup(props, context) {
  },
});
```
