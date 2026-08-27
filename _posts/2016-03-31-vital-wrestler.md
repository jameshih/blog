---
title: Vital Wrestler 💨
image: https://shih.app/blog/assets/wrestle/vital-wrestling-18a9vqu-1024x511.png
updated: 2016-03-31 07:16
---

![Render](https://shih.app/blog/assets/wrestle/IMG_0864-2i0jvj7-1024x768.jpg)

## Don't Smoke. It's Bad for You.

Many of my friends were heavy smokers. I had been trying for a while to help them quit by explaining how badly smoking affects physical performance. They did not seem to take my advice seriously, so I decided to make a device that would help them feel the effects for themselves.

When I ran cross-country in high school, our coach brought us balloons for a monthly competition. Whoever popped a balloon first, or had the largest balloon when time ran out, earned the day off. We called it “vital wrestling.” I used that idea for my midterm and built an interactive wrestling machine in which two players compete by blowing into fans. Whoever pushes the other player’s hand down wins.
<br><br><br>
![Concept](https://shih.app/blog/assets/wrestle/vital-wrestling-18a9vqu-1024x511.png)
<br><br><br>

## Schematic Diagram

![SD](https://shih.app/blog/assets/wrestle/vital-wrestling-18aa1ba-1024x654.png)
<br><br>

## Code

### vital_wrestling.ino

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

### tone_and_display.ino

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

### timerCal.ino

```cpp
//transfer fan analog read data into LED fade level
void timerCal() {
  long cTime = millis();

  if (cTime - timer1 >= interval) { //debouncing
    if (val1 != 0) {
      diff1 = (int)(val1 / 10); //measure how hard player one blows
      fadeLevel1 += diff1; //apply addition
    }

    timer1 = cTime; //resetting timer1
  }

  if (cTime - timer2 >= interval) { //debouncing
    if (val2 != 0) {
      diff2 = (int)(val2 / 10); //measure how hard player two blows
      fadeLevel2 += diff2; //apply addition
    }

    timer2 = cTime; //resetting timer2
  }
}
```

### reset.ino

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

### logic.ino

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

### debug.ino

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

## Build Process

When I got the PC fans, I spent a long time searching for a guide to using them as analog input devices for an Arduino. I could not find one, so I connected their power lines to A10 and A1 and connected ground to ground. They worked like regular analog devices, producing larger values as I blew harder.

![pc](https://shih.app/blog/assets/wrestle/IMG_0838-1litvt6.jpg)

I figured one LED per player would not be bright enough for the gameplay, so I soldered three LEDs together to make a brighter indicator.

![leds](https://shih.app/blog/assets/wrestle/IMG_0844-1wpl8s7-e1459434477564-768x1024.jpg)

I added a buzzer for the start, victory, and restart sounds.

![buzz](https://shih.app/blog/assets/wrestle/IMG_0845-1vwv9zx-e1459434625388-768x1024.jpg)

### Laser-Cutting the Case

![1](https://shih.app/blog/assets/wrestle/IMG_0856-sx0b33.jpg)
![2](https://shih.app/blog/assets/wrestle/IMG_0857-10fy5kl.jpg)

### Putting Everything Together

![4](https://shih.app/blog/assets/wrestle/IMG_0858-20fc6mt.jpg)

![5](https://shih.app/blog/assets/wrestle/IMG_0859-1t1e48d.jpg)

## Video

<iframe src="https://www.youtube.com/embed/OCsJXbZ-bSg" title="Vital Wrestler demo" width="640" height="564" allow="autoplay; fullscreen" allowfullscreen loading="lazy"></iframe>
