class Car{
  constructor(x,y,widht,height,controlType,maxSpeed=3){
    this.x=x
    this.y=y
    this.height=height
    this.width=widht
    this.speed = 0;
    this.acceleration =.2*200;
    this.maxspeed = maxSpeed*200;
    this.friction = 7;
    this.anglespeed=-.01/200;
    this.angle=0;
    this.dt = 0;
    this.controls = new Controls(controlType)
    this.useBrain = controlType=="ai"
    this.damaged=false
    if(controlType!="dummy"){
      this.sensor = new Sensor(this)
      this.brain = new NeuralNetwork([this.sensor.rayCount,6,4,4])
  }
}
  update(roadBorders,traffic){
    this.rb = roadBorders
          //console.log(this.damaged )
    if(!this.damaged){
        this.#move();
        this.polygon=this.#createPolygon();
        this.damaged=this.#assesDamage(roadBorders,traffic);
    }
    if(this.sensor){
    this.sensor.update(roadBorders,traffic);
    const offsets = this.sensor.readings.map(s=>s==null?0:1-s.offset)
    const outputs = NeuralNetwork.feedForward(offsets,this.brain)
    //console.log(outputs)
    if(this.useBrain){
      this.controls.forward=outputs[0]
      this.controls.left=   outputs[1]
      this.controls.right=  outputs[2]
      this.controls.reverse=outputs[3]
    }
  }
}
    #assesDamage(roadBorders,traffic){
      for(let i = 0;i<roadBorders.length;i++){
        if(polyIntersect(this.polygon,roadBorders[i])){        return true}
      }
      for(let i = 0;i<traffic.length;i++){
        if(polyIntersect(this.polygon,traffic[i].polygon)){        return true}
      }
      return false
    }

    #createPolygon(){
      const points = [];
      const rad = Math.hypot(this.width,this.height)/2
      const alpha = Math.atan2(this.width,this.height)
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
      if(this.controls.forward==true){
        this.speed+=this.acceleration;
      }
      if(this.controls.reverse==true){
        this.speed-=this.acceleration;
      }
      if(this.speed>this.maxspeed){
        this.speed=this.maxspeed;
      }
      if(this.speed<-this.maxspeed/2){
        this.speed=-this.maxspeed/2;
      }

      if(this.speed>0){
        this.speed-=this.friction
      }
      if(this.speed<0){
        this.speed+=this.friction
      }
      if(Math.abs(this.speed)<this.friction){
        this.speed = 0;
    }

      const flip=this.speed>0?-1:1
      if(this.controls.left==true){
        this.angle-=this.anglespeed*this.speed//flip;
      }
      if(this.controls.right==true){
        this.angle+=this.anglespeed*this.speed//flip;
      }

    this.y-=this.speed*Math.cos(this.angle)*this.dt;
    this.x-=this.speed*Math.sin(this.angle)*this.dt;
  //  console.log(this.angle)
  }
  draw(ctx,dt,color="red",drawS=false){
    this.dt = dt
    // ctx.fill
    if(this.damaged==false){
      ctx.fillStyle = color;
    //  console.log(this.damaged )
    }else{
      ctx.fillStyle = "gray"
    }
    ctx.beginPath()
    ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
    for(let i = 1;i<this.polygon.length;i++){
      ctx.lineTo(this.polygon[i].x,this.polygon[i].y)
    }
    ctx.fill()
    if(this.sensor&&drawS){
  this.sensor.draw(ctx);
  }
}

}
