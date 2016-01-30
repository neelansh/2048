var game = (function(){
  var mat = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
  var score = 0;
  var show2048Dialog = 0;
  function rotate90()
  {
      var rotated = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
      for(var i=0 ; i<mat.length ; ++i)
      {
          for(var j=0 ; j<mat[0].length ; ++j)
          {
              rotated[mat[0].length-j-1][i] = mat[i][j];
          }
      }
      mat = rotated;
  }
  function moveRight()
  {
      rotate90();
      rotate90();
      rotate90();
      moveDown(0);
      rotate90();
  }
  function moveLeft()
  {
     rotate90();
      moveDown(0);
      rotate90();
      rotate90();
      rotate90();
  }
  function moveTop()
  {
      rotate90();
      rotate90();
      moveDown(0);
      rotate90();
      rotate90();
  }
  function moveDown(j)
  {
      var k=0;
      if(j === mat.length)
      {
          return;
      }
      for(var i=mat.length-2 ; i>=0 ; --i)
      {
          if(mat[i][j] !== 0)
          {
              for(k=i ; k<mat.length-1; ++k)
              {
                  if(mat[k+1][j] === 0)
                  {
                      mat[k+1][j] = mat[k][j];
                      mat[k][j] = 0;
                  }
              }
          }
      }
      for(i=mat.length-2 ; i>=0 ; --i){
          if(mat[i+1][j] === mat[i][j]){
              mat[i+1][j] = 2*mat[i][j];
              mat[i][j] = 0;
              score = score + mat[i+1][j];
          }
      }
      for(i=mat.length-2 ; i>=0 ; --i)
      {
          if(mat[i][j] !== 0)
          {
              for(k=i ; k<mat.length-1; ++k)
              {
                  if(mat[k+1][j] === 0)
                  {
                      mat[k+1][j] = mat[k][j];
                      mat[k][j] = 0;
                  }
              }
          }
      }
      moveDown(j+1);
  }
  function getRandomValue()
  {
      // random number b/w 2 or 4
      var prob = Math.random();
      if(prob < 0.7)
      {
          return 2;
      }
      else {
          return 4;
      }
  }
  function getRandomEmptyCell()
  {
    //returns x,y of random empty cell
    var emptyTiles = [] , countEmpty = 0;
    for(var i=0 ; i<mat.length ; ++i)
    {
        for(var j=0 ; j<mat[0].length ; ++j)
        {
            if(mat[i][j] === 0)
            {
                emptyTiles.push({x: i , y: j});
                ++countEmpty;
            }
        }
    }

    return emptyTiles[Math.floor(Math.random()*countEmpty)];

  }
  function fillOneRandomEmptyCell()
  {
      var value = getRandomValue();
      var position = getRandomEmptyCell();
      mat[position.x][position.y] = value;
  }
  function isGameOver()
  {
    //check if game is over
    var countEmpty = 0;
    for(var i=0 ; i<mat.length ; ++i)
    {
        for(var j=0 ; j<mat[0].length ; ++j)
        {
            if(mat[i][j] === 0)
            {
                ++countEmpty;
            }
        }
    }
    if(countEmpty === 0){
        return true;
    }
    else {
        return false;
    }
  }
  function showGameOverDialog()
  {
      $("#gameOverDialog").show();
  }
  function show2048dialog()
  {
      $("#2048Dialog").show();
      show2048Dialog = 1;
  }
  function is2048()
  {
      for(var i=0 ; i<mat.length ; ++i)
      {
          for(var j=0 ; j<mat[0].length ; ++j)
          {
              if(mat[i][j] === 2048)
              {
                  return true;
              }

          }
      }
      return false;
  }
  function reDraw()//reflect state of matrix
  {
      for(var i=0 ; i<mat.length ; ++i)
      {
          for(var j=0 ; j<mat[0].length ; ++j)
          {
              var tileName = "tile_"+mat[i][j];
              var tileId = "#t"+i.toString()+j.toString();
              if(mat[i][j] !== 0)
              {
                //   document.getElementById(tileId).className = tileName;
                $(tileId).text(mat[i][j]);
                $(tileId).attr("class" , "tile center-align "+tileName);
              }
              else {
                  $(tileId).text("");
                  $(tileId).attr("class" , "tile center-align ");
              }
          }
      }
      $("#score").text("SCORE: " + score);
  }
  function isChange(initialState){
      for(var i=0 ; i<mat.length ; ++i){
          for(var j=0 ; j<mat.length ; ++j){
              if(mat[i][j] !== initialState[i][j]){

                  return true;
              }
          }
      }
      return false;
  }
  function move(e)
  {
      var initialState = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
      for(var i=0 ; i<mat.length ; ++i){
          for(var j=0 ; j<mat.length ; ++j){
              initialState[i][j] = mat[i][j];
          }
      }
      //depending upon key press call respective function
      if(e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40){
           e.preventDefault();
          if(e.keyCode === 37){
              moveLeft();
          }
          else if (e.keyCode === 38) {
              moveTop();
          }
          else if (e.keyCode === 39) {
              moveRight();
          }
          else if (e.keyCode === 40) {
              moveDown(0);
          }

          if(isChange(initialState)){
            fillOneRandomEmptyCell();
          }
          reDraw();

          if(isGameOver())
          {
              showGameOverDialog();
          }
          if(is2048() && show2048Dialog !== 1)
          {
              show2048dialog();
          }
      }
  }

  function reset(e)
  {
      e.preventDefault();
      mat = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
      score = 0;
      fillOneRandomEmptyCell();
      fillOneRandomEmptyCell();
      reDraw();
      $(document).ready(function(){
          $("#gameOverDialog").hide();
          $("#2048Dialog").hide();
      });

  }
  function conti(e){
      e.preventDefault();
      $("#2048Dialog").hide();
  }

  function saveGame(){
      var gameState = {};
      gameState.board = mat;
      gameState.score = score;
      gameState.show2048Dialog = show2048Dialog;
      localStorage.setItem("game" , JSON.stringify(gameState));
  }
  function reloadGame(){
      gameState = JSON.parse(localStorage.getItem("game"));
      mat = gameState.board;
      score = gameState.score;
      show2048Dialog = gameState.show2048Dialog;
  }
  function init()
  {
      if(localStorage.getItem("game") !== null){
          reloadGame();
      }
      else {
          fillOneRandomEmptyCell();
          fillOneRandomEmptyCell();
      }
      reDraw();
      window.addEventListener("keydown" , move);
      var list = document.getElementsByClassName('reset');
      for(var i=0 ; i<list.length ; ++i)
      {
          list[i].addEventListener("click" , reset);
      }
      $("#continue").click(conti);

      window.addEventListener("beforeunload" , saveGame);
  }

  return {
    init: init
  };
})();
