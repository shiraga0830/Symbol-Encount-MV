/*:
 * @target MV
 * @plugindesc MV用シンボルエンカウント
 * @author ネメシス
 *
 * @help
 * イベントのメモ欄に <SymbolEnemy> と書くと有効になります。
 *
 * 動作について：
 *   ・プレイヤーとの距離が5歩程度近くなるとびっくりマークを表示して追跡します
 *   ・プレイヤーとの距離が7歩程度遠くなると追跡を終了します
 */

(() => {
	const _Game_Event_initMembers = Game_Event.prototype.initMembers;
	Game_Event.prototype.initMembers = function () {
		_Game_Event_initMembers.call(this);
		this._symbolEnemy = false;
		this._originalX = 0;
		this._originalY = 0;
		this._isChasing = false;
	};
	const _Game_Event_setupPage = Game_Event.prototype.setupPage;
	Game_Event.prototype.setupPage = function () {
		_Game_Event_setupPage.call(this);
		if (this.event().note.includes("<SymbolEnemy>")) {
			this._symbolEnemy = true;
			this._originalX = this.x;
			this._originalY = this.y;
		}
	};
	const _Game_Event_update = Game_Event.prototype.update;
	Game_Event.prototype.update = function () {
		_Game_Event_update.call(this);
		if (this._symbolEnemy) this.updateSymbolEnemy();
	};
	Game_Event.prototype.updateSymbolEnemy = function () {
		const dx = $gamePlayer.x - this.x;
		const dy = $gamePlayer.y - this.y;
		const dist = Math.abs(dx) + Math.abs(dy);
		if (dist === 0) {
			if (!$gameMap.isEventRunning()) {
				this.start();
			}
			return;
		}
		if (!this._isChasing && dist <= 5) {
			this.requestBalloon(1);
			this._isChasing = true;
			this.setMoveSpeed(4);
			this.setMoveFrequency(5);
			AudioManager.playSe({"name":"Decision2","volume":90,"pitch":150,"pan":0});
		}
		if (this._isChasing) {
			if (dist > 7) {
				this._isChasing = false;
				this.setMoveSpeed(3);
				this.setMoveFrequency(3);
			}
		} else {
			this._isChasing = false;
		}
	};
	Game_Event.prototype.moveTowardOriginal = function () {
		if (this.x === this._originalX && this.y === this._originalY) return;
		const sx = this.deltaXFrom(this._originalX);
		const sy = this.deltaYFrom(this._originalY);
		if (Math.abs(sx) > Math.abs(sy)) {
			this.moveStraight(sx > 0 ? 4 : 6);
		} else if (sy !== 0) {
			this.moveStraight(sy > 0 ? 8 : 2);
		}
	};
	Game_Event.prototype.update = function () {
		_Game_Event_update.call(this);
		if (this._symbolEnemy && this._erased === false) this.updateSymbolEnemy();
	};

})();
