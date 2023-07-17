class RandomTrack extends Track{
    //takes in the center of the track, the number of points to spline the curve, and the max distance a point can be away from center. To create the curve the function goes in a circle around the 
    //center of the track and creates a point at a random distance from the center. This point is generated every 2pi/points radians. Then, an arc 
    // is drawn from the previous point to the current point. The arc is drawn in a clockwise direction if clockwise is true and counterclockwise
    // if clockwise is false.
    
    bordersIsValid() {
        for(let i = 0; i < this.borders.short.length; i++) {
            if(this.calcDistance(this.borders.short[i], this.borders.long[i]) < this.minWidth) {
                return false;
            }
            else {
                return true;
            }
        }
    }

    calcDistance(point1, point2) {
        return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
    }

    findMidPoint(longList) {
        let sumX = 0;
        let sumY = 0;
        for(let i = 0; i < longList.length; i++) {
            sumX += longList[i].x;
            sumY += longList[i].y;
        }
        return {x: sumX / longList.length, y: sumY / longList.length};
    }

    constructShortList(longList) {
        this.midpoint = this.findMidPoint(longList);
        let shortList = [];

        for(let i = 0; i < longList.length; i++) {
            let longPoint = longList[i];
            let distance = Math.sqrt(Math.pow(longPoint.x - this.midpoint.x, 2) + Math.pow(longPoint.y - this.midpoint.y, 2));
            
            let shortX = this.midpoint.x + ((longPoint.x - this.midpoint.x) * (this.minWidth / 120));
            let shortY = this.midpoint.y + ((longPoint.y - this.midpoint.y) * (this.minWidth / 120 ));
            shortList.push({x: shortX, y: shortY})
        }

        return shortList;

    }
    
    constructPolygon(ctx) {
        let isValid = false;

        while (!isValid) {
            let shortList = [];
            let longList = [];
    
            let radIterator = (2 * Math.PI) / this.points;
    
            for (let i = 1; i <= this.points; i++) {
                let randDistance = Math.random() * this.maxDistance;
                let radian = radIterator * i;

                let longX = (Math.cos(radian) * (randDistance + this.width)) + this.x;
                let longY = (Math.sin(radian) * (randDistance + this.width)) + this.y;
                longList.push({ x: longX, y: longY });
            }

            shortList = this.constructShortList(longList);
    
            this.borders = { short: shortList, long: longList };
            isValid = this.bordersIsValid();
            isValid = true;
        }
    }

    constructor(x, y, width, maxDistance, minWidth, points, clockwise = true) {
        super(x);
        this.y = y;
        this.width = width;
        this.maxDistance = maxDistance;
        this.minWidth = minWidth;
        this.points = points;
        this.clockwise = clockwise;
        this.borders = {};
        this.midpoint = {};
        this.constructPolygon(ctx);
    }

    getAngle(){
        return Math.atan2(this.borders.long[0].y - this.borders.short[0].y, this.borders.long[0].x - this.borders.short[0].x);
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.fillStyle = "gray";
        ctx.lineWidth = 5;
      
        // Draw the long side of the track
        ctx.moveTo(this.borders.long[0].x, this.borders.long[0].y);
        for (let i = 1; i < this.borders.long.length; i++) {
          const point = this.borders.long[i];
          ctx.lineTo(point.x, point.y);
        }
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
      
        // Draw the short side of the track
        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.moveTo(this.borders.short[0].x, this.borders.short[0].y);
        for (let i = 1; i < this.borders.short.length; i++) {
          const point = this.borders.short[i];
          ctx.lineTo(point.x, point.y);
        }
        ctx.fill();
        ctx.closePath();
        ctx.stroke();



    }

    getStart() {
        return {x: (this.borders.short[0].x + this.borders.long[0].x) / 2, y: (this.borders.short[0].y + this.borders.long[0].y) / 2};
    }

    
}