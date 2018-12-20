//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //分数
        _this.score = 0;
        //决定大球还是小球的变量  大球为1，小球为2
        _this.blackType = 1;
        //存储生成的黑球的显示对象，刚体，形状的数组，并没有全用上
        _this.blackBodys = [];
        _this.blackDis = [];
        _this.blackShape = [];
        //当黑球落下时缓存的数组，设计上有bug
        _this.blackCache = [];
        //记录生成了几个黑球
        _this.blacknumber = 0;
        _this.gamed = false;
        return _this;
        /**
         * 点击按钮
         * Click the button
         */
    }
    Main.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin
        });
        egret.lifecycle.onPause = function () {
            egret.ticker.pause();
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
        };
        //inject the custom material parser
        //注入自定义的素材解析器
        var assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        this.runGame().catch(function (e) {
            console.log(e);
        });
    };
    Main.prototype.runGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, userInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadResource()];
                    case 1:
                        _a.sent();
                        this.createGameScene();
                        return [4 /*yield*/, RES.getResAsync("description_json")];
                    case 2:
                        result = _a.sent();
                        this.startAnimation(result);
                        return [4 /*yield*/, platform.login()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, platform.getUserInfo()];
                    case 4:
                        userInfo = _a.sent();
                        console.log(userInfo);
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loadingView, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        loadingView = new LoadingUI();
                        this.stage.addChild(loadingView);
                        return [4 /*yield*/, RES.loadConfig("resource/default.res.json", "resource/")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.loadTheme()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, RES.loadGroup("preload", 0, loadingView)];
                    case 3:
                        _a.sent();
                        this.stage.removeChild(loadingView);
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadTheme = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            var theme = new eui.Theme("resource/default.thm.json", _this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, function () {
                resolve();
            }, _this);
        });
    };
    //游戏开始界面
    Main.prototype.createGameScene = function () {
        var _this = this;
        var bg = new egret.Shape();
        bg.graphics.beginFill(0x0000ff);
        bg.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
        bg.graphics.endFill();
        bg.alpha = 1;
        this.addChild(bg);
        var tx = new eui.Label();
        tx.text = "游戏规则:点击下方半圆区域，射出黑球阻止白球落下，一共五个黑球，每次撞击白球+1分，接金币+10分,小球模式是双倍积分和球数，但是速度也是双倍哦，本版小球切回大球模式有数量bug";
        tx.textColor = 0xff0000;
        tx.width = this.stage.stageWidth;
        tx.y = 200;
        tx.size = 40;
        this.addChild(tx);
        var btn = new eui.Button();
        this.addChild(btn);
        btn.label = "大球模式";
        btn.width = 250;
        btn.height = 100;
        btn.x = this.stage.stageWidth / 2 - 50;
        btn.y = this.stage.stageHeight / 2 - 100;
        var btn2 = new eui.Button();
        this.addChild(btn2);
        btn2.label = "小球模式";
        btn2.width = 250;
        btn2.height = 100;
        btn2.x = this.stage.stageWidth / 2 - 50;
        btn2.y = this.stage.stageHeight / 2 + 100;
        var touch = btn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
            //球的类型，大球是1，小球是2，这个值影响全局的得分率，速度，球大小
            _this.blackType = 1;
            //移除本界面所有的显示对象，其实装在容器里的话一下子就可以移除了；
            btn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, touch, _this);
            _this.removeChild(btn);
            _this.removeChild(btn2);
            _this.removeChild(tx);
            _this.removeChild(bg);
            //根据变量判断是否玩过游戏，开始游戏或者重启游戏
            if (!_this.gamed)
                _this.gameStart();
            else
                _this.restart();
        }, this);
        var touch2 = btn2.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
            _this.blackType = 2;
            btn2.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, touch2, _this);
            _this.removeChild(btn2);
            _this.removeChild(btn);
            _this.removeChild(tx);
            _this.removeChild(bg);
            if (!_this.gamed)
                _this.gameStart();
            else
                _this.restart();
        }, this);
    };
    //游戏正题
    Main.prototype.gameStart = function () {
        var _this = this;
        //换算比，p2坐标等于egret坐标除以50 
        var factor = 50;
        //场景高度和宽度
        var sH = this.stage.stageHeight;
        var sW = this.stage.stageWidth;
        //世界，由于采取的是镜像法，所以重力为正，p2世界中实际上刚体是在往上走;这种方法可以免掉转换egret坐标系，但是有一些其他的麻烦
        var world = new p2.World({ gravity: [0, 8] });
        this.world = world;
        //背景
        var bg = new egret.Shape();
        bg.graphics.beginFill(0x0000ff);
        //和舞台宽高相同
        bg.graphics.drawRect(0, 0, sW, sH);
        bg.graphics.endFill();
        bg.alpha = 0.2;
        this.addChild(bg);
        //分数
        var score;
        score = this.score;
        var scoreText = new egret.TextField();
        scoreText.text = "总分：" + score;
        scoreText.alpha = 0.7;
        scoreText.textColor = 0xffffff;
        this.addChild(scoreText);
        //剩余黑球数
        var leftblack = new egret.TextField();
        leftblack.text = "0";
        leftblack.alpha = 0.7;
        leftblack.textColor = 0xffffff;
        leftblack.y = 50;
        this.addChild(leftblack);
        var circle = new egret.Shape();
        circle.graphics.beginFill(0xffffff);
        circle.graphics.drawCircle(50, 50, 50);
        circle.graphics.endFill();
        this.addChild(circle);
        //圆形比较特殊，画图函数的坐标点,rx,ry本身就是图形的中心距离，所以只要把rx,ry设为[0,0]就可以不必设置偏移
        //这里完全是折腾
        circle.anchorOffsetX = 50;
        circle.anchorOffsetY = 50;
        circle.x = 0;
        circle.y = 0;
        //金币
        var gold = new egret.Shape();
        gold.graphics.beginFill(0xffff00);
        gold.graphics.drawCircle(20, 20, 20);
        gold.graphics.endFill();
        this.addChild(gold);
        gold.anchorOffsetX = 20;
        gold.anchorOffsetX = 20;
        gold.x = sW / 2;
        gold.y = 50;
        var goldShape = new p2.Circle({ radius: 20 / factor });
        var goldBody = new p2.Body({ mass: 0.5, position: [sW / 2 / factor, 50 / factor] });
        goldBody.addShape(goldShape);
        goldBody.displays = [gold];
        //id是为了监控碰撞检测，注意不能和材料或者其他刚体等的id重合了
        goldBody.id = 5;
        world.addBody(goldBody);
        //world.on  监控碰撞  结束事件    事件对象中包含刚体bodyA bodyB   注意碰撞存在A碰B B碰A两种情况    
        //检测黑球（id>20）碰金币 id=5  
        world.on("endContact", function (evt) {
            if ((evt.bodyA.id > 20 && evt.bodyB.id == 5) || (evt.bodyA.id == 5 && evt.bodyB.id > 20)) {
                //碰撞后把金币传送出地图
                goldBody.position[1] = (_this.stage.stageHeight + 100) / factor;
                //给金币向下的速度
                goldBody.velocity = [-1, 6];
                //分数+10 or 20
                _this.score += 10 * _this.blackType;
            }
        });
        //金币我们设成定时刷新坐标，全局一个金币
        //5秒检测一次
        var timer = new egret.Timer(5000, 0);
        timer.addEventListener(egret.TimerEvent.TIMER, function () {
            //如果已经离开画面，就把它再刷出来
            if (goldBody.position[1] > _this.stage.stageHeight / factor) {
                goldBody.position[1] = 50 / factor;
                goldBody.velocity = [1, 6];
            }
        }, this);
        timer.start();
        //黑球点击发射的半圆区域
        var arcArea = new egret.Shape();
        arcArea.graphics.lineStyle(10, 0xffffff);
        arcArea.graphics.drawArc(sW / 2, sH, sW / 2, Math.PI, 0);
        arcArea.graphics.endFill();
        this.addChild(arcArea);
        //画舞台边框
        var stageRect = new egret.Shape();
        stageRect.graphics.lineStyle(5, 0x000000);
        stageRect.graphics.drawRect(0, 0, sW, sH);
        stageRect.graphics.endFill();
        this.addChild(stageRect);
        //顶部
        var planeBody = new p2.Body({ mass: 1, type: p2.Body.STATIC, position: [sW / 2 / factor, 0 / factor] });
        var planeShape = new p2.Plane();
        planeBody.addShape(planeShape);
        planeBody.displays = [];
        var leftWallBody = new p2.Body({ mass: 1, type: p2.Body.STATIC, position: [0 / factor, sH / 2 / factor] });
        var leftWallShape = new p2.Plane();
        //左墙
        leftWallBody.angle = -Math.PI / 2;
        leftWallBody.addShape(leftWallShape);
        leftWallBody.displays = [];
        //右墙
        var rightWallBody = new p2.Body({ mass: 1, type: p2.Body.STATIC, position: [sW / factor, sH / 2 / factor] });
        var rightWallShape = new p2.Plane();
        rightWallBody.angle = Math.PI / 2;
        rightWallBody.addShape(rightWallShape);
        rightWallBody.displays = [];
        //白球刚体
        var whiteBody = new p2.Body({ mass: 1, position: [50 / factor, 50 / factor] });
        var whiteShape = new p2.Circle({ radius: 50 / factor });
        whiteBody.addShape(whiteShape);
        whiteBody.displays = [circle];
        //白球id
        whiteBody.id = 10;
        this.whiteBody = whiteBody;
        //创建材质
        var materiaA = new p2.Material(1);
        this.materiaA = materiaA;
        var materiaB = new p2.Material(2);
        this.materiaB = materiaB;
        var materiaC = new p2.Material(3);
        //给球和平面的（形状）绑定材质
        planeShape.material = materiaC;
        leftWallShape.material = materiaC;
        rightWallShape.material = materiaC;
        whiteShape.material = materiaA;
        //材质之间的关系 这里只设置了弹力，均为0.8
        var contactMaterial = new p2.ContactMaterial(materiaA, materiaB);
        contactMaterial.restitution = 0.8;
        //材质关系加入到世界（重要）
        world.addContactMaterial(contactMaterial);
        var contactMaterial2 = new p2.ContactMaterial(materiaA, materiaC);
        contactMaterial2.restitution = 0.8;
        world.addContactMaterial(contactMaterial2);
        var contactMaterial3 = new p2.ContactMaterial(materiaB, materiaC);
        contactMaterial3.restitution = 0.8;
        world.addContactMaterial(contactMaterial3);
        //世界中加入刚体
        world.addBody(whiteBody);
        world.addBody(planeBody);
        world.addBody(leftWallBody);
        world.addBody(rightWallBody);
        //按键音
        var touchsound = RES.getRes("touch_mp3");
        //触摸监控
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, function (evt) {
            //如果点击的坐标距离底部圆心的距离小于半径，则表示在圆内，这里不需要碰撞检测
            var x2 = Math.pow(sW / 2 - evt.stageX, 2);
            var y2 = Math.pow(sH - evt.stageY, 2);
            var r2 = Math.pow(sW / 2, 2);
            //求点击处到圆心的模长
            var length = Math.sqrt(x2 + y2);
            //速度大小和方向，其实这里我求反了   我把速度乘了20倍
            var vx = (sW / 2 - evt.stageX) / length * 20;
            var vy = (sH - evt.stageY) / length * 20;
            if ((x2 + y2) < r2) {
                //速度值传入生成某方向的黑球，这里我求反了，所以输入带了负号
                _this.createBlackball(-vx, -vy);
                touchsound.play(0, 1);
            }
        }, this);
        //碰撞尽量不要写在心跳里
        world.on("endContact", function (evt) {
            if (evt.bodyA.id == 10 && evt.bodyB.id > 20) {
                //加1分或2分
                _this.score += _this.blackType;
                scoreText.text = "总分：" + _this.score;
            }
        });
        egret.Ticker.getInstance().register(onticker, this);
        this.onticker = onticker;
        function onticker(dt) {
            world.step(dt / 1000);
            //白球显示对象和刚体的坐标同步
            circle.x = whiteBody.position[0] * factor;
            circle.y = whiteBody.position[1] * factor;
            //金币显示对象和刚体坐标同步
            gold.x = goldBody.position[0] * factor;
            gold.y = goldBody.position[1] * factor;
            //遍历黑球的显示对象，和刚体同步
            for (var i = 0; i < this.blackBodys.length; i++) {
                this.blackBodys[i].displays[0].x = this.blackBodys[i].position[0] * factor;
                this.blackBodys[i].displays[0].y = this.blackBodys[i].position[1] * factor;
                //如果黑球掉下则推入缓冲栈，设置条件避免无限循环
                //增加难度，将黑球入栈推迟500像素
                if (this.blackBodys[i].position[1] > (sH + 500) / factor && (this.blackCache.indexOf(this.blackBodys[i])) === -1)
                    this.blackCache.push(this.blackBodys[i]);
                leftblack.text = "仓库剩余球" + this.blackCache.length;
            }
            //如果白球掉下，则游戏结束
            if (whiteBody.position[1] > sH / factor) {
                scoreText.text = "你输了";
                //停止心跳，停止p2世界的时间
                egret.Ticker.getInstance().unregister(onticker, this);
                //显示游戏结束面板
                this.gameover();
            }
        }
    };
    //黑球生成函数
    Main.prototype.createBlackball = function (vx, vy) {
        //有bug，当黑球生成完毕，不再生成，从缓存数组中取出来
        if (this.blacknumber >= 5 * this.blackType && this.blackCache.length > 0) {
            //每次生成或者从缓存取出黑球都要根据球类型变量决定生成大球还是小球
            //刷新显示对象和p2形状对象
            var circle = new egret.Shape();
            circle.graphics.beginFill(0x000000);
            circle.graphics.drawCircle(0, 0, 50 / this.blackType);
            circle.graphics.endFill();
            this.addChild(circle);
            var blackShape = new p2.Circle({ radius: 50 / this.blackType / 50 });
            //形状对象附加材质
            blackShape.material = this.materiaB;
            //从缓存中取出刚体对象
            var oldBody = this.blackCache.pop();
            //直接换掉显示对象和形状
            this.removeChild(oldBody.displays[0]);
            oldBody.displays[0] = circle;
            oldBody.removeShape(oldBody.shapes[0]);
            oldBody.addShape(blackShape);
            //移动位置到下方，给与初速度
            oldBody.position = [this.stage.stageWidth / 2 / 50, this.stage.stageHeight / 50];
            oldBody.velocity = [vx * this.blackType, vy * this.blackType];
        }
        else if (this.blacknumber < 5 * this.blackType) {
            //每次执行都创造出新的黑球
            var circle = new egret.Shape();
            circle.graphics.beginFill(0x000000);
            circle.graphics.drawCircle(50 / this.blackType, 50 / this.blackType, 50 / this.blackType);
            circle.graphics.endFill();
            this.addChild(circle);
            circle.anchorOffsetX = 50 / this.blackType;
            circle.anchorOffsetY = 50 / this.blackType;
            circle.x = this.stage.stageWidth / 2;
            circle.y = this.stage.stageHeight;
            var blackBody = new p2.Body({ mass: 1, position: [this.stage.stageWidth / 2 / 50, this.stage.stageHeight / 50] });
            var blackShape = new p2.Circle({ radius: 50 / this.blackType / 50 });
            //设置材质
            blackShape.material = this.materiaB;
            //设置id要求不能和其他的id冲突，我这里夸张化了，只知道id>20
            blackBody.id = Math.round(Math.random() * 100 + 20);
            blackBody.addShape(blackShape);
            blackBody.displays = [circle];
            //传入初速度
            blackBody.velocity = [vx * this.blackType, vy * this.blackType];
            this.world.addBody(blackBody);
            //黑球的显示对象和刚体加入数组
            this.blackBodys.push(blackBody);
            this.blackDis.push(circle);
            this.blackShape.push(blackShape);
            this.blacknumber++;
        }
        else
            return false;
    };
    //游戏结束界面，包括重新开始和返回界面，和游戏开始的界面差不多
    Main.prototype.gameover = function () {
        var _this = this;
        //设置游戏玩过的标签为true；
        this.gamed = true;
        var bg = new egret.Shape();
        bg.graphics.beginFill(0xff0000);
        bg.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
        bg.graphics.endFill();
        bg.alpha = 0.5;
        this.addChild(bg);
        var tx = new eui.Label();
        tx.text = "游戏结束，你的总分是：" + this.score;
        tx.textColor = 0x000000;
        tx.width = this.stage.stageWidth;
        tx.y = 300;
        tx.size = 50;
        this.addChild(tx);
        var btn = new eui.Button();
        this.addChild(btn);
        btn.label = "重新开始";
        btn.width = 250;
        btn.height = 100;
        btn.x = this.stage.stageWidth / 2 - 50;
        btn.y = this.stage.stageHeight / 2 - 100;
        var btn2 = new eui.Button();
        this.addChild(btn2);
        btn2.label = "回到界面";
        btn2.width = 250;
        btn2.height = 100;
        btn2.x = this.stage.stageWidth / 2 - 50;
        btn2.y = this.stage.stageHeight / 2 + 100;
        var touch = btn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
            btn2.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, touch2, _this);
            btn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, touch, _this);
            _this.removeChild(btn);
            _this.removeChild(btn2);
            _this.removeChild(tx);
            _this.removeChild(bg);
            //游戏重新开始
            _this.restart();
        }, this);
        var touch2 = btn2.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
            btn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, touch, _this);
            btn2.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, touch2, _this);
            _this.removeChild(btn);
            _this.removeChild(btn2);
            _this.removeChild(tx);
            _this.removeChild(bg);
            //回到界面
            _this.createGameScene();
        }, this);
    };
    ;
    //重新开始游戏  把白球放回原位，黑球全部传走，分数归零。
    Main.prototype.restart = function () {
        this.whiteBody.velocity = [3, 1];
        this.whiteBody.position = [50 / 50, 50 / 50];
        //把黑球刚体对象循环利用
        for (var _i = 0, _a = this.blackBodys; _i < _a.length; _i++) {
            var body = _a[_i];
            if (body.position[1] < this.stage.stageHeight / 50)
                body.position[1] = (this.stage.stageHeight + 20000) / 50;
        }
        this.score = 0;
        egret.Ticker.getInstance().register(this.onticker, this);
    };
    Main.prototype.startAnimation = function (result) {
        var _this = this;
        var parser = new egret.HtmlTextParser();
        var textflowArr = result.map(function (text) { return parser.parse(text); });
        var textfield = this.textfield;
        var count = -1;
        var change = function () {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            var textFlow = textflowArr[count];
            // 切换描述内容
            // Switch to described content
            textfield.textFlow = textFlow;
            var tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, _this);
        };
        change();
    };
    return Main;
}(eui.UILayer));
__reflect(Main.prototype, "Main");
//# sourceMappingURL=Main.js.map