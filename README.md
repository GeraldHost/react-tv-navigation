# Spatial Navigation for TVs

WIP for a declarative approach to TV navigation.

The navigation system is based on the idea of a grid. Ispired by [this post](https://netflixtechblog.com/pass-the-remote-user-input-on-tv-devices-923f6920c9a8) by netflix. We utilise a focus tree to track elements. Each element can be a Row, Col or Container. If you have used any grid systems this should be familiar. As each element mounts the dom we add it to the focus tree. Then when we get a user input (LRUD) we traverse the tree to the next node. To do this it's just a simple while loop with a stack. So in theory it should be fast. The idea of this system is to be 1. simple to implement and 2. easy to extend and change how the focus behaviour works per component if desired.

![tv-navigation-preview](https://i.imgur.com/zTyjPt7.gif)

## TODO:

- Create example like Netflix
- Implement focus on hover to support pointer remotes
- more tests!
- Write a babel plugin to do the focus names? rather than making the user set them as a prop?

## Bugs

