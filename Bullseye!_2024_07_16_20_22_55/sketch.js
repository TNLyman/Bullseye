// Bullseye! Hit the target for points and try to get a place in the Top 10, or go for all of them.


// Bullseye variables
let x = 300;
let y = 300;
let z = 150;
let shrink = 0;
let timeline = 0;
let timeIncrement = 0.01;
let hitString;

// Game variables
let startShots = 6;
let startReserve = 6;
let shots = 6;
let reserve = 6;
let score = 0;

// Scoreboard variables
let winner = "New High Score!";
let newScore = false;
let highScoresList;
let rankY = 100;

// State screen variables
let startScreen = true;
let endPlay = false;

// Cloud variables.
let cloud1;
let cloud2;
let cloudOneX = 100;
let cloudOneY = 100;
let cloudTwoX = 0;
let cloudTwoY = 0;
let cloudOneDriftLeft = true;
let cloudTwoDriftLeft = true;

// Ready clouds and score board.
function preload() {
  cloud1 = loadImage("cloud.png");
  cloud2 = loadImage("cloud.png");
  highScoresList = loadJSON("top10List.json");
}

// Initial and static items.
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0, 0, 255);
  cloud1.resize(300, 200);
  cloud2.resize(250, 100);
  frameRate(30);
  textSize(32);
  noStroke();
}

//Resizer.
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0, 0, 255);
}

// Action on mouse click.
function mousePressed() {
  trackRounds();
}

// Award points based on precision.
function trackRounds() {
  // Same distance measurement used for each if statement.
  let precision = dist(x, y, mouseX, mouseY);
  if (reserve >= 0) {
    if (shots > 0) {
      // Center hit.
      if (precision <= 20 && precision >= 0) {
        score = score + 100;
        hitString = '+100';
        shots--;
      }
      // Inner white ring hit.
      else if(precision <= 35 && precision > 20) {
        score = score + 80;
        hitString = '+80';
        shots--;
      }
      // Inner red ring hit.
      else if(precision <= 50 && precision > 35) {
        score = score + 60;
        hitString = '+60';
        shots--;
      }
      // Outer white ring hit.
      else if(precision <= 65 && precision > 50) {
        score = score + 40;
        hitString = '+40';
        shots--;
      }
      // Outer red ring hit.
      else if(precision <= 75 && precision > 65) {
        score = score + 20;
        hitString = '+20';
        shots--;
      }
      // Miss.
      else {
        score = score;
        hitString = 'MISS';
        shots--;
      }
    }
    else if (shots == 0 && reserve > 0) {
      hitString = '';
      reload();
    }
  }
}

// Reload when shots run out but reserve rounds remain.
function reload() {
  if (keyCode === 82) {
      shots = 6;
      reserve = reserve - 6;
  }
}

// Make the clouds and let them drift in a certain range.
function clouds() {
  // Cloud 1 Stuff
  image(cloud1, cloudOneX, cloudOneY);
  
  // Cloud One Drift
  if (cloudOneDriftLeft) {
    cloudOneX+=0.1;
  }
  else if (!cloudOneDriftLeft) {
    cloudOneX-=0.1;
  }
  if (cloudOneX >= 105) {
    cloudOneDriftLeft = !cloudOneDriftLeft;
  }
  if (cloudOneX <= 95) {
    cloudOneDriftLeft = !cloudOneDriftLeft;
  }
  
  // Cloud 2 stuff.
  push();
    translate(width/1.1, height/1.1);
    rotate(PI);
    imageMode(CENTER);
    image(cloud2, cloudTwoX, cloudTwoY);
  
    // Cloud Two Drift
    if (cloudTwoDriftLeft) {
      cloudTwoX+=0.1;
    }
    else if (!cloudTwoDriftLeft) {
      cloudTwoX-=0.1;
    }
    if (cloudTwoX >= -5) {
      cloudTwoDriftLeft = !cloudTwoDriftLeft;
    }
    if (cloudTwoX <= 5) {
    cloudTwoDriftLeft = !cloudTwoDriftLeft;
    }
  pop();

}

// Make the bullseye and let it wander across the canvas.
function bullseye() {
  // Better bullseye using a for loop.
  for (let i = 0; i < 6; i++) {
    
    // Fill values.
    fill(255, 255, 255);
    if (i % 2 == 0 || i == 5) {
      fill(255, 0, 0);
    }
    
    // Shrink values.
    if (i == 1) {
      shrink = 20;
    }
    else if (i > 1) {
      shrink = 30;
    }
    
    // Draw the circle and set the z value for next circle in bullseye.
    circle(x, y, z);
    z = z - shrink;
  }
  
  // Reset z to maintain bullseye across draw cycles.
  z = 150;

  // Move bullseye across sky.
  x = noise(timeline) * width;
  y = noise(timeline+0.1) * height;
  timeline = timeline + timeIncrement
  
  // Point display
  fill(0, 255, 0);
  text(hitString, x + 75, y + 75);
  
  // Reload cue and instructions.
  if (shots == 0 && reserve > 0) {
    text('RELOAD!', x - 125, y - 80);
    text('Press r and left-click to reload', 10, height - 10);
  }
  fill(255, 255, 255);
}

