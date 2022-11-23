# SQLcl
This repository contains JavaScript scripts and libraries to expand the functionality of SQLcl.

The scripts can easily be registered as custom commands in SQLcl, or can just as easily be executed as is.
Have a look at the *.md files in the subdirectories to find out how this all works.

Note that the scripts load one or more of the libraries, so check which libraries it needs, and make sure you have these in place too.
"In place" in this case means: put the libraries in any accessable directory you want and define an environment variable named **SQLCL_JS_LIB** and assign it the path to the directory as its value

All this code is provided as-is.
I am **not** a JavaScript developer, in fact I started looking at JavaScript just because it allowed me to enhance SQLcl functionality.
This means that if you know JavaScript and look at the code I have no doubt you will see things that will make you go "Why???".
The answer, most of the time, is probably "because I don't know better (yet)".
The stuff works without a problem for me. But if you see things that could/should be done better: I'm always willing to learn, so by all means, educate me!



### NOTE:

Be aware that I use GraalVM rather than JDK.
This means that these scripts and libraries will probably not work if you're running your SQLcl with a JDK instead of GraalVM.
I've noticed several things that simply don't work with Nashorn in the JDK, among which is declaring a const.

Nashorn has been removed as of Java 15. 
So if you want to continue running JavaScript in SQLcl GraalVM is maybe the best choice anyway.

