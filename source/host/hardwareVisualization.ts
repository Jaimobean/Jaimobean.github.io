/**
 * Created by Jengl on 10/6/2015.
 */

//Initialize Memory Table
function initializeMemoryTable() {
    var cell;
    var row;
    var currentrownum = -1;
    var currentLoc = 0;
    var memTable = document.getElementById("memoryTable");
    for (var x = 0; x < 96; x++) {
        for (var y = 0; y < 9; y++){
            cell = "00";
            var hexadecimal = (x * 8).toString(16);
            if (y == 0) {
                cell = "<th>0x" + hexadecimal + "</th>";
                row = (<HTMLTableElement>memTable).insertRow(-1);
                (<HTMLTableRowElement>row).insertCell(0).innerHTML = cell;
                currentrownum++;
            }
            else {
                var id = "L" + currentLoc;
                row = (<HTMLTableElement>memTable).rows[currentrownum];
                var newTD = (<HTMLTableRowElement>row).insertCell(-1);
                (<HTMLTableCellElement>newTD).innerHTML = "00";
                (<HTMLTableCellElement>newTD).setAttribute('id', id);
                currentLoc++;
            }
        }
    }
}

//Update a certain cell in Memory Table
function updateMemoryTable(address: number, text: string) {
    (<HTMLTableDataCellElement>document.getElementById("L" + address)).innerText = text;
}

//Reset Memory Table
function resetMemoryTable() {
    for (var x = 0; x <= 767; x++) {
        (<HTMLTableDataCellElement>document.getElementById("L" + x)).innerText = "00";
    }
}

function initializeDiskTable() {
    var cell;
    var row;
    var currentrownum = -1;
    var currentLoc = 0;
    var diskTable = document.getElementById("diskTable");
    var key;
    var track;
    var sector;
    var block;
    var cell;
    for (var t = 0; t < 4; t++){
        for (var s = 0; s < 8; s++) {
            for (var b = 0; b < 8; b++){
                for (var x = 0; x < 2; x++) {
                    track = t.toString();
                    sector = s.toString();
                    block = b.toString();
                    key = track + ":" + sector + ":" + block;
                    cell = sessionStorage.getItem(key);
                    if (x == 0) {
                        cell = "<th>" + key + "</th>";
                        row = (<HTMLTableElement>diskTable).insertRow(-1);
                        (<HTMLTableRowElement>row).insertCell(0).innerHTML = cell;
                        currentrownum++;
                    }
                    else {
                        var id = "D" + key;
                        row = (<HTMLTableElement>diskTable).rows[currentrownum];
                        var newTD = (<HTMLTableRowElement>row).insertCell(-1);
                        (<HTMLTableCellElement>newTD).innerHTML = cell;
                        (<HTMLTableCellElement>newTD).setAttribute('id', id);
                        currentLoc++;
                    }
                }

            }
        }
    }
}

//Update a certain cell in Disk Table
function updateDiskTable(address, value: string) {
    (<HTMLTableDataCellElement>document.getElementById("D" + address)).innerText = value;
}

//Update CPU table with CPU contents
function updateCPUTable() {
    var CPUcontents = document.getElementsByName("cpuContents");
        (<HTMLTableCellElement>CPUcontents[0]).innerHTML = _CPU.PC.toString();
        (<HTMLTableCellElement>CPUcontents[1]).innerHTML = _CPU.Acc.toString();
        (<HTMLTableCellElement>CPUcontents[2]).innerHTML = _CPU.Xreg.toString();
        (<HTMLTableCellElement>CPUcontents[3]).innerHTML = _CPU.Yreg.toString();
        (<HTMLTableCellElement>CPUcontents[4]).innerHTML = _CPU.Zflag.toString();

}

//Clear CPU table
function clearCPUTable() {
    var CPUcontents = document.getElementsByName("cpuContents");
    (<HTMLTableCellElement>CPUcontents[0]).innerHTML = "";
    (<HTMLTableCellElement>CPUcontents[1]).innerHTML = "";
    (<HTMLTableCellElement>CPUcontents[2]).innerHTML = "";
    (<HTMLTableCellElement>CPUcontents[3]).innerHTML = "";
    (<HTMLTableCellElement>CPUcontents[4]).innerHTML = "";

}

