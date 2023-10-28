---
title: ScreenBOOM 💣
url: https://shih.app/blog/screen-boom
updated: 2016-10-10 10:10
---

<p align="center">
<img src="https://shih.app/blog/assets/sboom/eagle.png" width="280">
</p>

### Big Brother did't force you to watch

My concept for this project started from the electronic usage data that I had collected for nine days at the beginning of this school year. I created a visualization that would turn my electronic usage time of each application into an atom, the more the electrons, the longer the electronic usage duration is. By making this visualization, my intension was to imagine how would the atoms of our brain cells look like, if computers hadn’t become a majority of our working routine.
<br><br><br>
![Atom](https://shih.app/blog/assets/sboom/2.gif)
<br><br><br>

#### ScreenBOOM

After creating a visualization for the data I had collected, I wanted to create a system that can evaluate the importance of time and present that to the public. My first idea was to create a tetris game that is controlled by three timers, the first timer controls left and right movement of the tetris block, the second timer controls turning of the tetris block, and the third timer controls the speed of the tetris block, the player would have to adjust the timers to land a tetris block at his or her desired location. However, I realized that simply making a tetris game could not fully demonstrate the concept, “time is important,” well. This is when I came up with the idea of Screen BOOM. Rather than using time to control a tetris game, I am going use a timer to limit one’s computer usage. I will create an Arduino device that will automatically logout the user when the timer is up . The purpose of this Arduino timer is to emphasis the importance of time and ALWAYS save your files at all time.

What will you do if you can only use any electronic gadget for a limited amount of time per day?

### Build Process

#### First prototype on a breadboard

![p1](https://shih.app/blog/assets/sboom/p1.jpg)

#### Second prototype on cardboard

![f1](https://shih.app/blog/assets/sboom/f1.jpg)
![f2](https://shih.app/blog/assets/sboom/f2.jpg)

#### Testing out the second prototype

Set time

![t1](https://shih.app/blog/assets/sboom/t1.jpg)

Counting down

![t2](https://shih.app/blog/assets/sboom/t2.jpg)

Game over

![t3](https://shih.app/blog/assets/sboom/t3.jpg)

### Code

#### screenBoom.ino

```cpp
/*
  This is an arduino timer that will
  automatically log you out of your computer
            ***beware of unsaved files!!!***
  Screen Timer v2
  Aurthor: James Shih
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

### Video

<iframe src="https://www.youtube.com/embed/pI1DQHCBCME" width="640" height="564" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
