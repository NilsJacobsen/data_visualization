let endPos = [0,0,0,0,0,0,0];
let newmaxAmountsPerHalfYear = [0,3162,33766,74140,92600,104885,152559];
let maxAmountsPerHalfYear = [0,3162,36928,111068,203668,308553,461152];
let animationBarsDone = 0;
let animationBeziersDone = 0;
let secondAniBezier = [];
let mystate = 0;

function moveToBezierView(){
  state = 1;
  //get data
  let cityData = JSON.parse(localStorage.getItem('city_data.csv_local'));
  let halfYearBookings = JSON.parse(localStorage.getItem('halfyearbookings.csv_local'));
  let dataDuration = JSON.parse(localStorage.getItem('average_duration.csv_local'));

  markedCities = Snap.selectAll(".marked"); 

  //remove marked elems
  let markedElems = Snap.selectAll(".markedElem");
  for(let i = 0; i < markedElems.length; i++){
    markedElems[i].animate({
      opacity: 0
    }, 300, mina.easeinout, function(){
      markedElems[i].remove();
    });
  }

  //remove paper click handler
  paper.unclick();
  paper.click(function(handler){
    if(handler.srcElement.id != "hoverRight" && state == 1){
      resetAnimation();
    }
  });

  //detect mousemove
  paper.mousemove(function(evt){
    if(evt.clientX < window.innerWidth/2){
      if(animationBarsDone != 0 && animationBeziersDone != 0 && mystate != 0){
        cityData.sort(function(a,b){
          return b.amount - a.amount;
        });
        repositionBars(cityData, halfYearBookings);
        animationDone = 0;
        mystate = 0;
      }
    } else {
      if(animationBarsDone != 0 && animationBeziersDone != 0 && mystate != 1){
        cityData.sort(function(a,b){
          return a.x-b.x;
        });
        repositionBars(cityData, halfYearBookings);
        animationDone = 0;
        mystate = 1;
      }
    }
  });

  cityData.sort(function(a,b){
    return a.x - b.x;
  });
  let widthOffset = 20;
  let xCounter = widthOffset;
  let gap = window.innerWidth*0.01;
  let sum = 462715;
  for(let i = 0; i < cityData.length; i++){
    let myCircle = Snap.select('.' + cityData[i]['City']);
    let color = "white";
    myCircle.removeClass("map");
    myCircle.addClass("bezier");
    xCounter += map(cityData[i]['amount'],0,sum,0,window.innerWidth-((cityData.length-1)*gap)-2*widthOffset)/2;

    if(Snap.selectAll(".marked")[0] != undefined){
      if(Snap.selectAll(".marked")[0] == myCircle){
        //color = '#47FFD7';
      }
    }
    myCircle.unclick();
    myCircle.unhover();
    myCircle.animate({
      d: getPathOfRect(xCounter,gap,map(cityData[i]['amount'],0,sum,0,window.innerWidth-((cityData.length-1)*gap)-2*widthOffset)/2,5),
      fill: color,
      opacity: 1
    }, 400, mina.easeinout, function (){
        animationBarsDone = 1;
        makeBeziers(this, halfYearBookings, cityData, i);
    });
    xCounter += map(cityData[i]['amount'],0,sum,0,window.innerWidth-((cityData.length-1)*gap)-2*widthOffset)/2;
    xCounter += gap;
  }
}

function repositionBars(cityData){
  let widthOffset = 20;
  let xCounter = widthOffset;
  let gap = window.innerWidth*0.01;
  let sum = 462715;
  let mybezierCurve = Snap.selectAll(".curve");
  for(let i = 0; i < cityData.length; i++){
    let myCircle = Snap.select('.' + cityData[i]['City']);
    xCounter += map(cityData[i]['amount'],0,sum,0,window.innerWidth-((cityData.length-1)*gap)-2*widthOffset)/2;
    myCircle.animate({
      d: getPathOfRect(xCounter,gap,map(cityData[i]['amount'],0,sum,0,window.innerWidth-((cityData.length-1)*gap)-2*widthOffset)/2,5)
    }, 1000, mina.easeinout, function (){
        animationBarsDone = 1;
        remakeBeziers(this, cityData, mybezierCurve, i);
    });
    xCounter += map(cityData[i]['amount'],0,sum,0,window.innerWidth-((cityData.length-1)*gap)-2*widthOffset)/2;
    xCounter += gap;
  }
}

