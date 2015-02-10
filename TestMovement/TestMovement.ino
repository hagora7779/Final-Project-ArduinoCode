byte DelayDrive=1;
String inputString = "";         // a string to hold incoming data
boolean stringComplete = false;  // whether the string is complete

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
  inputString.reserve(200);
}

void loop()
{

  if (stringComplete) {
    Serial.println(inputString); 
    
    if(inputString == "w"){
      DriveForward();
    }
    if(inputString == "s"){
      DriveReward();
    }
    if(inputString == "a"){
      RotateLeft();
    }
    if(inputString == "d"){
      RotateRight();
    }
    else {
      digitalWrite(8,LOW);
      digitalWrite(52,LOW);
      digitalWrite(53,LOW);
      digitalWrite(13,LOW);
      digitalWrite(31,LOW);
      digitalWrite(33,LOW);
      Serial.println("STOP");
    }
    
    //clear the string;
    inputString = "";
    stringComplete = false;
  }
}



