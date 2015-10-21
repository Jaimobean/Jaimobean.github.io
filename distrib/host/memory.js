var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory(Mem) {
            if (Mem === void 0) { Mem = Array(255); }
            this.Mem = Mem;
        }
        //initialize memory
        Memory.prototype.init = function () {
            for (var x = 0; x < 255; x++) {
                this.Mem[x] = ("00");
            }
            _NextMemoryAddress = 0;
        };
        //read data from memory
        Memory.prototype.read = function (position) {
            return this.Mem[position];
        };
        //write data to memory
        Memory.prototype.write = function (position, code) {
            this.Mem.splice(position, 0, code);
        };
        //clear memory
        Memory.prototype.clearmem = function () {
            for (var x = 0; x < 255; x++) {
                this.Mem[x] = ("00");
            }
            _NextMemoryAddress = 0;
            _MemoryManager.isFree = true;
        };
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