//Update PCB table with certain PCB
function updatePCBTable(pcb) {
    var PCBcontents = document.getElementsByName("pcbContents");
    (<HTMLTableCellElement>PCBcontents[0]).innerHTML = pcb.PID.toString();
    (<HTMLTableCellElement>PCBcontents[1]).innerHTML = pcb.PC.toString();
    (<HTMLTableCellElement>PCBcontents[2]).innerHTML = pcb.Acc.toString();
    (<HTMLTableCellElement>PCBcontents[3]).innerHTML = pcb.Xreg.toString();
    (<HTMLTableCellElement>PCBcontents[4]).innerHTML = pcb.Yreg.toString();
    (<HTMLTableCellElement>PCBcontents[5]).innerHTML = pcb.Zflag.toString();

}

//Clear PCB table
function clearPCBTable(){
    var PCBcontents = document.getElementsByName("pcbContents");
    (<HTMLTableCellElement>PCBcontents[0]).innerHTML = "";
    (<HTMLTableCellElement>PCBcontents[1]).innerHTML = "";
    (<HTMLTableCellElement>PCBcontents[2]).innerHTML = "";
    (<HTMLTableCellElement>PCBcontents[3]).innerHTML = "";
    (<HTMLTableCellElement>PCBcontents[4]).innerHTML = "";
    (<HTMLTableCellElement>PCBcontents[5]).innerHTML = "";
}

//Update Ready Queue Table Row
function updateRQOneTable(pcb) {
    var RQOne = document.getElementsByName("RQ1");
    (<HTMLTableCellElement>RQOne[0]).innerHTML = pcb.PID.toString();
    (<HTMLTableCellElement>RQOne[1]).innerHTML = pcb.PC.toString();
    (<HTMLTableCellElement>RQOne[2]).innerHTML = pcb.Acc.toString();
    (<HTMLTableCellElement>RQOne[3]).innerHTML = pcb.Xreg.toString();
    (<HTMLTableCellElement>RQOne[4]).innerHTML = pcb.Yreg.toString();
    (<HTMLTableCellElement>RQOne[5]).innerHTML = pcb.Zflag.toString();
    (<HTMLTableCellElement>RQOne[6]).innerHTML = pcb.Base.toString();
    (<HTMLTableCellElement>RQOne[7]).innerHTML = pcb.Limit.toString();
    (<HTMLTableCellElement>RQOne[8]).innerHTML = pcb.Status.toString();
    (<HTMLTableCellElement>RQOne[9]).innerHTML = pcb.Location.toString();
}

//Clear certain Ready Queue Row in Table
function clearRQRowTable(row) {
    if (row == 1) {
        var RQOne = document.getElementsByName("RQ1");
        (<HTMLTableCellElement>RQOne[0]).innerHTML = "";
        (<HTMLTableCellElement>RQOne[1]).innerHTML = "";
        (<HTMLTableCellElement>RQOne[2]).innerHTML = "";
        (<HTMLTableCellElement>RQOne[3]).innerHTML = "";
        (<HTMLTableCellElement>RQOne[4]).innerHTML = "";
        (<HTMLTableCellElement>RQOne[5]).innerHTML = "";
        (<HTMLTableCellElement>RQOne[6]).innerHTML = "";
        (<HTMLTableCellElement>RQOne[7]).innerHTML = "";
        (<HTMLTableCellElement>RQOne[8]).innerHTML = "";
        (<HTMLTableCellElement>RQOne[9]).innerHTML = "";
    }
    else if (row == 2) {
        var RQTwo = document.getElementsByName("RQ2");
        (<HTMLTableCellElement>RQTwo[0]).innerHTML = "";
        (<HTMLTableCellElement>RQTwo[1]).innerHTML = "";
        (<HTMLTableCellElement>RQTwo[2]).innerHTML = "";
        (<HTMLTableCellElement>RQTwo[3]).innerHTML = "";
        (<HTMLTableCellElement>RQTwo[4]).innerHTML = "";
        (<HTMLTableCellElement>RQTwo[5]).innerHTML = "";
        (<HTMLTableCellElement>RQTwo[6]).innerHTML = "";
        (<HTMLTableCellElement>RQTwo[7]).innerHTML = "";
        (<HTMLTableCellElement>RQTwo[8]).innerHTML = "";
        (<HTMLTableCellElement>RQTwo[9]).innerHTML = "";
    }
    else if (row == 3) {
        var RQThree = document.getElementsByName("RQ3");
        (<HTMLTableCellElement>RQThree[0]).innerHTML = "";
        (<HTMLTableCellElement>RQThree[1]).innerHTML = "";
        (<HTMLTableCellElement>RQThree[2]).innerHTML = "";
        (<HTMLTableCellElement>RQThree[3]).innerHTML = "";
        (<HTMLTableCellElement>RQThree[4]).innerHTML = "";
        (<HTMLTableCellElement>RQThree[5]).innerHTML = "";
        (<HTMLTableCellElement>RQThree[6]).innerHTML = "";
        (<HTMLTableCellElement>RQThree[7]).innerHTML = "";
        (<HTMLTableCellElement>RQThree[8]).innerHTML = "";
        (<HTMLTableCellElement>RQThree[9]).innerHTML = "";
    }

}

