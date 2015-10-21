/**
 * Created by Jengl on 10/6/2015.
 */


function initializeMemoryTable() {
    var cell;
    var row;
    var currentrownum = -1;
    var currentLoc = 0;
    var memTable = document.getElementById("memoryTable");
    for (var x = 0; x < 32; x++) {
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

function updateMemoryTable(address: number, text: string) {
    (<HTMLTableDataCellElement>document.getElementById("L" + address)).innerText = text;
}

function resetMemoryTable() {
    for (var x = 0; x <= 255; x++) {
        (<HTMLTableDataCellElement>document.getElementById("L" + x)).innerText = "00";
    }
}

function updateCPUTable() {
    var CPUcontents = document.getElementsByName("cpuContents");
        (<HTMLTableCellElement>CPUcontents[0]).innerHTML = _CPU.PC.toString();
        (<HTMLTableCellElement>CPUcontents[1]).innerHTML = _CPU.Acc.toString();
        (<HTMLTableCellElement>CPUcontents[2]).innerHTML = _CPU.Xreg.toString();
        (<HTMLTableCellElement>CPUcontents[3]).innerHTML = _CPU.Yreg.toString();
        (<HTMLTableCellElement>CPUcontents[4]).innerHTML = _CPU.Zflag.toString();

}

function updatePCBTable() {
    var PCBcontents = document.getElementsByName("pcbContents");
    (<HTMLTableCellElement>PCBcontents[0]).innerHTML = _PCB.PID.toString();
    (<HTMLTableCellElement>PCBcontents[1]).innerHTML = _PCB.PC.toString();
    (<HTMLTableCellElement>PCBcontents[2]).innerHTML = _PCB.Acc.toString();
    (<HTMLTableCellElement>PCBcontents[3]).innerHTML = _PCB.Xreg.toString();
    (<HTMLTableCellElement>PCBcontents[4]).innerHTML = _PCB.Yreg.toString();
    (<HTMLTableCellElement>PCBcontents[5]).innerHTML = _PCB.Zflag.toString();

}



function formatHexNumb(numb: number, size: number) {
    var temp = numb.toString();
    while (temp.length < size) {
        temp = "0" + temp;
    }
    return temp;
}