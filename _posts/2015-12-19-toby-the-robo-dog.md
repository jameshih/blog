---
title: Toby the Robo Dog 🐶
updated: 2015-12-19 05:11
---

![Toby](https://github.com/jameshih/jameshih.github.io/blob/main/assets/toby/IMG_0226-15fzuu7.jpg?raw=true)

### Too lazy to buy your pet food? Why not get a robot dog.

The project is a continuation of [Mini Virtual Pet](https://shih.app/mini-virtual-pet). My goal for the project is to create a physical robot dog that one can interact with using a desktop application based on the mini virtual pet's interface and gameplay.

### Build Process

I started out by researching all the components needed for creating my robot, which are 4 servos and one ultrasonic sensor. I used an Arduino as the main control board.

I connected all four servos to the Arduino and started to model and 3d print some test enclosures for the servos
<br><br>

<center>
<img src="https://github.com/jameshih/jameshih.github.io/blob/main/assets/toby/s1.jpg?raw=true" width="300">
<img src="https://github.com/jameshih/jameshih.github.io/blob/main/assets/toby/s2.jpg?raw=true" width="300">
</center>

<br><br>

<center>
<div>

servo enclosure test 1

</div>
<iframe width="600" height="400" src="https://viewscreen.githubusercontent.com/view/solid?commit=c1e94f7eff626c218e73162bd1c1a5e374654b01&device=unknown_device&enc_url=68747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f6a616d65736869682f5669727475616c2d526f626f746963732f633165393466376566663632366332313865373331363262643163316135653337343635346230312f50726f677265737325323033442532307072696e7425323053544c2f736572766f253230656e636c6f737572652f736572766f253230656e636c6f7375726525323074657374253230312e73746c&logged_in=true&nwo=jameshih%2FVirtual-Robotics&path=Progress+3D+print+STL%2Fservo+enclosure%2Fservo+enclosure+test+1.stl&platform=mac&repository_id=47721677&repository_type=Repository&version=94#89037356-f604-4751-90f6-cb68917ceed5"></iframe>
</center>

<center>
<div>

servo enclosure test 2

</div>
<iframe width="600" height="400" src="https://viewscreen.githubusercontent.com/view/solid?commit=c1e94f7eff626c218e73162bd1c1a5e374654b01&device=unknown_device&enc_url=68747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f6a616d65736869682f5669727475616c2d526f626f746963732f633165393466376566663632366332313865373331363262643163316135653337343635346230312f50726f677265737325323033442532307072696e7425323053544c2f736572766f253230656e636c6f737572652f736572766f253230656e636c6f7375726525323074657374253230322e73746c&logged_in=true&nwo=jameshih%2FVirtual-Robotics&path=Progress+3D+print+STL%2Fservo+enclosure%2Fservo+enclosure+test+2.stl&platform=mac&repository_id=47721677&repository_type=Repository&version=94#ed497055-7ea9-4bd4-94b7-145c816142ad"></iframe>
</center>

<center>
<div>

servo enclosure test 3

</div>
<iframe width="600" height="400" src="https://viewscreen.githubusercontent.com/view/solid?commit=c1e94f7eff626c218e73162bd1c1a5e374654b01&device=unknown_device&enc_url=68747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f6a616d65736869682f5669727475616c2d526f626f746963732f633165393466376566663632366332313865373331363262643163316135653337343635346230312f50726f677265737325323033442532307072696e7425323053544c2f736572766f253230656e636c6f737572652f736572766f253230656e636c6f7375726525323074657374253230332e73746c&logged_in=true&nwo=jameshih%2FVirtual-Robotics&path=Progress+3D+print+STL%2Fservo+enclosure%2Fservo+enclosure+test+3.stl&platform=mac&repository_id=47721677&repository_type=Repository&version=94#f512988f-714d-4a96-9d8e-f05e3453a361"></iframe>
</center>

<script src="https://embed.github.com/view/3d/jameshih/Virtual-Robotics/master/Progress 3D print STL/servo enclosure/servo enclosure test 3.stl"></script>

<br><br>
Then I began to work on the robot’s legs

<center>
<div>

leg test 1

</div>
<iframe width="600" height="400" src="https://viewscreen.githubusercontent.com/view/solid?commit=c1e94f7eff626c218e73162bd1c1a5e374654b01&device=unknown_device&enc_url=68747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f6a616d65736869682f5669727475616c2d526f626f746963732f633165393466376566663632366332313865373331363262643163316135653337343635346230312f50726f677265737325323033442532307072696e7425323053544c2f6c65672f6c6567253230746573742e73746c&logged_in=true&nwo=jameshih%2FVirtual-Robotics&path=Progress+3D+print+STL%2Fleg%2Fleg+test.stl&platform=mac&repository_id=47721677&repository_type=Repository&version=94#d00179f1-f226-4dc4-a5c4-4f934ae333b8"></iframe>
</center>

<center>
<div>

leg test 2 left

</div>
<iframe width="600" height="400" src="https://viewscreen.githubusercontent.com/view/solid?commit=c1e94f7eff626c218e73162bd1c1a5e374654b01&device=unknown_device&enc_url=68747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f6a616d65736869682f5669727475616c2d526f626f746963732f633165393466376566663632366332313865373331363262643163316135653337343635346230312f50726f677265737325323033442532307072696e7425323053544c2f6c65672f6c656725323074657374253230322532306c6566742e73746c&logged_in=true&nwo=jameshih%2FVirtual-Robotics&path=Progress+3D+print+STL%2Fleg%2Fleg+test+2+left.stl&platform=mac&repository_id=47721677&repository_type=Repository&version=94#33f31ff0-75c3-492f-bff0-1916fa3a1f39"></iframe>
</center>

<center>
<div>

leg test 2 right

</div>
<iframe width="600" height="400" src="https://viewscreen.githubusercontent.com/view/solid?commit=c1e94f7eff626c218e73162bd1c1a5e374654b01&device=unknown_device&enc_url=68747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f6a616d65736869682f5669727475616c2d526f626f746963732f633165393466376566663632366332313865373331363262643163316135653337343635346230312f50726f677265737325323033442532307072696e7425323053544c2f6c65672f6c6567253230746573742532303225323072696768742e73746c&logged_in=true&nwo=jameshih%2FVirtual-Robotics&path=Progress+3D+print+STL%2Fleg%2Fleg+test+2+right.stl&platform=mac&repository_id=47721677&repository_type=Repository&version=94#ee7893fd-79e4-4f0f-a132-c7adbcae45ab"></iframe>
</center>

After finishing the basic components, I put together an unibody frame that can hold all servos while carrying an Arduino board.

<center>
<div>

Unibody frame

</div>
<iframe width="600" height="400" src="https://viewscreen.githubusercontent.com/view/solid?commit=c1e94f7eff626c218e73162bd1c1a5e374654b01&device=unknown_device&enc_url=68747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f6a616d65736869682f5669727475616c2d526f626f746963732f633165393466376566663632366332313865373331363262643163316135653337343635346230312f50726f677265737325323033442532307072696e7425323053544c2f626f64792532306672616d652f726f626f74253230756e69626f6479253230656e636c6f7375726525323074657374253230312e73746c&logged_in=true&nwo=jameshih%2FVirtual-Robotics&path=Progress+3D+print+STL%2Fbody+frame%2Frobot+unibody+enclosure+test+1.stl&platform=mac&repository_id=47721677&repository_type=Repository&version=94#8a726a3a-6bfe-4d3e-ad42-ade31de49d72"></iframe>
</center>

I connected all the essential parts and wrote the Arduino program for the robot to walk.

<center>
<img src="https://github.com/jameshih/jameshih.github.io/blob/main/assets/toby/1.jpg?raw=true" width="220">
<img src="https://github.com/jameshih/jameshih.github.io/blob/main/assets/toby/2.jpg?raw=true" width="220">
<img src="https://github.com/jameshih/jameshih.github.io/blob/main/assets/toby/3.jpg?raw=true" width="220">
<img src="https://github.com/jameshih/jameshih.github.io/blob/main/assets/toby/4.jpg?raw=true" width="220">
</center>

#### Test Walk

<iframe src="https://www.youtube.com/embed/gfIM5SOlD3k" width="640" height="564" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>

I added an ultrasonic distance sensor so that users can physically interact with the robot.

![t1](https://github.com/jameshih/jameshih.github.io/blob/main/assets/toby/IMG_0231-17um6ht-768x1024.jpg?raw=true)

I looked up many methods to communicate with the Arduino using my laptop and found that bluetooth is the most efficient one.

![t2](https://github.com/jameshih/jameshih.github.io/blob/main/assets/toby/IMG_0287-1wyk153-768x1024.jpg?raw=true)

I started to work on a virtual interface for user to control the robot via their computers. I took the design concept from a [tamagochi game](https://github.com/jameshih/virtual-pet) that I made before.

![i1](https://github.com/jameshih/jameshih.github.io/blob/main/assets/toby/i1.png?raw=true)

There are two indicators, “heart” and “happy face”.

Heart indicates the health of the pet, the pet will die if it gets to zero.

Happy face indicates the mood of the pet; the yellow face will turn red, showing the pet is mad if the happy level gets below 40.

There are two options on the home page, FEED and REMOTE

![i2](https://github.com/jameshih/jameshih.github.io/blob/main/assets/toby/i2.png?raw=true)

FEED lets the user to choose what to feed the pet (milk, apple ,or meat).

<center>
<img src="https://github.com/jameshih/jameshih.github.io/blob/main/assets/toby/f1.png?raw=true" width="200">
<img src="https://github.com/jameshih/jameshih.github.io/blob/main/assets/toby/f2.png?raw=true" width="200">
<img src="https://github.com/jameshih/jameshih.github.io/blob/main/assets/toby/f3.png?raw=true" width="200">
<img src="https://github.com/jameshih/jameshih.github.io/blob/main/assets/toby/b1.png?raw=true" width="200">
<img src="https://github.com/jameshih/jameshih.github.io/blob/main/assets/toby/b2.png?raw=true" width="200">
<img src="https://github.com/jameshih/jameshih.github.io/blob/main/assets/toby/b3.png?raw=true" width="200">
</center>

REMOTE lets the player control the robot
![r1](https://github.com/jameshih/jameshih.github.io/blob/main/assets/toby/r1.png?raw=true)

The robot is physically interactive outside of the REMOTE tap, meaning that it will response to the user automatically.

When on the REMOTE page, the user can press S on the keyboard to make the robot sit, U to make the robot stand, and D to lay the robot down.

If health gets to zero the pet will die and the robot will show dead.
![d](https://github.com/jameshih/jameshih.github.io/blob/main/assets/toby/d.png?raw=true)

### Robot Code

#### robot_v2.ino

```cpp
#include <Servo.h>
Servo myservo1;
Servo myservo2;
Servo myservo3;
Servo myservo4;
int caseState;
int interval = 100;
int pos;
int pos2;
int echoPin = 13;
int trigPin = 12;
float counter;
float pingTime;
float distance;
float speedOfSound = 776.5;
int timer;

//bluetooth
char val;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  myservo1.attach(9);
  myservo2.attach(10);
  myservo3.attach(11);
  myservo4.attach(6);
  Serial.begin(9600);
}


void loop() {
  if (Serial.available()) {
    val = Serial.read();
  }
  if (val == 'A') caseState = 0;
  if (val == 'B') caseState = 1;
  if (val == 'C') caseState = 2;
  if (val == 'D') caseState = 3;
  if (val == 'E') caseState = 4;
  if (val == 'X') {
    if (distance <= 4) {
      caseState = 3;
      timer--;
      if (timer <= 0 && distance <= 4) {
        caseState = 0;
      }
    } else {
      caseState = 2;
    }
  }
  logic();
  proximity();
  //debug();

}
```

#### logic.ino

```cpp

void logic() {
  long start = millis();
  switch (caseState) {
    case 0:
      timer = 0;
      myservo1.write(180);
      myservo3.write(0);
      myservo2.write(0);
      myservo4.write(180);
      break;
    case 1:

      myservo1.write(90);
      myservo3.write(90);
      myservo2.write(90);
      myservo4.write(90);

      break;

    case 2:
      timer = (int)random(50, 300);
      counter = 128 + 127 * cos (0.25 * PI / interval * (interval - start));
      pos = map(counter, 0, 255, 40, 135);
      pos2 = map(counter, 0, 255, 135, 40);
      myservo1.write(pos);
      myservo3.write(pos2);
      myservo2.write(pos);
      myservo4.write(pos2);
      break;

    case 3:
      myservo1.write(155);
      myservo3.write(90);
      myservo2.write(25);
      myservo4.write(90);
      break;
    case 4:// dead
      myservo1.write(40);
      myservo3.write(0);
      myservo2.write(30);
      myservo4.write(40);
      break;
  }
}
```

#### proximity.ino

```cpp
void proximity() {
  digitalWrite(trigPin, LOW);
  digitalWrite(trigPin, HIGH);
  digitalWrite(trigPin, LOW);

  pingTime = pulseIn(echoPin, HIGH);
  pingTime = pingTime / 1000000;
  pingTime = pingTime / 3600;
  distance = speedOfSound * pingTime;
  distance = distance / 2;
  distance = distance * 63360;
}
```

#### debug.ino

```cpp
void debug(){
  Serial.print("Servo Degree(9,10)= \t");
  Serial.print(pos);
    Serial.print("\tServo Degree(11,6)= \t");
  Serial.print(pos2);
  Serial.print("\tDistance= \t");
  Serial.print(distance);
  Serial.print("\tcaseState= \t");
  Serial.print(caseState);
  Serial.print("\tTimer= \t");
  Serial.print(timer);
  Serial.println();
}
```

### Interface Code

#### virtual_pet_interface.ino

```cpp
import processing.serial.*;
Serial port;

int caseState;
int duration = 5000;
int interval = 100;
int health = 100;
int happy =100;
int selectState;
int s;
int u;
int d;

long prevTime;
float heartc;
float happyc;
float counter;

PImage apple;
PImage milk;
PImage meat;

boolean feedMilk = false;
boolean feedApple = false;
boolean feedMeat = false;

void setup() {
  size(600, 600);
  // reference: https://processing.org/reference/libraries/serial/Serial.html
  port = new Serial(this, Serial.list()[1], 9600); //establish bluetooth connection
  println("Available serial ports:" + port);
  smooth();
  noStroke();
  textSize(30);
  apple = loadImage("img/apple.png");
  milk = loadImage("img/milk.png");
  meat = loadImage("img/meat.png");
}

void draw() {
  background(255);
  long start = millis();
  counter = 128 + 127 * cos(0.25 * PI/interval * (interval - start));
  heartc = map(counter, 0, 255, 255, 0);
  happyc = map(counter, 0, 255, 255, 0);

  if (start - prevTime >= duration) {
    prevTime = start;

    if (health <= 5) {
      health = 0;
      caseState = 3; //go to end game
    } else {
      health -= 2;
    }

    if (happy <= 8) {
      happy = 0;
    } else {
      happy -= random(3, 8);
    }
  }

  display();
  emotion();
  logic();

}


void reset() {
  caseState = 0;
  selectState = 0;
  health = 100;
  happy = 100;
}

void mouseClicked() {
  if (selectState == 1) {
    caseState = 1;
    selectState =3;
  }
  if (selectState == 2) {
    caseState = 2;
    selectState = 5;
  }

  if (selectState == 4) {
    caseState = 0;
    selectState =0;
  }

  if (selectState == 9) {
    caseState = 0;
    selectState =0;
  }
  if (caseState == 3) reset();

  if (feedMilk == true) {
    if (health <= 95) {
      health+=5;
    } else {
      health += 100-health;
    }
  }

  if (feedApple == true) {
    if (health <= 97) {
      health+=3;
    } else {
      health += 100-health;
    }
  }

  if (feedMeat == true) {
    if (health <= 92) {
      health+=8;
    } else {
      health += 100-health;
    }
  }
}
```

#### logic.ino

```cpp
void logic() {
  pushMatrix();
  translate(10, 10);
  select();
  switch(caseState) {
  case 0:
    port.write('X');
    if (mouseY >=63 && mouseY <=113) {
      if (mouseX >=125 && mouseX <=245) selectState = 1;
      if (mouseX >= 300 && mouseX <=430) selectState = 2;
    } else {
      selectState = 0;
    }
    break;

  case 1:
    port.write('X');
    if (mouseY >=63 && mouseY <=113) {
      if (mouseX >= 330 && mouseX <=480) selectState = 4;
    } else {
      selectState = 3;
    }

    break;

  case 2:
    if (mouseY >=63 && mouseY <=113) {
      if (mouseX >= 330 && mouseX <=480) selectState = 9;
    } else {
      selectState = 5;
    }
    if (keyPressed) {
      if (key == 's' || key == 'S') {
        port.write('D');
        s = #9EA9BA;
        if(happy < 100){
          happy++;
        }else{
          happy+=0;
        }
      } else {
        s = 0;
      }
      if (key == 'u' || key == 'U') {
        port.write('B');
        u = #9EA9BA;
          if(happy < 100){
          happy++;
        }else{
          happy+=0;
        }
      } else {
        u = 0;
      }

      if (key == 'd' || key == 'D') {
        port.write('A');
        d = #9EA9BA;
          if(happy < 100){
          happy++;
        }else{
          happy+=0;
        }
      } else {
        d = 0;
      }
    }
    break;

  case 3:
    text("I'M DEAD :'(", 200, 450);
    selectState = 8;
    happy = 0;
    port.write('E');
    break;
  }

  popMatrix();
}

void select() {
  switch(selectState) {
  case 0: //no hover
    fill(0);
    text("FEED", 150, 100);
    text("REMOTE", 310, 100);
    break;

  case 1: // hover feed
    fill(20);
    rect(125, 63, 120, 50);
    fill(255);
    text("FEED", 150, 100);
    fill(0);
    text("REMOTE", 310, 100);
    break;

  case 2: //hover remote
    fill(20);
    rect(300, 63, 135, 50);
    fill(0);
    text("FEED", 150, 100);
    fill(255);
    text("REMOTE", 310, 100);
    break;

  case 3: //feed no selection state
    fill(0);
    image(milk, 100, 50);
    //rect(260, 50, 60, 100); position rect
    image(apple, 180, 60);
    image(meat, 265, 60);
    text("GO BACK", 340, 100);
    if (mouseX >= 100 && mouseX <= 160 && mouseY >= 50 && mouseY <= 150) {
      if (mousePressed == true) {
        feedMilk = true;
        if (health <= 95) {
          fill(#3CA9EA);
          text("Health + 5", mouseX-40, mouseY+60);
        } else {
          if (health == 100) {
            fill(#76E87D);
            text("I'M FULL!", mouseX-40, mouseY+60);
          } else {
            fill(#3CA9EA);
            text("Health + " + (100-health), mouseX-40, mouseY+60);
          }
        }
      } else {
        text("/MILK/ Health+5", mouseX-40, mouseY+60);
        feedMilk = false;
      }
    }
    if (mouseX >= 180 && mouseX <= 240 && mouseY >= 50 && mouseY <= 150) {
      if (mousePressed == true) {
        feedApple = true;
        if (health <= 97) {
          fill(#3CA9EA);
          text("Health + 3", mouseX-40, mouseY+60);
        } else {
          if (health == 100) {
            fill(#76E87D);
            text("I'M FULL!", mouseX-40, mouseY+60);
          } else {
            fill(#3CA9EA);
            text("Health + " + (100-health), mouseX-40, mouseY+60);
          }
        }
      } else {
        text("/APPLE/ Health+3", mouseX-40, mouseY+60);
        feedApple = false;
      }
    }
    if (mouseX >= 260 && mouseX <= 320 && mouseY >= 50 && mouseY <= 150) {
      if (mousePressed == true) {
        feedMeat = true;
        if (health <= 92) {
          fill(#3CA9EA);
          text("Health + 8", mouseX-40, mouseY+60);
        } else {
          if (health == 100) {
            fill(#76E87D);
            text("I'M FULL!", mouseX-40, mouseY+60);
          } else {
            fill(#3CA9EA);
            text("Health + " + (100-health), mouseX-40, mouseY+60);
          }
        }
      } else {
        text("/MEAT/ Health+8", mouseX-40, mouseY+60);
        feedMeat = false;
      }
    }
    break;

  case 4: // feed selected go back
    fill(20);
    rect(330, 63, 150, 50);
    image(milk, 100, 50);
    image(apple, 180, 60);
    image(meat, 265, 60);
    fill(255);
    text("GO BACK", 340, 100);
    break;

  case 5: //remote no select
    fill(s);
    text("SIT", 50, 100);
    fill(u);
    text("UP", 150, 100);
    fill(d);
    text("DOWN", 230, 100);
    fill(0);
    text("GO BACK", 340, 100);


    break;

    case 8:
    fill(0);
    text("ClICK TO RESTART",150,100);
    break;

  case 9: //remote selected go back
    fill(0);
    text("SIT", 50, 100);
    //rect(260, 50, 60, 100); position rect
    text("UP", 150, 100);
    text("DOWN", 230, 100);
    fill(20);
    rect(330, 63, 150, 50);
    fill(255);
    text("GO BACK", 340, 100);
    break;
  }
}
```

#### display.ino

```cpp
void display() {
  pushMatrix();
  translate(width/2, height/2);
  fill(0);
  if (health !=0) {
    if (happy>=40) {
      fill(#FFF5A3); //yellow
    } else {
      fill(#FF7372);// red
    }
  } else {
    fill(#9EA9BA);//dead
  }

  ellipseMode(CENTER);
  ellipse(0, 0, 200, 200);
  popMatrix();

  pushMatrix();
  translate(40, 500);
  beginShape();

  if (health <= 60) {
    fill(heartc);
    text("HUNGRY!", 200, 450);
  } else {
    fill(0);
    text("", 200, 450);
  }

  vertex(50, 15);
  bezierVertex(50, -5, 90, 5, 50, 40);
  vertex(50, 15);
  bezierVertex(50, -5, 10, 5, 50, 40);
  endShape();
  text(health, 100, 33);
  if (happy <= 40) {
    fill(happyc);
  } else {
    fill(0);
  }
  text(":-)   " + happy, 360, 33);
  popMatrix();
}

void emotion() {
  fill(255);
  ellipse(260, 280, 20, 20);
  ellipse(330, 280, 20, 20);
  if (happy >= 40) {
    pushMatrix();
    translate(50, 20);
    bezier(200, 295, 200, 370, 300, 370, 300, 295); //smiley face
    line(150, 295, 350, 295);
    popMatrix();
  } else {
    if (health !=0) {
      pushMatrix();
      translate(85, 70);
      bezier(190, 260, 210, 240, 225, 240, 240, 260);
      fill(#FF7372); //mad color
      translate(0, 5);
      bezier(180, 260, 210, 240, 225, 240, 260, 260);//sad face
      popMatrix();
    } else {
      fill(#9EA9BA); //dead color
    }
  }
}
```

### Video

<iframe src="https://www.youtube.com/embed/f2849jXubVM" width="640" height="564" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
