/*

Hepworth engine.  A very rough work in progress
Author: @andrewdotdobson;
Please fork and improve!

TODO: 
Plot along a bezier curve
Overlay over hollow forms
Plot across 3D space??
*/



//globals

var isDrawing = false;
var stage = new createjs.Stage("demoCanvas");
var aLine = new createjs.Shape();
var bLine = new createjs.Shape();
var originA = new createjs.Point();
var endA = new createjs.Point();
var originB = new createjs.Point();
var endB = new createjs.Point();
var dist = 0;
var gradations = 10;
var spacing = 0;
var gridArrayA = new Array();
var gridArrayB = new Array();

var grid = new createjs.Shape();
var activeLine = "a";

function init()
{
  var slider = document.getElementById('lineRange');
  var input = document.getElementById('lineValue');
  var toggleSlider = document.getElementById('toggle');

  noUiSlider.create(slider, {
    start: 10,
    step: 1,
    connect: "lower",
    orientation: "horizontal",
    range: {
      'min': 4,
      'max': 20

    }
  })

  slider.noUiSlider.on('update', function( values, handle ) {
  gradations = parseInt(values[handle])-1;
  document.getElementById('lineValue').innerHTML = Math.floor(values[handle])+ " divisions in the grid";

  fillGridArrays();
  });


  noUiSlider.create(toggleSlider, {
  orientation: "horizontal",
  start: 0,
  range: {
    'min': [0, 1],
    'max': 1
  }
  
})

toggleSlider.noUiSlider.on('update', function( values, handle ){
  if ( values[handle] == '0.00' ) {
    activeLine = "a";
    document.getElementById('toggleLabel').innerHTML = "Line 1 selected";
  } else {

    activeLine = "b";
    document.getElementById('toggleLabel').innerHTML = "Line 2 selected";
  }


});



  initHepworthEngine();
}

function initHepworthEngine()
{
	
	stage.addEventListener("stagemousedown", activateLine);
  stage.addEventListener("stagemousemove", drawLine);
  stage.addEventListener("stagemouseup", releaseLine);
	stage.addChild(aLine);
  stage.addChild(bLine);
  stage.addChild(grid);
	randomLines();
  stage.update();
  

}

function randomLines(){
  originA = new createjs.Point(getRandomInt(10,790),getRandomInt(10,290));
  endA = new createjs.Point(getRandomInt(10,790),getRandomInt(10,290));
  originB = new createjs.Point(getRandomInt(10,790),getRandomInt(10,290));
  endB = new createjs.Point(getRandomInt(10,790),getRandomInt(10,290));
  
  drawStaticLines();
  fillGridArrays(); 
}

function activateLine(evt){
    isDrawing = true;
    if(activeLine == "a")
    {

      originA = new createjs.Point(evt.stageX,evt.stageY);
    } else {

      originB = new createjs.Point(evt.stageX,evt.stageY);
    } 

}

function drawStaticLines()
{
  var g = aLine.graphics;
  g.clear();
  g.setStrokeStyle(2);
  g.beginStroke('#ccc');
  g.moveTo(originA.x,originA.y);
  g.lineTo(endA.x,endA.y);

  g = bLine.graphics;
  g.clear();
  g.setStrokeStyle(2);
  g.beginStroke('#ccc');
  g.moveTo(originB.x,originB.y);
  g.lineTo(endB.x,endB.y);
}

function drawLine(evt)
{
  if(isDrawing)
  {
    
    if(activeLine=="a")
    {
      var g = aLine.graphics;
      g.clear();
      g.setStrokeStyle(2);
      g.beginStroke("#ccc");
      g.moveTo(originA.x,originA.y);

    } else {
      var g = bLine.graphics;
      g.clear();
      g.setStrokeStyle(2);
      g.beginStroke("#ccc");
      g.moveTo(originB.x,originB.y);
    }

    g.lineTo(evt.stageX,evt.stageY);
    stage.update();
  }
}

function releaseLine(evt)
{
  if(activeLine == "a")
  {
    endA = new createjs.Point(evt.stageX,evt.stageY);
  } else {
    endB = new createjs.Point(evt.stageX,evt.stageY);
  }

  isDrawing = false;
  fillGridArrays();
}




function fillGridArrays(){

    gridArrayA = [];
    gridArrayB = [];
  for(var i=0;i<=gradations;i++)
  {

   // var circx = returnPointOnLine(i).x;
   // var circy = returnPointOnLine(i).y;

    
  
    gridArrayA.push(returnPointOnLineA(i));
    gridArrayB.push(returnPointOnLineB(i));

  }

  drawGrid();
  stage.update();
}

function returnPointOnLineA(spacer)
{
  var a = originA.x;
  var b = endA.x;
  var s = (b-a)/gradations;
  var pointx = a+(s*spacer);

  a = originA.y;
  b = endA.y;
  s = (b-a)/gradations;
  pointy = a+(s*spacer);

  return new createjs.Point(pointx,pointy);
}

function returnPointOnLineB(spacer)
{
  var a = originB.x;
  var b = endB.x;
  var s = (b-a)/gradations;
  var pointx = a+(s*spacer);

  a = originB.y;
  b = endB.y;
  s = (b-a)/gradations;
  pointy = a+(s*spacer);

  return new createjs.Point(pointx,pointy);
}

function drawGrid()
{

  var g = grid.graphics;
  g.clear();
  g.setStrokeStyle(1);
  g.beginStroke("#c2b0a2");
  g.moveTo(originB.x,originB.y);


  for(var i=0;i<gridArrayB.length;i++)
  {

    
    g.moveTo(gridArrayB[i].x,gridArrayB[i].y);
    g.lineTo(gridArrayA[i].x,gridArrayA[i].y);
  }
  
}

// utils
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}