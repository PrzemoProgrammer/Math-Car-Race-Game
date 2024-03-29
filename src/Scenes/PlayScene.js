class PlayScene extends Phaser.Scene {
  constructor() {
    super("PlayScene");
  }

  preload() {
    this.load.setPath("./src/assets");
    this.load.image("roadShade", "roadShade.png");
    this.load.image("background", "background.png");
    this.load.image("road", "road.png");
    this.load.image("carPorsche", "carPorsche.png");
    this.load.image("operationBackground", "operationBackground.png");
    this.load.image("answerBackground", "answerBackground.png");
    this.load.image("car1", "car1.png");
    this.load.image("car2", "car2.png");
    this.load.image("car3", "car3.png");
    this.load.image("banner", "banner.png");

    this.load.image("car1Crashed", "car1Crashed.png");
    this.load.image("car2Crashed", "car2Crashed.png");
    this.load.image("car3Crashed", "car3Crashed.png");
    this.load.image("carPorscheCrashed", "carPorscheCrashed.png");
    this.load.image("carLight", "carLight.png");
    this.load.image("blackOverlay", "blackOverlay.png");
    this.load.image("full-screen", "full-screen.png");
    this.load.spritesheet("explosion", "explosion.png", {
      frameWidth: 2800 / 8,
      frameHeight: 301,
    });

    this.load.spritesheet("nitro", "nitro.png", {
      frameWidth: 1930 / 10,
      frameHeight: 322,
    });

    this.load.audio("correctAnswer", "audio/correctAnswer.mp3");
    this.load.audio("wrongAnswer", "audio/wrongAnswer.mp3");
    this.load.audio("carCrash", "audio/carCrash.mp3");
  }

  create() {
    this.gw = this.game.config.width;
    this.gh = this.game.config.height;

    this.anims.create({
      key: "explosion",
      frames: "explosion",
      frameRate: 15,
      repeat: 0,
    });

    this.anims.create({
      key: "nitro",
      frames: "nitro",
      frameRate: 15,
      repeat: -1,
    });

    this.addBackground();
    this.addRoad();
    this.createBanner();
    this.obstacles = [];

    this.blackOverlay = this.add.image(0, 0, "blackOverlay").setOrigin(0, 0);

    this.answers = [];

    this.car = {
      position1: this.road.x - 210,
      position2: this.road.x,
      position3: this.road.x + 210,
    };

    this.isGameLost = false;
    this.score = 0;

    this.mainCar = new Car(this, this.car.position2, 870, "carPorsche");
    this.addOperation();
    this.addAnswers();
    this.addScoreText();

    this.correctAnswerAudio = this.sound.add("correctAnswer");
    this.correctAnswerAudio.volume = 0.5;

    this.wrongAnswerAudio = this.sound.add("wrongAnswer");
    this.wrongAnswerAudio.volume = 0.5;

    this.carCrashAudio = this.sound.add("carCrash");
    this.addFullScreenButton();
  }

  update() {
    if (!this.scale.isFullscreen && !this.fullscreen.active) {
      this.fullscreen.setActive(true);
      this.fullscreen.setVisible(true);
    } else if (this.scale.isFullscreen && this.fullscreen.active) {
      this.fullscreen.setActive(false);
      this.fullscreen.setVisible(false);
    }
    if (!this.isGameLost) this.road.tilePositionY -= 8;
  }
  addFullScreenButton() {
    this.fullscreen = this.add
      .image(this.gw - 5, 5, "full-screen")
      .setOrigin(1, 0)
      .setScale(2)
      .setDepth(99999);
    this.fullscreen.setInteractive();

    this.fullscreen.on("pointerup", () => {
      this.scale.startFullscreen();
    });
  }
  addBackground() {
    this.background = this.add
      .image(0, -this.gh * 0.4, "background")
      .setOrigin(0, 0)
      .setDisplaySize(this.gw, this.gh * 1.5);
  }

  addRoad() {
    this.road = this.add
      .tileSprite(this.gw / 2, 0, 685, 1177, "road")
      .setOrigin(0.5, 0);

    this.roadShade = this.add
      .image(this.gw / 2, 0, "roadShade")
      .setOrigin(0.5, 0);
  }

  addAnswer(x) {
    const answer = new Answer(this, x, 300, "answerBackground");
    this.answers.push(answer);
    this.setClickAble(answer);
  }

  addAnswers() {
    for (let i = 1; i <= 3; i++) {
      let x = this.car["position" + i];

      this.addAnswer(x);
    }
    this.setCorrectAnswer();
  }

  setClickAble(answer) {
    answer.onClick(() => {
      this.addObstacles();
      this.mainCar.nitro.start();
      if (
        this.getCutNumber(this.operation.result) ===
        this.getCutNumber(answer.displayText.text)
      ) {
        this.updateScore();
        this.correctAnswerAudio.play();
      } else {
        this.wrongAnswerAudio.play();
      }
      this.mainCar.setPositionX(answer.container.x);
      this.operation.container.destroy();
      this.removeAnswers();

      this.newOperation = setTimeout(() => {
        this.addOperation();
        this.addAnswers();
        this.mainCar.nitro.off();
      }, 2000);
    });
  }

  getCutNumber(number) {
    return Number(Number(number).toFixed(5));
  }

  setCorrectAnswer() {
    let randomIndex = Phaser.Math.Between(0, this.answers.length - 1);
    let operationResult = this.getCutNumber(this.operation.result);
    this.answers[randomIndex].displayText.setText(operationResult);
  }

  addOperation() {
    this.operation = new Operation(
      this,
      this.gw / 2,
      this.gh - 1000,
      "operationBackground"
    );
  }

  removeAnswers() {
    this.answers.forEach((answer) => answer.container.destroy());
    this.answers.length = 0;
  }

  addObstacle(x) {
    const obstacle = new Obstacle(this, x, -150);
    this.obstacles.push(obstacle);
    this.physics.add.overlap(
      this.mainCar,
      obstacle,
      () => {
        if (this.isGameLost) return;
        this.mainCar.lightsOff();
        this.mainCar.nitro.off();
        obstacle.setCrashedSprite();
        this.lostGame();
      },
      undefined,
      this
    );
    obstacle.move(this.gh);
  }

  addObstacles() {
    this.answers.forEach((answer) => {
      if (answer.displayText.text == this.operation.result) return;
      this.addObstacle(answer.x);
    });
  }

  addScoreText() {
    const textConfig = {
      fontFamily: "LuckiestGuy",
      fontSize: "80px",
      color: "#FFFF00",
      stroke: "#000000",
      strokeThickness: 5,
      shadow: { blur: 0, stroke: false, fill: false },
    };

    this.scoreText = this.add
      .text(10, 10, "score " + this.score, textConfig)
      .setOrigin(0, 0);
  }

  updateScore() {
    this.score++;
    this.scoreText.setText("score " + this.score);
  }

  lostGame() {
    this.isGameLost = true;
    clearTimeout(this.newOperation);
    this.obstacles.forEach((obstacle) => obstacle.drive.stop());
    this.carCrash();
  }

  carCrash() {
    this.carCrashAudio.play();
    this.mainCar.setCrashedSprite();
    this.mainCar.explosion.setPosition(
      this.mainCar.x,
      this.mainCar.y - this.mainCar.displayHeight / 2
    );
    this.mainCar.explosion.startAnimation(() => this.scene.restart());
  }

  createBanner() {
    this.time.addEvent({
      delay: 13000,
      callback: () => this.addBanner(),
      loop: true,
    });
  }

  bannerMove() {
    this.tweens.add({
      targets: this.banner,
      y: this.gh + this.banner.displayHeight,
      duration: 2500,
      onComplete: () => {
        this.banner.destroy();
      },
    });
  }

  addBanner() {
    this.banner = this.add.image(this.gw / 2, -50, "banner");
    this.bannerMove();
  }
}
