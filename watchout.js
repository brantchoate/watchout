// currently have to iterate through array to find different asteroids
var asteroids = [
  {id: 0, cx: 0, cy: 0, r: 30},
  {id: 1, cx: 10, cy: 10, r: 30}
];

var playerData = [
  {id: "player", cx: 250, cy: 250, r: 20}
];
// build our game board
var gameBoard = d3.select('body')
                  .append('svg')
                    .attr('width', 500)
                    .attr('height', 500);

var drag = d3.behavior.drag()
              .on('drag', function() {
                player.attr('cx', d3.event.x)
                      .attr('cy', d3.event.y)
              });

var player = gameBoard.selectAll('.player')
  .data(playerData)
  .enter()
  .append('circle')
    .attr('class', 'player')
    .attr('cx', function(p) {
      return p.cx;
    })
    .attr('cy', function(p) {
      return p.cy;
    })
    .attr('r', function(p) {
      return p.r;
    })
    .call(drag);

//draw the circles / enemies
gameBoard.selectAll('.asteroid')
  .data(asteroids)
  .enter()
  .append('circle')
    .attr('class', 'asteroid')
    .attr('aid', function(asteroid) {
      return asteroid.id;
    })
    .attr('cx', function(asteroid) {
      return asteroid.cx;
    })
    .attr('cy', function(asteroid) {
      return asteroid.cy;
    })
    .attr('r', function(asteroid) {
      return asteroid.r;
    });

var randomPositionGenerator = function() {
  return Math.floor(Math.random() * 500);
};

//make enemies move around randomly
var moveAsteroids = function(data) {

  d3.selectAll('.asteroid')
    .data(data)
      .transition()
        .duration(750)
        .attr('cx',function(a){
          return a.cx;
        })
        .attr('cy',function(a){
          return a.cy;
        })
        .tween('custom', function (a) {
          return function(t) {
            checkCollision(a, onCollision);
            var nextX = randomPositionGenerator() * t;
            var nextY = randomPositionGenerator() * t;
            a.cx = nextX;
            a.cy = nextY;
          }
        });
};

//make the player draggable
var drag = d3.behavior.drag()
              .on('drag', function() {
                circle.attr('cx', d3.event.x)
                      .atrr('cy', d3.event.y)
              });

//set up collision detection (when the player gets hit)
var checkCollision = function (asteroid, onCollision) {
  // sum up the radii and calculate the distance between the
    // x and the y of the player and the asteroid
  var radiiSum = asteroid.r + parseInt(player.attr('r'));
  var diffX = asteroid.cx - parseInt(player.attr('cx'));
  var diffY = asteroid.cy - parseInt(player.attr('cy'));
  // use pythag to calculate the diagonal between the player and asteroid
  var distance = Math.sqrt( Math.pow(diffX,2) + Math.pow(diffY,2));

  if (distance < radiiSum) {

    onCollision(player, asteroid);
  }
};

var onCollision = function () {
  score = 0;
  console.log('poop');
  currentScore = d3.select('.current span')
                   .data([score])
                   .text(function(s) { return s;});
};

//keep track of score
var score = 0;
 // on every move we want to return the first collision that happend

var currentScore = 0;

// start game
setInterval(function(){
  score += 1000;
  currentScore = d3.select('.current span')
                   .data([score])
                   .text(function(s) { return s;});
  moveAsteroids(asteroids);
}, 1500);
