import * as grit from '@getgrit/api';

export async function execute(options: grit.WorkflowOptions) {
  const transformResult = await grit.stdlib.transform(
    {
      objective: `You are an expert software engineer working on a migration from moment.js to date-fns.
      Given an expression using Moment.js, replace it with the date-fns equivalent.`,
      principles: ['Use the twMerge library to conditionally combine classes.'],
      model: 'slow',
      query: 'js"moment($_).$_"',
      examples: [
        {
          input: `let text = moment(timestamp).fromNow();`,
          replacements: [`let text = formatDistanceToNow(timestamp, { addSuffix: true });`],
        },
      ],
    },
    {},
  );
  return transformResult;
}