// Introduce player to game.
function introScreen() {
    score = 0;
    textSize(64);
    push();
      fill(0, 255, 0);
      textAlign(CENTER, CENTER);
      text('Welcome to Bullseye! Try to hit the target.', width/2, height/2);
    pop();
}

// Display results of game and prompt another attempt or saving score.
function resultsScreen() {
    // Don't need distraction of hit tracking in results screen.
    hitString = '';
  
    fill(255, 255, 255);
  
    // Make one method of cheating more difficult.
    if (timeIncrement < 0.01) {
      score = score * 0;
    }
  
    push();
      textAlign(CENTER, CENTER);
      text('Your score: ' + score, (width/2), (height/2) - 50);
      if (score == (startShots + startReserve) * 100) {
        text('Perfect Score!', (width/2), (height/2) - 125);
      }
      text('Try again?', (width/2), (height/2) + 25);
      text('Y/N', (width/2), (height/2) + 100);
    pop();
    newGamePrompt();
}

// Update scoreboard and prompt whether to play a new game.
function newGamePrompt() {
  if (keyCode === 89) {
    shots = 6;
    reserve = 6;
    endPlay = false;
    draw();
  }
  else if (keyCode === 78) {
    // Only adjust the score board with player's final attempt for the round.
    top10Adjust();
    endPlay = true;
  }
}

// Insert player score in top 10, if applicable.
function top10Adjust() {
  for(let i = 0; i < highScoresList.players.length - 1; i++) {
    // Overwrite matching score directly.
    if (score == highScoresList.players[i].score && newScore == false) {
      highScoresList.players[i].name = winner;
      highScoresList.players[i].score = score;
      newScore = true;
    }
    // Supplant old ranking score with new score and move every lower score down by one rank.
    else if (score > highScoresList.players[i].score && newScore == false) {
      for (let j = highScoresList.players.length - 1; j > i; j--) {
        highScoresList.players[j].name = highScoresList.players[j - 1].name;
        highScoresList.players[j].score = highScoresList.players[j - 1].score;
      }
      highScoresList.players[i].name = winner;
      highScoresList.players[i].score = score;
      newScore = true;
    }
  }
}

// Grab and display high scoring players, with ranking colors.
function highScoreScreenList() {
    push();
      textSize(32);
      textAlign(CENTER, CENTER);
      text('Top 10', (width/2), 50);
      for (let i = 0; i < highScoresList.players.length; i++) {
        if (i <= 2) {
          fill(255, 215, 0);
        }
        else if (i > 2 && i <=5) {
          fill(192, 192, 192);
        }
        else {
          fill(205, 127, 50);
        }
        text(highScoresList.players[i].name, (width/2) - 100, rankY);
        text(highScoresList.players[i].score, (width/2) + 100, rankY);
        rankY+=50;
        if (rankY >= 600) {
          rankY = 100;
        }
      }
    pop();
    fill(0, 255, 0);
  
    // Restart game after all. Player can attempt new score while saving their old one for the duration of the session.
    push();
      textSize(32);
      textAlign(CENTER, CENTER);
      text('Press y to play again', (width/2), 650);
    pop();
    textSize(64);
    fill(255, 0 ,0);
    newGamePrompt();
}

function draw() {
  background(0,0,255);
  
  // Call clouds function to draw clouds.
  clouds(); 
  
  // Call bullseye function to draw bullseye.
  bullseye();
  
  // Display welcome screen at start.
  if(shots == 6 && reserve == 6) {
    introScreen();
  }
  
  // Help player keep track of remaining rounds. Green when full. Turn red when completely expended.
  if (shots == startShots && reserve == startReserve) {
    fill(0, 255, 0);
  }
  else if(shots == 0 && reserve <= 0) {
    fill(255, 0, 0);
  }
  text(shots + '/' + reserve, width - 100, height - 10);
  
  // Display results when all rounds are expended. Reset new score tracker to allow a new recording.
  // If a player plays enough rounds, they can fill the score board with their results.
  if(shots == 0 && reserve <= 0 && endPlay == false) {
    newScore = false;
    resultsScreen();
  }
  
  // Display high scores if new attempt isn't selected by player.
  if(shots == 0 && reserve <= 0 && endPlay == true) {
    highScoreScreenList();
  }
}