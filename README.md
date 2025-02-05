# RectangleResizeTask

Task was completed using React (TypeScript), Vite and ASP .NET Core (C#).

# DESCRIPTION

TL;DR - all of the given tasks were completed.

This app allows users to resize a rectangle inside a SVG figure. Rectangle has four corners, which clicked upon and dragged, resizes the rectangle from the respective corners.

Once the resizing is done (mouse button is lifted), back-end validates whether the width of the rectangle is smaller than the height. If the height is smaller - then it returns appropriate statuses.

Added a Task delay, which essentially does the validation 10 seconds after the request was sent. Each request is queued, and each response is logged inside the console with width, height and timestamp of the request.

In addition to resizing, I have added a possibillity to drag the rectangle around the container, since the coordinates for resize handlers coordinates are used.

Rectangle cannot go outside of the corners of the container.

Each time rectangle is interacted with (dragged or resized), data is saved in .json file and when page is refreshed the rectangle stays in the same place.

Width, height and perimeter are also displayed.

# Task for Candidate

Create a webpage, for drawing rectangle SVG figure.

Near to the figure display the perimeter of the figure.

Requirements:

•	The initial dimensions of the SVG figure need to be taken from JSON file.

•	The user should be able to resize the figure by mouse.

•	Need to display the perimeter of the figure.

•	After resizing, the system must update the JSON file with new dimensions.

•	When resizing rectangle finishes it should be validated at BackEnd level. If the rectangle width exceeds height it should send back error to UI . The duration of validation in BackEnd should be artificially increased to 10 seconds (To imitate long-lasting calculations) 

•	User can resize rectangle while previous validation is still not completed

Implement by using React (frontend) and C# (for JSON taking and saving through API).






