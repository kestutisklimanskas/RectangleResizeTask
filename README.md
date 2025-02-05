# RectangleResizeTask

Task was completed using React (TypeScript), Vite and ASP .NET Core (C#).

# DESCRIPTION

TL;DR - all of the given tasks were completed.

This app allows users to resize a rectangle inside a SVG figure. Rectangle has four corners, which clicked upon and dragged, resizes the rectangle from the respective corners.

Once the resizing is done (mouse button is lifted), back-end validates whether the width of the rectangle is smaller than the height. If the height is smaller - then it returns appropriate status.

Added a Task delay, which essentially does the validation 10 seconds after the request was sent. Each request is queued, and each response is logged inside the console with width, height and timestamp of the request.

In addition to resizing, I have added a possibillity to drag the rectangle around the container, since the coordinates for resize handlers coordinates are used anyway.

Rectangle cannot go outside of the corners of the container.

Each time rectangle is interacted with (dragged or resized), data is saved in .json file and when page is refreshed the rectangle stays in the same place.

Width, height and perimeter are also displayed.

Also added CORS, because project uses different ports and I thought I might need that.

# CLONE THE REPOSITORY
```
git clone https://github.com/kestutisklimanskas/RectangleResizeTask.git
```
or
```
gh repo clone kestutisklimanskas/RectangleResizeTask
```







