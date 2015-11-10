/**
 * Created by Jengl on 10/12/2015.
 */
var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager(MMU) {
            if (MMU === void 0) { MMU = Array(3); }
            this.MMU = MMU;
        }
        //Initialize the 3 segments of memory as memoryDescriptor object and give start values
        MemoryManager.prototype.init = function () {
            this.MMU[0] = new TSOS.MemoryDescriptor();
            this.MMU[1] = new TSOS.MemoryDescriptor();
            this.MMU[2] = new TSOS.MemoryDescriptor();
            this.MMU[0].init(0, 255, 0, true);
            this.MMU[1].init(256, 511, 1, true);
            this.MMU[2].init(512, 767, 2, true);
        };
        //Clear a certain segment of memory
        MemoryManager.prototype.clearSeg = function (segmentnum) {
            this.MMU[segmentnum].clear(segmentnum);
        };
        //Checks to see if there is a free segment in Memory, if yes return segment number, otherwise return -1
        MemoryManager.prototype.checkFreeMem = function () {
            if (this.MMU[0].isFree == true) {
                return 0;
            }
            else if (this.MMU[1].isFree == true) {
                return 1;
            }
            else if (this.MMU[2].isFree == true) {
                return 2;
            }
            else {
                return -1;
            }
        };
        MemoryManager.prototype.setMemSegStartAdd = function (segmentnum) {
            if (segmentnum == 0) {
                _NextMemoryAddress = this.MMU[0].base;
            }
            else if (segmentnum == 1) {
                _NextMemoryAddress = this.MMU[1].base;
            }
            else if (segmentnum == 2) {
                _NextMemoryAddress = this.MMU[2].base;
            }
        };
        MemoryManager.prototype.isValidAddress = function (address) {
            if (address >= _CurrentProcess.Base && address <= _CurrentProcess.Limit) {
                return true;
            }
            else {
                return false;
            }
        };
        //Gets the byte after the opcode
        MemoryManager.prototype.getNextByte = function () {
            var nextByte;
            nextByte = _Memory.read(_CPU.PC + 1);
            return nextByte;
        };
        //Gets the byte two bytes from the opcode
        MemoryManager.prototype.getTwoBytesAhead = function () {
            var nextByte;
            nextByte = _Memory.read(_CPU.PC + 2);
            return nextByte;
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
