### Script Name

Filename				: VariableDefault.js



### Registration as custom command

To register this script with minimal feedback as a custom command named "**my_command**", execute

```
script d:\myscripts\VariableDefault.js -cmdReg my_command -minimal
```

(assuming the script is placed in directory "d:\myscripts\")



### Required libraries

| Library Name | Filename             |
| ------------ | -------------------- |
| registration | ELib_registration.js |
| utl          | ELib_General_Util.js |
| substVar     | ELib_Subst_Var.js    |



### Purpose

Supplying a default value for substitution variables and sql-script parameters (&1, &2 etc) if they do not exist.

When used for a SQL-script parameter, the parameter becomes optional. If no parameter value is supplied, the parameter will be created with the default value.



### Description

##### Parameters

| Position | Optional | Description                                                  |
| -------- | -------- | ------------------------------------------------------------ |
| 1        | No       | Name of substitution variable which needs to be checked for existence |
| 2        | No       | The default value to be used if the variable indicated in the first parameter does not exist |
| 3        | Yes      | Optional: the name of a substitution variable in which the resulting value should be placed. See [**Usage**](#Usage) for more information |
|          |          |                                                              |

##### Usage

###### Script or command

To run the script there are two options: either as script or as custom command.
To run it as script, execute it like any other JavaScript script in SQLcl by using the keyword "script" followed by the full pathname of the script and then any parameter values that need to be passed to the script.

```
script d:\myscripts\VariableDefault.js [parameters]
```

To run it as a custom command, first [**register it as a custom command**](#Registration-as-custom-command), and then execute the command followed by any parameter values that need to be passed to the script.

```
script d:\myscripts\VariableDefault.js -cmdReg VariableDefault -minimal
VariableDefault [parameters]
```

The rest of this document assumes the script to be registered as a custom command by the same name as the script (without extension). But functionality will be the same for running as script.

###### Built-in help

To display help text for using this script, run the script (or the command if it's registered as custom command) without any parameters or with just one parameter value "help".
So like either of these

```
script d:\myscripts\VariableDefault.js
script d:\myscripts\VariableDefault.js help
```

###### Executing

The general syntax of this script is

```
VariableDefault SubstVarToCheck DefaultValue [TargetSubstVar]
```

Sometimes in a SQL script you want to check if a substitution variable, that is set in a different script, exists and act accordingly.
Or the SQL script accepts a parameter, which are nothing more than numbered substitution variables, but you want to do a default action if no parameter was supplied.

If your script references such a substitution variable/parameter that does not exist the script stops and waits for your input with the beautiful message

```
Enter value for 1:
```

With the VariableDefault script/command the script can start with checking such variables and deal with any missing ones.

VariableDefault works slightly different depending on whether it's executed with 2 or 3 parameters

**Running with 2 parameters**

If the script is run with only the first two parameters, then it will check if a substitution variable with the name indicated by SubstVarToCheck exists. 
If it does, it will not be touched.
If it does not, it will be created having the value indicated in DefaultValue.

**Example**

Suppose we have this SQL script named "count_objects.sql"

```
VariableDefault 1 %

select '&1'        as owner_like
,      count(*)    as object_count
from   dba_objects
where  owner  like upper('&1')  escape '/'
;
```

Without that first line the SQL script would ask for a value for &1 if we run it without parameters.

VariableDefault will check if &1 exists. If it does, it will not change it and the query will be run with whatever was entered as parameter value

If no parameter value was entered when running the SQL script, VariableDefault will detect the absence of the &1 substitution variable, and create it with the indicated default value "%" (second parameter in the call).

```
ERO@EVROCS>@count_objects ero

OWNER_LIKE       OBJECT_COUNT
_____________ _______________
ero                       198

ERO@EVROCS>@count_objects e%

OWNER_LIKE       OBJECT_COUNT
_____________ _______________
e%                        268

ERO@EVROCS>@count_objects

OWNER_LIKE       OBJECT_COUNT
_____________ _______________
%                       73526
```



**Running with 3 parameters**

If the script is run with three parameters, it will check if a substitution variable with the name indicated by SubstVarToCheck exists.
If it does it will put its value in a substitution variable with the name indicated by TargetSubstVar. 
If it does not, the value indicated in DefaultValue. will be put into a substitution variable with the name indicated by TargetSubstVar. 
If the variable indicated by TargetSubstVar variable does not exist it will be created.

This functionality is mainly useful when a script needs to decide how to act based on whether a substitution variable that is set by other scripts exists, but you don't want to create the variable if it doesn't.
Another use case could be the fact that often in SQL scripts, the first thing we do is put the parameter values into other variables with more descriptive names than 1, 2 etc. VariableDefault with 3 parameters can be used for that too, as long as you keep in mind that now a missing parameter leads to using the default value.

**Example**

Suppose we have this SQL script named "count_users.sql"

```
VariableDefault ora_maintained N my_own_ora_maintained

select '&my_own_ora_maintained'   as oracle_maintained
,      count(*)                   as user_count
from   dba_users
where  oracle_maintained like upper('&my_own_ora_maintained')
;
```

Substitution variable &ora_maintained may have been set or undefined in other SQL scripts or on the command line. In any case, when we run this SQL script the status of that variable could be anything.
But because it's maintained outside this SQL script we don't want this SQL script to create it with a default value, because then other scripts may show unexpected behavior.

So we use VariableDefault with 3 parameters.
VariableDefault checks if &ora_maintained exist. If it does, &my_own_ora_maintained is created with the same value that &ora_maintained has.
If &ora_maintained does not exist , &my_own_ora_maintained is created with value "N" (second parameter in the call of VariableDefault).

In either case no changes to the status or value of &ora_maintained are made.

```
ERO@EVROCS>/* Set ora_maintained to: any */
ERO@EVROCS>define ora_maintained = %
ERO@EVROCS>@count_users

ORACLE_MAINTAINED       USER_COUNT
____________________ _____________
%                               43

ERO@EVROCS>/* check if ora_maintained is unchaged */
ERO@EVROCS>define ora_maintained
DEFINE ORA_MAINTAINED  = "%" (CHAR)


ERO@EVROCS>/* Set ora_maintained to: yes */
ERO@EVROCS>define ora_maintained = y
ERO@EVROCS>@count_users

ORACLE_MAINTAINED       USER_COUNT
____________________ _____________
y                               35

ERO@EVROCS>/* check if ora_maintained is unchaged */
ERO@EVROCS>define ora_maintained
DEFINE ORA_MAINTAINED  = "y" (CHAR)


ERO@EVROCS>/* Remove ora_maintained */
ERO@EVROCS>undefine ora_maintained
ERO@EVROCS>@count_users

ORACLE_MAINTAINED       USER_COUNT
____________________ _____________
N                                8

ERO@EVROCS>/* check if ora_maintained is unchaged */
ERO@EVROCS>define ora_maintained
SP2-0135: symbol ora_maintained is UNDEFINED
```

