// generate 1 code cho category 
export const generateCode = (value) => {
    // bỏ dấu, tach thành mảng và for qua từng giá trị
    let output = ''
    value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').forEach(item => {
        // get 2 value dau tien cua tung item
        output += item.charAt(1) + item.charAt(0)
    });
    return output.toUpperCase() + value.length
}

