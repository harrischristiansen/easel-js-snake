/*
	@ Harris Christiansen (Harris@HarrisChristiansen.com)
	Created: November 17, 2016
	Project: Easel-JS-Snake
*/

var _colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"];
var KEYCODE_LEFT = 37,
	KEYCODE_UP = 38,
	KEYCODE_RIGHT = 39,
	KEYCODE_DOWN = 40;

var _update = true; // Set to true to call for stage update
var _canvas, _stage, _drawingCanvas;

var _cursorPt = [0,0];

var _players = [];

//////////////////////////////////// Initialization ///////////////////////////////////////

$(document).ready(function() { 
	_canvas = document.getElementById("canvas");
	_stage = new createjs.Stage(_canvas);
	_stage.enableDOMEvents(true);

	createjs.Touch.enable(_stage); // Enable touch interactions
	createjs.Ticker.addEventListener("tick", _tick); // Register tick event method

	_drawingCanvas = new createjs.Shape(); // Canvas for drawing paths
	_stage.addChild(_drawingCanvas);

	_stage.addEventListener("stagemousedown", _handleMouseDown);
	_stage.addEventListener("stagemouseup", _handleMouseUp);
	window.addEventListener("keydown", _keyPressed,true);

	// Start Snake
	_reset();
	setInterval(_updatePlayers,50);
});

//////////////////////////////////// Mouse Actions ///////////////////////////////////////

function _handleMouseDown (evt) {
	if (!evt.primary) { return; }

	_cursorPt[0] = new createjs.Point(_stage.mouseX, _stage.mouseY);
	_cursorPt[1] = _cursorPt[0].clone();

	_stage.addEventListener("stagemousemove", _handleMouseMove);
}

function _handleMouseUp (evt) {
	if (!evt.primary) { return; }
	_stage.removeEventListener("stagemousemove", _handleMouseMove);
}

function _handleMouseMove (evt) {
	if (!evt.primary) { return; }

	var midPt = new createjs.Point(_cursorPt[0].x + _stage.mouseX >> 1, _cursorPt[0].y + _stage.mouseY >> 1);

	_drawingCanvas.graphics.clear().setStrokeStyle(2, 'round', 'round').beginStroke(_colors[5]).moveTo(midPt.x, midPt.y).curveTo(_cursorPt[0].x, _cursorPt[0].y, _cursorPt[1].x, _cursorPt[1].y);

	_cursorPt[0].x = _stage.mouseX;
	_cursorPt[0].y = _stage.mouseY;

	_cursorPt[1].x = midPt.x;
	_cursorPt[1].y = midPt.y;

	_stage.update();
}

//////////////////////////////////// Keyboard Actions ///////////////////////////////////////

function _keyPressed(event) {
	switch(event.keyCode) {
		case KEYCODE_LEFT:
			_players[0].dir = KEYCODE_LEFT;
			break;
		case KEYCODE_UP:
			_players[0].dir = KEYCODE_UP;
			break;
		case KEYCODE_RIGHT:
			_players[0].dir = KEYCODE_RIGHT;
			break;
		case KEYCODE_DOWN:
			_players[0].dir = KEYCODE_DOWN;
			break;
	}
}

//////////////////////////////////// Update Player Positions ///////////////////////////////////////

function _updatePlayers() {
	_drawAdvance();
	_checkBounds();
}

function _drawAdvance() {
	_players.forEach(function(player, index) {
		if (player.active) {
			switch (player.dir) {
				case KEYCODE_LEFT:
					_players[index].x -= player.speed;
					break;
				case KEYCODE_UP:
					_players[index].y -= player.speed;
					break;
				case KEYCODE_RIGHT:
					_players[index].x += player.speed;
					break;
				case KEYCODE_DOWN:
					_players[index].y += player.speed;
					break;
			}

			_drawingCanvas.graphics.beginFill(player.color).drawRect(player.x, player.y, 1, 1);
		}
	});

	_update = true;
}

function _checkBounds() {
	_players.forEach(function(player, index) {
		if (player.active) {
			if (player.x < 0 || player.x > _stage.canvas.width || player.y < 0 || player.y > _stage.canvas.height) {
				_players[index].active = false;

				setTimeout(_reset,1800); // Reset after 1.8 seconds
			}
		}
	});
}

//////////////////////////////////// Reset ///////////////////////////////////////

function _reset() {
	_players = [ new Player(10, 10, KEYCODE_RIGHT, _colors[0]) ];
	_drawingCanvas.graphics.clear(); // Clear Canvas
	_update = true;
}

//////////////////////////////////// Player Model ///////////////////////////////////////

function Player(startX, startY, startDir, color) {
   this.x = startX;
   this.y = startY;
   this.dir = startDir;
   this.color = color;
   this.speed = 1;
   this.active = 1
}

//////////////////////////////////// Frame Updates ///////////////////////////////////////

function stop() {
	createjs.Ticker.removeEventListener("tick", _tick);
}

function _tick(event) {
	if (_update) { // Set 'update = true' to trigger the _stage to update
		_update = false;
		_stage.update(event);
	}
}