import * as grit from '@getgrit/api';

export async function execute() {
  const tokens = await grit.stdlib.apply(
    {
      query: `engine marzano(0.1)
language js

js"colors = { $colors }" where {
  $dunk = js"thing",
      $colors <: some bubble($alias) js"$name: theme.$label" where {
          //   Build the next rewrite inline
          // $alias += js"\`'$name'\` => \`'$label'\`, "
      }
}`,
      extract: ['$dunk'],
    },
    {},
  );
  if (!tokens.success) return tokens;
  console.log('got back', tokens);
  //   const rewrites = tokens.outputs.find((o) => o.name === '$alias').content;
  //   const query = `engine marzano
  // language js

  // js"color($color)" where { $color <: or { ${rewrites} }`;
  //   console.log(query);
  //   const colors = await grit.stdlib.apply(
  //     {
  //       query,
  //     },
  //     {},
  //   );

  return {
    success: true,
    message: `Success.`,
  };
}
