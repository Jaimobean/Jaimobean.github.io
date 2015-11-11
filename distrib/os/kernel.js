///<reference path="../globals.ts" />
///<reference path="queue.ts" />
/* ------------
     Kernel.ts

     Requires globals.ts
              queue.ts

     Routines for the Operating System, NOT the host.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    var Kernel = (function () {
        function Kernel() {
        }
        //
        // OS Startup and Shutdown Routines
        //
        Kernel.prototype.krnBootstrap = function () {
            TSOS.Control.hostLog("bootstrap", "host"); // Use hostLog because we ALWAYS want this, even if _Trace is off.
            // Initialize our global queues.
            _KernelInterruptQueue = new TSOS.Queue(); // A (currently) non-priority queue for interrupt requests (IRQs).
            _KernelBuffers = new Array(); // Buffers... for the kernel.
            _KernelInputQueue = new TSOS.Queue(); // Where device input lands before being processed out somewhere.
            _ReadyQueue = new TSOS.Queue(); // Where ready processes wait to execute
            _ResidentQueue = new TSOS.Queue(); // Where loaded processes wait to be told to run
            _LoadedPrograms = new Array(); // Loaded program PIDs, cleared after run command
            _TerminatedQueue = new TSOS.Queue(); // Where processes go after they die
            _ActiveArray = new Array(); // List of Active process PIDs
            // Initialize the console.
            _Console = new TSOS.Console(); // The command line interface / console I/O device.
            _Console.init();
            // Initialize standard input and output to the _Console.
            _StdIn = _Console;
            _StdOut = _Console;
            // Load the Keyboard Device Driver
            this.krnTrace("Loading the keyboard device driver.");
            _krnKeyboardDriver = new TSOS.DeviceDriverKeyboard(); // Construct it.
            _krnKeyboardDriver.driverEntry(); // Call the driverEntry() initialization routine.
            this.krnTrace(_krnKeyboardDriver.status);
            //
            // ... more?
            //
            // Enable the OS Interrupts.  (Not the CPU clock interrupt, as that is done in the hardware sim.)
            this.krnTrace("Enabling the interrupts.");
            this.krnEnableInterrupts();
            // Launch the shell.
            this.krnTrace("Creating and Launching the shell.");
            _OsShell = new TSOS.Shell();
            _OsShell.init();
            // Finally, initiate student testing protocol.
            if (_GLaDOS) {
                _GLaDOS.afterStartup();
            }
        };
        Kernel.prototype.krnShutdown = function () {
            this.krnTrace("begin shutdown OS");
            // TODO: Check for running processes.  If there are some, alert and stop. Else...
            // ... Disable the Interrupts.
            this.krnTrace("Disabling the interrupts.");
            this.krnDisableInterrupts();
            //
            // Unload the Device Drivers?
            // More?
            //
            this.krnTrace("end shutdown OS");
        };
        Kernel.prototype.krnOnCPUClockPulse = function () {
            /* This gets called from the host hardware simulation every time there is a hardware clock pulse.
               This is NOT the same as a TIMER, which causes an interrupt and is handled like other interrupts.
               This, on the other hand, is the clock pulse from the hardware / VM / host that tells the kernel
               that it has to look for interrupts and process them if it finds any.                           */
            // Check for an interrupt, are any. Page 560
            if (_KernelInterruptQueue.getSize() > 0) {
                // Process the first interrupt on the interrupt queue.
                // TODO: Implement a priority queue based on the IRQ number/id to enforce interrupt priority.
                var interrupt = _KernelInterruptQueue.dequeue();
                this.krnInterruptHandler(interrupt.irq, interrupt.params);
            }
            else if (_CPU.isExecuting) {
                // if c < q
                if (_CycleCounter < _Quantum) {
                    // c++
                    _CycleCounter++;
                    _CPU.cycle();
                }
                else {
                    _CycleCounter = 0;
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(SCHEDULER_IRQ, null));
                }
            }
            else {
                this.krnTrace("Idle");
            }
        };
        //
        // Interrupt Handling
        //
        Kernel.prototype.krnEnableInterrupts = function () {
            // Keyboard
            TSOS.Devices.hostEnableKeyboardInterrupt();
            // Put more here.
        };
        Kernel.prototype.krnDisableInterrupts = function () {
            // Keyboard
            TSOS.Devices.hostDisableKeyboardInterrupt();
            // Put more here.
        };
        Kernel.prototype.krnInterruptHandler = function (irq, params) {
            // This is the Interrupt Handler Routine.  See pages 8 and 560.
            // Trace our entrance here so we can compute Interrupt Latency by analyzing the log file later on. Page 766.
            this.krnTrace("Handling IRQ~" + irq);
            // Invoke the requested Interrupt Service Routine via Switch/Case rather than an Interrupt Vector.
            // TODO: Consider using an Interrupt Vector in the future.
            // Note: There is no need to "dismiss" or acknowledge the interrupts in our design here.
            //       Maybe the hardware simulation will grow to support/require that in the future.
            switch (irq) {
                case TIMER_IRQ:
                    this.krnTimerISR(); // Kernel built-in routine for timers (not the clock).
                    break;
                case KEYBOARD_IRQ:
                    _krnKeyboardDriver.isr(params); // Kernel mode device driver
                    _StdIn.handleInput();
                    break;
                case SYSTEMCALL_IRQ:
                    _StdIn.putText(params);
                    _StdIn.advanceLine();
                    _OsShell.putPrompt();
                    break;
                case SYSTEMCALLBRK_IRQ:
                    //Calculate Turnaround Time
                    _CurrentProcess.TurnAroundTime = _CurrentProcess.TurnAroundTime + _ExecuteTime + _CurrentProcess.WaitTime;
                    //Remove one from Program Count
                    _ProgramCount = _ProgramCount - 1;
                    //Clear row from Ready Queue Table
                    clearRQRowTable(_ProgramCount);
                    //Remove process from Active Array
                    _Kernel.removeProcessFromActiveArray(_CurrentProcess.PID);
                    //Move current process to terminated queue
                    _Kernel.killCurrentProcess();
                    //Reset Cycle Counter
                    _CycleCounter = 0;
                    //Reset execute time var
                    _ExecuteTime = 0;
                    //If there are still process in the ready queue, start round robin again
                    if (_ReadyQueue.getSize() > 0) {
                        _CPU.isExecuting = true;
                        _Kernel.roundRobin();
                    }
                    else {
                        if (_TerminatedQueue.getSize() > 1) {
                            _StdOut.putText("Programs are done executing.");
                            _StdIn.advanceLine();
                            _OsShell.putPrompt();
                        }
                        else {
                            _StdOut.putText("Program is done executing.");
                            _StdIn.advanceLine();
                            _OsShell.putPrompt();
                        }
                        //Print the Turnaround Time and Wait time for each process in the Terminate Queue
                        for (var x = 0; x < _TerminatedQueue.getSize(); x++) {
                            _StdOut.putText("PID: " + _TerminatedQueue.get(x).PID + " Turnaround Time = " + _TerminatedQueue.get(x).TurnAroundTime + " Wait Time = " + _TerminatedQueue.get(x).WaitTime);
                            _StdIn.advanceLine();
                            _OsShell.putPrompt();
                        }
                        //Clear the Ready Queue Table
                        clearRQRowTable(1);
                        //Set isExecuting to false
                        _CPU.isExecuting = params;
                        //Clear loaded programs arrray
                        _LoadedPrograms = [];
                    }
                    break;
                case SCHEDULER_IRQ:
                    _Kernel.roundRobin();
                    break;
                default:
                    this.krnTrapError("Invalid Interrupt Request. irq=" + irq + " params=[" + params + "]");
            }
        };
        Kernel.prototype.krnTimerISR = function () {
            // The built-in TIMER (not clock) Interrupt Service Routine (as opposed to an ISR coming from a device driver). {
            // Check multiprogramming parameters and enforce quanta here. Call the scheduler / context switch here if necessary.
        };
        //
        // System Calls... that generate software interrupts via tha Application Programming Interface library routines.
        //
        // Some ideas:
        // - ReadConsole
        // - WriteConsole
        // - CreateProcess
        // - ExitProcess
        // - WaitForProcessToExit
        // - CreateFile
        // - OpenFile
        // - ReadFile
        // - WriteFile
        // - CloseFile
        //
        // OS Utility Routines
        //
        Kernel.prototype.krnTrace = function (msg) {
            // Check globals to see if trace is set ON.  If so, then (maybe) log the message.
            if (_Trace) {
                if (msg === "Idle") {
                    // We can't log every idle clock pulse because it would lag the browser very quickly.
                    if (_OSclock % 10 == 0) {
                        // Check the CPU_CLOCK_INTERVAL in globals.ts for an
                        // idea of the tick rate and adjust this line accordingly.
                        TSOS.Control.hostLog(msg, "OS");
                    }
                }
                else {
                    TSOS.Control.hostLog(msg, "OS");
                }
            }
        };
        Kernel.prototype.krnTrapError = function (msg) {
            TSOS.Control.hostLog("OS ERROR - TRAP: " + msg);
            _DrawingContext.fillStyle = "#0000FF";
            _DrawingContext.fillRect(0, 0, _Canvas.width, _Canvas.height);
            // TODO: Display error on console, perhaps in some sort of colored screen. (Maybe blue?)
            this.krnShutdown();
        };
        //Function that does round robin scheduling
        Kernel.prototype.roundRobin = function () {
            //Change to kernel mode
            _Mode = 0;
            //call function that saves current program details in PCB
            //add PCB to end of Ready Queue
            if (_CurrentProcess.Status !== "Terminated") {
                this.saveCurrentProgramPCB();
            }
            //call function that takes the next Program in the ready queue if there is one
            //else continue running current program
            if (_ReadyQueue.getSize() > 0) {
                this.setCPUValuesFromPCB();
            }
            //Return to user mode
            _Mode = 1;
        };
        //Function that loads the ready queue from the resident queue
        Kernel.prototype.loadReadyQueue = function () {
            var size = _ResidentQueue.getSize();
            for (var x = 0; x < size; x++) {
                var process = _ResidentQueue.dequeue();
                process.Status = "Ready";
                //update the Ready Queue table
                moveRQTableRow(_ProgramCount, process);
                _ReadyQueue.enqueue(process);
                _ActiveArray.push(process.PID);
                moveRQTableRow(x, process);
            }
        };
        //Function that puts one process on the ready queue given a PID
        Kernel.prototype.putOneProcessOnReadyQueue = function (pid) {
            var size = _ResidentQueue.getSize();
            for (var x = 0; x < size; x++) {
                var process = _ResidentQueue.dequeue();
                if (process.PID == pid) {
                    _ReadyQueue.enqueue(process);
                    //Add to active process array
                    _ActiveArray.push(process.PID);
                    moveRQTableRow(_ProgramCount, process);
                    break;
                }
                else {
                    _ResidentQueue.enqueue(process);
                }
            }
        };
        //Function that removes one process from the ready queue given a PID
        Kernel.prototype.removeProcessFromReadyQueue = function (pid) {
            var size = _ReadyQueue.getSize();
            var process = _ReadyQueue.dequeue();
            for (var x = 0; x < size; x++) {
                if (process.PID == pid) {
                    process.Status = "Terminated";
                    _TerminatedQueue.enqueue(process);
                    this.removeProcessFromActiveArray(process.PID);
                    break;
                }
                else {
                    _ReadyQueue.enqueue(_CurrentProcess);
                }
            }
        };
        //Function that removes a process from the active array given a PID
        Kernel.prototype.removeProcessFromActiveArray = function (pid) {
            var size = _ActiveArray.length;
            for (var x = 0; x < size; x++) {
                if (_ActiveArray[x] == pid) {
                    _ActiveArray.splice(x, 1);
                }
            }
        };
        //Function that changes the current processes' state to terminated and adds it to the terminated queue
        Kernel.prototype.killCurrentProcess = function () {
            _CurrentProcess.Status = "Terminated";
            updateRQOneTable(_CurrentProcess);
            updatePCBTable(_CurrentProcess);
            updateCPUTable();
            _TerminatedQueue.enqueue(_CurrentProcess);
        };
        //Function that does loads the CPU with the values from a PCB on the ready queue
        Kernel.prototype.setCPUValuesFromPCB = function () {
            _CurrentProcess = _ReadyQueue.dequeue();
            _CurrentProcess.PC = _CurrentProcess.PC + _CurrentProcess.Base;
            updatePCBTable(_CurrentProcess);
            _CPU.PC = _CurrentProcess.PC;
            _CPU.Acc = _CurrentProcess.Acc;
            _CPU.Xreg = _CurrentProcess.Xreg;
            _CPU.Yreg = _CurrentProcess.Yreg;
            _CPU.Zflag = _CurrentProcess.Zflag;
            _CurrentProcess.Status = "Running";
            updateCPUTable();
        };
        //Function that saves the Current Program values in a PCB and loads it to the ready queue
        Kernel.prototype.saveCurrentProgramPCB = function () {
            var newPCB = new TSOS.ProcessControlBlock();
            newPCB.updatePCB(_CurrentProcess.PID, _CPU.PC - _CurrentProcess.Base, _CPU.Acc, _CPU.Xreg, _CPU.Yreg, _CPU.Zflag, _CurrentProcess.Base, _CurrentProcess.Limit, _CurrentProcess.Segment, "Ready", _CurrentProcess.TurnAroundTime + _ExecuteTime, _CurrentProcess.WaitTime);
            //Reset Execute Time var
            _ExecuteTime = 0;
            //Update the Ready queue tables
            var size = _ReadyQueue.getSize();
            if (size == 0) {
                clearRQRowTable(1);
            }
            else if (size == 1) {
                moveRQTableRow(size, newPCB);
                clearRQRowTable(2);
            }
            else if (size == 2) {
                var temp = _ReadyQueue.get(1);
                moveRQTableRow(1, temp);
                moveRQTableRow(size, newPCB);
                clearRQRowTable(3);
            }
            //Add to ready queue
            _ReadyQueue.enqueue(newPCB);
            //Log context switch
            TSOS.Control.hostLog("Context Switch Occurred", "Kernel");
        };
        return Kernel;
    })();
    TSOS.Kernel = Kernel;
})(TSOS || (TSOS = {}));
