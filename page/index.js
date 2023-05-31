// 캔버스 세팅

let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 800;
canvas.style.marginTop = "35px";
document.body.appendChild(canvas);

// 이미지 가져오기
let backgroundImage,
  spaceshipImage,
  bulletImage,
  enemyImage,
  gameOverImage,
  enemyBoss1Image,
  enemyBoss2Image,
  enemyBoss3Image,
  petImage;

// 게임의 상태 값
let gameOver = false; // ture이면 게임이 끝남, false면 게임이 안끝남.
let boss1Created = false; // 보스1 ture이면 보스 나타남, false면 안나타남.
let boss2Created = false; // 보스2
let boss3Created = false; // 보스3
let score = 0;
let playerSpeed = 5; // 플레이어 기본 스피드 값
let enemySpeed = 1; // 적 내려오는 스피드 값
let enemySpawnSpeed = 1000; // 적 생성 속도
let isPaused = true; // 일시정지 기능

// 우주선 좌표
let spaceshipX = canvas.width / 2 - 30; // 왼쪽 제일 위가 0 , 넓이 = 가로 넓이 2로 나누고 우주선 크기에 절반
let spaceshipY = canvas.height - 60; // 왼쪽 제일 위가 0 , 길이 = 세로 넓이 - 우주선크기
let bulletList = []; // 총알들을 저장하는 리스트
let interval; // 적군 인터벌

function Bullet() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.x = spaceshipX + 18;
    this.y = spaceshipY;
    this.alive = true; // true 면 살아있는 총알 false면 죽은 총알
    bulletList.push(this);
  };
  this.update = function () {
    this.y -= 7;
  };
  this.checkHit = function () {
    for (let i = 0; i < enemyList.length; i++) {
      // 총알이 닿았다.
      if (
        this.y <= enemyList[i].y + 40 &&
        this.y >= enemyList[i].y &&
        this.x >= enemyList[i].x &&
        this.x <= enemyList[i].x + 40
      ) {
        // 닿으면 총알이 죽게됌. 적군의 우주선이 없어짐. 점수 획득
        score++;
        this.alive = false; // 죽은 총알
        enemyList.splice(i, 1);
      }
    }
  };
}

function generateRandomValue(min, max) {
  // min,max = 최대값 최소값 미리 정해준것 / 화면 밖에서 생성되면 안되므로
  let randomNum = Math.floor(Math.random() * (max - min + 1)) + min; // 공식 인터넷에 찾아보기
  return randomNum;
}

let enemyList = [];
// let enemyBoss1 = [];

function Enemy() {
  this.x = 0;
  this.y = 0;
  this.init = function (x, y) {
    this.y = y || 0;
    this.x = x || generateRandomValue(0, canvas.width - 48); // 48 = 적군 이미지 사이즈
    enemyList.push(this);
  };
  this.update = function () {
    this.y += enemySpeed; // 적군의 속도 조절
    // 게임 종료
    if (this.y >= canvas.height - 48) {
      gameOver = true;
    }
  };
}

function Boss1() {
  this.x = 0;
  this.y = 0;
  this.speed = 1;
  this.init = function () {
    this.y = 0;
    this.x = generateRandomValue(0, canvas.width - 64); // 64 = 보스 이미지 사이즈
    enemyList.push(this);
  };
  this.enemySpawnInterval = 100;
  this.lastSpawnTime = 0;
  this.alive = true;

  this.update = function () {
    this.x += this.speed;

    // 화면 가장자리에 도달했을 떄 방향 변경
    if (this.x <= 0 && this.speed < 0) {
      this.speed = 1;
    } else if (this.x >= canvas.width - 64 && this.speed > 0) {
      this.speed = -1;
    }
  };
}

function Boss2() {
  this.x = 0;
  this.y = 0;
  this.speed = 1.2;
  this.init = function () {
    this.y = 0;
    this.x = generateRandomValue(0, canvas.width - 66);
    enemyList.push(this);
  };
  this.enemySpawnInterval = 100;
  this.lastSpawnTime = 0;
  this.alive = true;

  this.update = function () {
    this.x += this.speed;

    if (this.x <= 0 && this.speed < 0) {
      this.speed = 1.2;
    } else if (this.x >= canvas.width - 66 && this.speed > 0) {
      this.speed = -1.2;
    }
  };
}

function Boss3() {
  this.x = 0;
  this.y = 0;
  this.speed = 1.4;
  this.init = function () {
    this.y = 0;
    this.x = generateRandomValue(0, canvas.width - 66);
    enemyList.push(this);
  };
  this.enemySpawnInterval = 100;
  this.lastSpawnTime = 0;
  this.alive = true;

  this.update = function () {
    this.x += this.speed;

    if (this.x <= 0 && this.speed < 0) {
      this.speed = 1.4;
    } else if (this.x >= canvas.width - 66 && this.speed > 0) {
      this.speed = -1.4;
    }
  };
}

