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

class Main extends eui.UILayer {


    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());


        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        const result = await RES.getResAsync("description_json")
        this.startAnimation(result);
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);

    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }

    private textfield: egret.TextField;
 /*** 
  *本游戏采用的是镜像法，将重力设为正值，而游戏中所有坐标系包括p2刚体都是按照egret的坐标系来的。并没有对y轴进行处理 

  将所有显示对象的轴心

  后续计划是UI  背景音乐 音效  排行榜（数据记录）  随机白球位置  道具模式  破碎效果  性能优化   按键音 碰撞音(撞墙和撞球)
  ***/


private world:p2.World;

//白球材质
private materiaA:p2.Material;
//黑球材质  平面的材质是materiaC
private materiaB:p2.Material;
//分数
private score:number=0;

    
//游戏开始界面
 protected createGameScene(): void {

    let bg=new egret.Shape()
    bg.graphics.beginFill(0x0000ff);
    bg.graphics.drawRect(0,0,this.stage.stageWidth,this.stage.stageHeight);
    bg.graphics.endFill();
    bg.alpha=1;
    this.addChild(bg);


     let tx:eui.Label=new eui.Label();
     tx.text="游戏规则:点击下方半圆区域，射出黑球阻止白球落下，一共五个黑球，每次撞击白球+1分，接金币+10分,小球模式是双倍积分和球数，但是速度也是双倍哦，本版小球切回大球模式有数量bug";
     tx.textColor=0xff0000;
     tx.width=this.stage.stageWidth;
     tx.y=200;
     tx.size=40;
     this.addChild(tx);


     let btn:eui.Button=new eui.Button()
     this.addChild(btn);
     btn.label="大球模式";
     btn.width=250;
     btn.height=100;
     btn.x=this.stage.stageWidth/2-50;
     btn.y=this.stage.stageHeight/2-100;


     let btn2:eui.Button=new eui.Button()
     this.addChild(btn2);
     btn2.label="小球模式";
     btn2.width=250;
     btn2.height=100;
     btn2.x=this.stage.stageWidth/2-50;
     btn2.y=this.stage.stageHeight/2+100;



    let touch= btn.addEventListener(egret.TouchEvent.TOUCH_BEGIN,()=>{
    //球的类型，大球是1，小球是2，这个值影响全局的得分率，速度，球大小
    this.blackType=1;
    //移除本界面所有的显示对象，其实装在容器里的话一下子就可以移除了；
     btn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,touch,this);
    this.removeChild(btn);
    this.removeChild(btn2);
    this.removeChild(tx);
    this.removeChild(bg);
         //根据变量判断是否玩过游戏，开始游戏或者重启游戏
         if(!this.gamed)
         this.gameStart();
         else
         this.restart();

     },this);



      let touch2= btn2.addEventListener(egret.TouchEvent.TOUCH_BEGIN,()=>{
        this.blackType=2;
        
         btn2.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,touch2,this);
         this.removeChild(btn2);
          this.removeChild(btn);
         this.removeChild(tx);
         this.removeChild(bg);
         
         if(!this.gamed)
         this.gameStart();
         else
         this.restart();

     },this);





 }




