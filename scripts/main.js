const paper = Snap('#svgContainer');
state = 0;

//resizing
function resizeContainer(){
  paper.attr({
    height: window.innerHeight,
    width: '100%',
    height: '100%'
  });
}
window.onresize = function(event) {
  resizeContainer();
};
resizeContainer();

//loadData
let cityData = loadData('data/city_data.csv');
let vehicleData = loadData('data/city_and_vehicles.csv');
let halfYearBookings = loadData('data/halfyearbookings.csv');
let dataDuration = loadData('data/average_duration.csv');

//inital plot
showInitialMapView();