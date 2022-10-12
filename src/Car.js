class Car extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, sprite) {
    super(scene, x, y, sprite);
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.sprite = sprite;

    this.scene.add.existing(this);
    this.setScale(1.5);
    this.scene.physics.world.enableBody(this);

    this.explosion = new Explosion(
      this.scene,
      this.x,
      this.y - this.displayHeight / 2,
      "explosion"
    );
  }

  setPositionX(x) {
    this.scene.tweens.add({
      targets: this,
      x: x,
      duration: 500,
      onComplete: () => {},
    });
  }
}
