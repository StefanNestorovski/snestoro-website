class Draw {
    constructor(context, canvas) {
        this.ctx = context;
        this.canvas = canvas;
        this.fix_dpi();
    }

    fix_dpi() {
        //get DPI
        let dpi = window.devicePixelRatio;
        let style_height = +getComputedStyle(this.canvas).getPropertyValue("height").slice(0, -2);
        let style_width = +getComputedStyle(this.canvas).getPropertyValue("width").slice(0, -2);
        this.canvas.setAttribute('height', style_height * dpi);
        this.canvas.setAttribute('width', style_width * dpi);
    }

    drawPoint(point, color = "white") {
        let size = 5;
        this.ctx.fillStyle = color;
        if (point.x && point.y) {
            this.ctx.fillRect(point.x, point.y, size, size);
        }
    }

    drawPoints(points, color = "white") {
        for (let point of points) {
            this.drawPoint(point, color)
        }
    }

    clearScreen(color = "black") {
        this.ctx.fillStyle = color;
    	this.ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
    }

    drawShape(points, color = "white") {
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        for (let point of points) {
            this.ctx.lineTo(point.x, point.y);
        }
        this.ctx.lineTo(points[0].x, points[0].y);
        this.ctx.fill();
    }

    static getRndColor() {
        let r = 255*Math.random()|0,
            g = 255*Math.random()|0,
            b = 255*Math.random()|0;
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }
}