class Nitro extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, sprite) {
    super(scene, x, y, sprite);
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.sprite = sprite;

    this.scene.add.existing(this);
    this.setScale(0.3);
    this.setVisible(false);
  }

  setPositionX(x) {
    this.scene.tweens.add({
      targets: this,
      x: x,
      duration: 500,
      onComplete: () => {},
    });
  }

  start() {
    this.play("nitro");
    this.setVisible(true);
  }

  off() {
    this.anims.stop();
    this.setVisible(false);
  }
}
