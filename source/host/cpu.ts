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

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;

            //initialize CPU table
            updateCPUTable();
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.

            var size = _ReadyQueue.getSize();


            //fetch
            if (this.isExecuting == true) {
                _ExecuteTime = _ExecuteTime + 1;
                if (size > 0) {
                for (var x = 0; x < size; x++) {
                    _ReadyQueue.get(x).WaitTime = _ReadyQueue.get(x).WaitTime + 1;
                }
                }
                //decode and execute
                this.decode(_Memory.read(this.PC));
            }

            //execute
        }

        public updateCPU(pc, acc, x, y, z): void {
            this.PC = pc;
            this.Acc = acc;
            this.Yreg = y;
            this.Xreg = x;
            this.Zflag = z;
        }

        public decode(opcode): any {
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
                var numberAddress = parseInt(littleEndianAddress, 16)+ _CurrentProcess.Base;
                if (_MemoryManager.isValidAddress(numberAddress) == true) {
                    this.Acc = parseInt(_Memory.read(numberAddress));
                }
                else {
                    Control.hostLog("The address stored in Memory is not in the correct Memory slot.", "Cpu");
                    _KernelInterruptQueue.enqueue(new Interrupt(SYSTEMCALLBRK_IRQ , false));
                    throw new Error("The address stored in Memory is not in the correct Memory slot.");
                }

                //Increment PC
                this.PC = this.PC + 3;
                //Update CPU table
                updateCPUTable();
            }
            else if (opcode == '8D') {
                //Store the accumulator in memory
                var tempByteOne = _MemoryManager.getNextByte();
                var tempByteTwo = _MemoryManager.getTwoBytesAhead();
                var littleEndianAddress = tempByteTwo + tempByteOne;
                var numberAddress = parseInt(littleEndianAddress, 16) + _CurrentProcess.Base;
                var format;
                if (this.Acc < 10) {
                    format = formatHexNumb(this.Acc, 2);
                    updateMemoryTable(numberAddress, format);
                }
                else {
                    format = this.Acc.toString(16);
                    updateMemoryTable(numberAddress, format);
                }
                if (_MemoryManager.isValidAddress(numberAddress) == true) {
                    _Memory.Mem[numberAddress] = format;
                }
                else {
                    Control.hostLog("Cannot store data in Memory. Trying to access different Memory slot.", "Cpu");
                    _KernelInterruptQueue.enqueue(new Interrupt(SYSTEMCALLBRK_IRQ , false));
                    throw new Error("Cannot store data in Memory. Trying to access different Memory slot.");

                }
                //Increment PC
                this.PC = this.PC + 3;


                //Update Memory Table
                updateMemoryTable(numberAddress, format);
                //Update CPU Table
                updateCPUTable();

            }
            else if (opcode == '6D') {
                //Add with carry
                //Adds contents of an address to the contents of the accumulator and keeps the result in the accumulator
                var temp;
                var tempByteOne = _MemoryManager.getNextByte();
                var tempByteTwo = _MemoryManager.getTwoBytesAhead();
                var littleEndianAddress = tempByteTwo + tempByteOne;
                var numberAddress = parseInt(littleEndianAddress, 16) + _CurrentProcess.Base;
                if (_MemoryManager.isValidAddress(numberAddress) == true) {
                    temp =  parseInt(_Memory.read(numberAddress), 16);
                    this.Acc = this.Acc + temp;
                    if (this.Acc < 10) {
                        format = formatHexNumb(this.Acc, 2);
                        updateMemoryTable(numberAddress, format);
                    }
                    else {
                        format = this.Acc.toString(16);
                        updateMemoryTable(numberAddress, format);
                    }
                    this.Acc = format;
                }
                else {
                    Control.hostLog("The address trying to be accessed is not in the correct Memory slot.", "Cpu");
                    _KernelInterruptQueue.enqueue(new Interrupt(SYSTEMCALLBRK_IRQ , false));
                    throw new Error("The address trying to be accessed is not in the correct Memory slot.");
                }

                //Increment PC
                this.PC = this.PC + 3;
                //Update CPU table
                updateCPUTable();
            }
            else if (opcode == 'A2') {
                //Load the X register with a constant
                this.Xreg = parseInt(_MemoryManager.getNextByte(), 16) + _CurrentProcess.Base;
                this.PC = this.PC + 2;
                updateCPUTable();
            }
            else if (opcode == 'AE') {
                //Load the X register from memory
                var tempByteOne = _MemoryManager.getNextByte();
                var tempByteTwo = _MemoryManager.getTwoBytesAhead();
                var littleEndianAddress = tempByteTwo + tempByteOne;
                var numberAddress = parseInt(littleEndianAddress, 16) + _CurrentProcess.Base;
                if (_MemoryManager.isValidAddress(numberAddress) == true) {
                    this.Xreg = parseInt(_Memory.Mem[numberAddress], 16);
                }
                else {
                    Control.hostLog("The address stored in Memory is not in the correct Memory slot.", "Cpu");
                    _KernelInterruptQueue.enqueue(new Interrupt(SYSTEMCALLBRK_IRQ , false));
                    throw new Error("The address stored in Memory is not in the correct Memory slot.");
                }
                //Increment PC
                this.PC = this.PC + 3;
                //Update CPU table
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
                var numberAddress = parseInt(littleEndianAddress, 16) + _CurrentProcess.Base;
                if (_MemoryManager.isValidAddress(numberAddress) == true) {
                    this.Yreg = parseInt(_Memory.Mem[numberAddress], 16);
                }
                else {
                    Control.hostLog("The address stored in Memory is not in the correct Memory slot.", "Cpu");
                    _KernelInterruptQueue.enqueue(new Interrupt(SYSTEMCALLBRK_IRQ , false));
                    throw new Error("The address stored in Memory is not in the correct Memory slot.");
                }
                //Increment PC
                this.PC = this.PC + 3;
                //Update CPU table
                updateCPUTable();
            }
            else if (opcode == 'EA') {
                //No operation
                this.PC = this.PC + 1;
            }
            else if (opcode == '00') {
                //Break (which is really a system call)
                var bool = false;
                _KernelInterruptQueue.enqueue(new Interrupt(SYSTEMCALLBRK_IRQ , bool));
            }
            else if (opcode == 'EC') {
                //Compare a byte in memory to the X reg
                //Sets the Z (zero) flag if equal
                var tempByteOne = _MemoryManager.getNextByte();
                var tempByteTwo = _MemoryManager.getTwoBytesAhead();
                var littleEndianAddress = tempByteTwo + tempByteOne;
                var numberAddress = parseInt(littleEndianAddress, 16) + _CurrentProcess.Base;
                if (_MemoryManager.isValidAddress(numberAddress) == true) {
                    var data = parseInt(_Memory.read(numberAddress), 16);
                    if (this.Xreg >= _CurrentProcess.Base) {
                        var sub = this.Xreg - _CurrentProcess.Base;
                    }
                    else {
                        sub = this.Xreg;
                    }
                    if (sub == data) {
                        this.Zflag = 1;
                    }
                    else {
                        this.Zflag = 0;
                    }
                }
                else {
                    Control.hostLog("The address stored in Memory is not in the correct Memory slot.", "Cpu");
                    _KernelInterruptQueue.enqueue(new Interrupt(SYSTEMCALLBRK_IRQ , false));
                    throw new Error("The address stored in Memory is not in the correct Memory slot.");
                }
                //Increment PC
                this.PC = this.PC + 3;
                //Update CPU table
                updateCPUTable();

            }
            else if (opcode == 'D0') {
                //Branch n bytes if Z flag = 0
                var tempByteOne = _MemoryManager.getNextByte();
                var data = parseInt(tempByteOne, 16);
                this.PC = this.PC + 2;
                if (this.Zflag === 0) {
                    this.PC = this.PC + data;
                    if (this.PC > _CurrentProcess.Limit) {
                        this.PC = this.PC - 256;
                        var sub = this.PC - _CurrentProcess.Base;
                    }
                }
                updateCPUTable();
            }
            else if (opcode == 'EE') {
                //Increment the value of a byte
                var tempByteOne = _MemoryManager.getNextByte();
                var tempByteTwo = _MemoryManager.getTwoBytesAhead();
                var littleEndianAddress = tempByteTwo + tempByteOne;
                var numberAddress = parseInt(littleEndianAddress, 16) + _CurrentProcess.Base;
                if (_MemoryManager.isValidAddress(numberAddress) == true) {
                    var decimal = parseInt(_Memory.read(numberAddress), 16);
                    decimal = decimal + 1;
                    if (decimal < 10) {
                        format = formatHexNumb(decimal, 2);
                        updateMemoryTable(numberAddress, format);
                    }
                    else {
                        format = decimal.toString(16);
                        updateMemoryTable(numberAddress, format);
                    }

                    _Memory.Mem[numberAddress] = format;
                }
                else {
                    Control.hostLog("The address stored in Memory is not in the correct Memory slot.", "Cpu");
                    _KernelInterruptQueue.enqueue(new Interrupt(SYSTEMCALLBRK_IRQ , false));
                    throw new Error("The address stored in Memory is not in the correct Memory slot.");
                }
                //Increment PC
                this.PC = this.PC + 3;
                //Update CPU table
                updateCPUTable();

            }
            else if (opcode == 'FF') {
                //System Call
                //#$01 in X reg = print the integer stored in the Y register.
                //#$02 in X reg = print the 00-terminated string stored at the address in the Y register.
                var sub = this.Xreg - _CurrentProcess.Base;
                if (sub == 1) {
                    var yvalue = this.Yreg.toString();
                    for(var x = 0; x < yvalue.length; x++){
                        _StdOut.putText(yvalue.charAt(x));
                    }
                    _StdIn.advanceLine();
                    _OsShell.putPrompt();
                    this.PC = this.PC + 1;
                }
                else if(sub == 2) {
                    var numberAddress = this.Yreg + _CurrentProcess.Base;
                    if (_MemoryManager.isValidAddress(numberAddress) == true) {
                        var current = _Memory.read(numberAddress);
                        var keycode;
                        var str = "";
                        var x = 0;
                        while (current !== "00" ) {
                            keycode = parseInt(current, 16);
                            str = str + String.fromCharCode(keycode);
                            numberAddress = numberAddress + 1;
                            current = _Memory.read(numberAddress);
                            x++;
                        }
                        _KernelInterruptQueue.enqueue(new Interrupt(SYSTEMCALL_IRQ , str));
                        this.PC = this.PC + 1;
                    }
                    else {
                        Control.hostLog("The address stored in Memory is not in the correct Memory slot.", "Cpu");
                        _KernelInterruptQueue.enqueue(new Interrupt(SYSTEMCALLBRK_IRQ , false));
                        throw new Error("The address stored in Memory is not in the correct Memory slot.");
                    }

                }
                else {
                    this.PC = this.PC + 1;
                }
                updateCPUTable();
            }
            else {
                Control.hostLog("The opcode: " + opcode + " is invalid.", "Cpu");
                _KernelInterruptQueue.enqueue(new Interrupt(SYSTEMCALLBRK_IRQ , false));
                throw new Error("The opcode: " + opcode + " is invalid.");
            }
        }

    }
}
