Agile.crypto = {
    salt: function () {

    },
    pepper: function () {

    },
    encrypt: function (readableString) {
        var result = "";
        for (i = 0; i < readableString.length; i++) {
            if (i < readableString.length - 1) {
                result += readableString.charCodeAt(i) + 10;
                result += "-";
            }
            else {
                result += readableString.charCodeAt(i) + 10;
            }
        }
        return result;
    },
    decrypt: function (encryptedString) {
        var result = "";
        var array = encryptedString.split("-");
    
        for (i = 0; i < array.length; i++) {
            result += String.fromCharCode(array[i] - 10);
        }
        return result;
    }
}