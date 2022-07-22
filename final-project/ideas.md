# [Replace this with your project title]

## Hello! My name is Sania Khaja and I am a rising sophomore studying Computer Science at the University of Illinois at Chicago. Currently, I am 19.

## The Premise

## Tools used

## Step by step (with code snippets)

## Challenges + lessons learned

## Thanks and Acknowledgements

Project Name:
When To Leave For Event App

Project Idea: 
Will notify user via email when to leave their home based on traffic data
for any events, location and time that are booked on their google calender. 
If time permits, will incorparoate weather info into leaving time calculations

APIs:
- Google Calander API - User API Key
- Traffic API (Google Maps) - Application API Key
- SendGrid Azure
- (time permits) Weather API - Application API Key

Will Utilize:
- VS Code
- Azure Function
- Javascript/HTML
- SendGrid Azure
- APIs above
- Need API endPoints can have mutliple endpoints (Azure functions)
- CosmosDB
- timer functions thtat checks for any upcoing evenys. database
- blob storage

handlerbsrs js
vue.js
bootstrap for css
tailwind
DrawKit
splash
react
app.diagrams.net

Will need web UI for user set preferences
Preferences and Data:
- How much time to leave for parking and walking to venue
- Home location
- Email ID
- How much time to notify before time to leave (will limit this to at most an half an hour before for more accuracy for time to leave)
- Connecting to their google calender

How to Start:
1. Start with preference and storing that data (storing email ID, home location, time for parking, notification time)
2. Get the Google Calender aspect to work. User has to be able to sign into their google calender and I have to be able to access that data. Will have to work with Google Calender API
3. Import google maps API to use for calculation of when to leave home
4. Check to see if destination location exists and if so then calculate time to leave based on current traffic (will need current time and destination name)
5. Send user when to leave info through email using SendGrid

If Time permits:
 - import weather API and use for calculations
 - (if time permits. Can also leave this as a future idea for improvement to show web app can grow and improve). Allow user to store how much time it took them to reach destination vs how much time we gave them (allows for improvement in calculation for future). (can automatically calculate how much time was given). 
