# Next.js App Directory

Migrate to the [beta Next.js app directory](https://beta.nextjs.org/docs/upgrade-guide#migrating-from-pages-to-app).

```grit
language js

pattern ReactNode($name, $props, $children) = or {
    `<$name $props>$children</$name>`
    `<$name $props />`
}
```
