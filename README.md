# EternalSTL - Seva Assistant Bots for Reminders
This project has been designed to assist with automating trivial and re-occuring seva reminders through the incorporation of [Telegram Bots](https://core.telegram.org/bots). Using this project requires 
1. Setting up a group chat/message room in Telegram or an individual chat with the `Seva Assistant` Bot (Username: @eSTL_seva_assistant_bot).
2. Contacting admin users of this project to setup the reminders for your needs.

In additional to sending out reminders, this project allows for basic tracking of task completion for reminders that do require repeat reminders in the event that the associated task(s) for a given reminder are not completed by analyzing the messages sent to the Bot.

### Getting Started
//TODO: This section needs to be documented.

### Functionality Details
Current functionality entails the following:
* Set a re-occuring weekly reminder with the following specifications -
  * Chat/Message room to send the reminder
  * Day of the week the reminder needs to be initiated
  * Number of task completion confirmations needed
  * Reminder type and description
* Reminders can be initiated via -
  * Message
  * Poll (currently to determine availability at a given date/time)
* Read user(s) messages to track confirmations of task completion and send additional daily reminders for up to 2 more days or until the task has been completed.

### Enhancements
- [ ] Incorporation of Gmail API
- [ ] Self-service client tool for setting up reminders  

