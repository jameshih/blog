---
title: Mini Virtual Pet 🐣
url: https://shih.app/blog/mini-virtual-pet
updated: 2015-12-01 16:23
---

<center>

<img src="https://media.giphy.com/media/yn9OTbe6P9Tgs/giphy.gif" width="500">

</center>

### No space for a pet, why not a virtual pet

My concept for the project is to create a simple virtual pet similar to the Tamagotchi. The pet has a happiness and a health bar, which the values will constantly drop every 30 seconds. The user must keep feeding and playing with the pet or else the pet will die once the health bar get to zero.
<br><br><br>

### Schematic Diagram

![SD](https://shih.app/blog/assets/vpet/schematic-2i7sttu-1024x733.png)
<br><br>

### Code

#### virtual_pet_v2.ino

```cpp
#include "SPI.h"
#include "TFT_22_ILI9225.h"
#include <TFT.h>

#define TFT_RST 8
#define TFT_RS  9
#define TFT_CS  10  // SS
#define TFT_SDI 11  // MOSI
#define TFT_CLK 13  // SCK
#define TFT_LED 0

#define BUTTON_LED   6
//#define speaker      5
#define POT_LED      3
#define BUTTON       12
#define POT          2

int buttonState;
int potState;
int rgb;
int health = 99;
int happy = 99;
int caseState = 0;
int counter;
int counterState;
String outPutHealth;
String outPutPot;
String outPutHappy;

TFT_22_ILI9225 tft = TFT_22_ILI9225(TFT_RST, TFT_RS, TFT_CS, TFT_LED);

void setup() {

  pinMode(BUTTON_LED, OUTPUT);
  pinMode(POT_LED, OUTPUT);
  pinMode(BUTTON, INPUT);

  tft.begin();
  tft.setOrientation(2);
  tft.setFont(Terminal6x8);
  //tft.drawText(10, 10, "hello!");
  Serial.begin(9600);

}

void loop() {

  buttonState = digitalRead(BUTTON);
  potState = analogRead(POT);
  potState = map(potState, 0, 1023, 0, 9);
  interface();
  displayInfo();
  serialPort();
  digitalWrite(BUTTON_LED, HIGH);
  digitalWrite(POT_LED, HIGH);
  //tone(speaker, 0);
}
```

#### display.ino

```cpp
\void displayInfo() {

  String outPutPot = String(potState, DEC);
  String outPutHealth = String(health, DEC);
  String outPutHappy = String(happy, DEC);

  //counter logic
  switch (counterState) {
    case 0:
      counter++;
      if (health <= 0) counterState = 2;
      if (health <= 0) counterState = 2;
      if (counter == 5) counterState = 1;
      break;

    case 1:
      health -= 5;
      if (health <= 0) counterState = 2;
      if (health <= 0) counterState = 2;
      happy -= 2;
      counter = 0;
      if (counter == 0) counterState = 0;
      break;

    case 2:
      counter = 0;
      caseState = 3;
  }

  //control graphic
  if (health <= 0) {
    dieGraphic();
  } else {
    gameGraphic();
  }

}



void serialPort() {
  Serial.print("Button State = \t");
  Serial.print(buttonState);
  Serial.print("\t Pot State = \t");
  Serial.print(potState);
  Serial.print("\t counter = \t");
  Serial.print(counter);
  Serial.print("\t counterState = \t");
  Serial.print(counterState);
  Serial.println();
}
```

#### graphic.ino

```cpp
void gameGraphic() {
  String outPutPot = String(potState, DEC);
  String outPutHealth = String(health, DEC);
  String outPutHappy = String(happy, DEC);

  if (potState <= 4) {
    if (happy <= 70) {
      rgb = COLOR_RED;
    } else {
      rgb = COLOR_YELLOW;
    }
  } else {
    if (happy <= 70) {
      rgb = COLOR_RED;
    } else {
      rgb = COLOR_GREEN;
    }
  }

  tft.fillCircle(80, 100, 30, rgb);
  tft.fillCircle(70, 100, 5, COLOR_BLACK);
  tft.fillCircle(70, 100, 1, COLOR_WHITE);
  tft.fillCircle(90, 100, 5, COLOR_BLACK);
  tft.fillCircle(90, 100, 1, COLOR_WHITE);
  if(health <= 60){
    tft.drawText(ILI9225_LCD_WIDTH / 11, ILI9225_LCD_HEIGHT / 1.1, "Health: " + outPutHealth, COLOR_RED);
  }else{
  tft.drawText(ILI9225_LCD_WIDTH / 11, ILI9225_LCD_HEIGHT / 1.1, "Health: " + outPutHealth, COLOR_WHITE);
  }
  tft.drawText(ILI9225_LCD_WIDTH / 1.8, ILI9225_LCD_HEIGHT / 1.1, "Happy: " + outPutHappy);
}



void dieGraphic() {
  rgb = COLOR_GRAY;
  tft.fillCircle(80, 100, 30, rgb);
  tft.drawText(ILI9225_LCD_WIDTH / 3.3, ILI9225_LCD_HEIGHT / 1.4, "I'm dead :(");
  tft.drawText(ILI9225_LCD_WIDTH / 1.8, ILI9225_LCD_HEIGHT / 1.1, "Happy: 00  ", COLOR_GRAY);
  tft.drawText(ILI9225_LCD_WIDTH / 11, ILI9225_LCD_HEIGHT / 1.1, "Health: 00", COLOR_GRAY);

}


void resetGame() {
  tft.clear();
  health = 99;
  happy = 99;
  caseState = 0;
  counterState = 0;
}
```

#### interface.ino

```cpp
void interface() {


  switch (caseState) {
    case 0:
      if (potState == 9) caseState = 0;

      if (potState >= 2 ) {
        tft.drawRectangle(20, 20, 70, 40, COLOR_BLACK);
        tft.drawRectangle(85, 20, 135, 40, COLOR_WHITE);
        if (buttonState == HIGH) {
          caseState = 2;
        }
      } else if (potState == 0) {
        tft.drawRectangle(20, 20, 70, 40, COLOR_WHITE);
        tft.drawRectangle(85, 20, 135, 40, COLOR_BLACK);
        if (buttonState == HIGH) {
          caseState = 1;
        }
      }

      tft.drawText(ILI9225_LCD_WIDTH / 6, ILI9225_LCD_HEIGHT / 8, "Feed ");
      tft.drawText(ILI9225_LCD_WIDTH / 1.8, ILI9225_LCD_HEIGHT / 8, "Play");
      break;

    case 1:

      if (potState == 9) caseState = 0;

      if (potState >= 2) {
        tft.drawRectangle(85, 20, 135, 40, COLOR_WHITE);
        tft.drawRectangle(20, 20, 70, 40, COLOR_BLACK);

        if (buttonState == HIGH && health < 99) {

          if (health <= 87) health += 10;
          if (health > 87) health += 1;
        }else if(health >= 99){
          health = 99;
        }

      } else if (potState == 0) {
        tft.drawRectangle(85, 20, 135, 40, COLOR_BLACK);
        tft.drawRectangle(20, 20, 70, 40, COLOR_WHITE);

        if (buttonState == HIGH && health < 99) {
          health += 1;
        } else if (health >= 99) {
          health == 99;
        }
      }


      tft.drawText(ILI9225_LCD_WIDTH / 6, ILI9225_LCD_HEIGHT / 8, "Apple");
      tft.drawText(ILI9225_LCD_WIDTH / 1.8, ILI9225_LCD_HEIGHT / 8, "Milk");
      break;



    case 2:
      if (potState == 9) caseState = 0;

      if (potState >= 2 ) {
        tft.drawRectangle(20, 20, 70, 40, COLOR_BLACK);
        tft.drawRectangle(85, 20, 135, 40, COLOR_WHITE);

        if (buttonState == HIGH && happy < 99) {
          if (happy <= 92) happy += 5;
          if (happy > 92) happy += 1;
        }else if(happy >= 99){
          happy = 99;
        }

      } else if (potState == 0) {
        tft.drawRectangle(20, 20, 70, 40, COLOR_WHITE);
        tft.drawRectangle(85, 20, 135, 40, COLOR_BLACK);

        if (buttonState == HIGH && happy < 99) {
          if (happy <= 96) happy += 2;
          if (happy > 96) happy += 1;
        }else if(happy >= 99){
          happy = 99;
        }
      }


      tft.drawText(ILI9225_LCD_WIDTH / 6, ILI9225_LCD_HEIGHT / 8, "Fetch");
      tft.drawText(ILI9225_LCD_WIDTH / 1.8, ILI9225_LCD_HEIGHT / 8, "Pet ");

      break;

    case 3:
      tft.drawText(ILI9225_LCD_WIDTH / 6, ILI9225_LCD_HEIGHT / 8, "RESTART:");
      tft.drawText(ILI9225_LCD_WIDTH / 1.8, ILI9225_LCD_HEIGHT / 8, "GO! ");
      tft.drawRectangle(20, 20, 70, 40, COLOR_BLACK);
      tft.drawRectangle(85, 20, 135, 40, COLOR_WHITE);
      if (buttonState == HIGH) {
        resetGame();
      }
      break;

  }
}
```

### Rendering

Low Health Warning

![1](https://shih.app/blog/assets/vpet/IMG_2548-17kba5z-e1448962969240.jpg)

Pet is not happy (need to play with it more)

![2](https://shih.app/blog/assets/vpet/IMG_2549-1mayht9-e1448962925118.jpg)

Pet died

![3](https://shih.app/blog/assets/vpet/IMG_0211-1viq6n4-e1448962987425.jpg)

### Video

<iframe src="https://www.youtube.com/embed/HkHL1tuW8uY
" width="640" height="564" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
