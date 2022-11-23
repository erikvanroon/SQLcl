# Scripts
The scripts in this directory extend the functionality of SQLcl.
They load and use libraries from the lib directory in this repository.

### Preparing to run the scripts

To use one of these script

- Download the libraries the script needs
  See the "load" command(s) near the start of the script code
  Be aware that a library may in turn load other libraries, so then you will need those too
- Put them in some (any) directory
- Create an environment variable named SQLCL_JS_LIB containing the location of the libraries
- Download the script and run it.

### Running the scripts

##### Executing directly

The scripts can simply be run from SQLcl using the "script" keyword followed by the (path)name of the script and any parameter values that need to be passed to it.

Example

```javascript
script d:\myscripts\file2bind.js
```

Will display the help text of the file2bind script, and

```
script d:\myscripts\file2bind.js d:\myfile.txt mybind
```

Will put the contents of file d:\\myfile.txt into the bindvariable :mybind.


##### Registering as custom command

The scripts can also be run with special parameters, which will not execute the functionality of the script but will create a custom command that henceforth can be used to execute the functionality.

For a detailed description of the registration functionality, see the *.md file for the ELib_registration library.

Example
Running this

```
script d:\myscripts\file2bind.js -cmdReg f2b
```

Will register the functionality as custom command "f2b".
Including this in your login.sql or startup.sql will ensure you will always have this command available
Any name for the command can be chosen. 
If you choose a built in command however, the custom command will be registered, but can not be executed because the built in takes precedence.

After running the above we can execute the functionality by using the chosen name for the custom command like this

```
f2b d:\myfile.txt mybind
```



When the custom command is registered using the -cmdReg parameter some feedback will be printed on screen.
Assuming no errors are encountered this will look similar to this

```
Trying to unregister Command f2b in case it has been registered before....
Command f2b was not found, hence could not be UNRegistered
Command f2b has been registered
```

Telling you f2b was not registered before in this SQLcl session, so there's no need to unregister the old one before regsitering this one, and then tells you the f2b command was succesfully registered.
If the command **has** been registered before in this SQLcl session, the output would look similar to this

```
Trying to unregister Command f2b in case it has been registered before....
Command f2b has been UNRegistered
Command f2b has been registered
```

To reduce the amount of feedback, for example if you register a list of commands in your login.sql, an extra parameter can be added to the end of the registration command.

The choices you can make are

```
-all         = The default, will produce the feedback as shown above
-minimal     = Will only produce the message that the command was succesfully registered
-silent      = Will not give feedback
```

Errors will be shown, no matter what setting is chosen for the amount of feedback.

So running

```
script d:\myscripts\file2bind.js -cmdReg f2b -minimal
```

Will only produce the output

```
Command f2b has been registered
```





### NOTE:

Be aware that I use GraalVM rather than JDK.
This means that these scripts and libraries will probably not work if you're running your SQLcl with a JDK instead of GraalVM.
I've noticed several things that simply don't work with Nashorn in the JDK, among which is declaring a const.

Nashorn has been removed as of Java 15. 
So if you want to continue running JavaScript in SQLcl GraalVM is maybe the best choice anyway.

