### Library

Filename				: ELib_Subst_Var.js

Library name		: substVar



### Public functions

| Function        | Description                                                  |
| --------------- | ------------------------------------------------------------ |
| substVar.Exists | Indicates by a boolean if a substitution variable with the indicated name exists |
| substVar.Remove | Removes (undefines) a substitution variable if it exists     |
| substVar.Set    | Sets the value of a substitution variable to the indicated value |
| substVar.Get    | Retrieves the value of an existing substitution variable and returns it |



### Library Description

This library contains functions for dealing with substitution variables.



### Function Description

##### substVar.Exists

| Type       | Name                                                         |
| ---------- | ------------------------------------------------------------ |
| Parameters | substVarName                                                 |
| Returns    | Boolean indicating the existence of a substitution variable with the supplied name |

This function checks if a substitution variable has been defined with the name that was passed in through the parameter.
If such a variable exists, true is returned, else false is returned

Example

```
substVar.Exists ("mystring");    // returns true if variable &mystring exists, else false
```



##### substVar.Remove

| In/Out     | What         |
| ---------- | ------------ |
| Parameters | substVarName |
| Returns    | [nothing]    |

This function will "undefine" a substitution variable with the name that was passed in through the parameter, if it exists. 
If it does not exists no feedback about that fact will be given. Basically nothing will happen.
So, once this function has succesfully executed, the variable by the indicated name is undefined, whether it was defined before executing the function or not.

Example

```
substVar.Remove ("mystring")  // after this no variable &mystring exists anymore
```



##### substVar.Set

| In/Out     | What                            |
| ---------- | ------------------------------- |
| Parameters | substVarName<br />substVarValue |
| Returns    | [nothing]                       |

Thid function will set the value of a substitution variable with the name that is passed in parameter substVarName to the value passed in parameter substVarValue.
If the variable already exists it will be replaced by the new value, if it does not yet exist, it will be created.
Passing null to the substVarValue parameter has the effect of the variable being removed (undefined) if it exists.

Example

```
substVar.Set ("mystring", "ABC");  // will result in a variable &mystring with value ABC
substVar.Set ("mystring", null);   // will result in no variable &mystring (anymore)
```



##### substVar.Get

| In/Out     | What                                                         |
| ---------- | ------------------------------------------------------------ |
| Parameters | substVarName                                                 |
| Returns    | The value of the substitution variable, or null if it doesn't exist |

This function will check if a substitution variable exists with the name that is passed in the parameter.
If it does, its value is retrieved and returned, else null is returned.

Example

```
substVar.Get ("mystring");   // returns "ABC" if &mystring exists and has a value of ABC
substVar.Get ("mystring");   // returns null if &mystring does not exist
```



