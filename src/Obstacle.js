class Obstacle extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.scene = scene;
    this.x = x;
    this.y = y;
    // this.sprite = sprite;
    this.setTexture(this.randomSkin());

    this.scene.add.existing(this);
    this.setScale(0.3);

    this.scene.physics.world.enableBody(this);
  }

  move(y) {
    this.drive = this.scene.tweens.add({
      targets: this,
      y: y + this.height,
      duration: 2400,
    });
  }

  randomSkin() {
    let randomNumber = this.getRandomNumber();

    let skin = null;
    switch (randomNumber) {
      case 0:
        skin = "car1";
        break;
      case 1:
        skin = "car2";
        break;
      case 2:
        skin = "car3";
        break;
    }
    return skin;
  }

  getRandomNumber() {
    return Math.floor(Phaser.Math.Between(0, 2));
  }

  setCrashedSprite() {
    let skin = null;
    switch (this.texture.key) {
      case "car1":
        skin = "car1Crashed";
        break;
      case "car2":
        skin = "car2Crashed";
        break;
      case "car3":
        skin = "car3Crashed";
        break;
    }
    this.setTexture(skin);
  }
}
