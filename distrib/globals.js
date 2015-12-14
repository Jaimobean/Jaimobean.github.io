/* ------------
   Globals.ts

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)

   This code references page numbers in the text book:
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */
//
// Global CONSTANTS (TypeScript 1.5 introduced const. Very cool.)
//
var APP_NAME = "Nebula"; // 'cause a star is about to be born
var APP_VERSION = "2.0"; // I guess I've made progress.
var CPU_CLOCK_INTERVAL = 100; // This is in ms (milliseconds) so 1000 = 1 second.
var TIMER_IRQ = 0; // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
// NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
var KEYBOARD_IRQ = 1;
var SYSTEMCALL_IRQ = 2;
var SYSTEMCALLBRK_IRQ = 3;
var SCHEDULER_IRQ = 4;
//
// Global Variables
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
var _CPU; // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.
var _Memory; // Memory
var _MemorySize = 768;
var test = "";
var test2 = "";
var _DefaultPriority = 5;
var _MemoryDescriptor;
var _MemoryManager; //Memory Manager
var _CurrentSeg = 0;
var _CurrentProcess; //Current Process PCB
//Array of Loaded Programs
var _LoadedPrograms;
var _ProcessFinished = false;
var _OSclock = 0; // Page 23.
var _Mode = 0; // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.
var _Canvas; // Initialized in Control.hostInit().
var _DrawingContext; // = _Canvas.getContext("2d");  // Assigned here for type safety, but re-initialized in Control.hostInit() for OCD and logic.
var _DefaultFontFamily = "sans"; // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4; // Additional space added to font size when advancing a line.
var _Trace = true; // Default the OS trace to be on.
// The OS Kernel and its queues.
var _Kernel;
var _KernelInterruptQueue; // Initializing this to null (which I would normally do) would then require us to specify the 'any' type, as below.
var _KernelInputQueue = null; // Is this better? I don't like uninitialized variables. But I also don't like using the type specifier 'any'
var _KernelBuffers = null; // when clearly 'any' is not what we want. There is likely a better way, but what is it?
//Ready Queue array
var _ReadyQueue = null;
//Resident Queue array
var _ResidentQueue = null;
//Terminate Queue
var _TerminatedQueue = null;
//Array storing Active Process PIDs
var _ActiveArray;
//Temporary Queue for Sorting Priority
var _PriorityQueue = null;
var _HighestPriority = 1000000;
//var _ShellStatus = "Initialized";
// Standard input and output
var _StdIn; // Same "to null or not to null" issue as above.
var _StdOut;
// UI
var _Console;
var _OsShell;
//Quantum and Cycle Counter
var _Quantum = 6;
var _CycleCounter = 0;
//Program Count used for Ready Queue Table
var _ProgramCount = 0;
//Time program has been executing
var _ExecuteTime = 0;
//Scheduler
var _Scheduler = "rr";
//PCB
var _PCB;
//Next location address
var _NextMemoryAddress = 0;
//PID
var _PID = 0;
//Array for previous commands
var _PreviousCommand = [];
//Array index for previous commands
var _CommandIndex = 0;
// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;
// Global Device Driver Objects - page 12
var _krnKeyboardDriver; //  = null;
var _krnFileSystemDriver;
var _hardwareClockID = null;
var _isFormatted = false;
var _isProgram = false;
var _ProgramsOnDiskCount = -1;
// For testing (and enrichment)...
var Glados = null; // This is the function Glados() in glados.js on Labouseur.com.
var _GLaDOS = null; // If the above is linked in, this is the instantiated instance of Glados.
var onDocumentLoad = function () {
    TSOS.Control.hostInit();
};
