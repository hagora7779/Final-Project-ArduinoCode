char inChar;
void setup()
{
  //MOTOR1
  pinMode(8,OUTPUT);//PWM
  pinMode(53,OUTPUT);//INT1
  pinMode(52,OUTPUT);//INT2
  //MOTOR2
  pinMode(13,OUTPUT);//PWM
  pinMode(31,OUTPUT);//INT1
  pinMode(33,OUTPUT);//INT2
  
  
  Serial.begin(9600);
}

void loop()
{
  
  if(Serial.available()){
    inChar = (char)Serial.read();
    Serial.println(inChar);
  }
  if(inChar == '1'){
    digitalWrite(8,HIGH);
    digitalWrite(53,HIGH);
    digitalWrite(52,LOW);
    Serial.println("Left Reward");
  }
    if(inChar == '2'){
   digitalWrite(8,HIGH);
    digitalWrite(52,HIGH);
    digitalWrite(53,LOW);
    Serial.println("Left Forward");
  }
    if(inChar == '3'){
    digitalWrite(13,HIGH);
    digitalWrite(31,HIGH);
    digitalWrite(33,LOW);
    Serial.println("Right Forward");
  }
    if(inChar == '4'){
    digitalWrite(13,HIGH);
    digitalWrite(33,HIGH);
    digitalWrite(31,LOW);
    Serial.println("Right Reward");
  }
      if(inChar == '0'){
    digitalWrite(8,LOW);
    digitalWrite(52,LOW);
    digitalWrite(53,LOW);
    digitalWrite(13,LOW);
    digitalWrite(31,LOW);
    digitalWrite(33,LOW);
    Serial.println("STOP");
  }
  
  
}
