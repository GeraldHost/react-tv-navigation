# Spatial Navigation for TVs

WIP for a declarative approach to TV navigation.

The navigation system is based on the idea of a grid. Inspired by [this post](https://netflixtechblog.com/pass-the-remote-user-input-on-tv-devices-923f6920c9a8) by netflix. We utilise a focus tree to track elements. Each element can be a Row, Col or Container. If you have used any grid systems this should be familiar. As each element mounts the dom we add it to the focus tree. Then when we get a user input (LRUD) we traverse the tree to the next node. To do this it's just a simple while loop with a stack. So in theory it should be fast. The idea of this system is to be 1. simple to implement and 2. easy to extend and change how the focus behaviour works per component if desired.

## [Demo click here](https://geraldhost.github.io/react-tv-navigation/)

![tv-navigation-preview](https://i.imgur.com/GdU0WSc.gif)

## Get started

This repo uses yarn workspaces to pull in the packages so make sure you use `yarn` to install dependencies. First run:

```
yarn
```

Then run:

```
yarn start
```

Good to go. By default it will run on port `8080`

## Main Files

- `packages/tv-navigation`
  - `src/focusStore.js` does all the building and traversing of focus tree
  - `src/Focusable.js` is the Focusable HOC

## Basic Usage

```js
import { RootFocusRow, focusedCol, focusedRow } from "tv-navigation";

const FocusableRow = focusedRow((props) => <div {...props} />);
const FocusableCol = focusedCol((props) => <div {...props} />);

function App() {
  return (
    <RootFocusRow initialFocusNode="row">
        <FocusableRow name="row" container>
          <FocusableCol name="col-a" />
          <FocusableCol name="col-b" />
        </FocusableRow>
...
```

The one annouying thing is the fact you have to define name for each focusable item. This is currently the most performant way of building the tree without having to generate UIDs and track those. But I don't like this API. The current idea is to possible write a babel plugin that can create those values statically. But I need to give it some more thought!

## Before Active

before a component becomes active we can register a shim/middleware to change the focus behaviour. Under the hood it is using useEffect so we can pass in a deps array

```js
import { useBeforeActive } from "tv-navigation";

const Component = ({ name, ...props }) => {
  useBeforeActive(name, (activeNode, previousNode) => activeNode, [deps]);

  return ( ... );
}
```

## In Progress:

- Create `<View />` component to use as stack navigation system

## Bugs
