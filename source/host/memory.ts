module TSOS {

    export class Memory {

        constructor(public Mem: string[] = Array(255)
        ) {

        }
        //initialize memory
        public init() {
            for (var x = 0; x < 255; x++) {
                this.Mem[x] = ("00");
            }
            _NextMemoryAddress = 0;
        }

        //read data from memory
        public read(position: number): string {
            return this.Mem[position];
        }

        //write data to memory
        public write(position: number, code: string): void {
            this.Mem.splice(position, 0, code);

        }

        //clear memory
        public clearmem() {
            for (var x = 0; x < 255; x++) {
                this.Mem[x] = ("00");
            }
            _NextMemoryAddress = 0;
            _MemoryManager.isFree = true;
        }


    }
}