//游戏正题
protected gameStart(): void {
    //换算比，p2坐标等于egret坐标除以50 
        let factor=50;
        //场景高度和宽度
        let sH=this.stage.stageHeight;
        let sW=this.stage.stageWidth;

        //世界，由于采取的是镜像法，所以重力为正，p2世界中实际上刚体是在往上走;这种方法可以免掉转换egret坐标系，但是有一些其他的麻烦
        let world=new p2.World({gravity:[0,8]});

        this.world=world;


//背景
let bg=new egret.Shape()
bg.graphics.beginFill(0x0000ff);
//和舞台宽高相同
bg.graphics.drawRect(0,0,sW,sH);
bg.graphics.endFill();
bg.alpha=0.2;
this.addChild(bg);




//分数
let score:number;
score=this.score;

let scoreText=new egret.TextField();
scoreText.text="总分："+score;
scoreText.alpha=0.7;
scoreText.textColor=0xffffff;
this.addChild(scoreText);

//剩余黑球数
let leftblack=new egret.TextField();
leftblack.text="0";
leftblack.alpha=0.7;
leftblack.textColor=0xffffff;
leftblack.y=50;
this.addChild(leftblack);






let circle=new egret.Shape();
circle.graphics.beginFill(0xffffff);
circle.graphics.drawCircle(50,50,50);
circle.graphics.endFill();
this.addChild(circle);


//圆形比较特殊，画图函数的坐标点,rx,ry本身就是图形的中心距离，所以只要把rx,ry设为[0,0]就可以不必设置偏移
//这里完全是折腾

circle.anchorOffsetX=50;
circle.anchorOffsetY=50;

circle.x=0;
circle.y=0;


//金币
let gold:egret.Shape=new egret.Shape();
gold.graphics.beginFill(0xffff00);
gold.graphics.drawCircle(20,20,20);
gold.graphics.endFill();
this.addChild(gold);
gold.anchorOffsetX=20;
gold.anchorOffsetX=20;
gold.x=sW/2;
gold.y=50;

let goldShape=new p2.Circle({radius:20/factor});
let goldBody=new p2.Body({mass:0.5,position:[sW/2/factor,50/factor]});
goldBody.addShape(goldShape);
goldBody.displays=[gold];
//id是为了监控碰撞检测，注意不能和材料或者其他刚体等的id重合了
goldBody.id=5;
world.addBody(goldBody);

//world.on  监控碰撞  结束事件    事件对象中包含刚体bodyA bodyB   注意碰撞存在A碰B B碰A两种情况    
//检测黑球（id>20）碰金币 id=5  
world.on("endContact",(evt:any)=>{
if((evt.bodyA.id>20&&evt.bodyB.id==5)||(evt.bodyA.id==5&&evt.bodyB.id>20)){
    //碰撞后把金币传送出地图
    goldBody.position[1]=(this.stage.stageHeight+100)/factor;
    //给金币向下的速度
    goldBody.velocity=[-1,6];
    //分数+10 or 20
this.score+=10*this.blackType;    
}


});

//金币我们设成定时刷新坐标，全局一个金币
//5秒检测一次
let timer:egret.Timer=new egret.Timer(5000,0);
timer.addEventListener(egret.TimerEvent.TIMER,()=>{
    //如果已经离开画面，就把它再刷出来
if(goldBody.position[1]>this.stage.stageHeight/factor){
    goldBody.position[1]=50/factor;
     goldBody.velocity=[1,6];
    }
},this);
timer.start();

        //黑球点击发射的半圆区域
         let arcArea:egret.Shape=new egret.Shape();
         arcArea.graphics.lineStyle(10,0xffffff);
         arcArea.graphics.drawArc(sW/2,sH,sW/2,Math.PI,0);
         arcArea.graphics.endFill();
         this.addChild(arcArea);



         //画舞台边框

         let stageRect:egret.Shape=new egret.Shape();
         stageRect.graphics.lineStyle(5,0x000000);
         stageRect.graphics.drawRect(0,0,sW,sH);
         stageRect.graphics.endFill();
         this.addChild(stageRect);

//顶部
let planeBody=new p2.Body({mass:1,type:p2.Body.STATIC,position:[sW/2/factor,0/factor]});
let planeShape=new p2.Plane();
planeBody.addShape(planeShape);
planeBody.displays=[];

let leftWallBody=new p2.Body({mass:1,type:p2.Body.STATIC,position:[0/factor,sH/2/factor]});
let leftWallShape=new p2.Plane();


//左墙
leftWallBody.angle=-Math.PI/2;
leftWallBody.addShape(leftWallShape);
leftWallBody.displays=[];

//右墙
let rightWallBody=new p2.Body({mass:1,type:p2.Body.STATIC,position:[sW/factor,sH/2/factor]});
let rightWallShape=new p2.Plane();
rightWallBody.angle=Math.PI/2;
rightWallBody.addShape(rightWallShape);
rightWallBody.displays=[];


//白球刚体
let whiteBody=new p2.Body({mass:1,position:[50/factor,50/factor]});
let whiteShape=new p2.Circle({radius:50/factor});
whiteBody.addShape(whiteShape);
whiteBody.displays=[circle];
//白球id
whiteBody.id=10;
this.whiteBody=whiteBody;


//创建材质
let materiaA=new p2.Material(1);
this.materiaA=materiaA;
var materiaB=new p2.Material(2);
this.materiaB=materiaB;
let materiaC=new p2.Material(3);

//给球和平面的（形状）绑定材质
planeShape.material=materiaC;
leftWallShape.material=materiaC;
rightWallShape.material=materiaC;
whiteShape.material=materiaA;

//材质之间的关系 这里只设置了弹力，均为0.8
 var contactMaterial:p2.ContactMaterial=new p2.ContactMaterial(materiaA,materiaB);
 contactMaterial.restitution=0.8;
 //材质关系加入到世界（重要）
world.addContactMaterial(contactMaterial);

 var contactMaterial2:p2.ContactMaterial=new p2.ContactMaterial(materiaA,materiaC);
 contactMaterial2.restitution=0.8;
world.addContactMaterial(contactMaterial2);

 var contactMaterial3:p2.ContactMaterial=new p2.ContactMaterial(materiaB,materiaC);
 contactMaterial3.restitution=0.8;
world.addContactMaterial(contactMaterial3);

//世界中加入刚体
world.addBody(whiteBody);
world.addBody(planeBody);
world.addBody(leftWallBody);
world.addBody(rightWallBody);


//按键音
let touchsound:egret.Sound=RES.getRes("touch_mp3");

//触摸监控
this.addEventListener(egret.TouchEvent.TOUCH_TAP,(evt:egret.TouchEvent)=>{
    //如果点击的坐标距离底部圆心的距离小于半径，则表示在圆内，这里不需要碰撞检测

    let x2=Math.pow(sW/2-evt.stageX,2);
    let y2=Math.pow(sH-evt.stageY,2);
    let r2=Math.pow(sW/2,2);
    //求点击处到圆心的模长
    let length=Math.sqrt(x2+y2);

    //速度大小和方向，其实这里我求反了   我把速度乘了20倍
    let vx=(sW/2-evt.stageX)/length*20;
    let vy=(sH-evt.stageY)/length*20;


 if  ((x2+y2)<r2){

//速度值传入生成某方向的黑球，这里我求反了，所以输入带了负号
  this.createBlackball(-vx,-vy);  
  touchsound.play(0,1);
    }

},this);


//碰撞尽量不要写在心跳里
world.on("endContact",(evt:any)=>{
     if(evt.bodyA.id==10&&evt.bodyB.id>20) {
         //加1分或2分
         this.score+=this.blackType;
         scoreText.text="总分："+this.score;   }
     
  });





egret.Ticker.getInstance().register(onticker,this);

this.onticker=onticker;

function onticker (dt)
{
world.step(dt/1000);
//白球显示对象和刚体的坐标同步
circle.x=whiteBody.position[0]*factor;
circle.y=whiteBody.position[1]*factor;
//金币显示对象和刚体坐标同步
gold.x=goldBody.position[0]*factor;
gold.y=goldBody.position[1]*factor;


//遍历黑球的显示对象，和刚体同步
for(let i=0;i<this.blackBodys.length;i++){
    this.blackBodys[i].displays[0].x=this.blackBodys[i].position[0]*factor;
    this.blackBodys[i].displays[0].y=this.blackBodys[i].position[1]*factor;

//如果黑球掉下则推入缓冲栈，设置条件避免无限循环
//增加难度，将黑球入栈推迟500像素
    if(this.blackBodys[i].position[1]>(sH+500)/factor&&(this.blackCache.indexOf(this.blackBodys[i]))===-1)
    this.blackCache.push(this.blackBodys[i]);
    leftblack.text="仓库剩余球"+this.blackCache.length;

}


//如果白球掉下，则游戏结束
if(whiteBody.position[1]>sH/factor) {scoreText.text="你输了";
//停止心跳，停止p2世界的时间
egret.Ticker.getInstance().unregister(onticker,this);
//显示游戏结束面板
this.gameover();
}
}



    }

