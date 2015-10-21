/**
 * Created by Jengl on 10/12/2015.
 */

module TSOS {

    export class MemoryManager{

        constructor(public base: number = 0,
                    public limit: number = 255,
                    public segmentnum: number =1,
                    public isFree: boolean = true
        ) {

        }

        public init(): void {
            if (this.isFree == true) {
                this.base = 0;
                this.limit = 255;
                this.segmentnum = 1;
                this.isFree = true;
            }
            else {
                _StdOut.putText("There is no memory to load this program");
            }
        }

        //Gets the byte after the opcode
        public getNextByte(): string {
            var nextByte;
            //_CPU.PC++;
            nextByte = _Memory.read(_CPU.PC + 1);
            return nextByte;
        }

        //Gets the byte two bytes from the opcode
        public getTwoBytesAhead(): string {
            var nextByte;
           // _CPU.PC++;
            nextByte = _Memory.read(_CPU.PC + 2);
            return nextByte;
        }
    }
}