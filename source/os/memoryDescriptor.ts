/**
 * Created by Jengl on 10/28/2015.
 */
module TSOS {

    export class MemoryDescriptor {

        //Create object of Memory descriptor with properties of base, limit, segmentnum, and isFree
        constructor(public base:number = 0,
                    public limit:number = 0,
                    public segmentnum:number = 0,
                    public isFree:boolean = true) {

        }

        //Function to initialize these values given input
        public init( _base: number, _limit: number, _segmentnum: number, _isFree: boolean) {
            this.base = _base;
            this.limit = _limit;
            this.segmentnum = _segmentnum;
            this.isFree = _isFree;
        }

        //Reset values for certain segment of memory
        public clear(_segmentnum: number) {
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
        }
    }
}