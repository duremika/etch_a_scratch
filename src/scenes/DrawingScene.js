import { ORIGINAL_SIZE, DRAWING_AREA, BUTTONS, SOUNDS } from '../utils/constants.js';
import { calculateDrawingArea } from '../utils/helpers.js';
import { EraseButton } from '../components/EraseButton.js';
import { ControlButton } from '../components/ControlButton.js';


export class DrawingScene extends Phaser.Scene {
    constructor() {
        super('DrawingScene');
        this.line = null;
        this.lastPoint = null;
        this.speed = 1;
        this.keys = null;
        this.isMoving = false;
        this.lastAdTime = Date.now();
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('board', 'assets/board.png');
        this.load.image('eraseButton', 'assets/eraser-svgrepo-com.svg');
        this.load.image('leftButton', 'assets/chevron-arrows-svgrepo-com-left.svg');
        this.load.image('rightButton', 'assets/chevron-arrows-svgrepo-com-right.svg');
        this.load.image('upButton', 'assets/chevron-arrows-svgrepo-com-up.svg');
        this.load.image('downButton', 'assets/chevron-arrows-svgrepo-com-down.svg');
        this.load.audio('eraseSound', 'assets/erase-sound.mp3');
        this.load.audio('moveSound', 'assets/move-sound.mp3');
    }

    create() {
        this.initYandexSDK();
        this.setupDrawingArea();
        this.setupControls();
        this.setupEventListeners();
        this.setupSound();

        if (this.sys.game.device.input.touch) {
            this.input.addPointer(3);
        }
    }

    initYandexSDK() {
        if (typeof YaGames !== 'undefined') {
            YaGames.init().then(ysdkInstance => {
                this.ysdk = ysdkInstance;
                this.ysdk.adv.showFullscreenAdv();
                this.ysdk.features.LoadingAPI.ready();
            });
        }
    }

    setupDrawingArea() {
        this.drawingArea = calculateDrawingArea(this);

        this.whiteBg = this.add.graphics()
            .fillStyle(0xd0d0d0)
            .fillRect(
                this.drawingArea.x,
                this.drawingArea.y,
                this.drawingArea.width,
                this.drawingArea.height
            ).setDepth(1);

        this.line = this.add.graphics().setDepth(2);

        this.board = this.add.image(0, 0, 'board')
            .setOrigin(0, 0)
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height)
            .setDepth(3);

        this.initCursorPosition();
    }

    initCursorPosition() {
        this.cursorPos = {
            x: this.drawingArea.x + this.drawingArea.width / 16,
            y: this.drawingArea.y + this.drawingArea.height / 16
        };
        this.lastPoint = { ...this.cursorPos };
    }

    setupControls() {
        this.keys = this.input.keyboard.createCursorKeys();

        this.eraseButton = new EraseButton(this);
        ['SPACE', 'ENTER', 'OK'].forEach(key => {
            this.input.keyboard.on(`keydown-${key}`, () => this.eraseButton.handleErase());
        });

        this.leftButton = new ControlButton(
            this,
            BUTTONS.ARROWS.x,
            BUTTONS.ARROWS.y,
            'leftButton',
            'left'
        );

        this.rightButton = new ControlButton(
            this,
            BUTTONS.ARROWS.x,
            BUTTONS.ARROWS.y + 250,
            'rightButton',
            'right'
        );

        this.upButton = new ControlButton(
            this,
            this.cameras.main.width - BUTTONS.ARROWS.x,
            BUTTONS.ARROWS.y,
            'upButton',
            'up'
        );
        this.downButton = new ControlButton(
            this,
            this.cameras.main.width - BUTTONS.ARROWS.x,
            BUTTONS.ARROWS.y + 250,
            'downButton',
            'down'
        );
    }

    setupEventListeners() {
        this.scale.on('resize', this.handleResize.bind(this));
    }

    setupSound() {
        this.eraseSound = this.sound.get('eraseSound') || this.sound.add('eraseSound', SOUNDS.ERASE);
        this.moveSound = this.sound.get('moveSound') || this.sound.add('moveSound', SOUNDS.MOVE);
    }

    handleResize(gameSize) {
        this.board.setDisplaySize(gameSize.width, gameSize.height);
        this.drawingArea = calculateDrawingArea(this);

        this.whiteBg.clear()
            .fillStyle(0xd0d0d0)
            .fillRect(
                this.drawingArea.x,
                this.drawingArea.y,
                this.drawingArea.width,
                this.drawingArea.height
            );

        this.eraseButton.updatePosition(gameSize);
        this.leftButton.updatePosition(gameSize);
        this.rightButton.updatePosition(gameSize);
        this.upButton.updatePosition(gameSize);
        this.downButton.updatePosition(gameSize);
    }

    update() {
        this.handleCursorMovement();
    }

    handleCursorMovement() {
        const prevPos = { ...this.cursorPos };
        let moved = false;

        ['left', 'right', 'up', 'down'].forEach(direction => {
            if (this.keys[direction].isDown) {
                this.cursorPos[direction === 'left' || direction === 'right' ? 'x' : 'y'] +=
                    this.speed * (direction === 'left' || direction === 'up' ? -1 : 1);
                moved = true;
            }
        });

        if (moved && !this.isMoving) {
            this.moveSound.play();
            this.isMoving = true;
        } else if (!moved && this.isMoving) {
            this.moveSound.stop();
            this.isMoving = false;
        }

        if (moved) {
            this.clampCursorPosition();
            this.drawLine(prevPos);
            this.lastPoint = { ...this.cursorPos };
        }
    }

    clampCursorPosition() {
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
    }

    drawLine(prevPos) {
        this.line.lineStyle(1, 0x404040);
        this.line.lineBetween(
            prevPos.x,
            prevPos.y,
            this.cursorPos.x,
            this.cursorPos.y
        );
    }
}
