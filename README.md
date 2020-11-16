# Spatial Navigation for TVs

WIP for a declarative approach to TV navigation

## TODO:

- Refactor traversal to not use recursion. Instead use a while loop
- Refactor HOC so that it is a partial app and takes a focus type arg e.g withFocus("col")();
- Create example like Netflix
- Implement focus on hover to support pointer remotes
- Register key press event listeners
- more tests!
- Write a babel plugin to do the focus names? rather than making the user set them as a prop?

## Bugs

- When you trigger "down" on initial view it goes to the last node :/ 