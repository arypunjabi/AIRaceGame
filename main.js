const canvas=document.getElementById("myCanvas");
canvas.width=window.innerWidth;

const ctx = canvas.getContext("2d");
//for the simple race track add a new parameter saying whether the track is to be drawn clockwise from the center
// ex. (canvas.width/2, canvas.height/2, canvas.width*0.15, 500, false) where it defaults to clockwise if not specified
// if it is not clockwise just change road.getstart so that it looks counterclockwise
//const road = new SimpleRaceTrack(canvas.width/2, canvas.height/2, canvas.width*0.15, 500);

//const road = new StraightRoad(canvas.width/2, canvas.width*0.15);
const road = new RandomTrack(canvas.width/2, canvas.height/2, canvas.width * 0.15, 1000, 75, 5);
let cars = generateCars(road.getStart().x,road.getStart().y,30,50, road.getAngle(), 100);
let myCar = new Car(road.getStart().x,road.getStart().y,30,50, road.getAngle());

//const car = new Car("AI", road.getStart().x,road.getStart().y,30,50);
let bestCar = cars[0];
if(localStorage.getItem("bestCar")) {
    console.log("bestCar exists at beginning");
    for(let i = 0; i < cars.length; i++) {
        cars[i].network = JSON.parse(localStorage.getItem("bestCar"));
        if(i != 0) {
            cars[i].network = Network.evolve(cars[i].network, 0.1);
            console.log("evolved");
        }
    }
}
bestCar = cars[0];

animate();

function generateCars(x, y, w, h, angle, numCars) {
    let cars = [];
    for(let i = 0; i < numCars; i++) {
        cars.push(new Car("AI", x, y, w, h, angle));
    }
    return cars;
}

function animate(){
    //console.log(bestCar.speed)
    for(let i = 0; i < cars.length; i++) {
        if((cars[i].score > bestCar.score || bestCar.speed == 0) && cars[i].speed != 0) {
            bestCar = cars[i];
        }
    }

    for(let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, road.midpoint);
    }
    //myCar.update(road.borders, road.midpoint);

    canvas.height = window.innerHeight;

    ctx.save();
    ctx.translate((-bestCar.x) + canvas.width/2, (-bestCar.y) + canvas.height/2);

    road.draw(ctx);
    for(let i = 0; i < cars.length; i++) {
        cars[i].draw(ctx);
    }
    //myCar.draw(ctx);

    ctx.restore();
    requestAnimationFrame(animate);
}

function save() {
    if(localStorage.getItem("bestCar")) {
        const jsonData = JSON.stringify(bestCar.network);
        localStorage.setItem("prevBestCar", localStorage.getItem("bestCar"));
        localStorage.setItem("bestCar", jsonData);
        console.log("saved2");
    }
    else {
        const jsonData = JSON.stringify(bestCar.network);
        localStorage.setItem("bestCar", jsonData);
        if(localStorage.getItem("bestCar")) {
            console.log("saved");
        }
    }
}

function reset() {
    if(localStorage.getItem("prevBestCar")) {
        localStorage.removeItem("prevBestCar");
        console.log("reset prevBestCar");
    }
    else {
        console.log("no prevBestCar");
    }

    if(localStorage.getItem("bestCar")) {
        localStorage.removeItem("bestCar");
        console.log("reset prevBestCar");
    }
    else {
        console.log("no bestCar");
    }
}

function revert() {
    if(localStorage.getItem("prevBestCar")) {
        const jsonData = localStorage.getItem("prevBestCar");
        localStorage.setItem("bestCar", jsonData);
        localStorage.removeItem("prevBestCar");
        console.log("reverted to prevBestCar");
    }
    else {
        console.log("no prevBestCar");
    }
}