//决定大球还是小球的变量  大球为1，小球为2
private blackType:number=1;

//存储生成的黑球的显示对象，刚体，形状的数组，并没有全用上
private blackBodys:Array<p2.Body>=[];
private blackDis:Array<egret.Shape>=[];
private blackShape:Array<p2.Shape>=[];

//当黑球落下时缓存的数组，设计上有bug
private blackCache:Array<p2.Body>=[];

//记录生成了几个黑球
private blacknumber:number=0;


//黑球生成函数

 private createBlackball(vx:number,vy:number){

//有bug，当黑球生成完毕，不再生成，从缓存数组中取出来
if(this.blacknumber>=5*this.blackType&&this.blackCache.length>0){

//每次生成或者从缓存取出黑球都要根据球类型变量决定生成大球还是小球

//刷新显示对象和p2形状对象

 let circle=new egret.Shape();
 circle.graphics.beginFill(0x000000);
 circle.graphics.drawCircle(0,0,50/this.blackType);
 circle.graphics.endFill();
 this.addChild(circle);
 
let blackShape=new p2.Circle({radius:50/this.blackType/50});
//形状对象附加材质
blackShape.material=this.materiaB;

//从缓存中取出刚体对象
let oldBody:p2.Body=this.blackCache.pop();

//直接换掉显示对象和形状
this.removeChild(oldBody.displays[0]);
oldBody.displays[0]=circle;

oldBody.removeShape(oldBody.shapes[0]);
oldBody.addShape(blackShape);

//移动位置到下方，给与初速度
oldBody.position=[this.stage.stageWidth/2/50,this.stage.stageHeight/50];
oldBody.velocity=[vx*this.blackType,vy*this.blackType];


}


//如果数量小于5、10，则继续生成黑球
else if(this.blacknumber<5*this.blackType){

     //每次执行都创造出新的黑球
 let circle=new egret.Shape();
 circle.graphics.beginFill(0x000000);
 circle.graphics.drawCircle(50/this.blackType,50/this.blackType,50/this.blackType);
 circle.graphics.endFill();
 this.addChild(circle);
 circle.anchorOffsetX=50/this.blackType;
 circle.anchorOffsetY=50/this.blackType;
circle.x=this.stage.stageWidth/2;
circle.y=this.stage.stageHeight;

let  blackBody=new p2.Body({mass:1,position:[this.stage.stageWidth/2/50,this.stage.stageHeight/50]});
let blackShape=new p2.Circle({radius:50/this.blackType/50});
//设置材质
blackShape.material=this.materiaB;

//设置id要求不能和其他的id冲突，我这里夸张化了，只知道id>20
blackBody.id=Math.round(Math.random()*100+20);


blackBody.addShape(blackShape);
blackBody.displays=[circle];
//传入初速度
blackBody.velocity=[vx*this.blackType,vy*this.blackType];
this.world.addBody(blackBody);
//黑球的显示对象和刚体加入数组
this.blackBodys.push(blackBody);
this.blackDis.push(circle);
this.blackShape.push(blackShape);
this.blacknumber++;

            } 
            //无法创造黑球时返回一个false
            else return false;
    }



