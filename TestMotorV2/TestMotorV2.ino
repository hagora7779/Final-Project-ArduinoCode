char inChar;
void setup()
{
  //MOTOR1
  pinMode(5,OUTPUT);//PWM
  pinMode(53,OUTPUT);//INT1
  pinMode(52,OUTPUT);//INT2
  //MOTOR2
  pinMode(4,OUTPUT);//PWM
  pinMode(51,OUTPUT);//INT1
  pinMode(50,OUTPUT);//INT2
  
  
  //Serial.begin(9600);
}

void loop()
{
    digitalWrite(4,HIGH);
    digitalWrite(51,HIGH);
    digitalWrite(50,LOW);  
    digitalWrite(5,HIGH);
    digitalWrite(52,HIGH);
    digitalWrite(53,LOW); 
    delay(5000);
}
