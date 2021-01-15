class Country {
    constructor(center) {
        this.center = center;
        this.pointsInside = [];
        this.outerPoints = this.outerBoundary();
    }

    addPoints(points) {
        if (points.length) {
            this.pointsInside.push(...points);
        } else {
            this.pointsInside.push(points);
        }
        this.outerPoints = this.outerBoundary();
    }

    outerBoundary() {
        let numberCuts = 10;
        let sections = {};
        let boundary = [];
        for (let i = -numberCuts/2; i < numberCuts/2; i++) {
            let section = i * (2*Math.PI / numberCuts);
            // console.log(section)
            sections[section] = [];
        }
        for (let [index, point] of this.pointsInside.entries()) {
            let angle = Vector2D.radiansBetweenPoints(this.center, point);
            let sec = -10;
            for (let section in sections) {
                if (parseFloat(angle) > parseFloat(section)) {
                    if (parseFloat(section) > parseFloat(sec)) {
                        sec = section;
                    }
                }
            }
            sections[sec].push({
                index: index,
                distance: Vector2D.distanceBetweenPoints(this.center, point)
            });
        }
        let sectionKeys = Object.keys(sections).sort((a, b) => {
            if (parseFloat(a) > parseFloat(b)) {
                return -1;
            } else {
                return 1;
            }
        });
        for (let section of sectionKeys) {
            let farthestDistance = 0;
            let index = 0;
            for (let point of sections[section]) {
                if (point.distance > farthestDistance) {
                    farthestDistance = point.distance;
                    index = point.index;
                }
            }
            boundary.push(this.pointsInside[index]);
        }
        return boundary;
    }
}