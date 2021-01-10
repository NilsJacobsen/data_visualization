let markedCities = {};

function moveToScatterView(){
    state = 2;
    dataDuration = JSON.parse(localStorage.getItem('average_duration.csv_local'));
    let circles = Snap.selectAll(".map");
    let sortcircles = [];

    //remove marked elems
    let markedElems = Snap.selectAll(".markedElem");
    for(let i = 0; i < markedElems.length; i++){
        markedElems[i].animate({
        opacity: 0
        }, 300, mina.easeinout, function(){
        markedElems[i].remove();
        });
    }

    for(let i = 0; i < circles.length; i++){
        sortcircles.push({
            "circle": circles[i],
            "width":  circles[i].getBBox().width
        });
    }
    sortcircles.sort(function(a,b){
        return b.width-a.width;
    });
    index_circles = [];
    for(let i = 0; i < sortcircles.length; i++){
        index_circles.push(sortcircles[i].circle);
    }
    
    paper.unclick();
    paper.click(function(handler){
        if(handler.srcElement.id != "hoverLeft" && handler.srcElement.id == "svgContainer"){
            resetScatterAnimation(circles);
            
        }
        let markedElems = Snap.selectAll(".markedElem");
        if (handler.srcElement.id == "svgContainer") {
            for (let i = 0; i < markedElems.length; i++) {
                markedElems[i].animate({
                opacity: 0
                }, 500, mina.easeinout, function () {
                markedElems[i].remove();
                });
            }
        }
    });
    markedCities = Snap.selectAll(".marked"); 
    for(let i = 0; i < circles.length; i++){
        let duration = dataDuration.find(element => element.city == circles[i].node.id).duration;
        let xPos = map(duration,0,1400,0,window.innerWidth);
        let bev = cityData.find(element => element.City == circles[i].node.id).bev;
        let yPos = map(bev,0,3769,window.innerHeight-30,150);
        let width = circles[i].getBBox().width*1;
        color = map(duration,200,1300,270,340);
        if(markedCities.length == 0){
            circles[i].animate({
                opacity: 0.8,
                fill: hsl(color,100,50),
                d: getPathOfCircle(xPos,yPos,width/2)
            }, 400, mina.easeinout);
        } else {
            if(Object.values(circles[i].node.classList).find(element => element == "marked") != undefined){
                circles[i].animate({
                    opacity: 1,
                    fill: hsl(color,100,50),
                    d: getPathOfCircle(xPos,yPos,width/2)
                }, 400, mina.easeinout);
            } else {
                circles[i].animate({
                    opacity: 0.8,
                    fill: hsl(color,50,20),
                    d: getPathOfCircle(xPos,yPos,width/2)
                }, 400, mina.easeinout);
            }
        }
        circles[i].unhover();
        circles[i].unmouseout();
        circles[i].click( function(){
            if(Object.values(Snap.selectAll(".marked")).find(element => element == circles[i]) != undefined){
                console.log("bin da aus");
                circles[i].removeClass("marked");
                markedCities = Snap.selectAll(".marked");
                circles[i].animate({
                    fill: hsl(map(dataDuration.find(element => element.city == circles[i].node.id).duration,200,1300,270,340),50,30),
                    opacity: 0.9
                }, 100);
            } else {
                circles[i].addClass("marked");
                markedCities = Snap.selectAll(".marked");
                console.log("bin da");
                circles[i].animate({
                    fill: hsl(map(dataDuration.find(element => element.city == circles[i].node.id).duration,200,1300,270,340),100,50),
                    opacity: 0.9
                }, 100);
            }
        });
        circles[i].hover(function () {
            this.animate({
              opacity: 1,
              fill: "#e6aee8"
            }, 100);
          });
        circles[i].mouseout(function () {
            if(Snap.selectAll(".markedElem").length != 0){
                this.animate({
                  fill: 'magenta',
                  opacity: 0.5
                }, 100);
              } else {
                if(Snap.selectAll(".marked").length != 0){
                    if(circles[i] == Object.values(Snap.selectAll(".marked")).find(element => element == circles[i])){
                        this.animate({
                            fill: hsl(map(dataDuration.find(element => element.city == circles[i].node.id).duration,200,1300,270,340),100,50),
                            opacity: 0.9
                        }, 100);
                    } else {
                        this.animate({
                            fill: hsl(map(dataDuration.find(element => element.city == circles[i].node.id).duration,200,1300,270,340),50,20),
                            opacity: 0.9
                        }, 100);
                    }
                } else {
                    this.animate({
                        fill: hsl(map(dataDuration.find(element => element.city == circles[i].node.id).duration,200,1300,270,340),100,50),
                        opacity: 0.9
                    }, 100);
                }
              }
        });
    }
}

function resetScatterAnimation(circles){
    state = 0;
    paper.unclick();
    for (let i = 0; i < cityData.length; i++) {
        let cx = getPos(cityData[i]['x'], 'lat');
        let cy = getPos(cityData[i]['y'], 'long');
        let radius = map(areaToRadius(cityData[i]['amount']), 0, 391, 0, 60);
        circles[i].addClass(String(cityData[i]['City']));
        circles[i].addClass("map");
        let duration = dataDuration.find(element => element.city == cityData[i].City).duration;
        let color = map(duration,200,1300,270,340);
        circles[i].animate({
            d: getPathOfCircle(cx,cy,radius),  
            fill: hsl(color,100,50),
            opacity: 0.9
        },400, mina.easeinout);
        circles[i].unhover();
        circles[i].hover(function () {
            this.animate({
              opacity: 1,
              fill: "#e6aee8"
            }, 100);
        });
        circles[i].unmouseout();
        circles[i].mouseout(function () {
            if(Snap.selectAll(".markedElem").length != 0){
                this.animate({
                  fill: hsl(map(dataDuration.find(element => element.city == circles[i].node.id).duration,200,1300,270,340),50,35),
                  opacity: 0.5
                }, 100);
              } else {
                this.animate({
                  fill: hsl(color,100,50),
                  opacity: 0.9
                }, 100);
              }
        });
        
        circles[i].click(function(){
            
            //clickstuff(circles[i],cx,cy,radius,cityData[i]['City']);
        });
    }
    let hoverRight = Snap.select("#hoverRight");
    hoverRight.animate({
    transform: 'translate(0,0)'
    },400, mina.easeout);
    let hoverLeft = Snap.select("#hoverLeft");
    hoverLeft.animate({
    transform: 'translate(0,0)'
    },400, mina.easeout);
    setTimeout(() => {  markCityAgain(markedCities); }, 400);
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