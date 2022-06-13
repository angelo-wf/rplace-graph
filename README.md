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
- The bottom 32 bits contain the pixel location and color in the following format: `xxxxxxxx xxxyyyyy yyyyyycc ccc-----`. These are a bit-packed X position, Y position and color-index (an index into the colors found below)
- If the X-position is 2047, it is instead a mod-rectangle. The Y-position is an index into the mod-rectangles found below.

## Viewer

`viewer` contains a simple viewer that shows a timelapse of the r/place event. Open `index.html`, then open `data.bin` with the file-select. Press **Play** to start playing or pause, **Step** to step one frame or **Reset** to reset. It will use `requestAnimationFrame` to animate the timelapse, and will progress 5 minutes each frame. It shows the date, time since r/place's start and the raw time value at the top.

## Graph details

The grapher works by first figuring out the 'average' pixels for the defined area, by looking what color each pixel spend the most time as in the defined period. This forms the generated template. It then runs through the data again to see, per second, how many pixels match this template. This data is then reduced to one sample per 5 minutes by taking the average of each set of 300 values and then drawn as a graph on a canvas.

The grapher does not take the mod-rectangles into account.

## Graph

`graph` contains the tool to generate graphs from the data. Defined at the top of  `main.js` is an array of templates called `temps`. Each template has the following properties:
- `x`, `y`, `width` and `height` as the location and size of the area on the canvas to use.
- `startTime` and `endTime` to indicate which period to use for generating a template (using the raw time values the viewer shows).
- (optional) `templateX` and `templateY` for a location in `templates.png` to use as the alpha-map. If not defined, will use the whole rectangle.
- `graphCol` as the color-index for the graph.
- (optional) `startTimeGraph` and `endTimeGraph` to indicate which period to use for the graph. If not defined, will use the same period as used for the template.

`templates.png` contains the alpha-maps used. Pixels with a value higher than 127 for the red-channel will be seen as ***not*** part of the design.

Open `index.html` and load `data.bin` in the file-select to start. It will draw the 32 colors of r/place at the top of the canvas. Press **Next** to handle the first template, which will draw the generated template (average pixels) and the alpha-map used next to it underneath those colors, and the generated graph lower down. Pressing **Next** again goes to the next template in the array, will update the generated template/alpha-map and draw the next graph underneath the last drawn one.

## Colors and mod-rectangles

The color-index indexes into the following colors:

| index | color (hex value) |
| - | - |
| 0 | #000000 |
| 1 | #00756F |
| 2 | #009EAA |
| 3 | #00A368 |
| 4 | #00CC78 |
| 5 | #00CCC0 |
| 6 | #2450A4 |
| 7 | #3690EA |
| 8 | #493AC1 |
| 9 | #515252 |
| 10 | #51E9F4 |
| 11 | #6A5CFF |
| 12 | #6D001A |
| 13 | #6D482F |
| 14 | #7EED56 |
| 15 | #811E9F |
| 16 | #898D90 |
| 17 | #94B3FF |
| 18 | #9C6926 |
| 19 | #B44AC0 |
| 20 | #BE0039 |
| 21 | #D4D7D9 |
| 22 | #DE107F |
| 23 | #E4ABFF |
| 24 | #FF3881 |
| 25 | #FF4500 |
| 26 | #FF99AA |
| 27 | #FFA800 |
| 28 | #FFB470 |
| 29 | #FFD635 |
| 30 | #FFF8B8 |
| 31 | #FFFFFF |

The mod-rectangles are as follows, coordinates are inclusive:

| Index | top left X | top left Y | bottom right X | bottom right Y |
| - | - | - | - | - |
| 0 | 862 | 540 | 868 | 544 |
| 1 | 862 | 540 | 873 | 545 |
| 2 | 871 | 546 | 878 | 550 |
| 3 | 23 | 1523 | 172 | 1792 |
| 4 | 44 | 1652 | 165 | 1899 |
| 5 | 51 | 1691 | 154 | 1807 |
| 6 | 297 | 1750 | 364 | 1813 |
| 7 | 1349 | 1718 | 1424 | 1752 |
| 8 | 298 | 1770 | 334 | 1803 |
| 9 | 298 | 1805 | 329 | 1839 |
| 10 | 257 | 1736 | 296 | 1780 |
| 11 | 251 | 1805 | 296 | 1812 |
| 12 | 271 | 1835 | 296 | 1859 |
| 13 | 551 | 1311 | 562 | 1342 |
| 14 | 547 | 1330 | 550 | 1342 |
| 15 | 1373 | 1400 | 1419 | 1436 |
| 16 | 1371 | 1438 | 1418 | 1472 |
| 17 | 1372 | 1472 | 1406 | 1497 |
| 18 | 1375 | 1355 | 1424 | 1399 |

These can also be found as arrays in both `main.js` files.

## Licence

Licensed under the MIT license, see LICENSE for details.
