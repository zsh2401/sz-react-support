# sz-react-support

```sh
npm install --save sz-react-support
```

## Usage

### useAsyncState

useAsyncState is the most powerful feature of this library.
It give us the best way to manage async state in react.

```typescript
function Component() {
  const { state } = useAsyncState({
    loader: async () => await (await fetch("/api/foo/")).json(),
    reloadOnMounted: true,
  });
  return <div>{state}</div>;
}
```
