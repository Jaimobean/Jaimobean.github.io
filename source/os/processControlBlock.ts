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
                    public Segment: number = 0,
                    public Status: string = "",
                    public TurnAroundTime: number = 0,
                    public WaitTime: number = 0
        ) {

        }

        public init(pid, base, segment): void {
            this.PID = pid;
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.Base = base;
            this.Limit = base + 255;
            this.Segment = segment;
            this.Status = "New";
            this.TurnAroundTime = 0;
            this.WaitTime = 0;
        }

        public updatePCB(pid, pc, acc, x, y, z, base, limit, segment, status, turnaroundtime, waittime): void {
            this.PID = pid;
            this.PC = pc;
            this.Acc = acc;
            this.Yreg = y;
            this.Xreg = x;
            this.Zflag = z;
            this.Base = base;
            this.Limit = limit;
            this.Segment = segment;
            this.Status = status;
            this.TurnAroundTime = turnaroundtime;
            this.WaitTime = waittime;
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
            this.Status = "";
            this.TurnAroundTime = 0;
            this.WaitTime = 0;
        }

        public returnPID(pcb: ProcessControlBlock): number {

            return pcb.PID;
        }

    }
}
