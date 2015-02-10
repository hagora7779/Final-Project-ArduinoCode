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
  digitalWrite(8,HIGH);
  digitalWrite(52,HIGH);
  digitalWrite(53,LOW);
}

void LeftReward()
{
  digitalWrite(8,HIGH);
  digitalWrite(53,HIGH);
  digitalWrite(52,LOW);
}

void RightForward()
{
  digitalWrite(13,HIGH);
  digitalWrite(31,HIGH);
  digitalWrite(33,LOW);
}

void RightReward()
{
  digitalWrite(13,HIGH);
  digitalWrite(33,HIGH);
  digitalWrite(31,LOW);
}

