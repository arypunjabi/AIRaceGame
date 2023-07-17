class Car{
    constructor(type,x,y,width,height, angle = 0){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.type=type;

        this.speed=0;
        this.acceleration=0.2;
        this.maxSpeed=3;
        this.friction=0.05;
        this.angle = angle;
        this.damaged=false;
        this.score = 0;
        this.radsTraveled = 0;

        this.sensor=new Sensor(this);
        this.isAI = type == "AI";
        switch(this.type){
            case "AI":
                this.controls = new Controls("AI");
                this.network = new Network([this.sensor.rayCount, 6, 4])
                break;
            case "User":
                this.controls=new Controls();
                break;
        }
        
    }

    scoreCar(roadMidPoint){
        //maybe find the average of the scores computed using distance traveled and average speed weighted according
        //to how important each is
        //score is added every time car passes roadBoarders
        //maybe calculate angle each second and subtract from previous angle and add the difference
        //to score. use if(this.radsTraveled) to see whether its the first time calculating
        /*if(!this.damaged){
            if(!this.controls.right && !this.controls.left && this.speed != 0) {
                this.score += this.speed;
                //this.score ++;
            }
        }
        else {
            this.score = 0;
        }*/

        let x = roadMidPoint.x - this.x;
        let y = roadMidPoint.y - this.y;
        let angle = Math.atan2(y, x);
        if(this.radsTraveled == 0) {
            this.radsTraveled = angle;
        }
        else {
            this.radsTraveled += (angle - (this.radsTraveled % (2 * Math.PI)));
        }
        
    }

    update(roadBorders, roadMidPoint){
        this.scoreCar(roadMidPoint);
        if(!this.damaged){
            this.#move();
            this.polygon=this.#createPolygon();
            this.damaged=this.#assessDamage(roadBorders.short);
            if(!this.damaged) {
                this.damaged=this.#assessDamage(roadBorders.long);
            }
        }
        else{
            this.speed=0;
            this.score = 0;
        }
        this.sensor.update(roadBorders);

        if(this.isAI && this.damaged == false){
            let offsets = this.sensor.getSensorOffsets();
            let outputs = Network.feedForward(offsets, this.network);
            
            this.controls.forward = outputs[0] == 1;
            this.controls.reverse = outputs[1] == 1;
            this.controls.left = outputs[2] == 1;
            this.controls.right = outputs[3] == 1;

            //console.log({forward: outputs[0], reverse: outputs[1], left: outputs[2], right: outputs[3]});
        }
    }

    #assessDamage(roadBorders){
        for(let i=0;i<roadBorders.length;i++){
            if(polysIntersect(this.polygon,roadBorders)){
                return true;
            }
        }
        return false;
    }

    #createPolygon(){
        const points=[];
        const rad=Math.hypot(this.width,this.height)/2;
        const alpha=Math.atan2(this.width,this.height);
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        });
        return points;
    }

    #move(){
        if(this.controls.forward){
            this.speed+=this.acceleration;
        }
        if(this.controls.reverse){
            this.speed-=this.acceleration;
        }

        if(this.speed>this.maxSpeed){
            this.speed=this.maxSpeed;
        }
        if(this.speed<-this.maxSpeed/2){
            this.speed=-this.maxSpeed/2;
        }

        if(this.speed>0){
            this.speed-=this.friction;
        }
        if(this.speed<0){
            this.speed+=this.friction;
        }
        if(Math.abs(this.speed)<this.friction){
            this.speed=0;
        }

        if(this.speed!=0){
            const flip=this.speed>0?1:-1;
            if(this.controls.left){
                this.angle+=0.03*flip;
            }
            if(this.controls.right){
                this.angle-=0.03*flip;
            }
        }

        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
    }

    draw(ctx){
        if(this.damaged){
            ctx.fillStyle="darkred";
        }else{
            ctx.fillStyle="navy";
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
        for(let i=1;i<this.polygon.length;i++){
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
        }
        ctx.fill();

        this.sensor.draw(ctx);

    }
}