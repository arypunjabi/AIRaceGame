class StraightRoad extends Track{
    
    createPolygon(){
        //left side
        let short = [{x: this.left, y: this.bottom},{x: this.left, y: this.top}];

        //right side
        let long = [{x: this.right, y: this.bottom},{x: this.right, y: this.top}];

        this.borders = {short: short, long: long};

    }
   
    constructor(x,width){
        super(x);
        this.width = width;
        this.borders = {};

        this.left = this.x - (this.width / 2);
        this.right = this.x + (this.width / 2);
        this.top = 1000000000;
        this.bottom = -1000000000;


        this.createPolygon();
    }

    getAngle(){
        return 0;
    }



    getStart(){
        return {x: this.x, y: 100};
    }



    draw(ctx){

        ctx.beginPath();
        ctx.strokeStyle="gray";
        ctx.lineWidth=this.width;
        ctx.moveTo(this.x, this.bottom);
        ctx.lineTo(this.x, this.top);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle="white";
        ctx.lineWidth=5;
        ctx.moveTo((this.x - (this.width/2)), this.bottom);
        ctx.lineTo((this.x - (this.width/2)), this.top);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo((this.x + (this.width/2)), this.bottom);
        ctx.lineTo((this.x + (this.width/2)), this.top);
        ctx.stroke();

    }
}