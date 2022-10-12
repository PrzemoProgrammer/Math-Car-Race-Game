class Explosion extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, sprite) {
    super(scene, x, y, sprite);
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.sprite = sprite;

    this.scene.add.existing(this);
    this.setVisible(false);
    this.setActive(false);
    this.setDepth(100);
  }

  startAnimation(restartGame) {
    this.setVisible(true);
    this.setActive(true);
    this.play(this.sprite).once("animationcomplete", () => {
      restartGame();
    });
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
}