//游戏结束界面，包括重新开始和返回界面，和游戏开始的界面差不多

private gameover(){
//设置游戏玩过的标签为true；
      this.gamed=true;


let bg=new egret.Shape()
bg.graphics.beginFill(0xff0000);
bg.graphics.drawRect(0,0,this.stage.stageWidth,this.stage.stageHeight);
bg.graphics.endFill();
bg.alpha=0.5;
this.addChild(bg);


     let tx:eui.Label=new eui.Label();
     tx.text="游戏结束，你的总分是："+this.score;
     tx.textColor=0x000000;
     tx.width=this.stage.stageWidth;
     tx.y=300;
     tx.size=50;
     this.addChild(tx);

     


     let btn:eui.Button=new eui.Button()
     this.addChild(btn);
     btn.label="重新开始";
     btn.width=250;
     btn.height=100;
     btn.x=this.stage.stageWidth/2-50;
     btn.y=this.stage.stageHeight/2-100;



     let btn2:eui.Button=new eui.Button()
     this.addChild(btn2);
     btn2.label="回到界面";
     btn2.width=250;
     btn2.height=100;
     btn2.x=this.stage.stageWidth/2-50;
     btn2.y=this.stage.stageHeight/2+100;

   let touch= btn.addEventListener(egret.TouchEvent.TOUCH_BEGIN,()=>{
         btn2.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,touch2,this);
         btn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,touch,this);
         this.removeChild(btn);
         this.removeChild(btn2);
         this.removeChild(tx);
         this.removeChild(bg);
         
         //游戏重新开始
         this.restart();

     },this);


     let touch2= btn2.addEventListener(egret.TouchEvent.TOUCH_BEGIN,()=>{
          btn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,touch,this);
         btn2.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,touch2,this);
         this.removeChild(btn);
          this.removeChild(btn2);
         this.removeChild(tx);
         this.removeChild(bg);
         
       //回到界面
         this.createGameScene();

     },this);



};

private gamed:boolean=false;


private whiteBody:p2.Body;

private onticker;

//重新开始游戏  把白球放回原位，黑球全部传走，分数归零。

private restart(){
    

 this.whiteBody.velocity=[3,1];
 this.whiteBody.position=[50/50,50/50];
  
  //把黑球刚体对象循环利用
for(let body of this.blackBodys){
if(body.position[1]<this.stage.stageHeight/50)  body.position[1]=(this.stage.stageHeight+20000)/50;
    
}
   this.score=0;
   egret.Ticker.getInstance().register(this.onticker,this);
}



    private startAnimation(result: Array<any>): void {
        let parser = new egret.HtmlTextParser();

        let textflowArr = result.map(text => parser.parse(text));
        let textfield = this.textfield;
        let count = -1;
        let change = () => {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            let textFlow = textflowArr[count];

            // 切换描述内容
            // Switch to described content
            textfield.textFlow = textFlow;
            let tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, this);
        };

        change();
    }

    /**
     * 点击按钮
     * Click the button
     */
    
}
