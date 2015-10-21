/**
 * Created by Jengl on 10/7/2015.
 */
var TSOS;
(function (TSOS) {
    var ProcessControlBlock = (function () {
        function ProcessControlBlock(PID, PC, Acc, Xreg, Yreg, Zflag, Base, Limit, Segment) {
            if (PID === void 0) { PID = 0; }
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (Base === void 0) { Base = 0; }
            if (Limit === void 0) { Limit = 255; }
            if (Segment === void 0) { Segment = 0; }
            this.PID = PID;
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.Base = Base;
            this.Limit = Limit;
            this.Segment = Segment;
        }
        ProcessControlBlock.prototype.init = function (pid) {
            this.PID = pid;
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.Base = 0;
            this.Limit = 255;
            this.Segment = 0;
        };
        ProcessControlBlock.prototype.updatePCB = function (pc, acc, x, y, z) {
            this.PC = pc;
            this.Acc = acc;
            this.Yreg = y;
            this.Xreg = x;
            this.Zflag = z;
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
        };
        return ProcessControlBlock;
    })();
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
