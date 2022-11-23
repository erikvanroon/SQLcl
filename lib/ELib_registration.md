### Library

Filename				: ELib_registration.js

Library name		: registration



### Public functions

| Function                                                     | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [**registration.runCommand**](#registration.runCommand)      | Either run the functionality of the script as is, or register the script as a custom command |
| [**registration.unregisterCommand**](#registration.unregisterCommand) | Unregister a custom command                                  |



### Library Description

This library contains the functionality needed to register a JavaScript script as a custom command in SQLcl, and to unregister a custom command from SQLcl.

Start by building your scripts in the usual way.
To be able to register it as a custom command, now put all of this script code except the loading of libraries inside a function, for example called scriptCode.


Then at the top of the script load this library and at the bottom, after the scriptCode function, execute the runCommand function from this library and pass to it the function expression for the scriptCode function.

Example

If your script would be reoresented by

```
"use strict";

/////////////////////
// All the code of the original script
/////////////////////
```

It would be altered to be

```
"use strict";

load ("d:\mylibs\ELib_registration.js")

function scriptCode () {
  /////////////////////
  // All the code of the original script
  /////////////////////
}

registration.runCommand (scriptCode);
```

Note that there are no brackets after "scriptCode" in the execution of runCommand.
So, the "scriptCode" function expression is passed to the runCommand function, rather than the result of the execution of "scriptCode".

If a "beginEvent" and/or "EndEvent" are needed for this custom command, create functions for them with the functionality they should have, and pass those function expressions to the second and third parameters, like this

```
registration.runCommand (scriptCode, beginEventCode, endEventCode);
```

###### Running the script

Now that the script is set up like described above, it can still be run as usual.
So, if the script is executed the way we would normally execute a script from SQLcl

```
script d:\myscripts\altered_script.js param1 param2 param3
```

It would still execute as it did before adding the functionality from this library.

###### So, what's the point?

Well, now we can also chose to execute the script with special parameter "-cmdReg" followed by a command name that we choose.
Then the script will not be executed, but instead registered as a custom command with the chosen name.

This means that if we execute the script like this

```
script d:\myscripts\altered_script.js -cmdReg runme
```

we will get feedback on screen like

```
Trying to unregister Command runme in case it has been registered before....
Command runme was not found, hence could not be UNRegistered
Command runme has been registered
```

If the command "runme" has been registered before, the second line will be

```
Command runme has been UNRegistered
```

After this we can use the "runme" command instead of the "script d:\myscripts\altered_script.js" command like this

```
runme param1 param2 param3
```

having the same effect as running the script.

**Note** that if no name is supplied after -cmdReg, the script will be registered with the default name "**cctest**".
This can be useful while developing a new version of a command and in the meantime have the original version at hand as well.



###### Automatic UNregistration

Due to how registration of listeners for the custom commands work in SQLcl, if the custom command has already been registered before in the SQLcl session, we need to UNregister the custom command before registering it again in a new version. If not, the command is simply registered a second (third, fourth,...) time, but only the first registered (oldest) version will be available.
Unregistering is hard because by default the listeners can not be identified as belonging to a certain command.
**Note**, that the registration functionality completely takes care of all of this, so when registering a script as a custom command using -cmdReg, any registrations of the same command name will first be UNregistered before registering the command.



###### Amount of feedback

As we've seen above, when registering a custom command we get 3 lines of feedback.
Sometimes this may be overkill. Like when registering several custom commands in our login.sql or startup.sql.
In that case maybe we only want a oneliner for each command reporting successful registration, or maybe even no feedback at all.

For these cases there are three more 'special' parameters of which one can be used when using the -cmdReg parameter to register a command
These special parameters are

| Parameter | Effect                                                       |
| --------- | ------------------------------------------------------------ |
| -all      | This is the default, so adding it will have the same effect as not adding any of these three parameters.<br />This will produce complete feedback as we've seen above. |
| -minimal  | This will produce only the "command xxx has been registered" line as feedback |
| -silent   | This will suppress all feedback from the registration of the command. |

Be aware that if any errors occur during registration, these error messages will **not** be suppressed, regardless of the feedback setting that was chosen. 

Example

```
script d:\myscripts\altered_script.js -cmdReg runme -minimal
```

will only produce this feedback

```
Command runme has been registered
```



###### Manually unregistering a custom command

In general, there really is no need to manually unregister a custom command.
If we want to register a new version, the registration functionality automatically takes care of that.
If we just don't need the command anymore, just remove the registration line from your login.sql or startup.sql and next time you start SQLcl it will be gone.

But the functionality is there in the library, and no doubt there will be somebody somewhere who has a good use case for manually unregistering, so why not expose the functionality.

So, if you want to be able to manually unregister, create a simple script that loads this library and performs

```
if (args.length == 1) {
    registration.unregisterCommand ();
} else {
    registration.unregisterCommand (args[1]);
}
```

By running this script and passing it the name of a custom command, that command will be unregisterd.
If the script is run without passing it the name of a custom command, the custom command with the default name "cctest" will be unregistered.

Example, if the script has been saved as "d:\myscripts\unreg.js"
then

```
script d:\myscripts\unreg.js runme
```

 will unregister the "runme" custom command.

```
script d:\myscripts\unreg.js
```

will unregister the "cctest" custom command.



### Function Description

##### registration.runCommand

| Type       | Name                                            |
| ---------- | ----------------------------------------------- |
| Parameters | functionToExecute<br />beginEvent<br />endEvent |
| Returns    | [nothing]                                       |

This function handles what needs to be done when the script is executed.

The parameters each receive a function expression (or undefined. they are optional).
functionToExecute is the scriptCode function of the script.
beginEvent and endEvent are the functions in the script that implement the beginEvent, respectively the endEvent functionality for the custom command, if needed.

If the script is executed without parameters, or with 'normal' parameter values, this function will run the function that was passed to the functionToExecute parameter. 
Effectively running the script as it would normally be executed, had it not loaded this library and not implemented the runCommand function.

If the script is executed with -cmdReg as first parameter this function will register the script as a custom command with the name that follows the -cmdReg parameter. If no name is supplied the script will be registered with the default name "cctest"

For full description see section [**Library Description**](#Library-Description) above.



Example

```javascript
registration.runCommand (scriptCode);

//or

registration.runCommand (scriptCode, beginEventCode, endEventCode);
```



##### registration.unregisterCommand

| In/Out     | What      |
| ---------- | --------- |
| Parameters | cmdName   |
| Returns    | [nothing] |

This function will unregister a custom command with the name that is passed to the parameter.
If no custom command by that name has been registered, no commands are unregistered.
If no name is passed to the parameter, the command with the default name "cctest" is unregistered, if it exists.

For full description see section Library Description [**Library Description**](#Library-Description) above.

