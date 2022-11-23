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
   Library with functionality for registering/unregistering custom commands in SQLcl

   Public Functions
   ================
   See comment above each individual Function for its use

   - registration.unregisterCommand
   - registration.runCommand
   ==========================================================================================

   Instructions:

   To register your script as a custom command using this library you need to:
   1. Change your script a little bit
   2. Execute the script with some 'special' parameters.

   1. Change your script
      - include the entire functionality of the script that you want to register (except the loading of
        libraries) inside a function, for example called "scriptCode".
        Like this:
           // Function contains all the functionality of the script
           function scriptCode () {
             //put ALL of the original script, except the loading of libraries here
           }
      
      - At the top of the script that you want to register as a command first of all load this library
        Suppose you saved the library script as "ELib_registration.js" in "D:\ELib\", then:

          load ("D:/ELib/ELib_registration.js")
        
        should be placed before the line that starts the scriptCode function

      - At the bottom, after the closing bracket of the scriptCode function add this line:

              registration.runCommand (scriptCode);

          The function expression holding the script code is passed as value to the first parameter
          (Note: no brackets after the function name, so the function itself is passed, not the result of the function)
          If a beginEvent and/or endEvent are needed, create functions for those as well and supply the corresponding 
          function expressions from your script similarly to  respectively the second and third parameter.

   2. Execute the script
      You can now execute the scripts in two ways:
      - As you would have done before

        Executing the script without parameters or with parameters, but the first one is not -cmdReg or -cmdUnReg
        will just execute the function holding the script code. So the script is executed as it would be without the
        registration functionality, without being registered as a custom command.
        So,
          script FileName.js param1 param2 param3
        will just run FileName.js as if we hadn't altered the script at all.
        This gives you the choice to run a script from the commandline or register it as a custom command

      - Using some special registration parameters
        This registers the script as a custom command

        - For registration the general syntax is:

            script FileName.js -cmdReg [Custom_Command_name] [-all | -minimal | -silent]

          Examples:
            script FileName.js -cmdReg MyCommand
              => Will register the functionality as custom command "MyCommand"

            script FileName.js -cmdReg
              => Will register the functionality as default custom command "cctest"

            The examples above can be extended with one more parameter which controls the amount of feedback that
            is given on screen by the registration functionality.
            Valid values for this parameter are:
              - all       : The default. All feedback will be put on screen
              - minimal   : Only the succesful registration message is put on screen
              - silent    : No feedback is put on screen
            Errors are not suppressed, regardless of the chosen level of feedback.

   Unregistering a command
   - If a custom command already exists when you try to register (a new version) of it, the existing command
     is automatically unregistered just before the new version is registered.
     So, manually unregistering an old command is not needed before registering a new version of it

     If you just want to get rid of an existing custom command, the regular way of doing that would be to
     remove the registration of the command from your login.sql/startup.sql, and it will be gone from all
     future sqlcl instances.

     However, if for some reason you insist on removing a custom command from the current session, you
     can create an unregister script that executes the unregistration functionality from the library.
     In that script, load this libarary like you do in your custom cammand scripts, and then execute:

         if (args.length == 1) {
             registration.unregisterCommand ();
         } else {
             registration.unregisterCommand (args[1]);
         }

       Now any custom command can be unregistered by executing the script with the command name as parameter

         script unreg.js MyCommand

       Or simply

         script unreg.js

       to unregister the command with the default name "cctest"
   ==========================================================================================
*/

"use strict";

