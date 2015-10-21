/**
 * Created by Jengl on 10/7/2015.
 */

module TSOS {

    export class ProcessControlBlock {

        constructor(public PID: number = 0,
                    public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public Base: number = 0,
                    public Limit: number = 255,
                    public Segment: number = 0
        ) {

        }

        public init(pid): void {
            this.PID = pid;
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.Base = 0;
            this.Limit = 255;
            this.Segment = 0;
        }

        public updatePCB(pc, acc, x, y, z): void {
            this.PC = pc;
            this.Acc = acc;
            this.Yreg = y;
            this.Xreg = x;
            this.Zflag = z;
        }

        public clearPCB(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.Base = 0;
            this.Limit = 255;
            this.Segment = 0;
        }






    }
}
