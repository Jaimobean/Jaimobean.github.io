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
function updateMemoryTable(address, text) {
    document.getElementById("L" + address).innerText = text;
}
function resetMemoryTable() {
    for (var x = 0; x <= 255; x++) {
        document.getElementById("L" + x).innerText = "00";
    }
}
function updateCPUTable() {
    var CPUcontents = document.getElementsByName("cpuContents");
    CPUcontents[0].innerHTML = _CPU.PC.toString();
    CPUcontents[1].innerHTML = _CPU.Acc.toString();
    CPUcontents[2].innerHTML = _CPU.Xreg.toString();
    CPUcontents[3].innerHTML = _CPU.Yreg.toString();
    CPUcontents[4].innerHTML = _CPU.Zflag.toString();
}
function updatePCBTable() {
    var PCBcontents = document.getElementsByName("pcbContents");
    PCBcontents[0].innerHTML = _PCB.PID.toString();
    PCBcontents[1].innerHTML = _PCB.PC.toString();
    PCBcontents[2].innerHTML = _PCB.Acc.toString();
    PCBcontents[3].innerHTML = _PCB.Xreg.toString();
    PCBcontents[4].innerHTML = _PCB.Yreg.toString();
    PCBcontents[5].innerHTML = _PCB.Zflag.toString();
}
function formatHexNumb(numb, size) {
    var temp = numb.toString();
    while (temp.length < size) {
        temp = "0" + temp;
    }
    return temp;
}