var registration = (function () {

  var jRegUnregCollectors             = Java.type("java.util.stream.Collectors")                          ;
  var jRegUnregSQLCommand             = Java.type("oracle.dbtools.raptor.newscriptrunner.SQLCommand")     ;
  var jRegUnregCommandRegistry        = Java.type("oracle.dbtools.raptor.newscriptrunner.CommandRegistry");
  var jRegUnregCommandListener        = Java.type("oracle.dbtools.raptor.newscriptrunner.CommandListener");

  // Predefined Feedback Levels
  const RegUnregFeedbackWantedAll     = 0  ;
  const RegUnregFeedbackWantedMinimal = 50 ;
  const RegUnregFeedbackWantedSilent  = 100;

  // Message Priority Levels
  const RegUnregMsgLevelInfo          = 25  ;
  const RegUnregMsgLevelImportant     = 75  ;
  const RegUnregMsgLevelCritical      = 1000;

  // Set defaults for Feedback level and Name to use for the custom command
  const defaultCommandName            = "ccTest"                 ;
  var   RegUnregFeedbackWantedLevel   = RegUnregFeedbackWantedAll;


  function replaceArgsWithCustomArgs (matcher) {
    args = [];

    while (matcher.find()) {
        //args.push(matcher.group());
        args.push(matcher.group(3) != null ? matcher.group(3) : matcher.group(2));
    }
  }


  function feedback (line, fblevel) {
    if (fblevel >= RegUnregFeedbackWantedLevel) {
        ctx.write (line + "\n");
    }
  }


  function commandArguments (cmdLine) {
    var jPattern = Java.type("java.util.regex.Pattern");

    var pattern = jPattern.compile('("([^"]*)")|([^ ]+)');
    var matcher = pattern.matcher(cmdLine.trim());

    replaceArgsWithCustomArgs (matcher);
  }


  function feedbackParameter (feedbackParam) {
    var validFeedbackParam = true;

    if (feedbackParam.equalsIgnoreCase("-silent")) {
        // No feedback other than critical messages wanted
        RegUnregFeedbackWantedLevel   = RegUnregFeedbackWantedSilent;

    } else if (feedbackParam.equalsIgnoreCase("-minimal")) {
        // Only reasonably important messages wanted
        RegUnregFeedbackWantedLevel   = RegUnregFeedbackWantedMinimal;

    } else if (feedbackParam.equalsIgnoreCase("-all")) {
        // All possible messages wanted
        RegUnregFeedbackWantedLevel   = RegUnregFeedbackWantedAll;

    } else {
        // The value in the parameter is not a valid feedback parameter value
        validFeedbackParam = false;
    }

    return validFeedbackParam;
  }


  function unregisterCommand (cmdName) {
    if (cmdName != undefined && cmdName != "undefined") {
        var RegUnregCommandName = cmdName;
    } else {
        var RegUnregCommandName = defaultCommandName ;
    }

    // Get the current list of listeners
    var listeners    = jRegUnregCommandRegistry.getListeners(ctx.getBaseConnection(), ctx).get(jRegUnregSQLCommand.StmtSubType.G_S_FORALLSTMTS_STMTSUBTYPE);
    var commandFound = false;

    // remove all commands registered with jRegUnregCommandRegistry.addForAllStmtsListener
    jRegUnregCommandRegistry.removeListener(jRegUnregSQLCommand.StmtSubType.G_S_FORALLSTMTS_STMTSUBTYPE);

    // clear the general (no-connection) cache and the connection specific cache
    jRegUnregCommandRegistry.clearCaches(null, ctx);
    jRegUnregCommandRegistry.clearCaches(ctx.getBaseConnection(), ctx);

    // get the list of listeners that have not been removed, if any
    var remainingListeners = jRegUnregCommandRegistry.getListeners(ctx.getBaseConnection(), ctx).get(jRegUnregSQLCommand.StmtSubType.G_S_FORALLSTMTS_STMTSUBTYPE)
                             .stream().map(function(l) l.getClass()).collect(jRegUnregCollectors.toSet());

    // re-register all commands except for the one we are trying to unregister and any remaining (not removed) listener classes
    for (var i in listeners) {
        if (listeners.get(i).toString().equalsIgnoreCase(RegUnregCommandName)) {
            // This is the command we are trying to unregister, so don't re-register, remember we found it for feedback later
            commandFound = true;
        } else if (!remainingListeners.contains(listeners.get(i).getClass())) {
            // It is not one of the listener classes that couldn't be removed, so re-register it
            jRegUnregCommandRegistry.addForAllStmtsListener(listeners.get(i).getClass());
        }
    }

    // Report whether the command has actually been unregistered
    if (commandFound) {
        feedback ("Command " + RegUnregCommandName + " has been UNRegistered" , RegUnregMsgLevelInfo);
    } else {
        feedback ("Command " + RegUnregCommandName + " was not found, hence could not be UNRegistered" , RegUnregMsgLevelInfo);
    }

  }


  function registerCommand (cmdName, functionToExecute, beginEvent, endEvent) {
      if (cmdName != undefined && cmdName != "undefined") {
          var RegUnregCommandName = cmdName;
      } else {
          var RegUnregCommandName = defaultCommandName ;
      }


      // Determine if a beginEvent is supplied, and if not define it as an 'empty' function
      if (beginEvent == undefined || beginEvent == "undefined") {
          beginEvent = function(conn, ctx, cmd) {};
      }

      // Determine if an endEvent is supplied, and if not define it as an 'empty' function
      if (endEvent == undefined || endEvent == "undefined") {
          endEvent  = function(conn, ctx, cmd) {}
      }

      // Define a handleEvent. If no functionToExecute is supplied define it as an 'empty' function
      if (functionToExecute == undefined || functionToExecute == "undefined") {
          var handleEvent = function(conn, ctx, cmd) {}
      } else {
          var handleEvent = function(conn, ctx, cmd) {
                                commandArguments (cmd.getSql());
                                if (args != null && typeof args[0] != "undefined" && args[0].equalsIgnoreCase(RegUnregCommandName)) {
                                    functionToExecute();
                                    return true;
                                }
                                return false;
                            }
      }

      // Define a custom toString method as a function that returns the name of the custom command
      var customToString = function() {
          // to be able to identify this dynamically created class when unregistering
          return RegUnregCommandName;
      }

      // Extend the listener with the above methods
      var customCommandToRegister = Java.extend(jRegUnregCommandListener, {
                                                    handleEvent : handleEvent,
                                                    beginEvent  : beginEvent,
                                                    endEvent    : endEvent,
                                                    toString    : customToString
                                                }
                                    );

      // Unregister the custom command if it has been registered before
      feedback ("Trying to unregister Command " + RegUnregCommandName + " in case it has been registered before...." , RegUnregMsgLevelInfo);
      unregisterCommand (RegUnregCommandName);

      // Register the custom command
      jRegUnregCommandRegistry.addForAllStmtsListener(customCommandToRegister.class);

      feedback ("Command " + RegUnregCommandName + " has been registered" , RegUnregMsgLevelImportant);

  }


  function runCommand (functionToExecute, beginEvent, endEvent) {

      const paramCount = args.length - 1;
      var   cmdName;

      // if first parameter is -cmdReg   (case INsensitive) then register the CommandListener
      // if first parameter is -cmdUnReg (case INsensitive) then UNregister the CommandListener
      // otherwise just run the script
      if (paramCount >= 1 && args[1].equalsIgnoreCase("-cmdReg")) {
          // Parameter requesting registration of a command

          // Set feedback level and/or command name, if they were provided through the parameters
          // If there is a second parameter and it is one of the feedback parameters, set the global feedback level accordingly
          // otherwise,
          //   the second parameter contains the requested name of the custom command, so set *that* global variable
          //   in this case, check if there is a third parameter and if so, if it's one of the feedback parameters
          if (paramCount >= 2) {
              if (!feedbackParameter(args[2])) {
                  cmdName = args[2];
                  if (paramCount >= 3  ) {
                      // Now we are not interested in the return value of the function.
                      // If it's not a feedback parameter, it'll just be ignored and feedback level remains on its default
                      feedbackParameter(args[3]);
                  }
              }
          }

          registerCommand(cmdName, functionToExecute, beginEvent, endEvent);

      } else if (paramCount >= 1 && args[1].equalsIgnoreCase("-cmdUnReg")) {
          // Parameter requesting UNregistration of a command

          // If there is a parameter it contains the name of the command to be unregistered.
          // Otherwise, the command with the default name is to be unregistered
          if (paramCount >= 1) {
              cmdName = args[1];
          }

          unregisterCommand(cmdName);

      } else {
          // NO Parameter requesting registration of the command encountered, so just run the script
          functionToExecute();

      }

  }



  // Public Functions....
  return {unregisterCommand
         ,runCommand
         };

})();
