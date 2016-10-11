# Server

Contains projects that run on a nodejs server.

## FirebaseSave - Save to Firebase

Before you are allowed access to the firebase Database, you need to obtain a key via the webconsole, which is in a JSON format.
Please contact one of the group members for a key or direct access to the account depending on priviliges.
This just listens to post requests sent to it and with the transactions in the body it updates firebase.

---
## PostSender

Contains a nodejs module to send HTTP post requests (Http tools). Requires the "request" nodejs module.

---
## app3

Updates transactions received from the rasberry pi's with relevant fields before it can be added to the firebase database.
(Feel free to add some more stuff to this)
