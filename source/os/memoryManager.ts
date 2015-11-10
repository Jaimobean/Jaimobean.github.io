/**
 * Created by Jengl on 10/12/2015.
 */

module TSOS {

    export class MemoryManager{

        constructor(public MMU: Array<MemoryDescriptor> = Array<MemoryDescriptor>(3)) {
        }

        //Initialize the 3 segments of memory as memoryDescriptor object and give start values
        public init(): void {
            this.MMU[0] = new MemoryDescriptor();
            this.MMU[1] = new MemoryDescriptor();
            this.MMU[2] = new MemoryDescriptor();

            this.MMU[0].init(0, 255, 0, true);
            this.MMU[1].init(256, 511, 1, true);
            this.MMU[2].init(512, 767, 2, true);
        }

        //Clear a certain segment of memory
        public clearSeg(segmentnum) {
            this.MMU[segmentnum].clear(segmentnum);
            this.MMU[segmentnum].isFree = true;
        }

        //Checks to see if there is a free segment in Memory, if yes return segment number, otherwise return -1
        public checkFreeMem() {
            if (this.MMU[0].isFree == true) {
                console.log("at 0");
                return 0;
            }
            else if (this.MMU[1].isFree == true) {
                console.log("at 1");
                return 1;
            }
            else if (this.MMU[2].isFree == true) {
                console.log("at 2");
                return 2;
            }
            else {
                return -1;
            }
        }

        public setMemSegStartAdd(segmentnum) {
            if (segmentnum == 0) {
                _NextMemoryAddress = this.MMU[0].base;
                console.log("0 Next mem add = " + _NextMemoryAddress);
                console.log("base = " + this.MMU[0].base);
            }
            else if (segmentnum == 1) {
                _NextMemoryAddress = this.MMU[1].base;
                console.log("1 Next mem add = " + _NextMemoryAddress);

            }
            else if (segmentnum == 2) {
                _NextMemoryAddress = this.MMU[2].base;
                console.log("2 Next mem add = " + _NextMemoryAddress);

            }
        }

        public isValidAddress(address): boolean {
            if (address >= _CurrentProcess.Base  && address <= _CurrentProcess.Limit) {
                return true;
            }
            else {
                return false;
            }
        }

        //Gets the byte after the opcode
        public getNextByte(): string {
            var nextByte;
            nextByte = _Memory.read(_CPU.PC + 1);
            return nextByte;
        }

        //Gets the byte two bytes from the opcode
        public getTwoBytesAhead(): string {
            var nextByte;
            nextByte = _Memory.read(_CPU.PC + 2);
            return nextByte;
        }
    }
}