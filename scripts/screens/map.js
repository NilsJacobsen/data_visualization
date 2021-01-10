let markedElems = [];

function showInitialMapView() {
  state = 0;
  let cityData = JSON.parse(localStorage.getItem('city_data.csv_local'));
  let dataDuration = JSON.parse(localStorage.getItem('average_duration.csv_local'));


  paper.click(function (handler) {
    let markedElems = Snap.selectAll(".markedElem");
    if (handler.srcElement.id == "svgContainer") {
      
      for (let i = 0; i < markedElems.length; i++) {
        markedElems[i].animate({
          opacity: 0
        }, 500, mina.easeinout, function () {
          markedElems[i].remove();
        });
      }
      let markedBars = Snap.selectAll(".marked");
      for (let i = 0; i < markedBars.length; i++) {
        markedBars[i].removeClass("marked");
      }

      let citys = Snap.selectAll(".map");
      for(let m = 0; m < citys.length; m++){
        let duration = dataDuration.find(element => element.city == citys[m].node.id).duration;
        let color = map(duration,200,1300,270,340);
        citys[m].animate({
          fill: hsl(color,100,50),
          opacity: 0.9
        },200);
      }
      
    }
  })

  for (let i = 0; i < cityData.length; i++) {
    let cx = getPos(cityData[i]['x'], 'lat');
    let cy = getPos(cityData[i]['y'], 'long');
    let radius = map(areaToRadius(cityData[i]['amount']), 0, 391, 0, 60);
    let myCircle = paper.path(getPathOfCircle(cx, cy, radius));
    let duration = dataDuration.find(element => element.city == cityData[i].City).duration;
    let color = map(duration,200,1300,270,340);
    myCircle.addClass(String(cityData[i]['City']));
    myCircle.addClass("map");
    myCircle.attr({
      id: String(cityData[i]['City']),
      fill: hsl(color,100,50),
      opacity: 0.9
    });
    myCircle.hover(function () {
      this.animate({
        opacity: 1,
        fill: "#e6aee8"
      }, 100);
    });
    myCircle.mouseout(function () {
      if(Snap.selectAll(".markedElem").length != 0){
        this.animate({
          fill: hsl(map(dataDuration.find(element => element.city == myCircle.node.id).duration,200,1300,270,340),50,35),
          opacity: 0.5
        }, 100);
      } else {
        this.animate({
          fill: hsl(color,100,50),
          opacity: 0.9
        }, 100);
      }
    });
    myCircle.click(function () {
      clickstuff(this,cx,cy,radius,cityData[i]['City']);
    });
  }
  makeHoverAreas();
}

