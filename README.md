# claude-usage-bar-for-api

`cost-bar` is a Claude Code mod that shows the session cost (the figure `/cost` totals) in a bar above the prompt.

```
Session cost: $0.042
```

## Install

```
/plugin install cost-bar --marketplace <owner>/<repo>
```

Answer `y` to add the marketplace, then pick a scope. Needs Claude Code 2.1.287+.

Try it without installing: `claude --plugin-dir /path/to/this/repo`

## How it works

`session.measure` pushes the running cost after each turn; `hooks/register.tsx` stores it and draws it in the `AbovePrompt` slot. The bar stays hidden until a cost is known.
