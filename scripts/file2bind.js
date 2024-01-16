/*
   -------------------------------------------------------------------------
   --                                                                     --
   --       _/_/_/_/              _/_/_/      _/_/      _/_/_/    _/_/_/  --
   --      _/        _/      _/  _/    _/  _/    _/  _/        _/         --
   --     _/_/_/    _/      _/  _/_/_/    _/    _/  _/          _/_/      --
   --    _/          _/  _/    _/    _/  _/    _/  _/              _/     --
   --   _/_/_/_/      _/      _/    _/    _/_/      _/_/_/  _/_/_/        --
   --                                                                     --
   -------------------------------------------------------------------------

   ==========================================================================================
   Read a local (client) file and put its contents in a bindvariable of type clob
   ==========================================================================================
*/

"use strict";

// Load Libraries
var libraryPath = java.lang.System.getenv("SQLCL_JS_LIB").replace(/\\/g, "/").replace(/\/?$/, "/");
load (libraryPath + "ELib_registration.js");
load (libraryPath + "ELib_General_Util.js");

// Function contains all the functionality of the script
function scriptCode () {

  // function displays an error message on screen
  function errorMsg (message) {
    utl.writeLine ("");
    utl.writeLine ("##################################################");
    utl.writeLine ("== ERROR == ");
    utl.writeLine (message);
    utl.writeLine ("");
    utl.writeLine ("Call this script with parameter 'help' for usage");
    utl.writeLine ("##################################################");
    utl.writeLine ("");
  }

  // Prints the Help Text on screen
  function displayHelp (scriptName, bindContents, bindPathname) {
    utl.writeLine (''                                                                           );
    utl.writeLine ('===========================================================================');
    utl.writeLine ('Usage of script ' + scriptName                                              );
    utl.writeLine ('~~~~~~~~~~~~~~~~~~~~~~~~~'                                                  );
    utl.writeLine (scriptName + ' help'                                                         );
    utl.writeLine ('  => Display this help text'                                                );
    utl.writeLine (''                                                                           );
    utl.writeLine (scriptName + ' pathname [contents-bind] [pathname-bind]'                     );
    utl.writeLine ('  => Will read the contents of file "pathname" and place it in a'           );
    utl.writeLine ('     bindvariable  of type "clob" with the name specified in'               );
    utl.writeLine ('     "contents-bind".'                                                      );
    utl.writeLine ('     The pathname of the file that is read is placed in a bindvariable'     );
    utl.writeLine ('     with the name specified in "pathname-bind".'                           );
    utl.writeLine ('     The names of the bindvariables are optional. If omitted, default'      );
    utl.writeLine ('     names will be used'                                                    );
    utl.writeLine (''                                                                           );
    utl.writeLine ('     The reason the pathname of the file that is read is also placed in'    );
    utl.writeLine ('     a bindvariable, is to allow checking if the correct file is read'      );
    utl.writeLine ('     in cases where for example a substitution variable is used for the'    );
    utl.writeLine ('     filename or its location when calling this script.'                    );
    utl.writeLine (''                                                                           );
    utl.writeLine ('     Only the first parameter (pathname) is mandatory'                      );
    utl.writeLine (''                                                                           );
    utl.writeLine ('     Param'                                                                 );
    utl.writeLine ('     pathname      : path and name of the textfile that needs to be read'   );
    utl.writeLine ('                     e.g. D:\\Temp\\MyFile.txt'                             );
    utl.writeLine ('                          "D:\\Temp\\My File.txt"'                          );
    utl.writeLine ('                          /tmp/MyFile.txt'                                  );
    utl.writeLine (''                                                                           );
    utl.writeLine ('     contents-bind : The name of the bindvariable in which the contents'    );
    utl.writeLine ('                     of file "pathname" is placed'                          );
    utl.writeLine ('                     If omitted "' + bindContents + '" is used'             );
    utl.writeLine (''                                                                           );
    utl.writeLine ('     pathname-bind : The name of the bindvariable in which the pathname'    );
    utl.writeLine ('                     of file "pathname" is placed'                          );
    utl.writeLine ('                     If omitted "' + bindPathname + '" is used'             );
    utl.writeLine ('===========================================================================');
    utl.writeLine (''                                                                           );
  }

  // Function turns feedback on or off
  function setFeedback (fbStatus) {
    utl.runStmnt ("set feedback " + fbStatus);
  }

  // Function that will append a string of characters to the bind variable
  function appendToBind (chrBuffer , bindName) {
    // Remember a plsql block is executed by a slash
    // so add a newline+slash at the end of the statement
    const concatenationStmnt = "begin :" + bindName + " := :" + bindName + " || '" + chrBuffer + "'; end;" + "\n/";

    //debug -- In case of unexpected behavior uncomment the next line
    //utl.writeLine (concatenationStmnt);

    utl.runStmnt (concatenationStmnt);
  }

  // Function returns the supplied character escaped if it is a character that needs to be escaped
  // otherwise it returns the supplied character unchanged
  function escaped_if_needed (charToEscape) {
    var result = charToEscape;
    if (result == "'") {
      result = result + result;
    }
    return result;
  }

  // Function reads the file and puts data in the bind variables
  function readFileToBind (nameOfFile, bindContents, bindPathname) {
    // Declare variables
    const bufferSize   = 32766;                            // Maximum number of bytes to be appended to the clob at a time
                                                           // One less than max cvarchar2 size because in case of quote we add it escaped, so 2 char's at once
    var   fileReader   = Java.type('java.io.FileReader');  // Declare JavaScript variable referencing the FileReader Java class
    var   lineContents = '';                               // buffer (string of characters) to be appended to the bindvariable
    var   char;                                            // Current character to be processed

    // Open fileReader object
    try {
      var clientFile = new fileReader(nameOfFile);       // Declare a variable referencing an instance of the FileReader class for the requested file
    } catch (e) {
      // If *anything* goes wrong on opening the file, report that and exit
      errorMsg ("Unable to read specified file: " + nameOfFile);
      return;
    }

    // Declare the bindvariables for the path-name and contents of the file
    utl.runStmnt ("variable " + bindContents + " clob");
    utl.runStmnt ("variable " + bindPathname + " varchar2(500)");

    // Put the path-name of the file in the appropriate bindvariable
    utl.runStmnt ("exec :" + bindPathname + " := '" + nameOfFile + "'");

    // Loop until all characters in the file have been processed
    char        = clientFile.read();   // Get first character from file
    while (char !== -1) {
      // Add the character to the character-buffer, if it's a quote, escape it
      lineContents = lineContents + escaped_if_needed(String.fromCharCode(char));

      // Read the next character from the file
      char = clientFile.read();

      // If the buffer reached its maximum size OR we've reached the end of the file,
      // append the buffer to the bind variable and empty it
      if ((lineContents.length === bufferSize) || (char === -1)) {
        appendToBind (lineContents , bindContents);
        lineContents = "";
      }
    }

    // Close the fileReader object
    clientFile.close();
  }

  // Main code
  const defaultBindPathname = "ero_path";
  const defaultBindContents = "ero_file";
  const paramCount          = args.length - 1;

  var filePath;
  var chosenBindContents;
  var chosenBindPathname;

  if (paramCount > 3) {
    errorMsg ("Too many parameters (" + paramCount + ")");

  } else if ((paramCount === 0) ||
             ((paramCount === 1) && (args[1].toLowerCase() === "help"))
            ) {
    displayHelp (args[0], defaultBindContents, defaultBindPathname);

  } else {

    chosenBindPathname = defaultBindPathname;
    chosenBindContents = defaultBindContents;

    if ((paramCount === 3) && (args[3] !== "")) {
      chosenBindPathname = args[3];
    }

    if ((paramCount >= 2) && (args[2] !== "")) {
      chosenBindContents = args[2];
    }

    filePath = args[1];
    setFeedback ("off");
    readFileToBind (filePath, chosenBindContents, chosenBindPathname);
    setFeedback ("on");
  }
}

// Execute or register the script code
registration.runCommand (scriptCode);
