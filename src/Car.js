class Car extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, sprite) {
    super(scene, x, y, sprite);
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.sprite = sprite;

    this.scene.add.existing(this);
    this.setScale(0.3);

    this.scene.physics.world.enableBody(this);

    this.addExplosion();
    this.addNitro();
    this.addLights();
  }

  setPositionX(x) {
    this.scene.tweens.add({
      targets: this,
      x: x,
      duration: 500,
      onUpdate: () => {
        this.light1.setX(this.x + 20);
        this.light2.setX(this.x - 20);
      },
    });

    this.nitro.setPositionX(x);
  }

  setCrashedSprite() {
    this.setTexture("carPorscheCrashed");
  }

  addExplosion() {
    this.explosion = new Explosion(
      this.scene,
      this.x,
      this.y - this.displayHeight / 2,
      "explosion"
    );
  }

  addNitro() {
    this.nitro = new Nitro(
      this.scene,
      this.x,
      this.y + this.displayHeight / 2 + 40,
      "nitro"
    );
  }

  addLights() {
    this.light1 = this.scene.add
      .image(this.x + 20, this.y - this.displayHeight / 2 - 110, "carLight")
      .setScale(0.2);
    this.light2 = this.scene.add
      .image(this.x - 20, this.y - this.displayHeight / 2 - 110, "carLight")
      .setScale(0.2);
  }

  lightsOff() {
    this.light1.destroy();
    this.light2.destroy();
  }
}
