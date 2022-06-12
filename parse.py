
import csv
from datetime import datetime
import struct

# 160353104 rows
# time relative to 1648817050315
# ['time', 'user', 'color', 'x', 'y', 'tx', 'ty']
# reduced data from u/lornedon
# https://www.reddit.com/r/place/comments/tzqf76/i_shrank_and_indexed_the_data_from_the_rplace/


# correction for wrongly placed mod-rectangles
boxCorrect = {
    (862, 540, 868, 544): (862, 540, 868, 544),
    (862, 540, 873, 545): (862, 540, 873, 545),
    (871, 546, 878, 550): (871, 546, 878, 550),
    (23, 523, 172, 792): (23, 1523, 172, 1792),
    (44, 652, 165, 899): (44, 1652, 165, 1899),
    (51, 691, 154, 807): (51, 1691, 154, 1807),
    (297, 750, 364, 813): (297, 1750, 364, 1813),
    (349, 718, 424, 752): (1349, 1718, 1424, 1752),
    (298, 770, 334, 803): (298, 1770, 334, 1803),
    (298, 805, 329, 839): (298, 1805, 329, 1839),
    (257, 736, 296, 780): (257, 1736, 296, 1780),
    (251, 805, 296, 812): (251, 1805, 296, 1812),
    (271, 835, 296, 859): (271, 1835, 296, 1859),
    (551, 311, 562, 342): (551, 1311, 562, 1342),
    (547, 330, 550, 342): (547, 1330, 550, 1342),
    (373, 400, 419, 436): (1373, 1400, 1419, 1436),
    (371, 438, 418, 472): (1371, 1438, 1418, 1472),
    (372, 472, 406, 497): (1372, 1472, 1406, 1497),
    (375, 355, 424, 399): (1375, 1355, 1424, 1399)
}

boxIndex = [
    (862, 540, 868, 544),
    (862, 540, 873, 545),
    (871, 546, 878, 550),
    (23, 523, 172, 792),
    (44, 652, 165, 899),
    (51, 691, 154, 807),
    (297, 750, 364, 813),
    (349, 718, 424, 752),
    (298, 770, 334, 803),
    (298, 805, 329, 839),
    (257, 736, 296, 780),
    (251, 805, 296, 812),
    (271, 835, 296, 859),
    (551, 311, 562, 342),
    (547, 330, 550, 342),
    (373, 400, 419, 436),
    (371, 438, 418, 472),
    (372, 472, 406, 497),
    (375, 355, 424, 399)
]

with open("data.bin", "wb") as of:
    with open("place_reduced.csv", "r") as f:
        reader = csv.reader(f)
        headers = next(reader)
        print(headers)
        count = 0
        for row in reader:
            x = int(row[3])
            y = int(row[4])
            col = int(row[2])
            time = int(row[0])
            # xxxxxxxx xxxyyyyy yyyyyycc ccc-----
            if row[5] != "":
                x2 = int(row[5])
                y2 = int(row[6])
                box_idx = boxIndex.index((x, y, x2, y2))
                # block
                val = (2047 << 21) | (box_idx << 10) | (col << 5)
                of.write(struct.pack("I", val))
            else:
                val = (x << 21) | (y << 10) | (col << 5)
                of.write(struct.pack("I", val))

            of.write(struct.pack("I", time))

            count += 1
            if count % 10000000 == 0:
                print("at", count)

        print(count)
