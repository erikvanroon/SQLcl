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
   Library with general utilities

   Public Functions
   ================
   See comment above each individual Function for its use

   - utl.write
   - utl.writeLine
   - utl.runStmnt
   - utl.currentOS
   - utl.dirSeparator
   - utl.settingsPathName
   - utl.ltrim
   - utl.rtrim
   - utl.trim
   - utl.coalesce
   ==========================================================================================
*/

"use strict";

var utl = (function () {

  var jOS = Java.type("java.lang.System");


  // Function writes text to screen without an end-of-line
  // Yes, this is nothing but a simple call of ctx.write.
  // It's just here for consistency. Since "writeLine" is here, I want "write" here as well.
  function write (line) {
    ctx.write (line);
  }


  // Function writes text and an end-of-line to screen
  // (Just a ctx.write with an added newline at the end)
  function writeLine (line) {
    write (line + "\n");
  }


  // Function will make SQLcl run the statement that is passed in the parameter
  function runStmnt (stmnt) {
    sqlcl.setStmt(stmnt);
    sqlcl.run();
  }


  // Function returns three boolean flags, one each for Windows/Mac/Linux
  // Indicating whether the current SQLcl session is running on that OS
  function currentOS () {
    const osName = jOS.getProperty("os.name").toLowerCase();

    const winOS = (osName.indexOf("win") >= 0);
    const macOS = (osName.indexOf("mac") >= 0);
    const nixOS = ((osName.indexOf("nix") >= 0) || (osName.indexOf("nux") >= 0) || (osName.indexOf("aix") > 0));

    return {windows: winOS , mac: macOS , nix: nixOS}
  }


  // Function returns the directory separator for this operating system
  function dirSeparator () {
    return jOS.getProperty("file.separator");
  }


  // Function determines the location of sqlcl settings
  function settingsPathName () {

    //  On Windows: %appdata%\sqlcl
    //  On Linux  : ${HOME}/.sqlcl
    var result;

    if (currentOS().windows) {
      result = java.lang.System.getenv("appdata") + dirSeparator() + "sqlcl";
    } else {
      result = java.lang.System.getenv("HOME")    + dirSeparator() + ".sqlcl";
    }

    return result;
  }


  // Function trims a given character from the left of a string
  function ltrim (stringToTrim, chrToLose) {
    var result = stringToTrim;

    if (result === "undefined" || result == null ) {
      result = "";
    }

    while (result.charAt(0) === chrToLose) {
      result = result.slice(1);
    }
    return result;
  }


  // Function trims a given character from the right of a string
  function rtrim (stringToTrim, chrToLose) {
    var result = stringToTrim;

    if (result === "undefined" || result == null ) {
      result = "";
    }

    while (result.charAt(result.length - 1) === chrToLose) {
      result = result.slice(0,-1);
    }
    return result;
  }


  // Function trims a given character from both the left and the right of a string
  function trim (stringToTrim, chrToLose) {
    return ltrim(rtrim(stringToTrim, chrToLose), chrToLose);
  }


  // Function implements a coalesce for a maximum of 100 values
  // It returns the first value in the list of parameters that is neither NULL nor UNDEFINED nor EMPTY STRING
  // If none of the values satisfy that criterion, null is returned
  function coalesce (value001, value002, value003, value004, value005, value006, value007, value008, value009, value010
                    ,value011, value012, value013, value014, value015, value016, value017, value018, value019, value020
                    ,value021, value022, value023, value024, value025, value026, value027, value028, value029, value030
                    ,value031, value032, value033, value034, value035, value036, value037, value038, value039, value040
                    ,value041, value042, value043, value044, value045, value046, value047, value048, value049, value050
                    ,value051, value052, value053, value054, value055, value056, value057, value058, value059, value060
                    ,value061, value062, value063, value064, value065, value066, value067, value068, value069, value070
                    ,value071, value072, value073, value074, value075, value076, value077, value078, value079, value080
                    ,value081, value082, value083, value084, value085, value086, value087, value088, value089, value090
                    ,value091, value092, value093, value094, value095, value096, value097, value098, value099, value100
                    ) {

    var result = null;

           if ((value001  != null) && (value001 != "")) { result = value001;
    } else if ((value002  != null) && (value002 != "")) { result = value002;
    } else if ((value003  != null) && (value003 != "")) { result = value003;
    } else if ((value004  != null) && (value004 != "")) { result = value004;
    } else if ((value005  != null) && (value005 != "")) { result = value005;
    } else if ((value006  != null) && (value006 != "")) { result = value006;
    } else if ((value007  != null) && (value007 != "")) { result = value007;
    } else if ((value008  != null) && (value008 != "")) { result = value008;
    } else if ((value009  != null) && (value009 != "")) { result = value009;
    } else if ((value010  != null) && (value010 != "")) { result = value010;
    } else if ((value011  != null) && (value011 != "")) { result = value011;
    } else if ((value012  != null) && (value012 != "")) { result = value012;
    } else if ((value013  != null) && (value013 != "")) { result = value013;
    } else if ((value014  != null) && (value014 != "")) { result = value014;
    } else if ((value015  != null) && (value015 != "")) { result = value015;
    } else if ((value016  != null) && (value016 != "")) { result = value016;
    } else if ((value017  != null) && (value017 != "")) { result = value017;
    } else if ((value018  != null) && (value018 != "")) { result = value018;
    } else if ((value019  != null) && (value019 != "")) { result = value019;
    } else if ((value020  != null) && (value020 != "")) { result = value020;
    } else if ((value021  != null) && (value021 != "")) { result = value021;
    } else if ((value022  != null) && (value022 != "")) { result = value022;
    } else if ((value023  != null) && (value023 != "")) { result = value023;
    } else if ((value024  != null) && (value024 != "")) { result = value024;
    } else if ((value025  != null) && (value025 != "")) { result = value025;
    } else if ((value026  != null) && (value026 != "")) { result = value026;
    } else if ((value027  != null) && (value027 != "")) { result = value027;
    } else if ((value028  != null) && (value028 != "")) { result = value028;
    } else if ((value029  != null) && (value029 != "")) { result = value029;
    } else if ((value030  != null) && (value030 != "")) { result = value030;
    } else if ((value031  != null) && (value031 != "")) { result = value031;
    } else if ((value032  != null) && (value032 != "")) { result = value032;
    } else if ((value033  != null) && (value033 != "")) { result = value033;
    } else if ((value034  != null) && (value034 != "")) { result = value034;
    } else if ((value035  != null) && (value035 != "")) { result = value035;
    } else if ((value036  != null) && (value036 != "")) { result = value036;
    } else if ((value037  != null) && (value037 != "")) { result = value037;
    } else if ((value038  != null) && (value038 != "")) { result = value038;
    } else if ((value039  != null) && (value039 != "")) { result = value039;
    } else if ((value040  != null) && (value040 != "")) { result = value040;
    } else if ((value041  != null) && (value041 != "")) { result = value041;
    } else if ((value042  != null) && (value042 != "")) { result = value042;
    } else if ((value043  != null) && (value043 != "")) { result = value043;
    } else if ((value044  != null) && (value044 != "")) { result = value044;
    } else if ((value045  != null) && (value045 != "")) { result = value045;
    } else if ((value046  != null) && (value046 != "")) { result = value046;
    } else if ((value047  != null) && (value047 != "")) { result = value047;
    } else if ((value048  != null) && (value048 != "")) { result = value048;
    } else if ((value049  != null) && (value049 != "")) { result = value049;
    } else if ((value050  != null) && (value050 != "")) { result = value050;
    } else if ((value051  != null) && (value051 != "")) { result = value051;
    } else if ((value052  != null) && (value052 != "")) { result = value052;
    } else if ((value053  != null) && (value053 != "")) { result = value053;
    } else if ((value054  != null) && (value054 != "")) { result = value054;
    } else if ((value055  != null) && (value055 != "")) { result = value055;
    } else if ((value056  != null) && (value056 != "")) { result = value056;
    } else if ((value057  != null) && (value057 != "")) { result = value057;
    } else if ((value058  != null) && (value058 != "")) { result = value058;
    } else if ((value059  != null) && (value059 != "")) { result = value059;
    } else if ((value060  != null) && (value060 != "")) { result = value060;
    } else if ((value061  != null) && (value061 != "")) { result = value061;
    } else if ((value062  != null) && (value062 != "")) { result = value062;
    } else if ((value063  != null) && (value063 != "")) { result = value063;
    } else if ((value064  != null) && (value064 != "")) { result = value064;
    } else if ((value065  != null) && (value065 != "")) { result = value065;
    } else if ((value066  != null) && (value066 != "")) { result = value066;
    } else if ((value067  != null) && (value067 != "")) { result = value067;
    } else if ((value068  != null) && (value068 != "")) { result = value068;
    } else if ((value069  != null) && (value069 != "")) { result = value069;
    } else if ((value070  != null) && (value070 != "")) { result = value070;
    } else if ((value071  != null) && (value071 != "")) { result = value071;
    } else if ((value072  != null) && (value072 != "")) { result = value072;
    } else if ((value073  != null) && (value073 != "")) { result = value073;
    } else if ((value074  != null) && (value074 != "")) { result = value074;
    } else if ((value075  != null) && (value075 != "")) { result = value075;
    } else if ((value076  != null) && (value076 != "")) { result = value076;
    } else if ((value077  != null) && (value077 != "")) { result = value077;
    } else if ((value078  != null) && (value078 != "")) { result = value078;
    } else if ((value079  != null) && (value079 != "")) { result = value079;
    } else if ((value080  != null) && (value080 != "")) { result = value080;
    } else if ((value081  != null) && (value081 != "")) { result = value081;
    } else if ((value082  != null) && (value082 != "")) { result = value082;
    } else if ((value083  != null) && (value083 != "")) { result = value083;
    } else if ((value084  != null) && (value084 != "")) { result = value084;
    } else if ((value085  != null) && (value085 != "")) { result = value085;
    } else if ((value086  != null) && (value086 != "")) { result = value086;
    } else if ((value087  != null) && (value087 != "")) { result = value087;
    } else if ((value088  != null) && (value088 != "")) { result = value088;
    } else if ((value089  != null) && (value089 != "")) { result = value089;
    } else if ((value090  != null) && (value090 != "")) { result = value090;
    } else if ((value091  != null) && (value091 != "")) { result = value091;
    } else if ((value092  != null) && (value092 != "")) { result = value092;
    } else if ((value093  != null) && (value093 != "")) { result = value093;
    } else if ((value094  != null) && (value094 != "")) { result = value094;
    } else if ((value095  != null) && (value095 != "")) { result = value095;
    } else if ((value096  != null) && (value096 != "")) { result = value096;
    } else if ((value097  != null) && (value097 != "")) { result = value097;
    } else if ((value098  != null) && (value098 != "")) { result = value098;
    } else if ((value099  != null) && (value099 != "")) { result = value099;
    } else if ((value100  != null) && (value100 != "")) { result = value100;
    }
    return result;
  }


  // Public Functions....
  return {write
         ,writeLine
         ,runStmnt
         ,currentOS
         ,dirSeparator
         ,settingsPathName
         ,ltrim
         ,rtrim
         ,trim
         ,coalesce
         };

})();