function remakeBeziers(elem, cityData, beziers, j){
  let offset = 0;
  for(let i = 0; i < beziers.length; i++){
    if(beziers[i].node.classList[0] == "bezier" + cityData[j]['City']){
      beziers[i].animate({
        d: getPathOfBezier(elem.node.getPathData()[4].values[4] + offset, elem.node.getPathData()[4].values[5], beziers[i].node.getPathData()[2].values[0], window.innerHeight-20, beziers[i].node.getPathData()[2].values[4] - beziers[i].node.getPathData()[1].values[4], window.innerHeight/2)
      }, 1700, mina.easeinout);
      offset += beziers[i].node.getPathData()[2].values[4] - beziers[i].node.getPathData()[1].values[4];
    }
  }
  offset = 0;
}

function resetAnimation() {
  state = 0;
  paper.unmousemove();
  let curves = Snap.selectAll(".curve");
  for(let i = 0; i < curves.length; i++){
    curves[i].animate({
      d: getPathOfBezier(curves[i].node.getPathData()[0].values[0], curves[i].node.getPathData()[0].values[1], curves[i].node.getPathData()[0].values[0], window.innerHeight-20, curves[i].node.getPathData()[2].values[4] - curves[i].node.getPathData()[1].values[4],window.innerHeight/2)
    },400, mina.easeinout, function(){
      curves[i].animate({
        d: getPathOfBezier(curves[i].node.getPathData()[0].values[0], curves[i].node.getPathData()[0].values[1], curves[i].node.getPathData()[0].values[0], curves[i].node.getPathData()[0].values[1], curves[i].node.getPathData()[2].values[4] - curves[i].node.getPathData()[1].values[4],window.innerHeight/2),
        opacity: 1
      },400,mina.easeinout, function(){
        curves[i].remove();
        if(i == curves.length-1){
          let bars  = Snap.selectAll(".bezier");
          for(let j = 0; j < bars.length; j++){
            bars[j].removeClass("bezier");
            bars[j].addClass("map");
            let cx = getPos(cityData.find(element => element.City == bars[j].node.id).x,'lat');
            let cy = getPos(cityData.find(element => element.City == bars[j].node.id).y,'long');
            let radius = map(areaToRadius(cityData.find(element => element.City == bars[j].node.id)['amount']),0,391,0,60);
            let duration = dataDuration.find(element => element.city == bars[j].node.id).duration;
            let color = map(duration,200,1300,270,340);
            bars[j].animate({
              fill: hsl(color,100,50),
              opacity: 0.9,
              d: getPathOfCircle(cx,cy,radius)
            },400, mina.easeinout);
            bars[j].hover( function(){
              this.animate({
                fill: '#e6aee8',
                opacity: 1
              }, 100);
            });
            bars[j].mouseout( function(){
              
              if(Snap.selectAll(".marked").length != 0){
                this.animate({
                  fill: hsl(color,50,30),
                  opacity: 0.9
                }, 100);
              }else{
                this.animate({
                  fill: hsl(color,100,50),
                  opacity: 0.9
                }, 100);
              }
            });
            bars[j].click(function(){
              clickstuff(this,bars[j].getBBox().cx,bars[j].getBBox().cy,bars[j].getBBox().width/2,bars[j].node.id);
            });
          }
          paper.click(function (handler) {
            let markedElems = Snap.selectAll(".markedElem");
            if (handler.srcElement.id == "svgContainer") {
              for (let i = 0; i < markedElems.length; i++) {
                markedElems[i].animate({
                  opacity: 0
                }, 200, mina.easeinout, function () {
                  markedElems[i].remove();
                });
              }
              let markedBars = Snap.selectAll(".marked");
              for (let i = 0; i < markedBars.length; i++) {
                markedBars[i].removeClass("marked");
              }
            }
          });
          let hoverRight = Snap.select("#hoverRight");
          hoverRight.animate({
            transform: 'translate(0,0)'
          },400, mina.easeout);
          let hoverLeft = Snap.select("#hoverLeft");
          hoverLeft.animate({
            transform: 'translate(0,0)'
          },400, mina.easeout);
        }
      });
    });
  }
  setTimeout(() => {  
    markCityAgain(markedCities); 
  }, 2000);
}

