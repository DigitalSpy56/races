class Game {
  constructor() {
    this.reset = createButton("");
    this.leftKeyActive = false;
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }


  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();
    

    car1=createSprite(width/2-50,height-100);
    car1.addImage(car1_img);
    car1.scale=0.07;
    car2=createSprite(width/2+100,height-100);
    car2.addImage(car2_img);
    car2.scale=0.07;

    cars=[car1,car2];

    groupObstacles= new Group();

    
    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2 },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1 },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1 },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2 },
      { x: width / 2, y: height - 2800, image: obstacle2 },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1 },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2 },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2 },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1 },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2 },
      { x: width / 2, y: height - 5300, image: obstacle1 },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2 }
    ];

    this.obstacleSprites(groupObstacles,obstaclesPositions.length,obstacle1,0.04,obstaclesPositions);
    
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");
    
    this.reset.class("resetButton")
    this.reset.position(50,100)
      
  }

  play() {

    if (keyDown(32)){
        database.ref("/").set({
          playerCount: 0,
          gameState: 0,
          players: {},
          carsAtEnd: 0
        });
        window.location.reload();
    }

    this.handleElements();
    car1.collide(car2);
    Player.getPlayersInfo();
    if(allPlayers !==undefined){
      image(track,0,height*-5,width,height*6);

      var index =0

      for(var plr in allPlayers){
        index ++;
        var x =allPlayers[plr].positionX;
        var y = height-allPlayers[plr].positionY;
        
        cars[index-1].position.x=x;
        cars[index-1].position.y=y;

        if(index == player.index){
          //pendientes: hacer proyectos :P, recardar créditos :D
          //reto semana santa::::: poner indicador de qué jugador está activo

          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);
          this.handleCarCollision(index-1);
          cars[index-1].collide(groupObstacles,this.obstaclesCollisions);
        
          // Cambiar la posición de la cámara en la dirección y
          camera.position.y = cars[index - 1].position.y;
        }

      }

      const finishLine = height * 6 -100;

      if(player.positionY>finishLine){
        gameState = 2;
        player.rank++;
        Player.updateRank(player.rank);
        player.update();
        this.showRank();
      };
      
      this.handlePlayerControls();
      drawSprites();
    }
    
    this.fireReset();
    
  }
  
obstaclesCollisions(car,obstacle){
  
/// TAREA = HACER LA OPERACIÓN CORRECTA PARA SIMULAR COLISIÓN!

  player.positionY = -1 * obstacle.position.y+850;
  player.update();
}  





obstacleSprites(group,count,spriteImg,scale,pos=[]){
  for(var i=0;i<count;i++){
    var x,y;

  if(pos.length>0){
    x = pos[i].x;
    y = pos[i].y;
    spriteImg = pos[i].image;
  } else {
    x = random(width/2 +150, width /2 -150);
    y = random(-height*4.5, height-400);
  }
  
  var sprite = createSprite(x,y);
  sprite.addImage(spriteImg);
  sprite.scale=scale;
  group.add(sprite);
}


}


handleCarCollision(index) {
  if (index === 0) {
    if (cars[index].collide(cars[1])) {
      if (this.leftKeyActive) {
        player.positionX += 100;
      } else {
        player.positionX -= 100;
      }

      player.update();
    }
  }
  if (index === 1) {
    if (cars[index].collide(cars[0])) {
      if (this.leftKeyActive) {
        player.positionX += 100;
      } else {
        player.positionX -= 100;
      }

      player.update();
    }
  }
}
  
  fireReset(){
    if(keyIsDown(48)){
      database.ref("/").set({
        gameState:0,
        playerCount:0,
        players:{}
      })
      window.location.reload();
    }
  }

  handlePlayerControls(){
    if(keyIsDown (UP_ARROW)){
      player.positionY += 10
      player.update();  
    }
    if(keyIsDown (LEFT_ARROW) && player.positionX > width / 3 - 50){
      player.positionX -= 5
      player.update();
      this.leftKeyActive = true;
    }
    if(keyIsDown (RIGHT_ARROW) && player.positionX < width / 2 + 300){
      player.positionX += 5
      player.update();
      this.leftKeyActive = false;
        }
    if(keyIsDown (DOWN_ARROW)){
      player.positionY -= 2.5
      player.update();
    }
  }
  
  update(count){
    database.ref("/").update({
      gameState: count
    })
  }

  showRank() {
    swal({
      title: `¡Impresionante!${"\n"}Posición${"\n"}${player.rank}`,
      text: "Llegaste a la meta con éxito",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }

 


}

