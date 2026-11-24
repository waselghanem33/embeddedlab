volatile bool event=false;
void hit(){event=true;}
void setup(){pinMode(2,INPUT_PULLUP);pinMode(9,OUTPUT);attachInterrupt(digitalPinToInterrupt(2),hit,FALLING);analogWrite(9,64);}
void loop(){if(event){event=false;analogWrite(9,192);}}
