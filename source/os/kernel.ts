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

module TSOS {

    export class Kernel {
        //
        // OS Startup and Shutdown Routines
        //
        public krnBootstrap() {      // Page 8. {
            Control.hostLog("bootstrap", "host");  // Use hostLog because we ALWAYS want this, even if _Trace is off.

            // Initialize our global queues.
            _KernelInterruptQueue = new Queue();  // A (currently) non-priority queue for interrupt requests (IRQs).
            _KernelBuffers = new Array();         // Buffers... for the kernel.
            _KernelInputQueue = new Queue();      // Where device input lands before being processed out somewhere.
            _ReadyQueue = new Queue();            // Where ready processes wait to execute
            _ResidentQueue = new Queue();         // Where loaded processes wait to be told to run
            _LoadedPrograms = new Array();        // Loaded program PIDs, cleared after run command
            _TerminatedQueue = new Queue();       // Where processes go after they die
            _ActiveArray = new Array();           // List of Active process PIDs

            // Initialize the console.
            _Console = new Console();          // The command line interface / console I/O device.
            _Console.init();

            // Initialize standard input and output to the _Console.
            _StdIn  = _Console;
            _StdOut = _Console;

            // Load the Keyboard Device Driver
            this.krnTrace("Loading the keyboard device driver.");
            _krnKeyboardDriver = new DeviceDriverKeyboard();     // Construct it.
            _krnKeyboardDriver.driverEntry();                    // Call the driverEntry() initialization routine.
            this.krnTrace(_krnKeyboardDriver.status);

            //
            // ... more?
            //

            // Enable the OS Interrupts.  (Not the CPU clock interrupt, as that is done in the hardware sim.)
            this.krnTrace("Enabling the interrupts.");
            this.krnEnableInterrupts();

            // Launch the shell.
            this.krnTrace("Creating and Launching the shell.");
            _OsShell = new Shell();
            _OsShell.init();

            // Finally, initiate student testing protocol.
            if (_GLaDOS) {
                _GLaDOS.afterStartup();
            }
        }

        public krnShutdown() {
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
        }


        public krnOnCPUClockPulse() {
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
            } else if (_CPU.isExecuting) { // If there are no interrupts then run one CPU cycle if there is anything being processed. {
                // if c < q
                if (_CycleCounter < _Quantum) {
                    // c++
                    _CycleCounter++;
                    _CPU.cycle();
                }
                else {
                    _CycleCounter = 0;
                    _KernelInterruptQueue.enqueue(new Interrupt(SCHEDULER_IRQ , null));
                }
                // else
                //    c = 0
                //    dispatch sched int
            } else {                      // If there are no interrupts and there is nothing being executed then just be idle. {
                this.krnTrace("Idle");
            }
        }


        //
        // Interrupt Handling
        //
        public krnEnableInterrupts() {
            // Keyboard
            Devices.hostEnableKeyboardInterrupt();
            // Put more here.
        }

        public krnDisableInterrupts() {
            // Keyboard
            Devices.hostDisableKeyboardInterrupt();
            // Put more here.
        }

