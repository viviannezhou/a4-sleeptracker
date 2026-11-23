--Readme document for Vivianne Zhou, zhouvj@uci.edu, 44687700--

1. How many assignment points do you believe you completed (replace the *'s with your numbers)?

10/10
- 1/1 The ability to log overnight sleep
- 1/1 The ability to log sleepiness during the day
- 1/1 The ability to view these two categories of logged data
- 2/2 Either using a native device resource or backing up logged data
- 2/2 Following good principles of mobile design
- 2/2 Creating a compelling app
- 1/1 A readme and demo video which explains how these features were implemented and their design rationale


2. How long, in hours, did it take you to complete this assignment?

About 9-10 hours, including setup.


3. What online resources did you consult when completing this assignment? (list specific URLs)

- Lecture 13 slides (Ionic components, modals, toasts), Lecture 14 slides (mobile design principles), and Lecture 16 slides (databases)
- Professor's W8_L2_Databases demo (I followed its StorageService setup): https://github.com/travislindenreid/INF33-Demos
- Ionic Storage: https://github.com/ionic-team/ionic-storage
- Ionic modal and datetime: https://ionicframework.com/docs/api/modal, https://ionicframework.com/docs/api/datetime
- Ionic toast: https://ionicframework.com/docs/api/toast
- Ionic sliding items and segments: https://ionicframework.com/docs/api/item-sliding, https://ionicframework.com/docs/api/segment
- Ionic textarea: https://ionicframework.com/docs/api/textarea
- Ionic tabs: https://ionicframework.com/docs/api/tabs
- Ionic theming colors: https://ionicframework.com/docs/theming/colors
- Claude (Anthropic): I used Claude as a tutor. For each step, it explained the Ionic and Angular concepts and gave me skeleton code with some blanks, and I typed up the code myself, filled in the blanks (like the delete and restore functions, the check-in filter, the summary string format, and the note fields for sleepiness logs), then checked my work with it after. It also helped me debug errors, like running npm install in the wrong folder, a typo'd function name, future dates being allowed in the date pickers, and restoring my project from GitHub when my local folder disappeared. It also helped me pick the pastel color values for my theme.
- GitHub Copilot: Copilot sometimes suggested code while I was typing. I only used suggestions after checking that they made sense and were correct, and I edited or removed them when they weren't (like an openLogSleep function that got tangled up).


4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?

None, I worked alone.


5. Is there anything special we need to know in order to run your code?

Nothing special. The app starts empty, so log a night or a check-in to see data.


--Aim for no more than two sentences for each of the following questions.--


6. Did you design your app with a particular type of user in mind? If so, whom?

I designed Moonlog for college students, whose sleep changes a lot with late-night studying, early lectures, and work. The note placeholders use examples like "up late studying for a midterm" and "after 8am lecture, had coffee" so it feels made for them.


7. Did you design your app specifically for iOS or Android, or both?

I designed it for iOS and forced Ionic's iOS mode, so it uses iOS conventions like a bottom tab bar, Cancel on the left and Save on the right in modals, and swipe to delete.


8. How can a person log overnight sleep in your app? Why did you choose to support logging overnight sleep in this way?

On the Today page, they tap "Log last night," which opens a modal with bedtime and wake-up pickers that already default to 11pm last night and 7am today, plus an optional note. I chose defaults close to a typical night so most people only need small changes, and Save stays disabled until the times make sense (wake-up after bedtime, under 24 hours, and not in the future).


9. How can a person log sleepiness during the day in your app? Why did you choose to support logging sleepiness in this way?

On the Today page, they tap "Check in sleepiness," which opens a modal showing all 7 Stanford Sleepiness Scale levels with their descriptions, a time that defaults to now, and an optional note. Showing every description means nobody has to remember what each number means, and nothing is picked at first so they have to choose on purpose.


10. How can a person view the data they logged in your app? Why did you choose to support viewing logged data in this way?

The Today page shows last night's sleep and today's check-ins right away, and the History tab lists every log newest first with a filter for All, Sleep, or Sleepiness. Today answers "how am I doing right now" at a glance, while History is for looking back and cleaning up mistakes.


11. Which feature choose--using a native device resource, backing up logged data, or both?

Backing up logged data.


12. If you used a native device resource, what feature did you add? How does this feature change the app's experience for a user?

I didn't use a native device resource.


13. If you backed up logged data, where does it back up to?

It saves to the device using Ionic Storage, which uses IndexedDB (with localStorage as a backup), following the professor's Lecture 16 demo. Every log, including notes, is saved after each change and loaded when the app opens, so nothing is lost after a refresh or closing the app.


14. How does your app implement or follow principles of good mobile design?

Useful initial view: Today opens to last night's sleep and today's check-ins, with clear empty states and buttons for new users. Uh-oh button: every modal has Cancel, and deleting a log shows a toast with Undo. Error prevention: Save is disabled until input is valid, the pickers can't go into the future, and notes are capped at 100 characters. Platform conventions: it follows iOS patterns like the bottom tab bar, modals for single tasks, Cancel/Save placement, and swipe to delete.

