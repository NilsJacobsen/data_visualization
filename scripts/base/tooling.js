function getPathOfRect(cx,cy,width,height){
  return "M" + cx + " " + cy +
          "m" + 0 + " " + -height +
          "l" + width + " " + 0 +
          "l" + 0 + " " + 2*height +
          "l" + -2*width + " " + 0 +
          "l" + 0 + " " + -2*height +
          "z";
}

function getPathOfCircle(cx,cy,radius){
  return "M" + cx + " " + cy +
          "m" + 0 + " " + -radius +
          "a" + -radius + " " + radius + " 0 1,0 " + 0 + " " + 2*radius +
          "a" + -radius + " " + radius + " 0 1,0 " + 0 + " " + -2*radius;
}

function getPathOfBezier(cx,cy,ex,ey,width,bezierHeight){
  return "M" + cx + " " + cy +
          "C" + cx + " " + (cy + bezierHeight) + " " + ex + " " + (ey - bezierHeight) + " " + ex + " " + ey +
          "L" + (ex + width) + " " + ey + 
          "C" + (ex + width) + " " + (ey - bezierHeight) + " " + (cx + width) + " " + (cy + bezierHeight) + " " + (cx + width) + " " + cy +
          "Z";

}

function getPathOfPie(cx, cy, startAngle, endAngle, radiusOutside, width) {
  //damit es oben anfängt:
  startAngle -= 210;
  endAngle -= 210;

  var radiusInside = radiusOutside - width;

  var diagramCenter = {
      x: cx,
      y: cy
  };

  //an welcher Koordinate fängt der äußere Bogen des Donut-Stückchens an?
  var arcOutsideStart = {
      x: diagramCenter.x + (radiusOutside * Math.cos(radians(startAngle))),
      y: diagramCenter.y + (radiusOutside * Math.sin(radians(startAngle)))
  };

  // an welcher Koordinate hört der äußere Bogen des Donut-Stückchens auf?
  var arcOutsideEnd = {
      x: diagramCenter.x + (radiusOutside * Math.cos(radians(endAngle))),
      y: diagramCenter.y + (radiusOutside * Math.sin(radians(endAngle)))
  };

  //an welcher Koordinate fängt der innere Bogen des Donut-Stückchens an?
  var arcInsideStart = {
      x: diagramCenter.x + (radiusInside * Math.cos(radians(startAngle))),
      y: diagramCenter.y + (radiusInside * Math.sin(radians(startAngle)))
  };

  // an welcher Koordinate hört der innere Bogen des Donut-Stückchens auf?
  var arcInsideEnd = {
      x: diagramCenter.x + (radiusInside * Math.cos(radians(endAngle))),
      y: diagramCenter.y + (radiusInside * Math.sin(radians(endAngle)))
  };

  var over180Degrees = "0";
  if (endAngle - startAngle > 180) over180Degrees = "1";


  return "M" + arcOutsideStart.x + "," + arcOutsideStart.y +
      " A" + radiusOutside + "," + radiusOutside + " 0 " + over180Degrees + ",1 " + arcOutsideEnd.x + "," + arcOutsideEnd.y +
      " L" + arcInsideEnd.x + "," + arcInsideEnd.y +
      " A" + radiusInside + "," + radiusInside + " 0 " + over180Degrees + ",0 " + arcInsideStart.x + "," + arcInsideStart.y +
      " L" + arcOutsideStart.x + "," + arcOutsideStart.y +
      " Z";
}

function loadData(dataPath){
  d3.csv(dataPath).then(function(data) {
    localStorage.setItem(dataPath.replace(/^.*[\\\/]/, '') + '_local', JSON.stringify(data));
  });
  return JSON.parse(localStorage.getItem(dataPath.replace(/^.*[\\\/]/, '') + '_local'));
}

function getPos(data, direction){
  let germanyYSum = 8;
  let germanyXSum = 8.3;
  let germanyXOffset = 6;
  let germanyYOffset = 47;
  let XYproportion = 1.5;
  var scale = window.innerHeight/(germanyYSum+4);
  if(direction == 'lat'){
    return (data-germanyXOffset)*scale+(window.innerWidth/2-germanyXSum*scale/2);
  } else {
    return (germanyYSum-(data-germanyYOffset))*scale*XYproportion;
  }
}

function areaToRadius(area){
  return Math.sqrt(4*area/Math.PI);
}

