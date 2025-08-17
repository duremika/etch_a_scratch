class DrawingScene {
    constructor() {
        this.line = null;
        this.lastPoint = null;
        this.speed = 1;

        this.originalWidth = 1420;
        this.originalHeight = 800;

        this.originalDrawingArea = {
            x: 221,
            y: 144,
            width: 976,
            height: 486
        };
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('board', 'assets/board.png');
    }

    create() {
        const scaleX = this.cameras.main.width / this.originalWidth;
        const scaleY = this.cameras.main.height / this.originalHeight;

        this.drawingArea = {
            x: this.originalDrawingArea.x * scaleX,
            y: this.originalDrawingArea.y * scaleY,
            width: this.originalDrawingArea.width * scaleX,
            height: this.originalDrawingArea.height * scaleY
        };

        this.whiteBg = this.add.graphics()
            .fillStyle(0xd0d0d0)
            .fillRect(
                this.drawingArea.x,
                this.drawingArea.y,
                this.drawingArea.width,
                this.drawingArea.height
            ).setDepth(1);

        this.line = this.add.graphics()
            .setDepth(2);

        this.board = this.add.image(0, 0, 'board')
            .setOrigin(0, 0)
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height)
            .setDepth(3);

        this.cursorPos = {
            x: this.drawingArea.x + this.drawingArea.width / 16,
            y: this.drawingArea.y + this.drawingArea.height / 16
        };
        this.lastPoint = { ...this.cursorPos };

        this.keys = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on('keydown-SPACE', () => {
            this.line.clear();
        });

        this.scale.on('resize', (gameSize) => {
            this.board.setDisplaySize(gameSize.width, gameSize.height);

            const newScaleX = gameSize.width / this.originalWidth;
            const newScaleY = gameSize.height / this.originalHeight;

            this.drawingArea = {
                x: this.originalDrawingArea.x * newScaleX,
                y: this.originalDrawingArea.y * newScaleY,
                width: this.originalDrawingArea.width * newScaleX,
                height: this.originalDrawingArea.height * newScaleY
            };

            this.whiteBg.clear()
                .fillStyle(0xd0d0d0)
                .fillRect(
                    this.drawingArea.x,
                    this.drawingArea.y,
                    this.drawingArea.width,
                    this.drawingArea.height
                );
        });
    }

    update() {
        const prevPos = { ...this.cursorPos };
        let moved = false;

        if (this.keys.left.isDown) {
            this.cursorPos.x -= this.speed;
            moved = true;
        }
        if (this.keys.right.isDown) {
            this.cursorPos.x += this.speed;
            moved = true;
        }
        if (this.keys.up.isDown) {
            this.cursorPos.y -= this.speed;
            moved = true;
        }
        if (this.keys.down.isDown) {
            this.cursorPos.y += this.speed;
            moved = true;
        }

        if (moved) {
            this.cursorPos.x = Phaser.Math.Clamp(
                this.cursorPos.x,
                this.drawingArea.x,
                this.drawingArea.x + this.drawingArea.width
            );
            this.cursorPos.y = Phaser.Math.Clamp(
                this.cursorPos.y,
                this.drawingArea.y,
                this.drawingArea.y + this.drawingArea.height
            );

            this.line.lineStyle(1, 0x404040);
            this.line.lineBetween(
                prevPos.x,
                prevPos.y,
                this.cursorPos.x,
                this.cursorPos.y
            );

            this.lastPoint = { ...this.cursorPos };
        }
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 1420,
    height: 800,
    scene: DrawingScene,
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

new Phaser.Game(config);