function clickstuff(myCircle,cx,cy,radius,city) {
  if(state == 0){
    myCircle.animate({
      fill: 'magenta',
    }, 200, mina.easeinout);
    myCircle.addClass("marked");
    markedElems.push(myCircle);

    let myCircles = Snap.selectAll(".map");
    for(let l = 0; l < myCircles.length; l++){
      myCircles[l].animate({
        fill: hsl(map(dataDuration.find(element => element.city == myCircles[l].node.id).duration,200,1300,270,340),50,35),
        opacity: 0.5
      },200);
    }
    
    paper.click(function (handler) {
      let markedElems = Snap.selectAll(".markedElem");
      if (handler.srcElement.id == "svgContainer") {
        
        for (let i = 0; i < markedElems.length; i++) {
          markedElems[i].animate({
            opacity: 0
          }, 500, mina.easeinout, function () {
            markedElems[i].remove();
          });
        }
        let markedBars = Snap.selectAll(".marked");
        for (let i = 0; i < markedBars.length; i++) {
          markedBars[i].removeClass("marked");
        }

        let citys = Snap.selectAll(".map");
        for(let m = 0; m < citys.length; m++){
          let duration = dataDuration.find(element => element.city == citys[m].node.id).duration;
          let color = map(duration,200,1300,270,340);
          citys[m].animate({
            fill: hsl(color,100,50),
            opacity: 0.9
          },200);
        }
        
      }
    })

    let background = paper.path(getPathOfCircle(cx, cy, 0));
    let foreground = paper.path(getPathOfCircle(cx, cy, 0));
    //background
    background.addClass("markedElem");
    background.attr({
      fill: '#242424',
      opacity: 0
    });
    background.animate({
      d: getPathOfCircle(cx, cy, radius + 75),
      opacity: 0.9
    }, 200, mina.easeinout);
    background.click(function () {
      if (Object.values(myCircle.node.classList).find(element => element == "marked") != undefined) {
        myCircle.removeClass("marked");

        foreground.animate({
          opacity: 0
        }, 200, mina.easeinout, function () {
          this.remove();
        });

        background.animate({
          opacity: 0
        }, 200, mina.easeinout, function () {
          background.remove();
        });

        let clickedpies = Snap.selectAll(".pie" + Object.values(myCircle.node.classList)[0])
        clickedpies.animate({
          opacity: 0
        }, 200, mina.easeinout, function () {
          clickedpies.remove();
        });
      }
    });

    //pie
    let angle = 0;
    let stopangle = 0;
    let gap = 0.5;
    for (let j = 2; j < 9; j++) {
      if (Object.values(vehicleData.find(element => element.city == city))[j] != 0) {
        let value = Object.values(vehicleData.find(element => element.city == city))[j];
        stopangle += map(value, 0, Object.values(vehicleData.find(element => element.city == city))[1], 0, 240 - 6 * gap);
        let pie = paper.path(getPathOfPie(cx, cy, angle, stopangle, 2, 1));
        pie.addClass("markedElem");
        pie.addClass("pie" + city);
        pie.attr({
          fill: hsl(314 - j * 5, 100, 5 * j + 30),
          opacity: 0
        });
        pie.animate({
          d: getPathOfPie(cx, cy, angle, stopangle, radius + 50, 25),
          opacity: 1
        }, j * 30 + 200, mina.easeinout);
        stopangle += gap;
        angle = stopangle;
      }
    }

    //foreground

    foreground.attr({
      fill: '#e6aee8',
      opacity: 0
    });
    foreground.addClass("markedElem");
    foreground.animate({
      d: getPathOfCircle(cx, cy, radius),
      opacity: 1
    }, 200, mina.easeinout);
    foreground.click(function () {
      if (Object.values(myCircle.node.classList).find(element => element == "marked") != undefined) {
        myCircle.removeClass("marked");

        foreground.animate({
          opacity: 0
        }, 200, mina.easeinout, function () {
          foreground.remove();
        });

        background.animate({
          opacity: 0
        }, 200, mina.easeinout, function () {
          background.remove();
        });

        let clickedpies = Snap.selectAll(".pie" + Object.values(myCircle.node.classList)[0])
        clickedpies.animate({
          opacity: 0
        }, 200, mina.easeinout, function () {
          clickedpies.remove();
          if(Snap.selectAll(".markedElem").length == 0){
            let citys = Snap.selectAll(".map");
            for(let m = 0; m < citys.length; m++){
              let duration = dataDuration.find(element => element.city == citys[m].node.id).duration;
              let color = map(duration,200,1300,270,340);
              citys[m].animate({
                fill: hsl(color,100,50),
                opacity: 0.9
              },200);
            }
          }
        });
      }
    });
  }
}


function makeHoverAreas() {

  var hoverRight = paper.rect(window.innerWidth - 100, 0, 100, window.innerHeight);
  var hoverLeft = paper.rect(0, 0, 100, window.innerHeight);

  //right one
  hoverRight.attr({
    id: "hoverRight",
    fill: '#e6aee8',
    opacity: 0.1
  });
  hoverRight.hover(function () {
    this.animate({
      opacity: 0.2
    }, 100);
  });
  hoverRight.mouseout(function () {
    this.animate({
      opacity: 0.1
    }, 100);
  });
  hoverRight.click(function () {
    this.addClass("clicked");
    this.animate({
      transform: 'translate(100,0)'
    }, 400, mina.easeout);
    moveToBezierView();
    hoverLeft.animate({
      transform: 'translate(-100,0)'
    }, 400, mina.easeout);
  });
  //left one

  hoverLeft.attr({
    id: "hoverLeft",
    fill: '#e6aee8',
    opacity: 0.1
  });
  hoverLeft.hover(function () {
    this.animate({
      opacity: 0.2
    }, 100);
  });
  hoverLeft.mouseout(function () {
    this.animate({
      opacity: 0.1
    }, 100);
  });
  hoverLeft.click(function () {
    this.addClass("clicked");
    this.animate({
      transform: 'translate(-100,0)'
    }, 400, mina.easeout);
    hoverRight.animate({
      transform: 'translate(100,0)'
    }, 400, mina.easeout);
    moveToScatterView();
  });
}