class SimpleRaceTrack extends Track{
    getBorderAtRadian(radian){

        let closeY = (Math.sin(radian) * (this.radius - (this.width / 2))) + this.y;
        let closeX = (Math.cos(radian) * (this.radius - (this.width / 2))) + this.x;

        let farY = (Math.sin(radian) * (this.radius + (this.width / 2))) + this.y;
        let farX = (Math.cos(radian) * (this.radius + (this.width / 2))) + this.x;

        //0 index is closer to the center 1 index is further from the center
        return [{x: closeX, y: closeY},{x: farX, y: farY}];
    }
    
    createPolygon(LinesOfPrecision){
        let beginAngle = Math.PI;
        let iterationAngle = (2 * Math.PI) / LinesOfPrecision;

        let short = [];
        let long = [];

        for(let i = 0; i < LinesOfPrecision; i++){
            let angle = beginAngle - (iterationAngle * i);
            let border = this.getBorderAtRadian(angle);
            short.push({x: border[0].x, y: border[0].y});
        }

        short.push({x: short[0].x, y: short[0].y});

        for(let i = 0; i < LinesOfPrecision; i++){
            let angle = beginAngle - (iterationAngle * i);
            let border = this.getBorderAtRadian(angle);
            long.push({x: border[1].x, y: border[1].y});
        }

        long.push({x: long[0].x, y: long[0].y});

        this.borders = {short: short, long: long};

    }
   
    constructor(x,y,width,radius){
        super(x);
        this.y = y;
        this.width = width;
        this.radius = radius;

        this.createPolygon(100);
    }



    getStart(){
        return {x: this.x - (this.radius), y: this.y};
    }

    getAngle(){
        return 0;
    }



    draw(ctx){

        ctx.beginPath();
        ctx.strokeStyle="gray";
        ctx.lineWidth=this.width;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle="white";
        ctx.lineWidth=5;
        ctx.arc(this.x, this.y, (this.radius + (this.width / 2)), 0, 2 * Math.PI);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x, this.y, (this.radius - (this.width / 2)), 0, 2 * Math.PI);
        ctx.stroke();
    }
}