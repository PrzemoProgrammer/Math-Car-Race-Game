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
    this.load.image("separator", "separator.png");
    this.load.image("hole", "hole.png");
    this.load.image("car1", "car1.png");
    this.load.image("car2", "car2.png");
    this.load.image("car3", "car3.png");
    this.load.image("banner", "banner.png");

    this.load.spritesheet("explosion", "explosion.png", {
      frameWidth: 2800 / 8,
      frameHeight: 301,
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

    this.addBackground();
    this.addRoad();
    this.createBanner();
    this.obstacles = [];
    this.answers = [];

    this.car = {
      position1: this.road.x - 210,
      position2: this.road.x,
      position3: this.road.x + 210,
    };

    this.isGameLost = false;
    this.score = 0;

    this.mainCar = new Car(this, this.car.position2, 900, "carPorsche");
    this.addOperation();
    this.addAnswers();
    this.addScoreText();

    this.correctAnswerAudio = this.sound.add("correctAnswer");
    this.correctAnswerAudio.volume = 0.5;

    this.wrongAnswerAudio = this.sound.add("wrongAnswer");
    this.wrongAnswerAudio.volume = 0.5;

    this.carCrashAudio = this.sound.add("carCrash");
  }

  update() {
    if (!this.isGameLost) this.road.tilePositionY -= 8;
  }

  addBackground() {
    this.background = this.add
      .image(0, 0, "background")
      .setOrigin(0, 0)
      .setDisplaySize(this.gw, this.gh);
  }

  addRoad() {
    this.road = this.add
      .tileSprite(this.gw / 2, 0, 639, 1177, "road")
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
    const obstacle = new Obstacle(this, x, -150, "car1");
    this.obstacles.push(obstacle);
    this.physics.add.overlap(
      this.mainCar,
      obstacle,
      () => {
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
    if (this.isGameLost) return;
    this.isGameLost = true;
    clearTimeout(this.newOperation);
    this.obstacles.forEach((obstacle) => obstacle.drive.stop());
    this.carCrash();
  }

  carCrash() {
    this.carCrashAudio.play();
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