//Move certain Process to different row of Ready Queue Table
function moveRQTableRow(row, pcb){
    if (row == 1) {
        var RQOne = document.getElementsByName("RQ1");
        (<HTMLTableCellElement>RQOne[0]).innerHTML = pcb.PID.toString();
        (<HTMLTableCellElement>RQOne[1]).innerHTML = pcb.PC.toString();
        (<HTMLTableCellElement>RQOne[2]).innerHTML = pcb.Acc.toString();
        (<HTMLTableCellElement>RQOne[3]).innerHTML = pcb.Xreg.toString();
        (<HTMLTableCellElement>RQOne[4]).innerHTML = pcb.Yreg.toString();
        (<HTMLTableCellElement>RQOne[5]).innerHTML = pcb.Zflag.toString();
        (<HTMLTableCellElement>RQOne[6]).innerHTML = pcb.Base.toString();
        (<HTMLTableCellElement>RQOne[7]).innerHTML = pcb.Limit.toString();
        (<HTMLTableCellElement>RQOne[8]).innerHTML = pcb.Status.toString();
        (<HTMLTableCellElement>RQOne[9]).innerHTML = pcb.Location.toString();
    }
    else if(row == 2) {
        var RQTwo = document.getElementsByName("RQ2");
        (<HTMLTableCellElement>RQTwo[0]).innerHTML = pcb.PID.toString();
        (<HTMLTableCellElement>RQTwo[1]).innerHTML = pcb.PC.toString();
        (<HTMLTableCellElement>RQTwo[2]).innerHTML = pcb.Acc.toString();
        (<HTMLTableCellElement>RQTwo[3]).innerHTML = pcb.Xreg.toString();
        (<HTMLTableCellElement>RQTwo[4]).innerHTML = pcb.Yreg.toString();
        (<HTMLTableCellElement>RQTwo[5]).innerHTML = pcb.Zflag.toString();
        (<HTMLTableCellElement>RQTwo[6]).innerHTML = pcb.Base.toString();
        (<HTMLTableCellElement>RQTwo[7]).innerHTML = pcb.Limit.toString();
        (<HTMLTableCellElement>RQTwo[8]).innerHTML = pcb.Status.toString();
        (<HTMLTableCellElement>RQTwo[9]).innerHTML = pcb.Location.toString();
    }
    else if(row == 3) {
        var RQThree = document.getElementsByName("RQ3");
        (<HTMLTableCellElement>RQThree[0]).innerHTML = pcb.PID.toString();
        (<HTMLTableCellElement>RQThree[1]).innerHTML = pcb.PC.toString();
        (<HTMLTableCellElement>RQThree[2]).innerHTML = pcb.Acc.toString();
        (<HTMLTableCellElement>RQThree[3]).innerHTML = pcb.Xreg.toString();
        (<HTMLTableCellElement>RQThree[4]).innerHTML = pcb.Yreg.toString();
        (<HTMLTableCellElement>RQThree[5]).innerHTML = pcb.Zflag.toString();
        (<HTMLTableCellElement>RQThree[6]).innerHTML = pcb.Base.toString();
        (<HTMLTableCellElement>RQThree[7]).innerHTML = pcb.Limit.toString();
        (<HTMLTableCellElement>RQThree[8]).innerHTML = pcb.Status.toString();
        (<HTMLTableCellElement>RQThree[9]).innerHTML = pcb.Location.toString();
    }
}


//Add extra digit to number for Hex representation
function formatHexNumb(numb: number, size: number) {
    var temp = numb.toString();
    while (temp.length < size) {
        temp = "0" + temp;
    }
    return temp;
}