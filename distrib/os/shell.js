///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    var Shell = (function () {
        function Shell() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
            this.status = "initial";
        }
        Shell.prototype.init = function () {
            var sc;
            //
            // Load the command list.
            document.getElementById("shellStatus").value = "Status: ";
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            // date
            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Just in case you forgot what today is.");
            this.commandList[this.commandList.length] = sc;
            // whereami
            sc = new TSOS.ShellCommand(this.shellLocation, "whereami", "- Describes your location in the universe.");
            this.commandList[this.commandList.length] = sc;
            // tminus
            sc = new TSOS.ShellCommand(this.shellTimeLeft, "tminus", "- Tells you how much time remains until this Operating System will be completed.");
            this.commandList[this.commandList.length] = sc;
            // status <string>
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "<string> - Sets the status.");
            this.commandList[this.commandList.length] = sc;
            // blue screen
            sc = new TSOS.ShellCommand(this.shellBlueScreen, "bluescreen", "- Displays BSOD");
            this.commandList[this.commandList.length] = sc;
            // load
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "- Loads User Input Programs");
            this.commandList[this.commandList.length] = sc;
            // run
            sc = new TSOS.ShellCommand(this.shellRun, "run", "<PID> - Runs program with PID of <PID>.");
            this.commandList[this.commandList.length] = sc;
            // clear memory
            sc = new TSOS.ShellCommand(this.shellClearMem, "clearmem", "- Clears all segments of memory");
            this.commandList[this.commandList.length] = sc;
            // run all
            sc = new TSOS.ShellCommand(this.shellRunAll, "runall", "- Executes all programs in memory at one time");
            this.commandList[this.commandList.length] = sc;
            // Quantum
            sc = new TSOS.ShellCommand(this.shellQuantum, "quantum", "<Int> - Sets the Round Robin quantum to <Int>");
            this.commandList[this.commandList.length] = sc;
            // ps  - list the running processes and their IDs
            sc = new TSOS.ShellCommand(this.shellPS, "ps", "- Displays all active process' PIDs");
            this.commandList[this.commandList.length] = sc;
            // kill <id> - kills the specified process id.
            sc = new TSOS.ShellCommand(this.shellKill, "kill", "<PID> - Kills Program with PID of </PID>");
            this.commandList[this.commandList.length] = sc;
            //
            // Display the initial prompt.
            this.putPrompt();
        };
        Shell.prototype.putPrompt = function () {
            _StdOut.putText(this.promptStr);
        };
        Shell.prototype.handleInput = function (buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match.  TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) {
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {
                    this.execute(this.shellApology);
                }
                else {
                    this.execute(this.shellInvalidCommand);
                }
            }
        };
        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        Shell.prototype.execute = function (fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        };
        Shell.prototype.parseInput = function (buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        };
        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        Shell.prototype.shellInvalidCommand = function () {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        };
        Shell.prototype.shellCurse = function () {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        };
        Shell.prototype.shellApology = function () {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        };
        Shell.prototype.shellVer = function (args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        };
        Shell.prototype.shellHelp = function (args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        };
        Shell.prototype.shellShutdown = function (args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        };
        Shell.prototype.shellCls = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        };
        Shell.prototype.shellMan = function (args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    case "ver":
                        _StdOut.putText("Ver displays the name and version of the current Operating System.");
                    case "shutdown":
                        _StdOut.putText("Shutdown shuts down virtual OS but hardware continues to run inlcuding host log.");
                    case "cls":
                        _StdOut.putText("Cls clears the canvas and gives console new line");
                    case "man":
                        _StdOut.putText("Man 'topic' will give you a description of designated command");
                    case "trace":
                        _StdOut.putText("Trace 'on|off' can turn on/off the OS trace setting.");
                    case "rot13":
                        _StdOut.putText("Rot13 encodes a specified string with a letter shift cipher.");
                    case "prompt":
                        _StdOut.putText("Prompt sets the prompt to the specified string following the command");
                    case "date":
                        _StdOut.putText("Date gives you the current date, time, and time zone.");
                    case "whereami":
                        _StdOut.putText("Whereami gives the location of this OS, currently in the Helix Nebula");
                    case "tminus":
                        _StdOut.putText("Tminus returns the milliseconds until this OS project is due. DUN DUN DUN.");
                    case "status":
                        _StdOut.putText("Status sets the status to the specified string.");
                    case "bluescreen":
                        _StdOut.putText("Bluescreen enables the blue screen of death (BSOD) and shuts down the kernel");
                    case "load":
                        _StdOut.putText("Load checks if the User Program Input is hexadecimal or a space and returns whether it is valid or not.");
                    case "run":
                        _StdOut.putText("Runs the specified loaded program.");
                    case "runall":
                        _StdOut.putText("Runs all the loaded programs.");
                    case "quantum":
                        _StdOut.putText("Sets the quantum to the specified number.");
                    case "clearmem":
                        _StdOut.putText("Clears all segments of memory.");
                    case "ps":
                        _StdOut.putText("Lists all active processes.");
                    case "kill":
                        _StdOut.putText("Kills specified process.");
                    // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        };
        Shell.prototype.shellTrace = function (args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        };
        Shell.prototype.shellRot13 = function (args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellPrompt = function (args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellDate = function () {
            var date = new Date();
            date.getDate();
            _StdOut.putText(date.toString());
        };
        Shell.prototype.shellLocation = function () {
            var location = "Right Ascension: 22h 29m 38.55s Declination: −20° 50' 13.6";
            _StdOut.putText(location);
        };
        Shell.prototype.shellTimeLeft = function () {
            var today = new Date();
            today.getDate();
            var final = new Date("December 8, 2015 00:00:00");
            var remaining = Math.abs(final.getTime() - today.getTime());
            _StdOut.putText("tminus " + remaining.toString() + " milliseconds");
        };
        Shell.prototype.shellStatus = function (args) {
            if (args.length > 0) {
                _OsShell.status = args.join(" ");
                document.getElementById("shellStatus").value = "Status: " + _OsShell.status;
            }
            else {
                _StdOut.putText("Usage: status <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellBlueScreen = function () {
            var msg = "Too Bad So Sad";
            _Kernel.krnTrapError(msg);
        };
        Shell.prototype.shellLoad = function () {
            _CPU.init();
            updateCPUTable();
            var taProgramInput = document.getElementById("taProgramInput");
            var programInputLength = taProgramInput.value.length;
            var index = 0;
            var tempstring = "";
            //go through each character of user program input
            while (index < programInputLength) {
                //if character is a digit 0-9, keep going
                if (parseInt(taProgramInput.value.substring(index, index + 1)) >= 0 || parseInt(taProgramInput.value.substring(index, index + 1)) <= 9) {
                    index++;
                }
                else if (taProgramInput.value.substring(index, index + 1) == "a" || taProgramInput.value.substring(index, index + 1) == "b" || taProgramInput.value.substring(index, index + 1) == "c" || taProgramInput.value.substring(index, index + 1) == "d" || taProgramInput.value.substring(index, index + 1) == "e" || taProgramInput.value.substring(index, index + 1) == "f" || taProgramInput.value.substring(index, index + 1) == "A" || taProgramInput.value.substring(index, index + 1) == "B" || taProgramInput.value.substring(index, index + 1) == "C" || taProgramInput.value.substring(index, index + 1) == "D" || taProgramInput.value.substring(index, index + 1) == "E" || taProgramInput.value.substring(index, index + 1) == "F") {
                    index++;
                }
                else if (taProgramInput.value.substring(index, index + 1) == " ") {
                    index++;
                }
                else {
                    _StdOut.putText("The User Program Input is Invalid. Please enter valid hexadecimal or space characters.");
                    break;
                }
            }
            //if there is no input throw error
            if (programInputLength == 0) {
                _StdOut.putText("The User Program Input is Invalid. Please enter valid hexadecimal or space characters.");
            }
            else if (index == programInputLength && _MemoryManager.checkFreeMem() > -1) {
                //_StdOut.putText("The User Program Input is valid.");
                index = 0;
                _CurrentSeg = _MemoryManager.checkFreeMem();
                _MemoryManager.setMemSegStartAdd(_CurrentSeg);
                _MemoryManager.MMU[_CurrentSeg].isFree = false;
                // _Memory.clearmem();
                //go through input and add pairs of characters to memory
                while (index < programInputLength) {
                    //if character is a digit 0-9, keep going
                    if (parseInt(taProgramInput.value.substring(index, index + 1)) >= 0 || parseInt(taProgramInput.value.substring(index, index + 1)) <= 9) {
                        //add character to temporary string
                        tempstring = tempstring + taProgramInput.value.substring(index, index + 1);
                        //add 1 to index
                        index++;
                        //if the the string is in a pair reset the string
                        if (tempstring.length == 2) {
                            //add to memory
                            _Memory.write(_NextMemoryAddress, tempstring);
                            // console.log("Temp String = " +tempstring + " at mem[" +_NextMemoryAddress + "]");
                            updateMemoryTable(_NextMemoryAddress, tempstring);
                            _NextMemoryAddress++;
                            //that segment of memory is no longer free
                            //console.log("temp string" + tempstring);
                            tempstring = "";
                        }
                    }
                    else if (taProgramInput.value.substring(index, index + 1) == "a" || taProgramInput.value.substring(index, index + 1) == "b" || taProgramInput.value.substring(index, index + 1) == "c" || taProgramInput.value.substring(index, index + 1) == "d" || taProgramInput.value.substring(index, index + 1) == "e" || taProgramInput.value.substring(index, index + 1) == "f" || taProgramInput.value.substring(index, index + 1) == "A" || taProgramInput.value.substring(index, index + 1) == "B" || taProgramInput.value.substring(index, index + 1) == "C" || taProgramInput.value.substring(index, index + 1) == "D" || taProgramInput.value.substring(index, index + 1) == "E" || taProgramInput.value.substring(index, index + 1) == "F") {
                        //add character to temporary string
                        tempstring = tempstring + taProgramInput.value.substring(index, index + 1);
                        //add 1 to index
                        index++;
                        //if the the string is in a pair reset the string
                        if (tempstring.length == 2) {
                            _Memory.write(_NextMemoryAddress, tempstring);
                            //console.log("Temp String = " +tempstring + " at mem[" +_NextMemoryAddress + "]");
                            updateMemoryTable(_NextMemoryAddress, tempstring);
                            _NextMemoryAddress++;
                            //console.log("temp string" + tempstring);
                            tempstring = "";
                        }
                    }
                    else if (taProgramInput.value.substring(index, index + 1) == " ") {
                        index++;
                    }
                }
                //Program is done being loaded. Create PCB
                var pcb = new TSOS.ProcessControlBlock();
                pcb.init(_PID, _MemoryManager.MMU[_CurrentSeg].base, _CurrentSeg);
                _ProgramCount = _ProgramCount + 1;
                //Add PCB to resident queue
                _ResidentQueue.enqueue(pcb);
                _LoadedPrograms.push(_PID);
                //Let user know the PID
                _StdOut.putText("PID = " + _PID);
                //Update PID
                _PID++;
            }
            else {
                _StdOut.putText("Sorry there is no memory left to load a program.");
            }
        };
        Shell.prototype.tabPressed = function (buffer) {
            var fullCommand = "";
            var partialCommand = buffer;
            var partialCommandLength = partialCommand.length;
            var index = 0;
            var cmd;
            //go through list of commands
            while (index < this.commandList.length) {
                //compare each command with the partial command. if it matches return full command
                cmd = this.commandList[index].command;
                if (cmd.substring(0, partialCommandLength) === partialCommand) {
                    fullCommand = cmd;
                }
                index++;
            }
            return fullCommand;
        };
        Shell.prototype.shellRun = function (args) {
            var temp;
            var exists = false;
            if (_LoadedPrograms.length > 0) {
                for (var x = 0; x < _LoadedPrograms.length; x++) {
                    temp = _LoadedPrograms[x];
                    if (parseInt(args[0]) == temp) {
                        exists = true;
                        _Kernel.putOneProcessOnReadyQueue(args[0]);
                        _Kernel.setCPUValuesFromPCB();
                        _CPU.isExecuting = true;
                        _StdOut.putText("Running PID " + args[0]);
                        break;
                    }
                }
                if (exists == false) {
                    _StdOut.putText("Invalid PID. Please enter a valid PID.");
                }
            }
            else {
                _StdOut.putText("Sorry, no programs have been loaded. Please load a program and try again.");
            }
        };
        Shell.prototype.shellClearMem = function () {
            _Memory.clearmem();
            _MemoryManager.clearSeg(0);
            _MemoryManager.clearSeg(1);
            _MemoryManager.clearSeg(2);
            _LoadedPrograms = [];
            _CycleCounter = 0;
            _ProgramCount = 0;
            _ExecuteTime = 0;
            resetMemoryTable();
            _StdOut.putText("Memory has been cleared");
        };
        Shell.prototype.shellRunAll = function () {
            if (_LoadedPrograms.length > 0) {
                _Kernel.loadReadyQueue();
                _Kernel.setCPUValuesFromPCB();
                //set _Cpu.isExcuting = true
                _CPU.isExecuting = true;
            }
            else {
                _StdOut.putText("Sorry, no programs have been loaded. Please load a program and try again.");
            }
        };
        Shell.prototype.shellQuantum = function (args) {
            //change quantum
            _Quantum = parseInt(args[0]);
            _StdOut.putText("Quantum is now " + _Quantum);
        };
        Shell.prototype.shellPS = function () {
            var text;
            var size = _ActiveArray.length;
            if (size > 0) {
                text = "Active processes: ";
                for (var x = 0; x < size; x++) {
                    text = text + _ActiveArray[x] + ", ";
                }
            }
            else {
                text = "There are no active processes.";
            }
            _StdOut.putText(text);
        };
        Shell.prototype.shellKill = function (args) {
            if (args[0] == _CurrentProcess.PID) {
                _Kernel.killCurrentProcess();
                if (_ReadyQueue.getSize() > 0) {
                    _CPU.isExecuting = true;
                    _Kernel.roundRobin();
                }
                else {
                    clearRQRowTable(1);
                    _CPU.isExecuting = false;
                }
            }
            else {
                _Kernel.removeProcessFromReadyQueue(args[0]);
            }
            _StdOut.putText("Process " + args[0] + " has been killed.");
            TSOS.Control.hostLog("Process " + args[0] + " killed.", "host");
        };
        return Shell;
    })();
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
