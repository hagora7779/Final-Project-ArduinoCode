byte DelayDrive=1;
String inputString = "";         // a string to hold incoming data
boolean stringComplete = false;  // whether the string is complete
byte M1PWM = 5;
byte M1INIT1 = 53;
byte M1INIT2 = 52;
byte M2PWM = 4;
byte M2INIT1 = 51;
byte M2INIT2 = 50;
void setup()
{
  delay(5000);
  //MOTOR1
  pinMode(M1PWM,OUTPUT);//PWM
  pinMode(M1INIT1,OUTPUT);//INT1
  pinMode(M1INIT2,OUTPUT);//INT2
  //MOTOR2
  pinMode(M2PWM,OUTPUT);//PWM
  pinMode(M2INIT1,OUTPUT);//INT1
  pinMode(M2INIT2,OUTPUT);//INT2
  Serial.begin(9600);
  Serial.println("START");
  inputString.reserve(200);
}

void loop()
{

  if (stringComplete) {
    Serial.println(inputString); 
    
    if(inputString.indexOf('w') != -1){
      DriveForward();
      delay(1);
      Serial.println("FORWARD");
    }
    else if(inputString.indexOf('s') != -1){
      DriveReward();
      delay(1);
      Serial.println("REWARD");
    }
    else if(inputString.indexOf('a') != -1){
      RotateLeft();
      delay(1);
      Serial.println("RotateLeft");
    }
    else if(inputString.indexOf('d') !=  -1){
//      RotateRight();
//      delay(1);
//      Serial.println("RotateRight");
      digitalWrite(M1PWM,LOW);
      digitalWrite(M1INIT1,LOW);
      digitalWrite(M1INIT2,LOW);
      digitalWrite(M2PWM,LOW);
      digitalWrite(M2INIT1,LOW);
      digitalWrite(M2INIT2,LOW);
      Serial.println("STOP");
          Serial.println(inputString);
    }
    else if(inputString == "1\n"){
      LeftForward();
      delay(1);
    }
    else if(inputString == "2\n"){
      LeftReward();
      delay(1);      
    }
    else if(inputString == "3\n"){
      RightForward();
      delay(1);      
    }
    else if(inputString == "4\n"){
      RightReward();
      delay(1);      
    }
    else {
      digitalWrite(M1PWM,LOW);
      digitalWrite(M1INIT1,LOW);
      digitalWrite(M1INIT2,LOW);
      digitalWrite(M2PWM,LOW);
      digitalWrite(M2INIT1,LOW);
      digitalWrite(M2INIT2,LOW);
      Serial.println("STOP");
          Serial.println(inputString);          
    }
    
    //clear the string;
    inputString = "";
    stringComplete = false;
  }
}



