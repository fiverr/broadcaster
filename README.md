#Broadcaster

![Broadcaster](http://i.imgur.com/74KJ7Gh.png "Broadcaster")

An Express app to create and manage "Release Notes" for internal company distribution.
The flow as suggested by the app is that Product Manager/Senior Dev populates the various field forms and sends it across.
This should basically act as a madietion between the somewhat technical comments in the source control, to the more domain oriented comments the wider internal audience should see.
Once ready, Release notes are than sent to a defined mailing list.
In addition a "list" view is available to go over past records.


##Installtion 

```sh
cp ./configuration/setup.cfg.json_template ./configuration/setup.cfg.json
```

Update the configuration file based on the examples provided.


Start the server:

```sh
node app.js
```

Enjoy!