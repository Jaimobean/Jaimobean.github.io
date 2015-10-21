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

module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";
        public status = "initial";



        constructor() {
        }

        public init() {
            var sc;
            //
            // Load the command list.
            (<HTMLInputElement> document.getElementById("shellStatus")).value = "Status: ";
            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            // date
            sc = new ShellCommand(this.shellDate,
                "date",
                "- Just in case you forgot what today is.");
            this.commandList[this.commandList.length] = sc;

            // whereami
            sc = new ShellCommand(this.shellLocation,
                "whereami",
                "- Describes your location in the universe.");
            this.commandList[this.commandList.length] = sc;

            // tminus
            sc = new ShellCommand(this.shellTimeLeft,
                "tminus",
                "- Tells you how much time remains until this Operating System will be completed.");
            this.commandList[this.commandList.length] = sc;

            // status <string>
            sc = new ShellCommand(this.shellStatus,
                "status",
                "<string> - Sets the status.");
            this.commandList[this.commandList.length] = sc;

            // blue screen
            sc = new ShellCommand(this.shellBlueScreen,
                "bluescreen",
                "- Displays BSOD");
            this.commandList[this.commandList.length] = sc;

            // load
            sc = new ShellCommand(this.shellLoad,
                "load",
                "- Loads User Input Programs");
            this.commandList[this.commandList.length] = sc;

            // run
            //"<PID> - Runs program with PID of <PID>."
            sc = new ShellCommand(this.shellRun,
                "run",
                "<PID> - Runs program with PID of <PID>.");
            this.commandList[this.commandList.length] = sc;

            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.

            //
            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
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
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn, args?) {
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
        }

        public parseInput(buffer): UserCommand {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }

        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("I think we can put our differences behind us.");
              _StdOut.advanceLine();
              _StdOut.putText("For science . . . You monster.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        public shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }

        public shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown(args) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        }

        public shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }

        public shellMan(args) {
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

                    // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }

        public shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        } else {
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
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }

        public shellDate() {
           const date = new Date();
            date.getDate();
            _StdOut.putText(date.toString());
        }

        public shellLocation() {
            const location = "Right Ascension: 22h 29m 38.55s Declination: −20° 50' 13.6"
            _StdOut.putText(location);

        }

        public shellTimeLeft() {
            const today = new Date();
            today.getDate();
            const final = new Date("December 8, 2015 00:00:00");
            const remaining = Math.abs(final.getTime() - today.getTime());
            _StdOut.putText("tminus " + remaining.toString() + " milliseconds");

        }

        public shellStatus(args) {
            if (args.length > 0) {
                _OsShell.status = args.join(" ");
                (<HTMLInputElement> document.getElementById("shellStatus")).value = "Status: " + _OsShell.status;
            } else {
                _StdOut.putText("Usage: status <string>  Please supply a string.");
            }
        }

        public shellBlueScreen() {
            var msg = "Too Bad So Sad";
            _Kernel.krnTrapError(msg);
        }

        public shellLoad(){
            //clear all data
            _Memory.clearmem();
            resetMemoryTable();
            _CPU.init();
            _PCB.clearPCB();
            updateCPUTable();
            updatePCBTable();

            var taProgramInput = <HTMLInputElement> document.getElementById("taProgramInput");
            var programInputLength = taProgramInput.value.length;
            var index = 0;
            var tempstring = "";
            //go through each character of user program input
            while (index < programInputLength) {
                //if character is a digit 0-9, keep going
                if (parseInt(taProgramInput.value.substring(index, index + 1)) >= 0 || parseInt(taProgramInput.value.substring(index, index + 1)) <= 9) {
                    index++;
                }
                //if character is a letter A-F, keep going
                else if (taProgramInput.value.substring(index, index + 1) == "a" || taProgramInput.value.substring(index, index + 1) == "b" || taProgramInput.value.substring(index, index + 1) == "c" || taProgramInput.value.substring(index, index + 1) == "d" || taProgramInput.value.substring(index, index + 1) == "e" || taProgramInput.value.substring(index, index + 1) == "f" || taProgramInput.value.substring(index, index + 1) == "A" || taProgramInput.value.substring(index, index + 1) == "B" || taProgramInput.value.substring(index, index + 1) == "C" || taProgramInput.value.substring(index, index + 1) == "D" || taProgramInput.value.substring(index, index + 1) == "E" || taProgramInput.value.substring(index, index + 1) == "F"){
                    index++;
                }
                //if character is a space, keep going
                else if (taProgramInput.value.substring(index, index + 1) == " ") {
                    index++;
                }
                //else it is invalid
                else {
                    _StdOut.putText("The User Program Input is Invalid. Please enter valid hexadecimal or space characters.");
                    break;
                }
            }
            //if there is no input throw error
            if (programInputLength == 0) {
                _StdOut.putText("The User Program Input is Invalid. Please enter valid hexadecimal or space characters.");
            }
            //else you've reached the end of the input without invalid character, index == programInputLength
            else if (index == programInputLength && _MemoryManager.isFree === true) {
                //_StdOut.putText("The User Program Input is valid.");
                index = 0;
                _Memory.clearmem();
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
                            console.log("Temp String = " +tempstring + " at mem[" +_NextMemoryAddress + "]");
                            updateMemoryTable(_NextMemoryAddress, tempstring);
                            _NextMemoryAddress++;
                            _MemoryManager.isFree = false;
                            console.log("temp string" + tempstring);
                            tempstring = "";
                        }
                    }
                    //if character is a letter A-F, keep going
                    else if (taProgramInput.value.substring(index, index + 1) == "a" || taProgramInput.value.substring(index, index + 1) == "b" || taProgramInput.value.substring(index, index + 1) == "c" || taProgramInput.value.substring(index, index + 1) == "d" || taProgramInput.value.substring(index, index + 1) == "e" || taProgramInput.value.substring(index, index + 1) == "f" || taProgramInput.value.substring(index, index + 1) == "A" || taProgramInput.value.substring(index, index + 1) == "B" || taProgramInput.value.substring(index, index + 1) == "C" || taProgramInput.value.substring(index, index + 1) == "D" || taProgramInput.value.substring(index, index + 1) == "E" || taProgramInput.value.substring(index, index + 1) == "F") {
                        //add character to temporary string
                        tempstring = tempstring + taProgramInput.value.substring(index, index + 1);

                        //add 1 to index
                        index++;

                        //if the the string is in a pair reset the string
                        if (tempstring.length == 2) {
                            _Memory.write(_NextMemoryAddress, tempstring);
                            console.log("Temp String = " +tempstring + " at mem[" +_NextMemoryAddress + "]");
                            updateMemoryTable(_NextMemoryAddress, tempstring);
                            console.log("'L" + _NextMemoryAddress + "'");
                            _NextMemoryAddress++;


                            _MemoryManager.isFree = false;
                            //console.log("temp string" + tempstring);
                            tempstring = "";
                        }
                    }
                    //if character is a space, keep going
                    else if (taProgramInput.value.substring(index, index + 1) == " ") {
                        index++;
                    }
                }
                //Program is done being loaded. Create PCB
                _PCB.init(_PID);
                updatePCBTable();
                _StdOut.putText("PID = " + _PID);
                _PID++;

            }

        }


        public tabPressed(buffer) {
            var fullCommand = "";
            var partialCommand = buffer;
            var partialCommandLength = partialCommand.length;
            var index: number = 0;
            var cmd;

            //go through list of commands
            while (index < this.commandList.length)
            {
                //compare each command with the partial command. if it matches return full command
                cmd = this.commandList[index].command;
                if (cmd.substring(0, partialCommandLength) === partialCommand) {
                    fullCommand = cmd;
                }
                index++;
            }
            return fullCommand;
        }

        public shellRun(args) {
            var oldPID = _PID - 1;
            if (parseInt(args[0]) !== oldPID) {
                _StdOut.putText("This is an invalid PID. Please try again.");
            }
            else {
                _CPU.isExecuting = true;
                _CPU.updateCPU(_PCB.PC, _PCB.Acc, _PCB.Xreg, _PCB.Yreg, _PCB.Zflag);
                updateCPUTable();
                _StdOut.putText("Running PID " + args[0]);
            }
        }

    }
}
