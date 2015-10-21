/**
 * Created by Jengl on 10/12/2015.
 */
var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager(base, limit, segmentnum, isFree) {
            if (base === void 0) { base = 0; }
            if (limit === void 0) { limit = 255; }
            if (segmentnum === void 0) { segmentnum = 1; }
            if (isFree === void 0) { isFree = true; }
            this.base = base;
            this.limit = limit;
            this.segmentnum = segmentnum;
            this.isFree = isFree;
        }
        MemoryManager.prototype.init = function () {
            if (this.isFree == true) {
                this.base = 0;
                this.limit = 255;
                this.segmentnum = 1;
                this.isFree = true;
            }
            else {
                _StdOut.putText("There is no memory to load this program");
            }
        };
        //Gets the byte after the opcode
        MemoryManager.prototype.getNextByte = function () {
            var nextByte;
            //_CPU.PC++;
            nextByte = _Memory.read(_CPU.PC + 1);
            return nextByte;
        };
        //Gets the byte two bytes from the opcode
        MemoryManager.prototype.getTwoBytesAhead = function () {
            var nextByte;
            // _CPU.PC++;
            nextByte = _Memory.read(_CPU.PC + 2);
            return nextByte;
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
