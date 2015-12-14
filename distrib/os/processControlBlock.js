/**
 * Created by Jengl on 10/7/2015.
 */
var TSOS;
(function (TSOS) {
    var ProcessControlBlock = (function () {
        function ProcessControlBlock(PID, PC, Acc, Xreg, Yreg, Zflag, Base, Limit, Segment, Status, TurnAroundTime, WaitTime, Location, Priority) {
            if (PID === void 0) { PID = 0; }
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (Base === void 0) { Base = 0; }
            if (Limit === void 0) { Limit = 255; }
            if (Segment === void 0) { Segment = 0; }
            if (Status === void 0) { Status = ""; }
            if (TurnAroundTime === void 0) { TurnAroundTime = 0; }
            if (WaitTime === void 0) { WaitTime = 0; }
            if (Location === void 0) { Location = "In Memory"; }
            if (Priority === void 0) { Priority = _DefaultPriority; }
            this.PID = PID;
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.Base = Base;
            this.Limit = Limit;
            this.Segment = Segment;
            this.Status = Status;
            this.TurnAroundTime = TurnAroundTime;
            this.WaitTime = WaitTime;
            this.Location = Location;
            this.Priority = Priority;
        }
        ProcessControlBlock.prototype.init = function (pid, base, segment, loc) {
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
            this.Location = loc;
            this.Priority = _DefaultPriority;
        };
        ProcessControlBlock.prototype.updatePCB = function (pid, pc, acc, x, y, z, base, limit, segment, status, turnaroundtime, waittime) {
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
        };
        ProcessControlBlock.prototype.clearPCB = function () {
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
            this.Location = "";
            this.Priority = _DefaultPriority;
        };
        ProcessControlBlock.prototype.returnPID = function (pcb) {
            return pcb.PID;
        };
        return ProcessControlBlock;
    })();
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
