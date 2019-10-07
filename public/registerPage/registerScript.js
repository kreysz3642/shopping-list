$(document).ready(() => {
    $('#regButton').click(() => {
        let name = $('#inputNickName').val()
        let password = $('#inputPass').val()
        let passwordRepeat = $('#inputPassRepeat').val()
    

        let dat = {
            userName: name,
            userPassword: password,
            userPasswordRepeat: passwordRepeat
        }

        $.ajax({
            url: 'regNewUser',
            type: 'POST',
            data: JSON.stringify(dat),
            contentType: 'application/json; charset=utf-8',
            success: function(resp) {
                if(resp.isError){
                    showAlert(resp.errorMessage, true)
                }else{
                    $(location).attr('href', '/');
                }
            }
        });
    })

    $('.alert .close').on('click', () => {
        closeAlert()
    })
})