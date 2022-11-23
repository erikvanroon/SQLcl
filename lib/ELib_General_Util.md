### Library

Filename				: ELib_General_Util.js

Library name		: utl



### Public functions

| Function                                          | Description                                                  |
| ------------------------------------------------- | ------------------------------------------------------------ |
| [**utl.write**](#utl.write)                       | Writes text to screen without an end-of-line                 |
| [**utl.writeLine**](#utl.writeLine)               | Writes text and an end-of-line to screen                     |
| [**utl.runStmnt**](#utl.runStmnt)                 | Will make SQLcl run the statement that is passed in the parameter |
| [**utl.currentOS**](#utl.currentOS)               | Returns three boolean flags, for Windows/Mac/Linux, true only for the one reflecting current OS |
| [**utl.dirSeparator**](#utl.dirSeparator)         | Returns the directory separator (slash-backslash) for this operating system |
| [**utl.settingsPathName**](#utl.settingsPathName) | Returns the path to the SQLcl settings                       |
| [**utl.ltrim**](#utl.ltrim)                       | Trims a given character from the left of a string            |
| [**utl.rtrim**](#utl.rtrim)                       | Trims a given character from the right of a string           |
| [**utl.trim**](#utl.trim)                         | Trims a given character from both the left and the right of a string |
| [**utl.coalesce**](#utl.coalesce)                 | Returns the first value in the list of (max 100) parameters that is neither NULL nor UNDEFINED nor EMPTY STRING. If none of the values satisfy that criterion, null is returned. |



### Library Description

This library contains all sorts of general purpose utility functions



### Function Description

##### utl.write

| Type       | Name      |
| ---------- | --------- |
| Parameters | line      |
| Returns    | [nothing] |

This function is nothing more than just the standard **ctx.write**.
The only reason it's in the library is consistency.
The writeLine function (see below) is implemented here, so to avoid having "utl.writeline" on one hand and "ctx.write" on the other, the write function is also included here.

The function takes one argument which is then printed on screen without an end-of-line (\n)

Example

```
utl.write ("Put this ");
utl.write ("line on ");
utl.write ("screen\n");
```

results in

```
Put this line on screen
```



##### utl.writeLine

| In/Out     | What      |
| ---------- | --------- |
| Parameters | line      |
| Returns    | [nothing] |

This function, like "write" takes one argument end prints it to screen, however writeLine adds an end-of-line (\n) to the end.

Example

```
utl.write ("Put this ");
utl.write ("line on ");
utl.write ("screen");
```

results in

```
Put this 
line on 
screen
```



##### utl.runStmnt

| In/Out     | What      |
| ---------- | --------- |
| Parameters | stmnt     |
| Returns    | [nothing] |

To have SQLcl execute a command, like e.g. the built in command "load", we need two statements.
First we need to execute "sqlcl.setStmnt", passing it the statement, and then we need to run it by executing "sqlcl.run".
This function combines the two statements, so we can let SQLcl execute a statement with a single function call.

Example

```
runStmnt ("variable MyVar varchar2(10)");
```

Will set and then have SQLcl run the statement for declaring a varchar2(10) bind variable with the name MyVar.



##### utl.currentOS

| In/Out    | What                          |
| --------- | ----------------------------- |
| Arguments | [None]                        |
| Returns   | 3 booleans: windows, mac, nix |

This function does not take any arguments, and returns three booleans named "windows", "mac" and "nix".
The boolean that corresponds with the operating system the script is running on will be true, the others will be false.

Example

Running this code

```
     if (utl.currentOS().windows) {utl.writeline ("We are currently on Windows"   );}
else if (utl.currentOS().mac)     {utl.writeline ("We are currently on an Apple"  );}
else if (utl.currentOS().nix)     {utl.writeline ("We are currently on Linux/Unix");}
```

Will return the appropriate line depending on which operating system the script is run.



##### utl.dirSeparator

| In/Out     | What                                                         |
| ---------- | ------------------------------------------------------------ |
| Parameters | [None]                                                       |
| Returns    | char used as directory separator in paths in this operating system |

This function will return the character that the operating system on which the script is run uses as a separator for directories in paths.

Example

On windows this will return a backslash ("\\")
On linux this will return a slash ("/")



##### utl.settingsPathName

| In/Out     | What                                                  |
| ---------- | ----------------------------------------------------- |
| Parameters | [None]                                                |
| Returns    | Location (path) where SQLcl stores its settings files |

On windows SQLcl stores its settings files in the "sqlcl" subdirectory of the "%appdata%" directory.
on linux it stores the files in the ".sqlcl" subdirectory of the "${HOME}" directory.

This function determines the current operating system and then retrieves the value of the appropriate environment variable and adds the appropriate subdirectory to it. The result is returned



##### utl.ltrim

| In/Out     | What                                                         |
| ---------- | ------------------------------------------------------------ |
| Parameters | stringToTrim<br />chrToLose                                  |
| Returns    | stringToTrim with all occurences of chrToLose stripped from the left |

This function works similar to the ltrim within Oracle SQL. 
Except, there is no default for the character to trim.

Starting from the left of "stringToTrim" characters are removed until a character is encountered that is not "chrToLose"

If stringToTrim is "undefined", null is returned

Example

```
utl.ltrim ("xxxxabcxxdefxxxx", "x");      // results in "abcxxdefxxxx"
utl.ltrim ("abcxxdefxxxx", "x");          // results in "abcxxdefxxxx"
```



##### utl.rtrim

| In/Out     | What                                                         |
| ---------- | ------------------------------------------------------------ |
| Parameters | stringToTrim<br />chrToLose                                  |
| Returns    | stringToTrim with all occurences of chrToLose stripped from the right |

This function works similar to the rtrim within Oracle SQL. 
Except, there is no default for the character to trim.

Starting from the right of "stringToTrim" characters are removed until a character is encountered that is not "chrToLose"

If stringToTrim is "undefined", null is returned

Example

```
utl.rtrim ("xxxxabcxxdefxxxx", "x");      // results in "xxxxabcxxdef"
utl.rtrim ("xxxxabcxxdef", "x");          // results in "xxxxabcxxdef"
```



##### utl.trim

| In/Out     | What                                                         |
| ---------- | ------------------------------------------------------------ |
| Parameters | stringToTrim<br />chrToLose                                  |
| Returns    | stringToTrim with all occurences of chrToLose stripped from the both the left and the right |

This function works as a ltrim+rtrim. 

Starting from both the left and the right of "stringToTrim" characters are removed until a character is encountered that is not "chrToLose"

If stringToTrim is "undefined", null is returned

Example

```
utl.rtrim ("xxxxabcxxdefxxxxxx", "x");      // results in "abcxxdef"
utl.rtrim ("xxxxabcxxdef", "x");            // results in "abcxxdef"
utl.rtrim ("abcxxdef", "x");                // results in "abcxxdef"
```



##### utl.coalesce

| In/Out     | What                                                         |
| ---------- | ------------------------------------------------------------ |
| Parameters | value001<br />value002<br />...<br />value099<br />value100  |
| Returns    | The first value in the list that is neither NULL nor UNDEFINED nor EMPTY STRING |

This function is an adoptation of the Oracle SQL coalesce function.
Any number of parameters with a maximum of 100 can be passed to this function.
The function will go through each value that was passed into it starting with the first, and will return the value of the first parameter that is not NULL, UNDEFINED or EMPTY STRING.

Example

```
var value1;
var value2 = null;
var value3 = "Something";
var value4 = 100;

utl.coalesce (value1, value3, value4);                    // returns "Something"
utl.coalesce (value2, value4, value3);                    // returns 100
utl.coalesce (value1, value2, value4, value1, value3);    // returns 100
```





