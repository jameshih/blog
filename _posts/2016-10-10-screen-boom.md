---
title: ScreenBOOM 💣
image: https://shih.app/blog/assets/sboom/image.png
updated: 2016-10-10 10:10
---

<div class="media-center">
  <img src="https://shih.app/blog/assets/sboom/eagle.png" alt="ScreenBOOM eagle graphic" width="280">
</div>

## Big Brother Didn't Force You to Watch

The concept began with nine days of device-usage data that I collected at the start of the school year. I created a visualization that turned the time spent in each application into an atom: the more electrons it had, the longer I had used the application. I wanted to imagine what the atoms in our brain cells might look like if computers had not become such a large part of our working lives.
<br><br><br>
![Atom](https://shih.app/blog/assets/sboom/2.gif)
<br><br><br>

### ScreenBOOM

After visualizing the data, I wanted to build a system that could demonstrate the value of time. My first idea was a Tetris game controlled by three timers: one for horizontal movement, one for rotation, and one for speed. The player would adjust the timers to land each block in the desired position. However, a Tetris game did not communicate “time is important” strongly enough. That led me to ScreenBOOM. Instead of using time to control a game, an Arduino timer limits your computer session and automatically logs you out when time expires. Its lesson is simple: time matters, and ALWAYS save your files.

What would you do if you could use each electronic device for only a limited amount of time per day?

## Build Process

### First Prototype on a Breadboard

![p1](https://shih.app/blog/assets/sboom/p1.jpg)

### Second Prototype on Cardboard

![f1](https://shih.app/blog/assets/sboom/f1.jpg)
![f2](https://shih.app/blog/assets/sboom/f2.jpg)

### Testing the Second Prototype

Set time

![t1](https://shih.app/blog/assets/sboom/t1.jpg)

Counting down

![t2](https://shih.app/blog/assets/sboom/t2.jpg)

Game over

![t3](https://shih.app/blog/assets/sboom/t3.jpg)

## Code

### screenBoom.ino

```cpp
/*
  This is an arduino timer that will
  automatically log you out of your computer
            ***beware of unsaved files!!!***
  Screen Timer v2
  Author: James Shih
  references
  https://www.arduino.cc/en/Reference/KeyboardModifiers
  https://www.arduino.cc/en/Reference/KeyboardPress
*/
#include <LiquidCrystal.h>
#include <Keyboard.h>
#include <HID.h>
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);
char cmdKey = KEY_LEFT_GUI;
char shfKey = KEY_LEFT_SHIFT;
char rtnKey = KEY_RETURN;
int potPin = A0;
int photoPin = A1;
int val = 0;
int photoVal = 0;
int counter = 0;
int countNum = 0;
int caseState = 0;
unsigned long pTime = 0;

void setup() {
  Keyboard.begin();
  lcd.begin(16, 2);
  Serial.begin(9600);
}

void loop() {
  val = analogRead(potPin);
  photoVal = analogRead(photoPin);
  counter = map(val, 0, 1016, 0, 600); //map to 600 seconds
  long cTime = millis();
  Serial.print(photoVal);
  Serial.print("      ");
  Serial.print(counter);
  Serial.print("      ");
  Serial.print(countNum);
  Serial.println();

  switch (caseState) {
    case 0:
      lcd.setCursor(0, 0);
      lcd.print("Set Timer:");
      lcd.setCursor(0, 1);
      lcd.print("    ");
      lcd.print(counter);
      lcd.print("  seconds");
      lcd.print("    ");

      if (photoVal <= 300) {
        tone(9, 3000, 100); //set time sound
        countNum = counter;
        lcd.clear();
        caseState++;
      }
      break;

    case 1:
      lcd.setCursor(0, 0);
      lcd.print("Time Left:");
      lcd.setCursor(0, 1);
      if (cTime - pTime >= 1000 && countNum > 0) {
        pTime = cTime;
        tone(9, 2500, 100);
        countNum--;
        lcd.print("    ");
        lcd.print(countNum);
        lcd.print("  seconds");
        lcd.print("    ");
      } else if (countNum <= 0) {
        lcd.clear();
        caseState++;
      }
      break;

    case 2:
      lcd.setCursor(0, 0);
      lcd.print("     ");
      lcd.print("BOOM!");
      lcd.setCursor(0, 1);
      lcd.print("");
      //Boom sound effect
      tone(9, 400, 800);
      delay(400);
      tone(9, 200, 1000);
      //Logout Mac
      Keyboard.press(cmdKey);
      Keyboard.press(shfKey);
      Keyboard.press('q');
      delay(100);
      Keyboard.releaseAll();
      Keyboard.press(rtnKey);
      Keyboard.releaseAll();
      delay(6000);
      lcd.clear();
      caseState = 0;
      break;
  }
}
```

## Video

<iframe src="https://www.youtube.com/embed/pI1DQHCBCME" title="ScreenBOOM demo" width="640" height="564" allow="autoplay; fullscreen" allowfullscreen loading="lazy"></iframe>