function loadImage() {
  backgroundImage = new Image();
  backgroundImage.src = "images/background.gif";

  spaceshipImage = new Image();
  spaceshipImage.src = "images/spaceship.png";

  bulletImage = new Image();
  bulletImage.src = "images/bullet.png";

  enemyImage = new Image();
  enemyImage.src = "images/enemy.png";

  gameOverImage = new Image();
  gameOverImage.src = "images/gameover.png";

  enemyBoss1Image = new Image();
  enemyBoss1Image.src = "images/enemyBoss1.png";

  enemyBoss2Image = new Image();
  enemyBoss2Image.src = "images/enemyBoss2.png";

  enemyBoss3Image = new Image();
  enemyBoss3Image.src = "images/enemyBoss3.png";

  petImage = new Image();
  petImage.src = "images/pet.png"
}
// 방향키를 누르면 생기는 이벤트 , // 1. 스페이스 바를 누르면 총알이 발사 된다.
let keysDown = {};
function setupKeyboardListener() {
  document.addEventListener("keydown", function (event) {
    keysDown[event.keyCode] = true;
  });
  document.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];
  });
}
// 총알 생성
function createBullet() {
  let b = new Bullet(); // 총알 하나 생성
  b.init();
}

// 잔몹 생성
function createEnemy() {
  setInterval(function () {
    if (score >= 10 && score !== 0 && !boss1Created) {
      createEnemyBoss1();
    } else if (score >= 100 && !boss2Created) {
      createEnemyBoss2();
    } else if (score >= 200 && !boss3Created) {
      createEnemyBoss3();
    }

    else {
      if (!isPaused) {
        let e = new Enemy();
        e.init();
      }
    }
  }, enemySpawnSpeed);
}
// 보스1 생성
function createEnemyBoss1() {
  if (!boss1Created) {
    let boss = new Boss1();
    boss.init();
    enemyList.push(boss);
    boss1Created = true;
    // 보스 1이 생성되면 스피드 업
    playerSpeed = playerSpeed+2;
    // 보스 1이 생성되면 적군 이동 속도를 빠르게 변경
    enemySpeed = 2;
    // 적 생성 속도
    enemySpawnSpeed = 100;
  }
}
// 보스2 생성
function createEnemyBoss2() {
  if (!boss2Created) {
    let boss = new Boss2();
    boss.init();
    enemyList.push(boss);
    boss2Created = true;
    // 보스 2가 생성되면 스피드 업
    playerSpeed = playerSpeed+2;
    // 보스 2이 생성되면 적군 이동 속도를 빠르게 변경
    enemySpeed = 2;
    enemySpawnSpeed = 100;
  }
}
// 보스3 생성
function createEnemyBoss3() {
  if (!boss3Created) {
    let boss = new Boss3();
    boss.init();
    enemyList.push(boss);
    boss3Created = true;
    // 보스 3이 생성되면 스피드 업
    playerSpeed = playerSpeed+2;
    // 보스 3이 생성되면 적군 이동 속도를 빠르게 변경
    enemySpeed = 2;
    enemySpawnSpeed = 100;
  }
}

// 우주선 몸으로 적군 부수는 함수
function checkSpaceshipCollision(enemy) {
  return (
    spaceshipX < enemy.x + 48 &&
    spaceshipX + 60 > enemy.x &&
    spaceshipY < enemy.y + 48 &&
    spaceshipY + 60 > enemy.y
  );
}

function update() {
  if (39 in keysDown) {
    spaceshipX += playerSpeed; // 우주선의 속도 오른쪽
  }
  if (37 in keysDown) {
    spaceshipX -= playerSpeed; // 우주선의 속도 왼쪽
  }

  // 우주선의 좌표값이 무한대로 업데이트가 되는 게 아닌! 경기장 안에서만 있게 하려면?
  if (spaceshipX <= 0) {
    spaceshipX = 0;
  }
  if (spaceshipX >= canvas.width - 60) {
    spaceshipX = canvas.width - 60;
  }

  // 우주선의 좌표값이 무한대로 업데이트가 되는 게 아닌! 경기장 안에서만 있게 하려면?
  if (spaceshipX <= 0) {
    spaceshipX = 0;
  }
  if (spaceshipX >= canvas.width - 60) {
    spaceshipX = canvas.width - 60;
  }

  if (38 in keysDown) {
    spaceshipY -= playerSpeed;
  }
  if (40 in keysDown) {
    spaceshipY += playerSpeed;
  }
  if (spaceshipY >= canvas.height - 60) {
    spaceshipY = canvas.height - 60;
  }
  if (spaceshipY <= 60) {
    spaceshipY = 60;
  }
  // 총알의 y 좌표 업데이트 하는 함수 호출
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      bulletList[i].update();
      bulletList[i].checkHit();
    }
  }
  // 적군 잔몹들 아래로 내려오는 함수 / 움직임 /
  for (let i = 0; i < enemyList.length; i++) {
    enemyList[i].update();
    // 플레이어와 잔몹이 충돌했는지 확인
    if (checkSpaceshipCollision(enemyList[i])) {
      enemyList.splice(i, 1); // 적 제거
      score++; // 스코어 증가
      i--; // 인덱스 조정
    }
  }

  // 보스1 몹이 나타났을 때 보스몹에게 잔몹이 나타나게 하는 함수
  for (let i = 0; i < enemyList.length; i++) {
    if (enemyList[i] instanceof Boss1 && enemyList[i].alive) {
      const currentTime = new Date().getTime();
      if (
        currentTime - enemyList[i].lastSpawnTime >
        enemyList[i].enemySpawnInterval
      ) {
        let e = new Enemy();
        e.init(enemyList[i].x + 32, enemyList[i].y + 64);
        enemyList[i].lastSpawnTime = currentTime;
      }
    }
  }
  // 보스 2 몹이 나타났을 떄 보스몹에게 잔몹이 나타나게 하는 함수
  for (let i = 0; i < enemyList.length; i++) {
    if (enemyList[i] instanceof Boss2 && enemyList[i].alive) {
      const currentTime = new Date().getTime();
      if (
        currentTime - enemyList[i].lastSpawnTime >
        enemyList[i].enemySpawnInterval
      ) {
        let e = new Enemy();
        e.init(enemyList[i].x + 33, enemyList[i].y + 66);
        enemyList[i].lastSpawnTime = currentTime;
      }
    }
  }
  // 보스 3 몹이 나타났을 떄 보스몹에게 잔몹이 나타나게 하는 함수
  for (let i = 0; i < enemyList.length; i++) {
    if (enemyList[i] instanceof Boss3 && enemyList[i].alive) {
      const currentTime = new Date().getTime();
      if (
        currentTime - enemyList[i].lastSpawnTime >
        enemyList[i].enemySpawnInterval
      ) {
        let e = new Enemy();
        e.init(enemyList[i].x + 33, enemyList[i].y + 66);
        enemyList[i].lastSpawnTime = currentTime;
      }
    }
  }
}

