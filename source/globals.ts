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
const APP_NAME: string    = "Nebula";   // 'cause a star is about to be born
const APP_VERSION: string = "4.0";   // I guess I've made progress.

const CPU_CLOCK_INTERVAL: number = 100;   // This is in ms (milliseconds) so 1000 = 1 second.

const TIMER_IRQ: number = 0;  // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
                              // NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
const KEYBOARD_IRQ: number = 1;

const SYSTEMCALL_IRQ: number = 2;

const SYSTEMCALLBRK_IRQ: number = 3;

const SCHEDULER_IRQ: number = 4;


//
// Global Variables
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
var _CPU: TSOS.Cpu;  // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.

var _Memory: TSOS.Memory; // Memory

var _MemorySize: number = 768;

var test = "";

var test2 = "";

var _DefaultPriority: number = 5;

var _MemoryDescriptor: TSOS.MemoryDescriptor;

var _MemoryManager: TSOS.MemoryManager; //Memory Manager

var _CurrentSeg: number = 0;

var _CurrentProcess: TSOS.ProcessControlBlock; //Current Process PCB

//Array of Loaded Programs
var _LoadedPrograms;

var _ProcessFinished: boolean = false;

var _OSclock: number = 0;  // Page 23.

var _Mode: number = 0;     // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.

var _Canvas: HTMLCanvasElement;         // Initialized in Control.hostInit().
var _DrawingContext: any; // = _Canvas.getContext("2d");  // Assigned here for type safety, but re-initialized in Control.hostInit() for OCD and logic.
var _DefaultFontFamily: string = "sans";        // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize: number = 13;
var _FontHeightMargin: number = 4;              // Additional space added to font size when advancing a line.

var _Trace: boolean = true;  // Default the OS trace to be on.

// The OS Kernel and its queues.
var _Kernel: TSOS.Kernel;
var _KernelInterruptQueue;          // Initializing this to null (which I would normally do) would then require us to specify the 'any' type, as below.
var _KernelInputQueue: any = null;  // Is this better? I don't like uninitialized variables. But I also don't like using the type specifier 'any'
var _KernelBuffers: any[] = null;   // when clearly 'any' is not what we want. There is likely a better way, but what is it?

//Ready Queue array
var _ReadyQueue: any = null;

//Resident Queue array
var _ResidentQueue: any = null;

//Terminate Queue
var _TerminatedQueue: any = null;

//Array storing Active Process PIDs
var _ActiveArray;

//Temporary Queue for Sorting Priority
var _PriorityQueue: any = null;

var _HighestPriority: number = 1000000;

//var _ShellStatus = "Initialized";
// Standard input and output
var _StdIn;    // Same "to null or not to null" issue as above.
var _StdOut;

// UI
var _Console: TSOS.Console;
var _OsShell: TSOS.Shell;

//Quantum and Cycle Counter
var _Quantum: number = 6;
var _CycleCounter: number = 0;

//Program Count used for Ready Queue Table
var _ProgramCount = 0;

//Time program has been executing
var _ExecuteTime  = 0;

//Scheduler
var _Scheduler = "rr";

//PCB
var _PCB: TSOS.ProcessControlBlock;

//Next location address
var _NextMemoryAddress: number = 0;

//PID
var _PID: number = 0;

//Array for previous commands
var _PreviousCommand = [];

//Array index for previous commands
var _CommandIndex = 0;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode: boolean = false;

// Global Device Driver Objects - page 12
var _krnKeyboardDriver; //  = null;
var _krnFileSystemDriver;
var _hardwareClockID: number = null;

var _isFormatted = false;
var _isProgram = false;
var _ProgramsOnDiskCount = -1;

// For testing (and enrichment)...
var Glados: any = null;  // This is the function Glados() in glados.js on Labouseur.com.
var _GLaDOS: any = null; // If the above is linked in, this is the instantiated instance of Glados.


var onDocumentLoad = function() {
	TSOS.Control.hostInit();
};
