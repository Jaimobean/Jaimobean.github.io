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
        for (var y = 0; y < 9; y++) {
            cell = "00";
            var hexadecimal = (x * 8).toString(16);
            if (y == 0) {
                cell = "<th>0x" + hexadecimal + "</th>";
                row = memTable.insertRow(-1);
                row.insertCell(0).innerHTML = cell;
                currentrownum++;
            }
            else {
                var id = "L" + currentLoc;
                row = memTable.rows[currentrownum];
                var newTD = row.insertCell(-1);
                newTD.innerHTML = "00";
                newTD.setAttribute('id', id);
                currentLoc++;
            }
        }
    }
}
//Update a certain cell in Memory Table
function updateMemoryTable(address, text) {
    document.getElementById("L" + address).innerText = text;
}
//Reset Memory Table
function resetMemoryTable() {
    for (var x = 0; x <= 767; x++) {
        document.getElementById("L" + x).innerText = "00";
    }
}
//Update CPU table with CPU contents
function updateCPUTable() {
    var CPUcontents = document.getElementsByName("cpuContents");
    CPUcontents[0].innerHTML = _CPU.PC.toString();
    CPUcontents[1].innerHTML = _CPU.Acc.toString();
    CPUcontents[2].innerHTML = _CPU.Xreg.toString();
    CPUcontents[3].innerHTML = _CPU.Yreg.toString();
    CPUcontents[4].innerHTML = _CPU.Zflag.toString();
}
//Clear CPU table
function clearCPUTable() {
    var CPUcontents = document.getElementsByName("cpuContents");
    CPUcontents[0].innerHTML = "";
    CPUcontents[1].innerHTML = "";
    CPUcontents[2].innerHTML = "";
    CPUcontents[3].innerHTML = "";
    CPUcontents[4].innerHTML = "";
}
//Update PCB table with certain PCB
function updatePCBTable(pcb) {
    var PCBcontents = document.getElementsByName("pcbContents");
    PCBcontents[0].innerHTML = pcb.PID.toString();
    PCBcontents[1].innerHTML = pcb.PC.toString();
    PCBcontents[2].innerHTML = pcb.Acc.toString();
    PCBcontents[3].innerHTML = pcb.Xreg.toString();
    PCBcontents[4].innerHTML = pcb.Yreg.toString();
    PCBcontents[5].innerHTML = pcb.Zflag.toString();
}
//Clear PCB table
function clearPCBTable() {
    var PCBcontents = document.getElementsByName("pcbContents");
    PCBcontents[0].innerHTML = "";
    PCBcontents[1].innerHTML = "";
    PCBcontents[2].innerHTML = "";
    PCBcontents[3].innerHTML = "";
    PCBcontents[4].innerHTML = "";
    PCBcontents[5].innerHTML = "";
}
//Update Ready Queue Table Row
function updateRQOneTable(pcb) {
    var RQOne = document.getElementsByName("RQ1");
    RQOne[0].innerHTML = pcb.PID.toString();
    RQOne[1].innerHTML = pcb.PC.toString();
    RQOne[2].innerHTML = pcb.Acc.toString();
    RQOne[3].innerHTML = pcb.Xreg.toString();
    RQOne[4].innerHTML = pcb.Yreg.toString();
    RQOne[5].innerHTML = pcb.Zflag.toString();
    RQOne[6].innerHTML = pcb.Base.toString();
    RQOne[7].innerHTML = pcb.Limit.toString();
    RQOne[8].innerHTML = pcb.Status.toString();
}
//Clear certain Ready Queue Row in Table
function clearRQRowTable(row) {
    if (row == 1) {
        var RQOne = document.getElementsByName("RQ1");
        RQOne[0].innerHTML = "";
        RQOne[1].innerHTML = "";
        RQOne[2].innerHTML = "";
        RQOne[3].innerHTML = "";
        RQOne[4].innerHTML = "";
        RQOne[5].innerHTML = "";
        RQOne[6].innerHTML = "";
        RQOne[7].innerHTML = "";
        RQOne[8].innerHTML = "";
    }
    else if (row == 2) {
        var RQTwo = document.getElementsByName("RQ2");
        RQTwo[0].innerHTML = "";
        RQTwo[1].innerHTML = "";
        RQTwo[2].innerHTML = "";
        RQTwo[3].innerHTML = "";
        RQTwo[4].innerHTML = "";
        RQTwo[5].innerHTML = "";
        RQTwo[6].innerHTML = "";
        RQTwo[7].innerHTML = "";
        RQTwo[8].innerHTML = "";
    }
    else if (row == 3) {
        var RQThree = document.getElementsByName("RQ3");
        RQThree[0].innerHTML = "";
        RQThree[1].innerHTML = "";
        RQThree[2].innerHTML = "";
        RQThree[3].innerHTML = "";
        RQThree[4].innerHTML = "";
        RQThree[5].innerHTML = "";
        RQThree[6].innerHTML = "";
        RQThree[7].innerHTML = "";
        RQThree[8].innerHTML = "";
    }
}
//Move certain Process to different row of Ready Queue Table
function moveRQTableRow(row, pcb) {
    if (row == 1) {
        var RQOne = document.getElementsByName("RQ1");
        console.log("hardware pid = " + pcb.PID);
        RQOne[0].innerHTML = pcb.PID.toString();
        RQOne[1].innerHTML = pcb.PC.toString();
        RQOne[2].innerHTML = pcb.Acc.toString();
        RQOne[3].innerHTML = pcb.Xreg.toString();
        RQOne[4].innerHTML = pcb.Yreg.toString();
        RQOne[5].innerHTML = pcb.Zflag.toString();
        RQOne[6].innerHTML = pcb.Base.toString();
        RQOne[7].innerHTML = pcb.Limit.toString();
        RQOne[8].innerHTML = pcb.Status.toString();
    }
    else if (row == 2) {
        var RQTwo = document.getElementsByName("RQ2");
        console.log("hardware pid = " + pcb.PID);
        RQTwo[0].innerHTML = pcb.PID.toString();
        RQTwo[1].innerHTML = pcb.PC.toString();
        RQTwo[2].innerHTML = pcb.Acc.toString();
        RQTwo[3].innerHTML = pcb.Xreg.toString();
        RQTwo[4].innerHTML = pcb.Yreg.toString();
        RQTwo[5].innerHTML = pcb.Zflag.toString();
        RQTwo[6].innerHTML = pcb.Base.toString();
        RQTwo[7].innerHTML = pcb.Limit.toString();
        RQTwo[8].innerHTML = pcb.Status.toString();
    }
    else if (row == 3) {
        var RQThree = document.getElementsByName("RQ3");
        console.log("hardware pid = " + pcb.PID);
        RQThree[0].innerHTML = pcb.PID.toString();
        RQThree[1].innerHTML = pcb.PC.toString();
        RQThree[2].innerHTML = pcb.Acc.toString();
        RQThree[3].innerHTML = pcb.Xreg.toString();
        RQThree[4].innerHTML = pcb.Yreg.toString();
        RQThree[5].innerHTML = pcb.Zflag.toString();
        RQThree[6].innerHTML = pcb.Base.toString();
        RQThree[7].innerHTML = pcb.Limit.toString();
        RQThree[8].innerHTML = pcb.Status.toString();
    }
}
//Add extra digit to number for Hex representation
function formatHexNumb(numb, size) {
    var temp = numb.toString();
    while (temp.length < size) {
        temp = "0" + temp;
    }
    return temp;
}
