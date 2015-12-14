/**
 * Created by Jengl on 10/28/2015.
 */
var TSOS;
(function (TSOS) {
    var MemoryDescriptor = (function () {
        //Create object of Memory descriptor with properties of base, limit, segmentnum, and isFree
        function MemoryDescriptor(base, limit, segmentnum, isFree) {
            if (base === void 0) { base = 0; }
            if (limit === void 0) { limit = 0; }
            if (segmentnum === void 0) { segmentnum = 0; }
            if (isFree === void 0) { isFree = true; }
            this.base = base;
            this.limit = limit;
            this.segmentnum = segmentnum;
            this.isFree = isFree;
        }
        //Function to initialize these values given input
        MemoryDescriptor.prototype.init = function (_base, _limit, _segmentnum, _isFree) {
            this.base = _base;
            this.limit = _limit;
            this.segmentnum = _segmentnum;
            this.isFree = _isFree;
        };
        //Reset values for certain segment of memory
        MemoryDescriptor.prototype.clear = function (_segmentnum) {
            if (_segmentnum == 0) {
                this.base = 0;
                this.limit = 255;
                this.segmentnum = _segmentnum;
                this.isFree = true;
            }
            else if (_segmentnum == 1) {
                this.base = 256;
                this.limit = 511;
                this.segmentnum = _segmentnum;
                this.isFree = true;
            }
            else if (_segmentnum == 2) {
                this.base = 512;
                this.limit = 767;
                this.segmentnum = _segmentnum;
                this.isFree = true;
            }
        };
        return MemoryDescriptor;
    })();
    TSOS.MemoryDescriptor = MemoryDescriptor;
})(TSOS || (TSOS = {}));
