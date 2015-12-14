/**
 * Created by Jengl on 11/25/2015.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var DeviceDriverFileSystem = (function (_super) {
        __extends(DeviceDriverFileSystem, _super);
        function DeviceDriverFileSystem() {
            // Override the base method pointers.
            _super.call(this, this.krnFileSystemDriverEntry, null);
        }
        DeviceDriverFileSystem.prototype.krnFileSystemDriverEntry = function () {
            // Initialization routine for this, the kernel-mode File System Device Driver.
            this.status = "loaded";
        };
        //Function to get the value of a key in Session Storage
        DeviceDriverFileSystem.prototype.getValue = function (key) {
            return sessionStorage.getItem(key);
        };
        //Function to set the value of a key in Session Storage
        DeviceDriverFileSystem.prototype.setValue = function (key, value) {
            sessionStorage.setItem(key, value);
        };
        //Function to get the Address of the next available directory block
        DeviceDriverFileSystem.prototype.getNextAvailableDirectory = function () {
            var key;
            var track;
            var sector;
            var block;
            var next = null;
            var temp;
            tr: for (var t = 0; t < 1; t++) {
                sec: for (var s = 0; s < 8; s++) {
                    blck: for (var b = 0; b < 8; b++) {
                        track = t.toString();
                        sector = s.toString();
                        block = b.toString();
                        key = track + ":" + sector + ":" + block;
                        temp = sessionStorage.getItem(key);
                        if (temp.toString().substr(0, 1) == "0") {
                            next = key;
                            break tr;
                        }
                    }
                }
            }
            return next;
        };
        //Function to check if the Directory is Full
        DeviceDriverFileSystem.prototype.isDirectoryFull = function () {
            var key;
            var track;
            var sector;
            var block;
            var next = null;
            var temp;
            tr: for (var t = 0; t < 1; t++) {
                sec: for (var s = 0; s < 8; s++) {
                    blck: for (var b = 0; b < 8; b++) {
                        track = t.toString();
                        sector = s.toString();
                        block = b.toString();
                        key = track + ":" + sector + ":" + block;
                        temp = sessionStorage.getItem(key);
                        if (temp.toString().substr(0, 1) == "0") {
                            next = key;
                            break tr;
                        }
                    }
                }
            }
            if (next == null) {
                return true;
            }
            else {
                return false;
            }
        };
        //Function to check is the Hard Drive Data section is full
        DeviceDriverFileSystem.prototype.isDiskDataFull = function () {
            var key;
            var track;
            var sector;
            var block;
            var next = "";
            var temp;
            tr: for (var t = 1; t < 4; t++) {
                sec: for (var s = 0; s < 8; s++) {
                    blck: for (var b = 0; b < 8; b++) {
                        track = t.toString();
                        sector = s.toString();
                        block = b.toString();
                        key = track + ":" + sector + ":" + block;
                        temp = sessionStorage.getItem(key);
                        if (temp.toString().substr(0, 1) == "0") {
                            next = key;
                            break tr;
                        }
                    }
                }
            }
            if (next == "") {
                return true;
            }
            else {
                return false;
            }
        };
        //Function to get the address of the next avaliable data block
        DeviceDriverFileSystem.prototype.getNextAvailableDataBlock = function () {
            var key;
            var track;
            var sector;
            var block;
            var next = null;
            var temp;
            tr: for (var t = 1; t < 4; t++) {
                sec: for (var s = 0; s < 8; s++) {
                    blck: for (var b = 0; b < 8; b++) {
                        track = t.toString();
                        sector = s.toString();
                        block = b.toString();
                        key = track + ":" + sector + ":" + block;
                        temp = sessionStorage.getItem(key);
                        if (temp.toString().substr(0, 1) == "0") {
                            next = key;
                            break tr;
                        }
                    }
                }
            }
            return next;
        };
        //Function the save the next available directory block to the Master Boot Record
        DeviceDriverFileSystem.prototype.saveNextAvailBlockToMBR = function () {
            if (this.getNextAvailableDirectory() !== null) {
                this.setAddressInValueHeader("0:0:0", this.getNextAvailableDirectory());
            }
        };
        //Function the clears disk and reformats it
        DeviceDriverFileSystem.prototype.formatDisk = function () {
            //clear sessionStorage
            sessionStorage.clear();
            //Set the default value for all keys
            var value = "0---............................................................";
            //var value = "0---000000000000000000000000000000000000000000000000000000000000"
            //declare key, track, sector, and block variables
            var key;
            var track;
            var sector;
            var block;
            //loop through all tracks, sectors, and blocks and set default value
            for (var t = 0; t < 4; t++) {
                for (var s = 0; s < 8; s++) {
                    for (var b = 0; b < 8; b++) {
                        track = t.toString();
                        sector = s.toString();
                        block = b.toString();
                        key = track + ":" + sector + ":" + block;
                        sessionStorage.setItem(key, value);
                    }
                }
            }
            //set isFormatted equal to true
            _isFormatted = true;
            //set Master Boot Record to in use and save the next available block address in its header
            this.setBlockInUse("0:0:0");
            this.saveNextAvailBlockToMBR();
        };
        //Function that sets a block given an address in use to 1 in the first bit
        DeviceDriverFileSystem.prototype.setBlockInUse = function (address) {
            var value;
            var newvalue;
            var end;
            //get old value
            value = this.getValue(address);
            //get the rest of the string
            end = value.substr(1);
            //change first bit to 1 and add the end of the original string
            newvalue = "1" + end;
            //set new value to address
            this.setValue(address, newvalue);
        };
        //Function that sets a block given an address in use to 0 in the first bit
        DeviceDriverFileSystem.prototype.resetBlockInUse = function (address) {
            var value;
            var newvalue;
            var end;
            //get old value
            value = this.getValue(address);
            //get the rest of the string
            end = value.substr(1);
            //change first bit to 1 and add the end of the original string
            newvalue = "0" + end;
            //set new value to address
            this.setValue(address, newvalue);
        };
        //Function to set an address in the bits 1-3 of the header of a block
        DeviceDriverFileSystem.prototype.setAddressInValueHeader = function (destaddress, dataaddress) {
            //set local variables
            var temp;
            var temp2;
            var editedAddress = dataaddress.substr(x, 1);
            var value;
            var value2;
            var newvalue;
            var beginning;
            var end;
            //remove ":"s from dataaddress
            for (var y = 0; y < dataaddress.length; y++) {
                temp2 = dataaddress.substr(y + 1, 1);
                if (temp2 !== ":") {
                    editedAddress = editedAddress + temp2;
                }
            }
            //add address one number at a time to the previous value at the destaddress
            for (var x = 0; x < editedAddress.length; x++) {
                temp = editedAddress.substr(x, 1);
                value = this.getValue(destaddress);
                value2 = value;
                beginning = value.substring(0, x + 1);
                end = value2.substr(x + 2);
                newvalue = beginning + temp + end;
                this.setValue(destaddress, newvalue);
            }
        };
        //Function to change text string to hex
        DeviceDriverFileSystem.prototype.changeTextToHex = function (str) {
            var char;
            var hexchar;
            var hexstring = "";
            for (var x = 0; x < str.length; x++) {
                char = str.charCodeAt(x);
                hexchar = char.toString(16).toUpperCase();
                hexstring = hexstring + hexchar;
            }
            return hexstring;
        };
        //Function to change hex string to text
        DeviceDriverFileSystem.prototype.changeHexToString = function (hexstr) {
            var index = 0;
            var strlength = hexstr.length;
            var tempstring = "";
            var textstring = "";
            var temp;
            var temp2;
            while (index < strlength) {
                tempstring = tempstring + hexstr.substring(index, index + 1);
                index++;
                if (tempstring.length == 2) {
                    temp = parseInt(tempstring, 16);
                    temp2 = String.fromCharCode(temp);
                    textstring = textstring + temp2;
                    tempstring = "";
                }
            }
            return textstring;
        };
        //Function to remove colons from an address
        DeviceDriverFileSystem.prototype.removeColonsFromAddress = function (address) {
            var temp;
            var editedAddress;
            //remove ":"s from original address
            for (var y = 0; y < address.length; y++) {
                temp = address.substr(y + 1, 1);
                if (temp !== ":") {
                    editedAddress = editedAddress + temp;
                }
            }
            return editedAddress;
        };
        //Function to add colons to an address
        DeviceDriverFileSystem.prototype.addColonsToAddress = function (address) {
            var temp;
            var editedAddress = address.substr(0, 1);
            for (var x = 1; x < address.length; x++) {
                editedAddress = editedAddress + ":" + address.charAt(x);
            }
            return editedAddress;
        };
        //Function to update the Master Boot Record with the next available directory block
        DeviceDriverFileSystem.prototype.updateMBR = function () {
            this.saveNextAvailBlockToMBR();
            var MBRvalue = this.getValue("0:0:0");
            updateDiskTable("0:0:0", MBRvalue);
        };
        //Function to create a file in the File System
        DeviceDriverFileSystem.prototype.createFile = function (name) {
            //Get next available direction TSB and format it
            var MBRvalue = this.getValue("0:0:0");
            var originalAddress = MBRvalue.substring(1, 4);
            var editedAddress = this.addColonsToAddress(originalAddress);
            //Format file name into hex
            var hexstring = this.changeTextToHex(name);
            //Write hex to value of TSB
            var x = 0;
            var y = 0;
            var counter = 0;
            var temp = "";
            this.setBlockInUse(editedAddress);
            var newVal = this.getValue(editedAddress).substr(0, 4);
            //if the length of the filename is less than 60 bytes
            if (hexstring.length < 120) {
                while (x < 60) {
                    while (y < hexstring.length) {
                        newVal = newVal + hexstring.substr(y, 2);
                        y = y + 2;
                        x = x + 1;
                    }
                    x = x + 1;
                    newVal = newVal + ".";
                }
                this.setValue(editedAddress, newVal);
                updateDiskTable(editedAddress, newVal);
                //Update MBR
                this.updateMBR();
                //If its not a swap file, then print out the successfully created string
                if (name.substr(0, 1) !== "~") {
                    _StdOut.putText("File '" + name + "' successfully created.");
                }
            }
            else {
                _StdOut.putText("Sorry that filename is too long. Please try again.");
            }
        };
        //Function that checks if a filename is valid
        DeviceDriverFileSystem.prototype.validFileName = function (filename) {
            var hexname = this.changeTextToHex(filename);
            var strlength = hexname.length;
            var key;
            var track;
            var sector;
            var block;
            var temp;
            var temp2;
            var next;
            var fileExists = false;
            //loop through directory track, sectors, and blocks to find the file
            tr: for (var t = 0; t < 1; t++) {
                sec: for (var s = 0; s < 8; s++) {
                    blck: for (var b = 0; b < 8; b++) {
                        track = t.toString();
                        sector = s.toString();
                        block = b.toString();
                        key = track + ":" + sector + ":" + block;
                        temp = this.getValue(key);
                        temp2 = temp.substr(4, strlength);
                        if (temp2 == hexname) {
                            fileExists = true;
                            break tr;
                        }
                    }
                }
            }
            return fileExists;
        };
        //Function that deletes a file from the File System
        DeviceDriverFileSystem.prototype.deleteFile = function (filename) {
            var hexname = this.changeTextToHex(filename);
            var strlength = hexname.length;
            var value = "0---............................................................";
            var key;
            var track;
            var sector;
            var block;
            var temp;
            var temp2;
            var address;
            var dataaddress;
            var next;
            //loop through directory track, sectors, and blocks to find the file
            tr: for (var t = 0; t < 1; t++) {
                sec: for (var s = 0; s < 8; s++) {
                    blck: for (var b = 0; b < 8; b++) {
                        track = t.toString();
                        sector = s.toString();
                        block = b.toString();
                        key = track + ":" + sector + ":" + block;
                        temp = this.getValue(key);
                        temp2 = temp.substr(4, strlength);
                        if (temp2 == hexname) {
                            address = key;
                            dataaddress = this.getValue(address).substr(1, 3);
                            break tr;
                        }
                    }
                }
            }
            //if the file is empty just reset the directory value
            if (dataaddress == "---") {
                this.setValue(address, value);
                updateDiskTable(address, value);
            }
            else {
                this.setValue(address, value);
                updateDiskTable(address, value);
                //clear all linked blocks
                while (dataaddress !== "---") {
                    dataaddress = this.addColonsToAddress(dataaddress);
                    next = this.getValue(dataaddress).substr(1, 3);
                    this.setValue(dataaddress, value);
                    updateDiskTable(dataaddress, value);
                    dataaddress = next;
                }
            }
            //Update MBR
            this.updateMBR();
        };
        //Function that writes data to a file in File System
        DeviceDriverFileSystem.prototype.writeFile = function (filename, data) {
            var hexname = this.changeTextToHex(filename);
            var strlength = hexname.length;
            var value = "0---............................................................";
            var key;
            var track;
            var sector;
            var block;
            var temp;
            var temp2;
            var address;
            var nextAvailableBlock = this.getNextAvailableDataBlock();
            var previousBlockAddress = nextAvailableBlock;
            //loop through directory track, sectors, and blocks to find file in directory
            tr: for (var t = 0; t < 1; t++) {
                sec: for (var s = 0; s < 8; s++) {
                    blck: for (var b = 0; b < 8; b++) {
                        track = t.toString();
                        sector = s.toString();
                        block = b.toString();
                        key = track + ":" + sector + ":" + block;
                        temp = this.getValue(key);
                        temp2 = temp.substr(4, strlength);
                        if (temp2 == hexname) {
                            address = key;
                            break tr;
                        }
                    }
                }
            }
            //Link first data block to directory tsb
            this.setAddressInValueHeader(address, nextAvailableBlock);
            updateDiskTable(address, this.getValue(address));
            if (_isProgram == false) {
                var hexstring = this.changeTextToHex(data);
            }
            else {
                hexstring = data;
            }
            //Write hex to value of TSB
            var x = 0;
            var y = 0;
            var w = 0;
            var v = 0;
            var counter = 0;
            this.setBlockInUse(nextAvailableBlock);
            var newVal = this.getValue(nextAvailableBlock).substr(0, 4);
            //if the string only needs 1 block write it to that blocks
            if (hexstring.length < 120) {
                while (x < 60) {
                    while (y < hexstring.length) {
                        newVal = newVal + hexstring.substr(y, 2);
                        y = y + 2;
                        x = x + 1;
                    }
                    x = x + 1;
                    newVal = newVal + ".";
                }
                this.setValue(nextAvailableBlock, newVal);
                updateDiskTable(nextAvailableBlock, newVal);
                //Update MBR
                this.updateMBR();
            }
            else {
                //determine number of blocks needs
                var numofblocks = Math.ceil(hexstring.length / 120);
                //for the number of blocks needed
                for (var z = 0; z < numofblocks; z++) {
                    //write 60 bytes at a time
                    while (w < 60) {
                        if (v < hexstring.length) {
                            newVal = newVal + hexstring.substr(v, 2);
                            v = v + 2;
                            w = w + 1;
                        }
                        else {
                            w = w + 1;
                            newVal = newVal + ".";
                        }
                    }
                    //reset w value
                    w = 0;
                    //write value to the block
                    this.setValue(nextAvailableBlock, newVal);
                    updateDiskTable(nextAvailableBlock, newVal);
                    if (z !== numofblocks - 1) {
                        //Get next available block
                        nextAvailableBlock = this.getNextAvailableDataBlock();
                        //Link data block to previous data block
                        this.setAddressInValueHeader(previousBlockAddress, nextAvailableBlock);
                        updateDiskTable(previousBlockAddress, this.getValue(previousBlockAddress));
                        previousBlockAddress = nextAvailableBlock;
                        //Set New block in use
                        this.setBlockInUse(nextAvailableBlock);
                        //set new value equal to beginning of the new block
                        newVal = this.getValue(nextAvailableBlock).substr(0, 4);
                    }
                }
                //Update MBR
                this.updateMBR();
            }
        };
        //Function to get an addrees from the header of another block
        DeviceDriverFileSystem.prototype.getAddressInHeader = function (address) {
            var val = this.getValue(address);
            val = val.substr(1, 3);
            if (val !== "---") {
                return this.addColonsToAddress(val);
            }
            else {
                return null;
            }
        };
        //Function to just get the data portion of the value from an address
        DeviceDriverFileSystem.prototype.getData = function (address) {
            var val = this.getValue(address);
            val = val.substr(4);
            return val;
        };
        //Function to get the address of a file in File System
        DeviceDriverFileSystem.prototype.getTSBOfFile = function (filename) {
            var hexname = this.changeTextToHex(filename);
            var strlength = hexname.length;
            var key;
            var track;
            var sector;
            var block;
            var temp;
            var temp2;
            var firstaddress;
            //loop through directory track, sectors, and blocks to find file in directory
            tr: for (var t = 0; t < 1; t++) {
                sec: for (var s = 0; s < 8; s++) {
                    blck: for (var b = 0; b < 8; b++) {
                        track = t.toString();
                        sector = s.toString();
                        block = b.toString();
                        key = track + ":" + sector + ":" + block;
                        temp = this.getValue(key);
                        temp2 = temp.substr(4, strlength);
                        if (temp2 == hexname) {
                            firstaddress = key;
                            break tr;
                        }
                    }
                }
            }
            return firstaddress;
        };
        //Function to read a file in the File System
        DeviceDriverFileSystem.prototype.readFile = function (filename) {
            var hexname = this.changeTextToHex(filename);
            var strlength = hexname.length;
            var value = "0---............................................................";
            var key;
            var track;
            var sector;
            var block;
            var temp;
            var temp2;
            var firstaddress;
            var address;
            var nextAvailableBlock = this.getNextAvailableDataBlock();
            var previousBlockAddress = nextAvailableBlock;
            var totalhexstring = "";
            var totaltextstring = "";
            //loop through directory track, sectors, and blocks to find file in directory
            tr: for (var t = 0; t < 1; t++) {
                sec: for (var s = 0; s < 8; s++) {
                    blck: for (var b = 0; b < 8; b++) {
                        track = t.toString();
                        sector = s.toString();
                        block = b.toString();
                        key = track + ":" + sector + ":" + block;
                        temp = this.getValue(key);
                        temp2 = temp.substr(4, strlength);
                        if (temp2 == hexname) {
                            firstaddress = key;
                            break tr;
                        }
                    }
                }
            }
            address = this.getAddressInHeader(firstaddress);
            //Get first data block to directory tsb
            if (address !== null) {
                while (address !== null) {
                    var data = this.getData(address);
                    if (this.getAddressInHeader(address) !== null) {
                        totalhexstring = totalhexstring + data;
                        address = this.getAddressInHeader(address);
                    }
                    else {
                        last: for (var x = 0; x < 120; x++) {
                            var onechar = data.substr(x, 1);
                            if (onechar !== ".") {
                                totalhexstring = totalhexstring + onechar;
                            }
                            else {
                                break last;
                            }
                        }
                        address = null;
                    }
                }
                if (_isProgram == false) {
                    totaltextstring = this.changeHexToString(totalhexstring);
                }
                else {
                    totaltextstring = totalhexstring;
                }
                return totaltextstring;
            }
            else {
                _StdOut.putText("Sorry. This file seems to be empty.");
            }
        };
        //Function to check is the Directory is empty
        DeviceDriverFileSystem.prototype.isDirectoryEmpty = function () {
            var track;
            var sector;
            var block;
            var key;
            var temp;
            var directoryEmpty = true;
            tr: for (var t = 0; t < 1; t++) {
                sec: for (var s = 0; s < 8; s++) {
                    blck: for (var b = 1; b < 8; b++) {
                        track = t.toString();
                        sector = s.toString();
                        block = b.toString();
                        key = track + ":" + sector + ":" + block;
                        temp = this.getValue(key);
                        if (temp.substr(0, 1) == "1") {
                            directoryEmpty = false;
                            break tr;
                        }
                    }
                }
            }
            return directoryEmpty;
        };
        //Function to list files in Directory of File System
        DeviceDriverFileSystem.prototype.listFiles = function () {
            var key;
            var track;
            var sector;
            var block;
            var temp;
            var name = "";
            var temp2;
            var list = new Array();
            //loop through directory track, sectors, and blocks to find the file
            tr: for (var t = 0; t < 1; t++) {
                sec: for (var s = 0; s < 8; s++) {
                    blck: for (var b = 1; b < 8; b++) {
                        track = t.toString();
                        sector = s.toString();
                        block = b.toString();
                        key = track + ":" + sector + ":" + block;
                        temp = this.getValue(key);
                        if (temp.substr(0, 1) == "1") {
                            check: for (var x = 4; x < 120; x++) {
                                temp2 = temp.substr(x, 1);
                                if (temp2 !== ".") {
                                    name = name + temp2;
                                }
                                else {
                                    break check;
                                }
                            }
                            name = this.changeHexToString(name);
                            list.push(name);
                            name = "";
                        }
                    }
                }
            }
            return list.join(", ");
        };
        return DeviceDriverFileSystem;
    })(TSOS.DeviceDriver);
    TSOS.DeviceDriverFileSystem = DeviceDriverFileSystem;
})(TSOS || (TSOS = {}));