// 이미지 캔버스에 그려주기
function render() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
  ctx.drawImage(petImage, spaceshipX+10,spaceshipY-10 );
  ctx.fillText(`Score : ${score}`, 60, 20);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";

  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }
  }
  for (let i = 0; i < enemyList.length; i++) {
    if (enemyList[i] instanceof Boss1) {
      ctx.drawImage(enemyBoss1Image, enemyList[i].x, enemyList[i].y);
    } else if (enemyList[i] instanceof Boss2) {
      ctx.drawImage(enemyBoss2Image, enemyList[i].x, enemyList[i].y);
    } else if (enemyList[i] instanceof Boss3) {
      ctx.drawImage(enemyBoss3Image, enemyList[i].x, enemyList[i].y);
    } else {
      ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
    }
  }
}

// 일시정지 기능 추가
// 일시정지 함수
function togglePause() {
  isPaused = !isPaused;
}

// pause 그리기

function renderPause() {
  // 반투명 검은색 레이어
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 일시정지 메세지
  ctx.fillStyle = "yellow";
  ctx.font = "50px Arial";
  ctx.textAlign = "center";
  ctx.fillText("게임설명", canvas.width / 2, canvas.height / 2 - 200);
  ctx.font = "20px Arial"
  ctx.fillText("당신은 외계인에게 납치된 지구인들을", canvas.width / 2, canvas.height / 2 - 160);
  ctx.font = "20px Arial"
  ctx.fillText("구조하라는 특별한 임무를 받았다.", canvas.width / 2, canvas.height / 2 - 130);
  ctx.font = "20px Arial"
  ctx.fillText("납치된 지구인들을 구조하라.", canvas.width / 2, canvas.height / 2 - 100);
  ctx.font = "20px Arial"
  ctx.fillText("구조된 지구인의 수만큼 Score를 얻게되며,", canvas.width / 2, canvas.height / 2 - 70);
  ctx.font = "20px Arial"
  ctx.fillText("적립된 Score는 Token으로 교환할 수 있다.", canvas.width / 2, canvas.height / 2 - 40);
  ctx.font = "20px Arial"
  ctx.fillText("방향키로 내려오는 지구인에게 접근하면", canvas.width / 2, canvas.height / 2 + 40);
  ctx.font = "20px Arial"
  ctx.fillText("구조 성공!", canvas.width / 2, canvas.height / 2 + 70);
  ctx.font = "20px Arial"
  ctx.fillText("ESC 또는 p 키로 게임을 시작하거나", canvas.width / 2, canvas.height / 2 + 100);
  ctx.font = "20px Arial"
  ctx.fillText("일시정지 할 수 있다.", canvas.width / 2, canvas.height / 2 + 130);
};

// 일시정지 키 입력 (esc나 p 누르면 일시정지)
window.addEventListener('keydown', function (event) {
  if (event.key === "p" || event.key === "P" || event.key === "ㅔ" || event.key === "ㅖ"
    || event.keyCode === 27) {
    togglePause();

  }
});

function main() {
    if(!gameOver){
        if(!isPaused) {
            update(); // 좌표 값을 업데이트 하고 
        } 
        render(); // 그려주고

        if(isPaused) {
            renderPause();
        }
         
            requestAnimationFrame(main);
        } else{
            ctx.drawImage(gameOverImage,10,100,380,380);
        }
    }

loadImage();
setupKeyboardListener();
createEnemy();
main();