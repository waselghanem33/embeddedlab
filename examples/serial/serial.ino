void setup(){Serial.begin(9600);pinMode(13,OUTPUT);}
void loop(){Serial.println(analogRead(A0));digitalWrite(13,!digitalRead(13));delay(250);}
