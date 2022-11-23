# Libraries
The scripts in this directory are libraries that are loaded and used by the other scripts you find in the rest of this repository.

Please also read the *.md files for the individual libraries

### Preparing to use the libraries

To use these libraries

- Download the libraries
- Put them in some (any) directory
- Create an environment variable named SQLCL_JS_LIB containing the location of the libraries

So, if you put the libraries in d:\myscripts\lib, then let the value of the environment variable be d:\myscripts\lib.
This will work similarly on linux based systems.
The scripts will read the variable, make sure the (back)slashes are correct, including trailing (back)slash, and load its libraries from that directory

### Usage of the libraries by the scripts in this repository

Provided the environment variable that is mentioned in the previous section is set up, and points to the correct directory that contains the libraries, the scripts in this repository should work without a problem.

The scripts read the environment variable SQLCL_JS_LIB, then will make sure the (back)slashes are correct, including trailing (back)slash, and will finally load its libraries from that directory.

### Usage of the libraries in your own scripts

If you want to use the libraries in scripts of your own, you can load them similar to how it's done in the scripts in this repository.
At the start of the script add lines similar to this

```
var libraryPath = java.lang.System.getenv("SQLCL_JS_LIB").replace(/\\/g, "/").replace(/\/?$/, "/");
load (libraryPath + "ELib_General_Util.js");
load (libraryPath + "ELib_Subst_Var.js");
```

The first line reads the value of the SQLCL_JS_LIB environment variable which contains the location of the libraries.
It then replaces each backslash that may be in there by slash, and adds a trailing slash if it's not there.
The result is placed in variable libraryPath.

Next you can load the desired libraries with the load command as shown.

Of course, if you prefer to use a hardcoded path to the libraries, you can skip the first line and just pass the entire pathname of the library to the load command.





### NOTE:

Be aware that I use GraalVM rather than JDK.
This means that these scripts and libraries will probably not work if you're running your SQLcl with a JDK instead of GraalVM.
I've noticed several things that simply don't work with Nashorn in the JDK, among which is declaring a const.

Nashorn has been removed as of Java 15. 
So if you want to continue running JavaScript in SQLcl GraalVM is maybe the best choice anyway.

