///<reference path="../globals.ts" />
/* ------------
     CPU.ts

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    var Cpu = (function () {
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            //initialize CPU table
            updateCPUTable();
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            //fetch
            if (this.isExecuting == true) {
                //decode and execute
                this.decode(_Memory.read(this.PC));
            }
            //execute
        };
        Cpu.prototype.updateCPU = function (pc, acc, x, y, z) {
            this.PC = pc;
            this.Acc = acc;
            this.Yreg = y;
            this.Xreg = x;
            this.Zflag = z;
        };
        Cpu.prototype.decode = function (opcode) {
            if (opcode == 'A9') {
                //Load the accumulator with a constant
                this.Acc = parseInt(_MemoryManager.getNextByte(), 16);
                this.PC = this.PC + 2;
                updateCPUTable();
            }
            else if (opcode == 'AD') {
                //Load the accumulator from memory
                var tempByteOne = _MemoryManager.getNextByte();
                var tempByteTwo = _MemoryManager.getTwoBytesAhead();
                var littleEndianAddress = tempByteTwo + tempByteOne;
                var numberAddress = parseInt(littleEndianAddress, 16);
                this.Acc = parseInt(_Memory.read(numberAddress));
                this.PC = this.PC + 3;
                updateCPUTable();
            }
            else if (opcode == '8D') {
                //Store the accumulator in memory
                var tempByteOne = _MemoryManager.getNextByte();
                var tempByteTwo = _MemoryManager.getTwoBytesAhead();
                var littleEndianAddress = tempByteTwo + tempByteOne;
                var numberAddress = parseInt(littleEndianAddress, 16);
                _Memory.Mem[numberAddress] = this.Acc.toString(16);
                this.PC = this.PC + 3;
                var format = formatHexNumb(this.Acc, 2);
                updateMemoryTable(numberAddress, format);
                updateCPUTable();
            }
            else if (opcode == '6D') {
                //Add with carry
                //Adds contents of an address to the contents of the accumulator and keeps the result in the accumulator
                var temp;
                var tempByteOne = _MemoryManager.getNextByte();
                var tempByteTwo = _MemoryManager.getTwoBytesAhead();
                var littleEndianAddress = tempByteTwo + tempByteOne;
                var numberAddress = parseInt(littleEndianAddress, 16);
                temp = parseInt(_Memory.read(numberAddress), 16);
                this.Acc = this.Acc + temp;
                this.PC = this.PC + 3;
                updateCPUTable();
            }
            else if (opcode == 'A2') {
                //Load the X register with a constant
                this.Xreg = parseInt(_MemoryManager.getNextByte(), 16);
                this.PC = this.PC + 2;
                updateCPUTable();
            }
            else if (opcode == 'AE') {
                //Load the X register from memory
                var tempByteOne = _MemoryManager.getNextByte();
                var tempByteTwo = _MemoryManager.getTwoBytesAhead();
                var littleEndianAddress = tempByteTwo + tempByteOne;
                var numberAddress = parseInt(littleEndianAddress, 16);
                this.Xreg = parseInt(_Memory.Mem[numberAddress], 16);
                this.PC = this.PC + 3;
                updateCPUTable();
            }
            else if (opcode == 'A0') {
                //Load Y register with a constant
                this.Yreg = parseInt(_MemoryManager.getNextByte(), 16);
                this.PC = this.PC + 2;
                updateCPUTable();
            }
            else if (opcode == 'AC') {
                //Load the Y register from memory
                var tempByteOne = _MemoryManager.getNextByte();
                var tempByteTwo = _MemoryManager.getTwoBytesAhead();
                var littleEndianAddress = tempByteTwo + tempByteOne;
                var numberAddress = parseInt(littleEndianAddress, 16);
                this.Yreg = parseInt(_Memory.Mem[numberAddress], 16);
                this.PC = this.PC + 3;
                updateCPUTable();
            }
            else if (opcode == 'EA') {
                //No operation
                this.PC = this.PC + 1;
            }
            else if (opcode == '00') {
                //Break (which is really a system call)
                var bool = false;
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(SYSTEMCALLBRK_IRQ, bool));
            }
            else if (opcode == 'EC') {
                //Compare a byte in memory to the X reg
                //Sets the Z (zero) flag if equal
                var tempByteOne = _MemoryManager.getNextByte();
                var tempByteTwo = _MemoryManager.getTwoBytesAhead();
                var littleEndianAddress = tempByteTwo + tempByteOne;
                var numberAddress = parseInt(littleEndianAddress, 16);
                var data = parseInt(_Memory.read(numberAddress), 16);
                if (this.Xreg == data) {
                    this.Zflag = 1;
                }
                else {
                    this.Zflag = 0;
                }
                this.PC = this.PC + 3;
                updateCPUTable();
            }
            else if (opcode == 'D0') {
                //Branch n bytes if Z flag = 0
                var tempByteOne = _MemoryManager.getNextByte();
                var data = parseInt(tempByteOne, 16);
                if (this.Zflag === 0) {
                    this.PC = this.PC + data;
                    if (this.PC > 256) {
                        this.PC = this.PC - 256;
                    }
                    this.PC = this.PC + 2;
                }
                else {
                    this.PC = this.PC + 2;
                }
                updateCPUTable();
            }
            else if (opcode == 'EE') {
                //Increment the value of a byte
                var tempByteOne = _MemoryManager.getNextByte();
                var tempByteTwo = _MemoryManager.getTwoBytesAhead();
                var littleEndianAddress = tempByteTwo + tempByteOne;
                var numberAddress = parseInt(littleEndianAddress, 16);
                var decimal = parseInt(_Memory.read(numberAddress), 16);
                decimal = decimal + 1;
                var hex = decimal.toString(16);
                _Memory.Mem[numberAddress] = decimal.toString(16);
                updateMemoryTable(numberAddress, hex);
                this.PC = this.PC + 3;
                updateCPUTable();
            }
            else if (opcode == 'FF') {
                //System Call
                //#$01 in X reg = print the integer stored in the Y register.
                //#$02 in X reg = print the 00-terminated string stored at the address in the Y register.
                if (this.Xreg == 1) {
                    var yvalue = this.Yreg.toString();
                    for (var x = 0; x < yvalue.length; x++) {
                        _StdOut.putText(yvalue.charAt(x));
                    }
                    _StdIn.advanceLine();
                    _OsShell.putPrompt();
                    this.PC = this.PC + 1;
                }
                else if (this.Xreg == 2) {
                    var numberAddress = this.Yreg;
                    var current = _Memory.read(numberAddress);
                    var keycode;
                    var str = "";
                    var x = 0;
                    while (current !== "00") {
                        keycode = parseInt(current, 16);
                        str = str + String.fromCharCode(keycode);
                        numberAddress = numberAddress + 1;
                        current = _Memory.read(numberAddress);
                        x++;
                    }
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(SYSTEMCALL_IRQ, str));
                    this.PC = this.PC + 1;
                }
                updateCPUTable();
            }
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
