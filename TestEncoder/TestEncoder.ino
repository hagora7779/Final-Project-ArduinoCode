volatile int r = 0;

void setup(){
  Serial.begin(9600);
  attachInterrupt(0,count, RISING);//Arduino MEGA pin2 intterupt 0
}

void loop(){
  Serial.println(r);
}

void count(){
  r++;
}
