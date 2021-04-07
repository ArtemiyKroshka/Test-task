let dropArea = document.getElementById('drop-area');
let fileName = document.getElementById('fileLabel');

$("#fileUploader").change(function () {
    filename = this.files[0].name

});

//----------------------------------------Counter---------------------------------------

let count = {
    number: 0,
    old: 0,
    child: 0
}

let numberCount = document.getElementById('numberCounter');
let oldCount = document.getElementById('oldCounter');
let childCount = document.getElementById('childCounter');

function counterPlus(event) {
    if (event == 'number') {
        count[event] = +count[event] + 1;
        numberCount.value = count[event];
    } else if (event == 'old') {
        count[event] = +count[event] + 1;;
        oldCount.value = count[event];
    } else {
        count[event] = +count[event] + 1;
        childCount.value = count[event];
    }
}

function counterMinus(event) {
    if (event == 'number') {
        if (count[event] > 0) {
            count[event] = +count[event] - 1;
            numberCount.value = count[event];
        }
    } else if (event == 'old') {
        if (count[event] > 0) {
            count[event] = +count[event] - 1;
            oldCount.value = count[event];
        }
    } else {
        if (count[event] > 0) {
            count[event] = +count[event] - 1;
            childCount.value = count[event];
        }
    }
}

//----------------------------------------Drag-and-Drop---------------------------------------

function FileInput() {
    if (dropArea.style.display == '' || dropArea.style.display == 'none') {
        dropArea.style.display = 'block';
    } else {
        dropArea.style.display = 'none';
    }
}

dropArea.addEventListener('dragenter', preventDefaults, false);
dropArea.addEventListener('dragleave', preventDefaults, false);
dropArea.addEventListener('dragover', preventDefaults, false);
dropArea.addEventListener('drop', preventDefaults, false);

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
})

function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
}

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
});

function highlight(e) {
    dropArea.classList.add('highlight')
    dropArea.classList.remove('drop-area-static')
}

function unhighlight(e) {
    dropArea.classList.add('drop-area-static')
    dropArea.classList.remove('highlight')
}

dropArea.addEventListener('drop', handleDrop, false)

function handleDrop(e) {
    let dt = e.dataTransfer
    let files = dt.files

    handleFiles(files)
}

function handleFiles(files) {
    ([...files]).forEach(uploadFile)
}

function uploadFile(file) {
    let filetype = file.name.split('.').pop();
    if (!(filetype == 'xlsx' || filetype == 'xls')) {
        fileName.innerHTML = `<div>Недопустимый тип файла ".${filetype}", выберете другой <br> файл</div>`;
    } else if (file.size >= 10000) {
        fileName.innerHTML = "<div>Допустимый размер файла 10Мб, выберите <br> другой файл</div>";
    } else {
        fileName.innerHTML = `Файл - ${file.name}`;
        if (file) {
            let fileReader = new FileReader();
            fileReader.onload = function (event) {
                let data = event.target.result;
                let workbook = XLSX.read(data, {
                    type: "binary",
                });
                workbook.SheetNames.forEach(sheet => {
                    let rowObject = XLSX.utils.sheet_to_row_object_array(
                        workbook.Sheets[sheet]
                    );

                    // fetch('http://193.243.158.230:4500/api/import', {
                    //     method: 'POST',
                    //     headers: {
                    //         "Authorization": "test-task",
                    //     },
                    //     body: JSON.stringify({resultArray: rowObject})
                    // })

                    $.ajax({
                        url: 'http://193.243.158.230:4500/api/import',
                        type: "POST",
                        dataType: 'json',
                        headers:{
                            "Authorization": "test-task",
                        },
                        data: {
                            resultArray: JSON.stringify(rowObject)
                        }
                    });
                });
            };
            fileReader.readAsBinaryString(file);
        }
    }
}