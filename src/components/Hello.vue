<template>
  <div class="hello">
    <!--<h1>{{ msg }}</h1>-->
    <!--<h2>Essential Links</h2>-->
    <div class="content">
        <div id="poster">
          <canvas id="gameCanvas"></canvas>
        </div>
    </div>
    <!--底部日期显示-->
    <div class="footview">
        <div class="timeview">
            <p class="timeviewf">{{ nowDay }}</p><p class="timeviewd">{{ weekDay }}<br>{{ yearDay }}</p>
        </div>
        <div class="moodview">
          <img src="../assets/png/taiyang.png"/>
          <img src="../assets/png/nanguo.png"/>
          <img src="../assets/png/biji.png"/>
        </div>
    </div>
  </div>
</template>

<script>//var chineseLunar = require("chinese-lunar");
import LunarCalendar from "lunar-calendar"
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      yearDay: '',
      weekDay: '',
      nowDay: '',
    }
  },
  mounted: function () {
    var yd = this.getYearDay()
    this.yearDay = yd
    var wd = this.getWeekDay()
    this.weekDay = wd
    var nd = this.getNowDay()
    this.nowDay = nd

    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");
    canvas.width= 300//this.getDomWidth("poster");
    canvas.height= 482//this.getDomHeight("poster");
    ctx.lineJoin = "round";
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2,  canvas.width-4, canvas.height-4);

    ctx.lineWidth = 2;
    canvasLine(ctx,0,15,canvas.width,15)

    ctx.lineWidth = 2;
    canvasLine(ctx,0,canvas.height/3*2,canvas.width,canvas.height/3*2)

    ctx.lineWidth = 2;
    canvasLine(ctx,canvas.width/4,15,canvas.width/4,canvas.height/3*2)


    ctx.fillStyle = "#333";
    ctx.font = "10rem 'Times'";
    ctx.textAlign = "center";
//shadowBlur:模式级数
//    ctx.shadowBlur = 10;
//    ctx.shadowOffsetX = 5;
//    ctx.shadowOffsetY = 5;
//    ctx.shadowColor = "black";
//fillText("要添加的文字",x0坐标，y0坐标)
//    ctx.strokeText("You jump! I jump!",50,100);
    ctx.fillText("24",canvas.width/8*5,canvas.height/3*1.25);
    ctx.font = "2rem sans-serif";
    ctx.fillStyle = "#222";
    ctx.fillText("忌王者荣耀",canvas.width/8*5,canvas.height/3*1.75);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = "1rem 'hei";
    var fontWidth = (canvas.width/4-15)

    var solarDate = new Date(); //公历2014年2月1日
    var lunar = LunarCalendar.solarToLunar(solarDate.getFullYear(),solarDate.getMonth()+1,solarDate.getDate());
    var space = ' '
    var fmt = lunar.lunarMonthName+
              lunar.lunarDayName+space+
              lunar.GanZhiYear+'年'+space+
              '●'+lunar.zodiac+'年'+space+
              lunar.GanZhiMonth+'月'+space+
              lunar.GanZhiDay+'日' + space+
              lunar.lunarYear+'/'+
              lunar.lunarLeapMonth+'/'+
              lunar.lunarDay+space+wd

    console.log(lunar)
    canvasTextAutoLine(fmt,canvas,20,fontWidth,fontWidth/2)
  },
  methods: {
    //获取年月
    getYearDay:function(){
      var d = new Date();
      var curr_date = d.getDate();
      var curr_month = d.getMonth() + 1;
      var curr_year = d.getFullYear();
      String(curr_month).length < 2 ? (curr_month = "0" + curr_month): curr_month;
      String(curr_date).length < 2 ? (curr_date = "0" + curr_date): curr_date;
      var yyyyMM= curr_year + "年" + curr_month + "月";
      return yyyyMM;
    },
    //获取星期
    getWeekDay:function(){
      var weekDay = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
      var myDate = new Date();
      return (weekDay[myDate.getDay()]);
    },
    //获取日期
    getNowDay:function(){
      var myDate = new Date();
      return (myDate.getDay());
    }
  }
}

//获取坐标点与颜色画笔类型
function canvasLine(ctx,x1,y1,x2,y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.closePath();
  ctx.stroke();
}


