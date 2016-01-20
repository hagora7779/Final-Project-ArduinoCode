void DriveForward()
{
  LeftForward();
  RightForward();
  delay(DelayDrive);
}

void DriveReward()
{
  LeftReward();
  RightReward();
  delay(DelayDrive);
}

void RotateLeft()
{
  LeftReward();
  RightForward();
  delay(DelayDrive);
}

void RotateRight()
{
  LeftForward();
  RightReward();
  delay(DelayDrive);

}

void LeftForward()
{
  digitalWrite(M1PWM,HIGH);
  digitalWrite(M1INIT1,LOW);
  digitalWrite(M1INIT2,HIGH);
}

void LeftReward()
{
  digitalWrite(M1PWM,HIGH);
  digitalWrite(M1INIT1,HIGH);
  digitalWrite(M1INIT2,LOW);
}

void RightForward()
{
  digitalWrite(M2PWM,HIGH);
  digitalWrite(M2INIT1,LOW);
  digitalWrite(M2INIT2,HIGH);
}

void RightReward()
{
  digitalWrite(M2PWM,HIGH);
  digitalWrite(M2INIT1,HIGH);
  digitalWrite(M2INIT2,LOW);
}

