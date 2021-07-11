---
title: Vital Wrestler 💨
updated: 2016-03-31 07:16
---

![Render](https://github.com/jameshih/jameshih.github.io/blob/master/assets/wrestle/IMG_0864-2i0jvj7-1024x768.jpg?raw=true)

### Don't smoke. It's bad for you.

Many of my friends are heavy smokers. I had been trying to help them quit smoke for awhile, telling them how bad smoking influences physical abilities. They seemed to be not taking my advice seriously, so I decided to make a device that would help my friends realize how bad smoking is.

When I was running cross country in high school, the coach would brought us balloons and had a competition once a month. Whoever pops the ballon first or has the biggest balloon when the time is up can take the day off. We called the competition “vital wrestling.” I took the idea as an inspiration for my midterm and I decided to make an interactive wrestling statue that lets two players compete by blowing into the fans, and whoever pushes the other player’s hand down wins the game.
<br><br><br>
![Concept](https://github.com/jameshih/jameshih.github.io/blob/master/assets/wrestle/vital-wrestling-18a9vqu-1024x511.png?raw=true)
<br><br><br>

### Schematic Diagram

![SD](https://github.com/jameshih/jameshih.github.io/blob/master/assets/wrestle/vital-wrestling-18aa1ba-1024x654.png?raw=true)
<br><br>

### Code

#### vital_wrestling.ino

```cpp
#include <LiquidCrystal.h>

LiquidCrystal lcd(12, 11, 5, 4, 3, 2);

#define LED1 10
#define LED2 6
#define Blue 13
#define FAN1 A0
#define FAN2 A1
#define Button 2



int caseState, val1, val2, buttonVal, photoVal1, photoVal2, fadeLevel1, fadeLevel2, interval, winner, pos, limit, diff1, diff2;

unsigned long timer1, timer2;

void setup() {
  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
  pinMode(Blue, OUTPUT);
  pinMode(Button, INPUT);
  //servo.attach(5);
  analogWrite(FAN1, 0);
  analogWrite(FAN2, 0);
  lcd.begin(16,2);
  Serial.begin(9600);

}

void loop() {

  val1 = analogRead(FAN1); //analog read fan1
  val2 = analogRead(FAN2); //analog read fan2
  logic();
  debug();

}
```

#### tone_and_display.ino

```cpp
//custom set tone code for my laziness
void setTone(int x) {
  return (tone(8, x, 10));
}


//isolate "begin serial print" for easy edit
void beginDis() {
  Serial.println("Ready!");
  lcd.clear();
  lcd.setCursor(5, 0);
  lcd.print("Ready!");
  setTone(3000);
  delay(1500);
  Serial.println(3);
  lcd.clear();
  lcd.setCursor(7, 0);
  lcd.print(3);
  setTone(4000);
  delay(1000);
  Serial.println(2);
  lcd.clear();
  lcd.setCursor(7, 0);
  lcd.print(2);
  setTone(4000);
  delay(1000);
  Serial.println(1);
  lcd.clear();
  lcd.setCursor(7, 0);
  lcd.print(1);
  setTone(4000);
  delay(1000);
  setTone(2000);
  lcd.clear();
  lcd.setCursor(6, 0);
  lcd.print("GO!");
  Serial.println("GO!");
}


//isolate win tone for easy edit
void winTone() {
  tone(8, 1000, 800);
  delay(100);
  tone(8, 3500, 1000);
}
```

#### timerCal.ino

```cpp
//transfer fan analog read data into LED fadelevel
void timerCal() {
  long cTime = millis();

  if (cTime - timer1 >= interval) { //debouncing
    if (val1 != 0) {
      diff1 = (int)(val1 / 10); //measure how hard player one blows
      fadeLevel1 += diff1; //apply addup
    }

    timer1 = cTime; //reseting timer1
  }

  if (cTime - timer2 >= interval) { //debouncing
    if (val2 != 0) {
      diff2 = (int)(val2 / 10); //measure how hard player two blows
      fadeLevel2 += diff2; //apply addup
    }

    timer2 = cTime; //reseting timer2
  }
}
```

#### reset.ino

```cpp
//reset the game
void reset() {
  fadeLevel1 = 0;
  fadeLevel2 = 0;
  limit = 0;
  //servo.write(90);
  analogWrite(LED1, fadeLevel1);
  analogWrite(LED2, fadeLevel2);
  caseState = 0;
}
```

#### logic.ino

```cpp
void logic() {
  photoVal1 = analogRead(A4);
  photoVal2 = analogRead(A5);
  switch (caseState) {
    case 0:
      //      buttonVal = 0;
      //      buttonVal = digitalRead(Button);
      //      if (val1 < 80 && val2 < 80 && abs(val1 - val2) <= 2) {
      //        if (limit < 1) { //limit the serial print to print one
      //          Serial.println("Press the button to start!");
      //        }
      //

      digitalWrite(Blue, HIGH);
      if (limit < 1) { //limit the serial print to print one
        Serial.println("Press the sensors to start!");
        lcd.clear();
        lcd.print("Press the sensor");
        lcd.setCursor(0, 1);
        lcd.print("to start!");
      }

      limit = 1; //stop the if statement above

      if (photoVal1 <= 100 && photoVal2 <= 100) caseState++; //move to next case

      break;

    case 1:
      beginDis();
      caseState++;
      break;

    case 2:
      //buttonVal = 0;
      limit = 0;
      interval = 100;

      //measureWin(fadeLevel1, fadeLevel2);

      timerCal();

      analogWrite(LED1, fadeLevel1);
      analogWrite(LED2, fadeLevel2);


      if (fadeLevel1 >= 255) {
        fadeLevel1 = 255;
        winner = 1;
        caseState++;
      }

      if (fadeLevel2 >= 255) {
        fadeLevel1 = 255;
        winner = 2;
        caseState++;
      }

      Serial.print("Fan 1 =  ");
      Serial.print(val1);
      Serial.print("\t");
      Serial.print("Fan 2 =  ");
      Serial.print(val2);
      Serial.print("\t");
      Serial.print("1 =  ");
      Serial.print(fadeLevel1);
      Serial.print("\t");
      Serial.print("2 =  ");
      Serial.print(fadeLevel2);
      Serial.println();
      lcd.clear();
      lcd.setCursor(2, 0);
      lcd.print("P2");
      lcd.setCursor(12, 0);
      lcd.print("P1");
      lcd.setCursor(2, 1);
      lcd.print(fadeLevel2);
      lcd.setCursor(12, 1);
      lcd.print(fadeLevel1);

      break;

    case 3:
      if (winner == 1) {

        analogWrite(LED1, 255);
        Serial.println("Player one wins!");
        lcd.clear();
        lcd.print("Player one");
        lcd.setCursor(0, 1);
        lcd.print("wins!");
        winTone();

      } else {

        analogWrite(LED2, 255);

        Serial.println("Player two wins");
        lcd.clear();
        lcd.print("Player two");
        lcd.setCursor(0, 1);
        lcd.print("wins!");
        winTone();

      }

      delay(8000);
      setTone(2000);
      caseState++;
      break;

    case 4:
      if (limit < 1) {
        Serial.println("Press the sensors to restart");
        lcd.clear();
        lcd.print("Press the sensor");
        lcd.setCursor(0, 1);
        lcd.print("to restart!");
      }
      limit = 1;

      if (photoVal1 <= 100 && photoVal2 <= 100) reset();
      break;
  }

}
```

#### debug.ino

```cpp
void debug(){
  Serial.print("Fan 1 =  ");
  Serial.print(val1);
  Serial.print("\t");
  Serial.print("Fan 2 =  ");
  Serial.print(val2);
  Serial.print("\t");
  Serial.print("Case State =  ");
  Serial.print(caseState);
  Serial.print("\t");
  Serial.print("Button =  ");
  Serial.print(buttonVal);
  Serial.print("\t");
  Serial.print("Photocell 1 =  ");
  Serial.print(photoVal1);
  Serial.print("\t");
  Serial.print("Photocell 2 =  ");
  Serial.print(photoVal2);
  Serial.println();
}
```

### Build Process

When I got the pc fans, I spent a lot of time searching online for a guide that tells me how to use the fans as analog read devices for the Arduino. I didn’t find any, so I just plugged the power into A10 and A1 and ground to ground and they turned out to be working like regular analog devices and they print out larger number as you blow on them.

![pc](https://github.com/jameshih/jameshih.github.io/blob/master/assets/wrestle/IMG_0838-1litvt6.jpg?raw=true)

I figured that one LED for each player wouldn’t be bright enough to represent the game play, so I soldered three LEDs together to form a brighter indicator.

![leds](https://github.com/jameshih/jameshih.github.io/blob/master/assets/wrestle/IMG_0844-1wpl8s7-e1459434477564-768x1024.jpg?raw=true)

I added a buzzer to play the game start sounds, winning sounds, and the restart sounds.

![buzz](https://github.com/jameshih/jameshih.github.io/blob/master/assets/wrestle/IMG_0845-1vwv9zx-e1459434625388-768x1024.jpg?raw=true)

#### Laser cutting the case.

![1](https://github.com/jameshih/jameshih.github.io/blob/master/assets/wrestle/IMG_0856-sx0b33.jpg?raw=true)
![2](https://github.com/jameshih/jameshih.github.io/blob/master/assets/wrestle/IMG_0857-10fy5kl.jpg?raw=true)

#### Putting everything together.

![4](https://github.com/jameshih/jameshih.github.io/blob/master/assets/wrestle/IMG_0858-20fc6mt.jpg?raw=true)

![5](https://github.com/jameshih/jameshih.github.io/blob/master/assets/wrestle/IMG_0859-1t1e48d.jpg?raw=true)

### Video

<iframe src="https://www.youtube.com/embed/OCsJXbZ-bSg" width="640" height="564" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