        public krnInterruptHandler(irq, params) {
            // This is the Interrupt Handler Routine.  See pages 8 and 560.
            // Trace our entrance here so we can compute Interrupt Latency by analyzing the log file later on. Page 766.
            this.krnTrace("Handling IRQ~" + irq);

            // Invoke the requested Interrupt Service Routine via Switch/Case rather than an Interrupt Vector.
            // TODO: Consider using an Interrupt Vector in the future.
            // Note: There is no need to "dismiss" or acknowledge the interrupts in our design here.
            //       Maybe the hardware simulation will grow to support/require that in the future.
            switch (irq) {
                case TIMER_IRQ:
                    this.krnTimerISR();              // Kernel built-in routine for timers (not the clock).
                    break;
                case KEYBOARD_IRQ:
                    _krnKeyboardDriver.isr(params);   // Kernel mode device driver
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
                    //Else tell user that the programs are done executing
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
                        for(var x = 0; x < _TerminatedQueue.getSize(); x++) {
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
        }

        public krnTimerISR() {
            // The built-in TIMER (not clock) Interrupt Service Routine (as opposed to an ISR coming from a device driver). {
            // Check multiprogramming parameters and enforce quanta here. Call the scheduler / context switch here if necessary.
        }

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
        public krnTrace(msg: string) {
             // Check globals to see if trace is set ON.  If so, then (maybe) log the message.
             if (_Trace) {
                if (msg === "Idle") {
                    // We can't log every idle clock pulse because it would lag the browser very quickly.
                    if (_OSclock % 10 == 0) {
                        // Check the CPU_CLOCK_INTERVAL in globals.ts for an
                        // idea of the tick rate and adjust this line accordingly.
                        Control.hostLog(msg, "OS");
                    }
                } else {
                    Control.hostLog(msg, "OS");
                }
             }
        }

        public krnTrapError(msg) {
            Control.hostLog("OS ERROR - TRAP: " + msg);
            _DrawingContext.fillStyle = "#0000FF";
            _DrawingContext.fillRect(0, 0, _Canvas.width, _Canvas.height);
            // TODO: Display error on console, perhaps in some sort of colored screen. (Maybe blue?)
            this.krnShutdown();
        }

        //Function that does round robin scheduling
        public roundRobin() {
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
        }

        //Function that loads the ready queue from the resident queue
        public loadReadyQueue() {
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
        }

        //Function that puts one process on the ready queue given a PID
        public putOneProcessOnReadyQueue(pid) {
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
        }

        //Function that removes one process from the ready queue given a PID
        public removeProcessFromReadyQueue(pid) {
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
        }

        //Function that removes a process from the active array given a PID
        public removeProcessFromActiveArray(pid) {
            var size = _ActiveArray.length;
            for (var x = 0; x < size; x++) {
                if (_ActiveArray[x] == pid) {
                    _ActiveArray.splice(x, 1);
                }
            }
        }

        //Function that changes the current processes' state to terminated and adds it to the terminated queue
        public killCurrentProcess() {
            _CurrentProcess.Status = "Terminated";
            updateRQOneTable(_CurrentProcess);
            updatePCBTable(_CurrentProcess);
            updateCPUTable();
            _TerminatedQueue.enqueue(_CurrentProcess);

        }

        //Function that does loads the CPU with the values from a PCB on the ready queue
        public setCPUValuesFromPCB() {
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

        }

        //Function that saves the Current Program values in a PCB and loads it to the ready queue
        public saveCurrentProgramPCB() {
            var newPCB = new ProcessControlBlock();
            newPCB.updatePCB(_CurrentProcess.PID, _CPU.PC -_CurrentProcess.Base, _CPU.Acc, _CPU.Xreg, _CPU.Yreg, _CPU.Zflag, _CurrentProcess.Base, _CurrentProcess.Limit, _CurrentProcess.Segment, "Ready", _CurrentProcess.TurnAroundTime + _ExecuteTime, _CurrentProcess.WaitTime);
            //Reset Execute Time var
            _ExecuteTime = 0;
            //Update the Ready queue tables
            var size = _ReadyQueue.getSize();
            if (size == 0){
                clearRQRowTable(1);
            }
            else if (size == 1) {
                moveRQTableRow(size, newPCB);
                clearRQRowTable(2);
            }
            else if (size == 2){
                var temp = _ReadyQueue.get(1);
                moveRQTableRow(1, temp);
                moveRQTableRow(size, newPCB);
                clearRQRowTable(3);
            }
            //Add to ready queue
            _ReadyQueue.enqueue(newPCB);
            //Log context switch
            Control.hostLog("Context Switch Occurred", "Kernel");
        }
    }
}