function markCityAgain(cities){
  for(let i = 0; i < cities.length; i++){
      let cx = cities[i].getBBox().cx;
      let cy = cities[i].getBBox().cy;
      let radius = cities[i].getBBox().width/2;
      let city = cities[i].node.id;
      clickstuff(cities[i],cx,cy,radius,city);
  }
}

function makeBeziers(elem, data, cityData, j) {
  let cityBookings = data.find(element => element['city'] == elem.node.id);
  let bezierWidth = 0;
  let startXPos = elem.getBBox().x;
  let myEndPos = 0;
  let widthOffset = 20;
  for(let i = 0; i < 6; i++){
    bezierWidth = elem.getBBox().width/((cityData.find(element => element['City'] == elem.node.id))['amount'])*cityBookings[String(i)];
    sumGap = window.innerWidth - 2*widthOffset - elem.getBBox().width/((cityData.find(element => element['City'] == elem.node.id))['amount']) * maxAmountsPerHalfYear[maxAmountsPerHalfYear.length-1];
    myEndPos =  widthOffset + endPos[i] + elem.getBBox().width/((cityData.find(element => element['City'] == elem.node.id))['amount']) * maxAmountsPerHalfYear[i] + i * sumGap/5;
    let mybezierCurve = paper.path(getPathOfBezier(startXPos, elem.getBBox().y2, startXPos, elem.getBBox().y2, bezierWidth, 0));
    mybezierCurve.addClass("bezier" + elem.node.classList[0]);
    mybezierCurve.addClass("curve");
    mybezierCurve.attr({
      fill: hsl(230-i*10,100,7*i+40),
      opacity: 0,
    }); 

    if(Snap.selectAll(".marked")[0] != undefined){
      let isMarked = 0;
      for(let j = 0; j < markedElems.length; j++){
        if(Snap.selectAll(".marked")[j] == elem){
          mybezierCurve.attr({
            fill: hsl(230-i*10,100,7*i+40),
            opacity: 0,
          });
          isMarked = 1;
        }else {
          if(isMarked != 1){
            mybezierCurve.attr({
              fill: hsl(230-i*10,5,3*i+20),
              opacity: 0,
            });
          }
        }
      }
      
    }

    secondAniBezier.push({
      x: myEndPos,
      width: bezierWidth
    });
    mybezierCurve.animate({
      d: getPathOfBezier(startXPos, elem.getBBox().y2, startXPos, window.innerHeight-20, bezierWidth, window.innerHeight/2),
      opacity: 0.8
    },400, mina.easeinout, function (startXPos, elem, myEndPos, bezierWidth){
      startXPos = 0;
      this.animate({
        d: getPathOfBezier(this.node.getPathData()[0].values[0], this.node.getPathData()[0].values[1], secondAniBezier[i*Math.pow(6,0) + j*Math.pow(6,1)].x, window.innerHeight-20, secondAniBezier[i*Math.pow(6,0) + j*Math.pow(6,1)].width, window.innerHeight/2)
      },800, mina.easeinout, function() {
        animationBeziersDone = 1;
      });
    });
    endPos[i] += bezierWidth;
    startXPos += bezierWidth;
  }
}