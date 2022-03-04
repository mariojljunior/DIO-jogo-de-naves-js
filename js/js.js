function start() {
  $("#first").hide();

  $("#backGame").append("<div id='player' class='anima1'></div>");
  $("#backGame").append("<div id='enemy1' class='anima2'></div>");
  $("#backGame").append("<div id='enemy2'></div>");
  $("#backGame").append("<div id='friend' class='anima3'></div>");
  $("#backGame").append("<div id='scoreboard'></div>");
  $("#backGame").append("<div id='energy'></div>");

  var game = {};
  var velocity = 5;
  var positionY = parseInt(Math.random() * 334);
  var keyboard = {
    W: 38,
    S: 40,
    D: 32,
  };
  var shoot = true;
  var endOfTheGame = false;
  var points = 0;
  var saved = 0;
  var lost = 0;
  var currentEnergy = 3;
  var soundTrigger = document.getElementById("soundTrigger");
  var soundExplosion = document.getElementById("soundExplosion");
  var music = document.getElementById("music");
  var soundGameover = document.getElementById("soundGameover");
  var soundLost = document.getElementById("soundLost");
  var soundRescue = document.getElementById("soundRescue");

  music.addEventListener(
    "ended",
    function () {
      music.currentTime = 0;
      music.play();
    },
    false
  );
  music.play();

  game.pressed = [];

  $(document).keydown(function (e) {
    game.pressed[e.which] = true;
  });

  $(document).keyup(function (e) {
    game.pressed[e.which] = false;
  });

  game.timer = setInterval(loop, 30);

  function loop() {
    movefundo();
    moveplayer();
    moveenemy1();
    moveenemy2();
    movefriend();
    collision();
    scoreboard();
    energy();
  }

  function movefundo() {
    esquerda = parseInt($("#backGame").css("background-position"));
    $("#backGame").css("background-position", esquerda - 1);
  }

  function moveplayer() {
    if (game.pressed[keyboard.W]) {
      var topo = parseInt($("#player").css("top"));
      $("#player").css("top", topo - 10);

      if (topo <= 0) {
        $("#player").css("top", topo + 15);
      }
    }

    if (game.pressed[keyboard.S]) {
      var topo = parseInt($("#player").css("top"));
      $("#player").css("top", topo + 10);

      if (topo >= 434) {
        $("#player").css("top", topo - 15);
      }
    }

    if (game.pressed[keyboard.D]) {
      shot();
    }
  }

  function moveenemy1() {
    positionX = parseInt($("#enemy1").css("left"));
    $("#enemy1").css("left", positionX - velocity);
    $("#enemy1").css("top", positionY);

    if (positionX <= 0) {
      positionY = parseInt(Math.random() * 334);
      $("#enemy1").css("left", 694);
      $("#enemy1").css("top", positionY);
    }
  }

  function moveenemy2() {
    positionX = parseInt($("#enemy2").css("left"));
    $("#enemy2").css("left", positionX - 3);

    if (positionX <= 0) {
      $("#enemy2").css("left", 775);
    }
  }

  function movefriend() {
    positionX = parseInt($("#friend").css("left"));
    $("#friend").css("left", positionX + 1);

    if (positionX > 906) {
      $("#friend").css("left", 0);
    }
  }

  function shot() {
    if (shoot == true) {
      soundTrigger.play();
      shoot = false;

      topo = parseInt($("#player").css("top"));
      positionX = parseInt($("#player").css("left"));
      tiroX = positionX + 190;
      topoTiro = topo + 37;
      $("#backGame").append("<div id='shot'></div");
      $("#shot").css("top", topoTiro);
      $("#shot").css("left", tiroX);

      var temposhot = window.setInterval(executeshot, 30);
    }

    function executeshot() {
      positionX = parseInt($("#shot").css("left"));
      $("#shot").css("left", positionX + 15);

      if (positionX > 900) {
        window.clearInterval(temposhot);
        temposhot = null;
        $("#shot").remove();
        shoot = true;
      }
    }
  }

  function collision() {
    var collision1 = $("#player").collision($("#enemy1"));
    var collision2 = $("#player").collision($("#enemy2"));
    var collision3 = $("#shot").collision($("#enemy1"));
    var collision4 = $("#shot").collision($("#enemy2"));
    var collision5 = $("#player").collision($("#friend"));
    var collision6 = $("#enemy2").collision($("#friend"));

    if (collision1.length > 0) {
      currentEnergy--;
      enemy1X = parseInt($("#enemy1").css("left"));
      enemy1Y = parseInt($("#enemy1").css("top"));
      explosion1(enemy1X, enemy1Y);

      positionY = parseInt(Math.random() * 334);
      $("#enemy1").css("left", 694);
      $("#enemy1").css("top", positionY);
    }

    if (collision2.length > 0) {
      currentEnergy--;
      enemy2X = parseInt($("#enemy2").css("left"));
      enemy2Y = parseInt($("#enemy2").css("top"));
      explosion2(enemy2X, enemy2Y);

      $("#enemy2").remove();

      reposicionaenemy2();
    }

    if (collision3.length > 0) {
      points = points + 100;
      velocity = velocity + 0.3;
      enemy1X = parseInt($("#enemy1").css("left"));
      enemy1Y = parseInt($("#enemy1").css("top"));

      explosion1(enemy1X, enemy1Y);
      $("#shot").css("left", 950);

      positionY = parseInt(Math.random() * 334);
      $("#enemy1").css("left", 694);
      $("#enemy1").css("top", positionY);
    }

    if (collision4.length > 0) {
      points = points + 50;
      enemy2X = parseInt($("#enemy2").css("left"));
      enemy2Y = parseInt($("#enemy2").css("top"));
      $("#enemy2").remove();

      explosion2(enemy2X, enemy2Y);
      $("#shot").css("left", 950);

      reposicionaenemy2();
    }

    if (collision5.length > 0) {
      saved++;
      soundRescue.play();
      reposicionafriend();
      $("#friend").remove();
    }

    if (collision6.length > 0) {
      lost++;
      friendX = parseInt($("#friend").css("left"));
      friendY = parseInt($("#friend").css("top"));
      explosion3(friendX, friendY);
      $("#friend").remove();

      reposicionafriend();
    }
  }

  function explosion1(enemy1X, enemy1Y) {
    soundExplosion.play();
    $("#backGame").append("<div id='explosion1'></div");
    $("#explosion1").css("background-image", "url(img/explosion.png)");
    var div = $("#explosion1");
    div.css("top", enemy1Y);
    div.css("left", enemy1X);
    div.animate({ width: 200, opacity: 0 }, "slow");

    var tempoexplosion = window.setInterval(removeexplosion, 1000);

    function removeexplosion() {
      div.remove();
      window.clearInterval(tempoexplosion);
      tempoexplosion = null;
    }
  }

  function explosion2(enemy2X, enemy2Y) {
    soundExplosion.play();
    $("#backGame").append("<div id='explosion2'></div");
    $("#explosion2").css("background-image", "url(img/explosion.png)");
    var div2 = $("#explosion2");
    div2.css("top", enemy2Y);
    div2.css("left", enemy2X);
    div2.animate({ width: 200, opacity: 0 }, "slow");

    var tempoexplosion2 = window.setInterval(removeexplosion2, 1000);

    function removeexplosion2() {
      div2.remove();
      window.clearInterval(tempoexplosion2);
      tempoexplosion2 = null;
    }
  }

  function reposicionaenemy2() {
    var tempocollision4 = window.setInterval(reposiciona4, 5000);

    function reposiciona4() {
      window.clearInterval(tempocollision4);
      tempocollision4 = null;

      if (endOfTheGame == false) {
        $("#backGame").append("<div id=enemy2></div");
      }
    }
  }

  function reposicionafriend() {
    var tempofriend = window.setInterval(reposiciona6, 6000);

    function reposiciona6() {
      window.clearInterval(tempofriend);
      tempofriend = null;

      if (endOfTheGame == false) {
        $("#backGame").append("<div id='friend' class='anima3'></div>");
      }
    }
  }

  function explosion3(friendX, friendY) {
    soundLost.play();
    $("#backGame").append("<div id='explosion3' class='anima4'></div");
    $("#explosion3").css("top", friendY);
    $("#explosion3").css("left", friendX);
    var tempoexplosion3 = window.setInterval(resetaexplosion3, 1000);
    function resetaexplosion3() {
      $("#explosion3").remove();
      window.clearInterval(tempoexplosion3);
      tempoexplosion3 = null;
    }
  }

  function scoreboard() {
    $("#scoreboard").html(
      "<h2> points: " + points + " saved: " + saved + " lost: " + lost + "</h2>"
    );
  }

  function energy() {
    if (currentEnergy == 3) {
      $("#energy").css("background-image", "url(img/energy3.png)");
    }

    if (currentEnergy == 2) {
      $("#energy").css("background-image", "url(img/energy2.png)");
    }

    if (currentEnergy == 1) {
      $("#energy").css("background-image", "url(img/energy1.png)");
    }

    if (currentEnergy == 0) {
      $("#energy").css("background-image", "url(img/energy0.png)");

      gameOver();
    }
  }

  function gameOver() {
    endOfTheGame = true;
    music.pause();
    soundGameover.play();

    window.clearInterval(game.timer);
    game.timer = null;

    $("#player").remove();
    $("#enemy1").remove();
    $("#enemy2").remove();
    $("#friend").remove();

    $("#backGame").append("<div id='fim'></div>");

    $("#fim").html(
      "<h1> Game Over </h1><p>Sua pontuação foi: " +
        points +
        "</p>" +
        "<div id='reinicia' onClick=restartGame()><h3>Jogar Novamente</h3></div>"
    );
  }
}

function restartGame() {
  soundGameover.pause();
  $("#fim").remove();
  start();
}
