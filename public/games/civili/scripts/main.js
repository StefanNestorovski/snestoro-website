let canvas;
let ctx;
const PIXEL_SIZE = 3;

window.onload = function () {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    let mouseLoc = {};
    let draw = new Draw(ctx, canvas);
    let countries = [];

    createListeners(mouseLoc);
    generateMap(countries);
    draw.clearScreen("blue");


    for (let country of countries) {
        draw.drawPoints(country.pointsInside, Draw.getRndColor());
        // draw.drawShape(country.outerPoints, Draw.getRndColor());
        draw.drawPoint(country.center);
    }

    let startT = Date.now();


    const gameLoop = () => {
        // draw.drawPoint(mouseLoc, "green");
        // draw.clearScreen();
        // Utils.wigglePoints(points);
        // console.log(Date.now() - startT);
        startT = Date.now();
        requestAnimationFrame(gameLoop);
    }
    requestAnimationFrame(gameLoop);
};


function createListeners(mouseLoc) {
    canvas.addEventListener('mousemove', function(e) {
        // important: correct mouse position:
        let rect = this.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        mouseLoc.x = x * 2;
        mouseLoc.y = y * 2;
    });

    canvas.onmouseout = function(e) {
        mouseLoc.x = null;
    	mouseLoc.y = null;
    }
}

function generateMap(countries) {
    // let points = [];
    let numSquares = Math.round((canvas.width*canvas.height) / Math.pow(PIXEL_SIZE, 2));
    console.log(numSquares)
    let gridPoints = Utils.create2DGridPoints(numSquares, canvas.width, canvas.height);
    let countryCenters = Utils.create2DGridPoints(20, canvas.width, canvas.height);

    for (let ccRows of countryCenters) {
        for (let cc of ccRows) {
            for (let i = 0; i < 10000; i++) {
                Utils.wigglePoint(cc, 10);
            }
        }
    }
    let countryCombs = {};
    for (let gpRows of gridPoints) {
        for (let gp of gpRows) {
            for (let i = 0; i < 50; i++) {
                // Utils.wigglePoint(gp, 5);
            }

            let primaryCountry = {
                pointIndex: 0,
                distance: Number.MAX_VALUE
            }
            let secondaryCountry = {
                pointIndex: 0,
                distance: Number.MAX_VALUE
            }
            countryCenters.forEach((c, i) => {
                c.forEach((cc, ii) => {
                    const distance = Vector2D.distanceBetweenPoints(gp, cc);
                    if (distance < primaryCountry.distance) {
                        secondaryCountry.pointIndex = primaryCountry.pointIndex;
                        secondaryCountry.distance = primaryCountry.distance;
                        primaryCountry.pointIndex = i + "," + ii;
                        primaryCountry.distance = distance;
                    } else if (secondaryCountry < primaryCountry.distance) {
                        secondaryCountry.pointIndex = i + "," + ii;;
                        secondaryCountry.distance = distance;
                    }
                });
            });
            let key = primaryCountry.pointIndex + "," + secondaryCountry.pointIndex;
            countryCombs[key] = countryCombs[key] || [];
            countryCombs[key].push(gp);
        }
    }
    for (let countryLoc in countryCombs) {
        let center = countryCombs[countryLoc].reduce((sum, loc) => {
            sum.x += loc.x;
            sum.y += loc.y;
            return sum;
        }, {x:0,y:0});
        center.x /= countryCombs[countryLoc].length
        center.y /= countryCombs[countryLoc].length
        let country = new Country(new Vector2D(center.x, center.y));
        country.addPoints(countryCombs[countryLoc]);
        countries.push(country);
    }
}