function canvasTextAutoLine(str,canvas,initX,initY,lineHeight){
  var ctx = canvas.getContext("2d");
  var lineWidth = 0;
  var canvasWidth = canvas.height/3*2 - 18;
  var lastSubStrIndex= 0;
  for(let i=0;i<str.length;i++){
    lineWidth+=ctx.measureText(str[i]).width;
    if(lineWidth>canvasWidth-initX){
      //ctx.fillText(str.substring(lastSubStrIndex,i),initX,initY);
      ctx.fillTextVertical(str.substring(lastSubStrIndex,i), initY, initX);
      //initY +=lineHeight;
      initY -=lineHeight;
      lineWidth=0;
      lastSubStrIndex=i;
    }
    if(i==str.length-1){
      //ctx.fillText(str.substring(lastSubStrIndex,i+1),initX,initY);
      ctx.fillTextVertical(str.substring(lastSubStrIndex,i+1), initY, initX);
    }
  }
}

CanvasRenderingContext2D.prototype.fillTextVertical = function (text, x, y) {
  var context = this;
  var canvas = context.canvas;

  var arrText = text.split('');
  var arrWidth = arrText.map(function (letter) {
    return context.measureText(letter).width;
  });

  var align = context.textAlign;
  var baseline = context.textBaseline;

  if (align == 'left') {
    x = x + Math.max.apply(null, arrWidth) / 2;
  } else if (align == 'right') {
    x = x - Math.max.apply(null, arrWidth) / 2;
  }
  if (baseline == 'bottom' || baseline == 'alphabetic' || baseline == 'ideographic') {
    y = y - arrWidth[0] / 2;
  } else if (baseline == 'top' || baseline == 'hanging') {
    y = y + arrWidth[0] / 2;
  }

  context.textAlign = 'center';
  context.textBaseline = 'middle';

  // 开始逐字绘制
  arrText.forEach(function (letter, index) {
    // 确定下一个字符的纵坐标位置
    var letterWidth = arrWidth[index];
    // 是否需要旋转判断
    var code = letter.charCodeAt(0);
    if (code <= 256) {
      context.translate(x, y);
      // 英文字符，旋转90°
      context.rotate(90 * Math.PI / 180);
      context.translate(-x, -y);
    } else if (index > 0 && text.charCodeAt(index - 1) < 256) {
      // y修正
      y = y + arrWidth[index - 1] / 2 ;
    }
    context.fillText(letter, x, y);
    // 旋转坐标系还原成初始态
    context.setTransform(1, 0, 0, 1, 0, 0);
    // 确定下一个字符的纵坐标位置
    var letterWidth = arrWidth[index];
    y = y + letterWidth;
  });
  // 水平垂直对齐方式还原
  context.textAlign = align;
  context.textBaseline = baseline;
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

  .footview {
    position: absolute;
    width: 100%;
    height: 64px;
    background-color: #FEFFFF;
    bottom: 0px;
    -moz-box-shadow:0px 0px 10px #DDDDDD;
    -webkit-box-shadow:0px 0px 10px #DDDDDD;
    box-shadow:0px 0px 10px #DDDDDD;
  }

  .timeview {
     position: absolute;
     width: 120px;
     height: 34px;
     top: 0px;
   }

  .timeview p{
    display: inline-block;
  }
  .timeviewf{
    font-size: 36px;
    margin-left: 20px;
    margin-right: 10px;
    color:#515151;
  }
  .timeviewd{
    font-size: 10px;
    line-height:15px;
    color:#8a8a8a;
  }

  .moodview {
    position: absolute;
    width: 100px;
    height: 34px;
    bottom: 0px;
    right: 0px;
  }

  .moodview img{
    width: 16px;
    height: 16px;
    margin: 0 6px;
    margin-top: 5px;
  }

  .content{
    position: absolute;
    bottom: 64px;
    right: 0px;
    left: 0px;
    top: 0px;
  }

  #poster{
    text-align: center;
    background-color: #fff;
    border-radius: 20px;
    /*width: 80%;*/
    /*height: 80%;*/
    width: 300px;
    height: 482px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    -moz-box-shadow:0px 0px 10px #E6E6E6; -webkit-box-shadow:0px 0px 10px #E6E6E6; box-shadow:0px 0px 10px #E6E6E6;
  }
</style>
