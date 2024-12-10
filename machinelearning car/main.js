
const carCanvas = document.getElementById('carCanvas')
const networkCanvas = document.getElementById('networkCanvas')
carCanvas.height = innerHeight
carCanvas.width=200;
networkCanvas.height = innerHeight
networkCanvas.width=300;
let t = 0;
setInterval(function () {t+=1/1000}, 1);
const carctx = carCanvas.getContext("2d");
const networkctx = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width/2,carCanvas.width*.94)
const car = new Car(road.getLaneCenter(1),500,30,50,"ai")
let traffic = [
new Car(road.getLaneCenter(1),300,30,50,"dummy",1.5),
new Car(road.getLaneCenter(3),100,30,50,"dummy",1.5),
new Car(road.getLaneCenter(2),0,30,50,"dummy",1.5),
new Car(road.getLaneCenter(2),300,30,50,"dummy",1.5),
new Car(road.getLaneCenter(3),-500,30,50,"dummy",1.5),
new Car(road.getLaneCenter(2),-350,30,50,"dummy",1.5)
]
let oldt = 0;
function gentraf(d,y){
  let ntraf;
  if(d<2){
    ntraf = new Car(road.getLaneCenter(Math.floor(Math.random()*3-1)),y-300,30,50,"dummy",1.5)
  }
  traffic.push(ntraf)
}
function genCars(n){
  const ca = []
  for(let i = 0;i<n;i++){
    ca.push(new Car(road.getLaneCenter(1),500,30,50,"ai"))
  }
  return ca;
}
let cars = genCars(700)
bestCar = cars[0];
if(localStorage.getItem("bestBrain")){
  for(let i = 0 ; i<cars.length;i++){
    cars[i].brain =JSON.parse(localStorage.getItem("bestBrain"))
      if(i!=0){
        NeuralNetwork.mutate(cars[i].brain,0.1)
      }
  }
}
animate()
function save(){
  localStorage.setItem("bestBrain",JSON.stringify(bestCar.brain))
}
function discard(){
  localStorage.removeItem("bestBrain")
}
setInterval(function(){if(t>2){gentraf(1,bestCar.y)}},3000)
function animate(time){
   bestCar = cars.find(
    c=>c.y==Math.min(...cars.map(c=>c.y))
  )
  for(let i = 0;i<traffic.length;i++){
    traffic[i].update(road.borders,[])
  }
  let dt = t-oldt;
//  console.log(dt)
  carCanvas.height = innerHeight
  networkCanvas.height = innerHeight
  for(carts of cars){
    carts.update(road.borders,traffic)
  }
//  car.update(road.borders,traffic)

  carctx.save();
  carctx.translate(0,-bestCar.y+carCanvas.height*.75)
  road.draw(carctx)
  for(let i = 0;i<traffic.length;i++){
    traffic[i].draw(carctx,dt)
  }
  carctx.globalAlpha=.2;
  for(carts of cars){
    carts.draw(carctx,dt,"blue")
  }
  carctx.globalAlpha=1;
  bestCar.draw(carctx,dt,"indigo",true)
//  car.draw(carctx,dt,"blue")
  carctx.restore();
  networkctx.lineDashOffset=-time/100
  requestAnimationFrame(animate)


  oldt = t;
  Visualizer.drawNetwork(networkctx,bestCar.brain)
}
