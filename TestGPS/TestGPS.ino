String GPSString = "";
boolean stringComplete = false;

void setup() {
  // initialize both serial ports:

  Serial3.begin(4800);
  Serial.begin(9600);
  GPSString.reserve(200);
  Serial.println("Hell Yeah");
}

void loop() {
  // read from port 1, send to port 0:
  if(stringComplete){
    Serial.print(GPSString);
    GPSString = "";
    stringComplete = false;
  }
}

void serialEvent3() {
  while (Serial3.available()) {
    // get the new byte:
    char inChar = (char)Serial3.read(); 
    // add it to the inputString:
    GPSString += inChar;
    // if the incoming character is a newline, set a flag
    // so the main loop can do something about it:
    if (inChar == '\n') {
      stringComplete = true;
    } 
  }
}
