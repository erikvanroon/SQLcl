### Script Name

Filename				: file2bind.js



### Registration as custom command

To register this script with minimal feedback as a custom command named "**my_command**", execute

```
script d:\myscripts\file2bind.js -cmdReg my_command -minimal
```

(assuming the script is placed in directory "d:\myscripts\")



### Required libraries

| Library Name | Filename             |
| ------------ | -------------------- |
| registration | ELib_registration.js |
| utl          | ELib_General_Util.js |



### Purpose

Read a (flat) file from the client machine that SQLcl is running on and put its contents in a bindvariable of type "clob" so it can be used in SQL/PL-SQL.



### Description

##### Parameters

| Position | Optional | Description                                                  |
| -------- | -------- | ------------------------------------------------------------ |
| 1        | No       | Full pathname of the file of which the contents should be put into a bindvariable. |
| 2        | Yes      | Name of the bindvariable that will hold the contents of the file to be read<br />The default name for this bind variable, if not supplied, is "ero_path" |
| 3        | Yes      | Full pathname of the file that was read. (see [**Usage**](#Usage))<br />The default name for this bind variable, if not supplied, is "ero_file" |

##### Usage

###### Script or command

To run the script there are two options: either as script or as custom command.
To run it as script, execute it like any other JavaScript script in SQLcl by using the keyword "script" followed by the full pathname of the script and then any parameter values that need to be passed to the script.

```
script d:\myscripts\file2bind.js [parameters]
```

To run it as a custom command, first [**register it as a custom command**](#Registration-as-custom-command), and then execute the command followed by any parameter values that need to be passed to the script.

```
script d:\myscripts\file2bind.js -cmdReg file2bind -minimal
file2bind [parameters]
```

The rest of this document assumes the script to be registered as a custom command by the same name as the script (without extension). But functionality will be the same for running as script.

###### Built-in help

To display help text for using this script, run the script (or the command if it's registered as custom command) without any parameters or with just one parameter value "help".
So like either of these

```
script d:\myscripts\file2bind.js
script d:\myscripts\file2bind.js help
```

###### Executing

The general syntax of this script is

```
file2bind pathname [contents-bind] [pathname-bind]
```

If for example this statement is run

```
file2bind D:\TNSAdmin\tnsnames.ora my_tnsnames source_file
```

Then the tnsnames.ora file on my machine in "D:\TNSAdmin\" will be read and it's contents will be placed in a clob bindvariable called :my_tnsnames.

The full pathname of the file that was read (D:\TNSAdmin\tnsnames.ora) will be placed in a varchar2 bindvariable called :source_file.

It may seem strange to put the name of the file that is read in a bindvariable as well. After all, we know which file was read because we supplied that information in the first parameter, right?
However, we could of course use substitution variables in the statement, like this:

```
file2bind &tns_location.\tnsnames.ora my_tnsnames source_file
```

Now, it isn't perfectly clear which file is read. To be able to check the exact source of the data in :my_tnsnames the pathname of the file can be retrieved from :source_file.

After the command in the example above is run, the entire contents of the tnsnames.ora file will be available in the bind variable, so it can for example be parsed/split up in PL-SQL or specific information can be searched or inserted into a table with SQL.

So suppose I need the information of the 16th entry in my tnsnames.ora file.
(**Note** that in my tnsnames.ora there is always exactly 1 empty line between entries)

```
ERO@EVROCS>file2bind D:\TNSAdmin\tnsnames.ora my_tnsnames source_file
ERO@EVROCS>declare
  2    cn_separator  constant  varchar2(2) := chr(10)||chr(10);
  3    cn_entry_nr   constant  integer     := 16;
  4    l_start   integer;
  5    l_length  integer;
  6    l_entry   varchar2(2000);
  7  begin
  8    l_start  := instr(:my_tnsnames, cn_separator, 1, cn_entry_nr) + length(cn_separator);
  9    l_length := instr(:my_tnsnames, cn_separator, l_start) - l_start;
 10
 11    l_entry  := substr(:my_tnsnames, l_start, l_length);
 12    dbms_output.put_line ('Entry nr '||cn_entry_nr||' in file '||:source_file||' is:');
 13    dbms_output.put_line (l_entry);
 14  end;
 15* /
Entry nr 16 in file D:\TNSAdmin\tnsnames.ora is:
evrocs =
  (DESCRIPTION =
    (ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT = 1521))
    (CONNECT_DATA =
      (SERVER = DEDICATED)
      (SERVICE_NAME = evrocs)
    )
  )

PL/SQL procedure successfully completed.

ERO@EVROCS>
```

