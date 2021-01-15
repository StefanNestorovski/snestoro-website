class Vector2D {
    constructor(x, y) {
        this.x = Math.round(x) || 0;
        this.y = Math.round(y) || 0;
    }

    static distanceBetweenPoints(a, b) {
        const xd = Math.abs(b.x - a.x);
        const yd = Math.abs(b.y - a.y);

        const distance = Math.sqrt(Math.pow(xd, 2) + Math.pow(yd, 2));

        return distance;
    }

    static radiansBetweenPoints(a, b) {
        const xd = b.x - a.x;
        const yd = b.y - a.y;

        const angle = Math.atan2(yd, xd);
        return angle;
    }
}