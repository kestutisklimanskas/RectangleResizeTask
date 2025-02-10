# RectangleResizeTask

Completed using React (TypeScript), Vite and ASP .NET Core (C#).

# DESCRIPTION

This app allows users to resize a rectangle inside a SVG figure. Rectangle has four corners, which clicked upon and dragged, resizes the rectangle from the respective corners.

Once the resizing is done (mouse button is lifted), back-end validates whether the width of the rectangle is smaller than the height. If the height is smaller - then it returns appropriate status.

Added a Task delay, which essentially does the validation 10 seconds after the request was sent. Each request is queued, and each response is logged inside the console with width, height and timestamp of the request.

In addition to resizing, added a possibillity to drag the rectangle around the container and the coordinates are saved too.

Rectangle cannot go outside of the corners of the container.

Each time rectangle is interacted with (dragged or resized), data is saved in .json file and when page is refreshed the rectangle stays in the same place.

Width, height and perimeter are also displayed near the SVG figure.

Added CORS








