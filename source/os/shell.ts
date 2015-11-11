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
            sc = new ShellCommand(this.shellRun,
                "run",
                "<PID> - Runs program with PID of <PID>.");
            this.commandList[this.commandList.length] = sc;

            // clear memory
            sc = new ShellCommand(this.shellClearMem,
                "clearmem",
                "- Clears all segments of memory");
            this.commandList[this.commandList.length] = sc;

            // run all
            sc = new ShellCommand(this.shellRunAll,
                "runall",
                "- Executes all programs in memory at one time");
            this.commandList[this.commandList.length] = sc;

            // Quantum
            sc = new ShellCommand(this.shellQuantum,
                "quantum",
                "<Int> - Sets the Round Robin quantum to <Int>");
            this.commandList[this.commandList.length] = sc;

            // ps  - list the running processes and their IDs
            sc = new ShellCommand(this.shellPS,
                "ps",
                "- Displays all active process' PIDs");
            this.commandList[this.commandList.length] = sc;

            // kill <id> - kills the specified process id.
            sc = new ShellCommand(this.shellKill,
                "kill",
                "<PID> - Kills Program with PID of </PID>");
            this.commandList[this.commandList.length] = sc;

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
            _CPU.init();
            updateCPUTable();



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
            else if (index == programInputLength && _MemoryManager.checkFreeMem() > -1) {
                //_StdOut.putText("The User Program Input is valid.");
                index = 0;
                _CurrentSeg = _MemoryManager.checkFreeMem();
                _MemoryManager.setMemSegStartAdd(_CurrentSeg);
                _MemoryManager.MMU[_CurrentSeg].isFree = false;

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
                            //console.log("Temp String = " +tempstring + " at mem[" +_NextMemoryAddress + "]");
                            updateMemoryTable(_NextMemoryAddress, tempstring);
                            _NextMemoryAddress++;
                            //that segment of memory is no longer free

                            //console.log("temp string" + tempstring);
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
                            //console.log("Temp String = " +tempstring + " at mem[" +_NextMemoryAddress + "]");
                            updateMemoryTable(_NextMemoryAddress, tempstring);
                            _NextMemoryAddress++;

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
                var pcb = new ProcessControlBlock();
                pcb.init(_PID,_MemoryManager.MMU[_CurrentSeg].base,_CurrentSeg);
                _ProgramCount = _ProgramCount + 1;

                //Add PCB to resident queue
                _ResidentQueue.enqueue(pcb);
                _LoadedPrograms.push(_PID);

                //Let user know the PID
                _StdOut.putText("PID = " + _PID);
                //Update PID
                _PID++;

            }
            else if (_MemoryManager.checkFreeMem() == -1){
                _StdOut.putText("Sorry there is no memory left to load a program.");
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
            var temp;
            var exists = false;
            //If there are loaded programs then check if the pid they gave is valid
            if (_LoadedPrograms.length > 0) {
                for (var x = 0; x < _LoadedPrograms.length; x++) {
                    temp = _LoadedPrograms[x];
                    //If pid is valid run process
                    if (parseInt(args[0]) == temp) {
                        exists = true;
                        _Kernel.putOneProcessOnReadyQueue(args[0]);
                        _Kernel.setCPUValuesFromPCB();
                        _CPU.isExecuting = true;
                        _StdOut.putText("Running PID " + args[0]);
                        break;
                    }
                }
                //If pid doesn't exist tell user they have entered an invalid pid
                if (exists == false) {
                    _StdOut.putText("Invalid PID. Please enter a valid PID.");
                }
            }
            //If there are no loaded programs tell user
            else {
                _StdOut.putText("Sorry, no programs have been loaded. Please load a program and try again.");
            }
        }


        public shellClearMem() {
            //If there are active processes, don't allow user to clear memory
            if (_ActiveArray.length > 0) {
                _StdOut.putText("Cannot clear memory while processes are running. Please wait until programs finish executing.");
            } else {
                //Clear memory array
                _Memory.clearmem();
                //Reset all segments via memory manager
                _MemoryManager.clearSeg(0);
                _MemoryManager.clearSeg(1);
                _MemoryManager.clearSeg(2);
                //Clear loaded prgrams array
                _LoadedPrograms = [];
                //Reset cycle counter, program count, and execute time variables
                _CycleCounter = 0;
                _ProgramCount = 0;
                _ExecuteTime  = 0;
                //Clear all tables on html page
                resetMemoryTable();
                clearCPUTable();
                clearPCBTable();
                //Alert user that memory has been cleared
                _StdOut.putText("Memory has been cleared.");
            }

        }

        public shellRunAll(){
            //If there are loaded programs then start executing them
            if (_LoadedPrograms.length > 0) {
                _Kernel.loadReadyQueue();
                _Kernel.setCPUValuesFromPCB();
                //set _Cpu.isExcuting = true
                _CPU.isExecuting = true;
            }
            //Otherwise alert user that there are no programs loaded
            else {
                _StdOut.putText("Sorry, no programs have been loaded. Please load a program and try again.");
            }


        }

        public shellQuantum(args) {
            //change quantum
            _Quantum = parseInt(args[0]);
            _StdOut.putText("Quantum is now " + _Quantum);
        }

        public shellPS(){
            var text;
            var size = _ActiveArray.length;
            //If there are active processes, loop through array and add to text string then print
            if (size > 0) {
                text = "Active processes: ";
                for (var x = 0; x < size; x++) {
                    text = text + _ActiveArray[x] + ", ";
                }
            }
            //Otherwise say there are no active processes
            else {
                text = "There are no active processes.";
            }

            _StdOut.putText(text);
        }

        public shellKill(args) {
            //If killing the Current Process, move to terminated queue and remove from active array
            if (args[0] == _CurrentProcess.PID) {
                _Kernel.killCurrentProcess();
                _Kernel.removeProcessFromActiveArray(args[0]);
                //If there are still processes in ready queue continue round robin
                if (_ReadyQueue.getSize() > 0) {
                    _CPU.isExecuting = true;
                    _Kernel.roundRobin();
                }
                //Otherwise clear the ready queue table and set isExecuting to false
                else {
                    clearRQRowTable(1);
                    _CPU.isExecuting = false;
                }
            }
            //Else if it is another PID just remove it from the ready queue
            else {
                _Kernel.removeProcessFromReadyQueue(args[0]);
            }
            //Tell user and host log that process has been killed
            _StdOut.putText("Process " + args[0] + " has been killed.");
            Control.hostLog("Process " + args[0] + " killed.", "host");
        }

    }


}
