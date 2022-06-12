# rplace-graph
Tool to generate graphs from r/place data

This is a tool to generate graphs showing 'correctness' of a particular area for a particular period of Reddit's r/place event (2022). It makes use of the [condensed r/place dataset](https://www.reddit.com/r/place/comments/tzqf76/i_shrank_and_indexed_the_data_from_the_rplace/) by Reddit user u/Lornedon, specifically the `place_reduced.csv` file.

It consists of tools to transform this data into a more compact binary format (`data.bin`), sorted on date/time and the tool to generate a graph from this data. It also contains a viewer that shows a simple timelapse of the event using the generated data.

## generating `data.bin`

- Obtain `place_reduced.csv` from u/Lornedon condensed r/place dataset.
- Run `parse.py` using Python 3, which will generate a `data.bin` file with this data, unsorted.
- Compile `sort.c` to `sort` using a C compiler (clang example: `clang -O3 -o sort sort.c`)
- Run `sort` (`./sort`), which will replace `data.bin` with a version that is sorted on date/time.

This `data.bin` contains all of the placed pixels using a 64-bit little endian unsigned integer per entry:
- The top 32 bits contain the timestamp, in milliseconds since the start of the event.
- The bottom 32 bits contain the pixel location and color in the following format: `xxxxxxxx xxxyyyyy yyyyyycc ccc-----`. These are a bit-packed X position, Y position and color (color as index into `colors` array in `main.js`, found in both `viewer` and `graph`)
- If the X-position is 2047, it is instead a moderation-rectangle. The Y-position is an index into the `boxes` array in `main.js`. This array contains entries with the X and Y position of the top-left corner and the X and Y position of the bottom-right corner, inclusive.

## Viewer

`viewer` contains a simple viewer that shows a timelapse of the r/place event. Open `index.html`, then open `data.bin` with the file-select. Press **Play** to start playing or pause, **Step** to step one frame or **Reset** to reset. It will use `requestAnimationFrame` to animate the timelapse, and will progress 5 minutes each frame. It shows the date, time since r/place's start and the raw time value at the top.

## Graph details

The grapher works by first figuring out the 'average' pixels for the defined area, by looking what color each pixel spend the most time as in the defined period. This forms the generated template. It then runs through the data again to see, per second, how many pixels match this template. This data is then reduced to one sample per 5 minutes by taking the average of each set of 300 values and then drawn as a graph on a canvas.

## Graph

`graph` contains the tool to generate graphs from the data. Starting from line 15 in `main.js` is an array of templates called `temps`. Each template has the following properties:
- `x`, `y`, `width` and `height` as the location and size of the area on the canvas to use.
- `startTime` and `endTime` to indicate which period to use (using the raw time values the viewer shows).
- `templateX` and `templateY` for a location in `templates.png` to use as the alpha-map, set `templateX` to `-1` to not use a template (use the entire rectangle).
- `graphCol` as the color (as an index in the `colors` array, line 128).

`templates.png` contains the alpha-maps used. Pixels with a value higher than 127 for the red-channel will be seen as ***not*** part of the design.

Open `index.html` and load `data.bin` in the file-select to start. It will draw the 32 colors of r/place at the top of the canvas. Press **Next** to handle the first template, which will draw the generated template (average pixels) and the alpha-map used next to it underneath those colors, and the generated graph lower down. Pressing **Next** again goes to the next template in the array, will update the generated template/alpha-map and draw the next graph underneath the last drawn one.

## Licence

Licensed under the MIT license, see LICENSE for details.
