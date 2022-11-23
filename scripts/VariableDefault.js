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
   Check if substitution variable exists, and if not, supply a default value
   ==========================================================================================
*/

"use strict";

// Load Libraries
var libraryPath = java.lang.System.getenv("SQLCL_JS_LIB").replace(/\\/g, "/").replace(/\/?$/, "/");
load (libraryPath + "ELib_registration.js");
load (libraryPath + "ELib_General_Util.js");
load (libraryPath + "ELib_Subst_Var.js");


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
  function displayHelp (scriptName) {
    utl.writeLine (''                                                                           );
    utl.writeLine ('===========================================================================');
    utl.writeLine ('Usage of script ' + scriptName                                              );
    utl.writeLine ('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    utl.writeLine (scriptName + ' help'                                                         );
    utl.writeLine ('  => Display this help text'                                                );
    utl.writeLine (''                                                                           );
    utl.writeLine ('>>>>> Version with 2 parameters <<<<<'                                      );
    utl.writeLine (scriptName + ' SubstVar DefaultValue'                                        );
    utl.writeLine (''                                                                           );
    utl.writeLine ('  => If the substitution variable named in the first parameter exists it is');
    utl.writeLine ('     left unchanged.'                                                       );
    utl.writeLine ('     If the substitution variable named in the first parameter does NOT'    );
    utl.writeLine ('     exist it is created and given the value of the second parameter'       );
    utl.writeLine (''                                                                           );
    utl.writeLine ('>>>>> Version with 3 parameters <<<<<'                                      );
    utl.writeLine (scriptName + ' SubstVar1 DefaultValue SubstVar2'                             );
    utl.writeLine (''                                                                           );
    utl.writeLine ('  => The substitution variable named in the third parameter is created if'  );
    utl.writeLine ('     it does not yet exist, and given either the value of the substitution' );
    utl.writeLine ('     variable named in the first parameter if it exists, or the value of'   );
    utl.writeLine ('     the second parameter if the substitution variable named in the first'  );
    utl.writeLine ('     parameter does not exist.'                                             );
    utl.writeLine (''                                                                           );
    utl.writeLine ('First and Third parameter (variable names) are case-INsensistive'           );
    utl.writeLine (''                                                                           );
    utl.writeLine ('Examples:'                                                                  );
    utl.writeLine (scriptName + ' my_var my_default'                                            );
    utl.writeLine ('   if variable &MY_VAR exists, nothing will happen'                         );
    utl.writeLine ('   if variable &MY_VAR does not exist it will be created and given'         );
    utl.writeLine ('   the vale "my_default"'                                                   );
    utl.writeLine (''                                                                           );
    utl.writeLine (scriptName + ' my_var my_default target_var'                                 );
    utl.writeLine ('   if variable &MY_VAR exists, its value will be assigned to variable'      );
    utl.writeLine ('   &TARGET_VAR, which will be created if it does not yet exist'             );
    utl.writeLine ('   if variable &MY_VAR does not exist "my_default" will be assigned to'     );
    utl.writeLine ('   variable &TARGET_VAR, which will be created if it does not yet exist'    );
    utl.writeLine ('===========================================================================');
    utl.writeLine (''                                                                           );
  }

  // Main code

  const paramCount       = args.length - 1;

  var substVarSource   = null;
  var substVarTarget   = null;
  var substVarValue    = null;

  // Check and handle parameters
  if (paramCount > 3) {

    // More than 3 parameters supplied: syntax error
    errorMsg (args[0] + " - Too many parameters (" + paramCount + ")");

  } else if ((paramCount === 0) ||
             ((paramCount === 1) && (args[1].toLowerCase() === "help"))
            ) {


    // No parameters supplied, or 1 parameter which is "help": show help text
    displayHelp (args[0]);

  } else if (paramCount < 2) {

    // Fewer than 2 parameters supplied: syntax error
    errorMsg (args[0] + " - Not enough parameters (" + paramCount + ")");

  } else {

    // Either 2 or 3 parameters supplied
    // Param 1 containts the name of the substVar that needs to be defaulted if it doesn't exist
    substVarSource     = args[1].toUpperCase();

    // Param 2 contains the value to be used as default for the substVar if it doesn't exist
    // If the source variable exists, use its value, else use the default value from param 2
    if (substVar.Exists (substVarSource)) {
      // The source variable exists, so instead of the provided default value, use its value for the target variable
      substVarValue = substVar.Get(substVarSource);

    } else {

      substVarValue = args[2];

    }

    // Param 3 (optional) contains the name of a substVar in which the value should be placed
    //         if not supplied, it should be placed in the variable that is named in the first parameter
    if (paramCount === 3) {

      // 3 parameters supplied, so the target variable is named in the third parameter
      substVarTarget   = args[3].toUpperCase();

    } else {

      // 2 parameters supplied, so the target variable is named in the first parameter
      substVarTarget   = substVarSource;

    }

    // Set the target variable to be the value we determined.
    substVar.Set(substVarTarget, substVarValue);

  }
}

// Execute or register the script code
registration.runCommand (scriptCode);
