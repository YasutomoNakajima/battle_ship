///<reference path="../lib/node_modules/@types/jquery/JQuery.d.ts" />
///<reference path="../lib/node_modules/pixi.js/pixi.js.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var tuto;
(function (tuto) {
    var Ezelia;
    (function (Ezelia) {
        var Scene = /** @class */ (function (_super) {
            __extends(Scene, _super);
            function Scene() {
                var _this = _super.call(this) || this;
                _this.paused = false;
                _this.updateCB = function () { };
                return _this;
            }
            Scene.prototype.onUpdate = function (updateCB) {
                this.updateCB = updateCB;
            };
            Scene.prototype.update = function () {
                this.updateCB();
            };
            Scene.prototype.pause = function () {
                this.paused = true;
            };
            Scene.prototype.resume = function () {
                this.paused = false;
            };
            Scene.prototype.isPaused = function () {
                return this.paused;
            };
            return Scene;
        }(PIXI.Container));
        Ezelia.Scene = Scene;
    })(Ezelia = tuto.Ezelia || (tuto.Ezelia = {}));
})(tuto || (tuto = {}));
