class Utils {
    constructor() {

    }

    static createRandomPoints2Dspace(numOfPoints, maxX, maxY) {
        let points = [];

        let x = Math.random() * maxX;
        let y = Math.random() * maxY;
        points.push(new Vector2D(x, y))
        let radius = 4;
        let rad = Math.random() * 2 * Math.PI;
        for (let i = 1; i < numOfPoints; i++) {
            rad += (Math.random() * 1 * Math.PI) - Math.PI / 2;
            x += radius * Math.cos(rad);
            y += radius * Math.sin(rad);
            if (x > 0 && x < maxX && y > 0 && y < maxY) {
                points.push(new Vector2D(x, y));
            } else {
                i--;
                x -= radius * Math.cos(rad);
                y -= radius * Math.sin(rad);
            }
        }

        return points;
    }

    static create2DGridPoints(numOfPoints, maxX, maxY) {
        let points = [];

        const ratio = maxY / maxX;

        const numCols = Math.sqrt(numOfPoints / ratio);
        const numRows = numOfPoints / numCols;

        const width = maxX / (numCols + 1);
        const height = maxY / (numRows + 1);

        for (let j = 0; j < numRows; j++) {
            points[j] = [];
            for (let i = 0; i < numCols; i++) {
                points[j].push(new Vector2D((i + 1) * width, (j + 1) * height))
            }
        }

        return points;
    }

    static wigglePoint(point, radius) {
        let rad = Math.random() * 2 * Math.PI;
        point.x += Math.round(radius * Math.cos(rad));
        point.y += Math.round(radius * Math.sin(rad));
    }
}