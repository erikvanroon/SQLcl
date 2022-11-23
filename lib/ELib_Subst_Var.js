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
   Library with functionality involving reading and manipulating of substitution variables

   Public Functions
   ================
   See comment above each individual Function for its use

   - substVar.Exists
   - substVar.Remove
   - substVar.Set
   - substVar.Get
   ==========================================================================================

*/

"use strict";

// Load Libraries
var libraryPath = java.lang.System.getenv("SQLCL_JS_LIB").replace(/\\/g, "/").replace(/\/?$/, "/");
load (libraryPath + "ELib_General_Util.js");


var substVar = (function () {

  // Function returns true or false indicating if a substitution variable with the indicated name exists
  function Exists (substVarName) {
    var substVarFound    = false;

    for each (var definedVarName in ctx.getMap().keySet()) {
      if (definedVarName.equalsIgnoreCase(substVarName)) {
        substVarFound = true;
        break;
      }
    }

    return substVarFound;
  }


  // Function removes (undefines) a substitution variable if it exists
  function Remove (substVarName) {
    utl.runStmnt("undefine " + substVarName.toUpperCase());
  }


  // Function sets the value of a substitution variable to the indicated value
  // If the variable does not exist it will be created
  // If the value is null, the variable will be removed if it exists
  function Set (substVarName, substVarValue) {
  //ero
    if (substVarValue == null ) {
      Remove (substVarName);
    } else {
      ctx.getMap().put(substVarName.toUpperCase(), substVarValue);
    }
  }


  // Function retrieves the value of an existing substitution variable and returns it
  // If the variable does not exist, null is returned
  function Get (substVarName) {
    var result = null;

    if (Exists (substVarName)) {
      result = ctx.getMap().get(substVarName.toUpperCase());
    }

    return result;
  }

  // Public Functions....
          return {Exists
                 ,Remove
                 ,Set
                 ,Get
                 };

})();
