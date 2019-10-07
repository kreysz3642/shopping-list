$(document).ready(()=>{
    $('#headerRegButton').click(()=>{
        $(location).attr('href', 'registration');
    })

    $('#loginButton').click(() => {
        let name = $('#inputNickName').val()
        let password = $('#inputPass').val()
    

        let dat = {
            userName: name,
            userPassword: password
        }
        
        $.ajax({
            url: 'login',
            type: 'POST',
            data: JSON.stringify(dat),
            contentType: 'application/json; charset=utf-8',
            success: function(resp) {
                if(resp.isError){
                    showAlert(resp.errorMessage, true)
                }else{
                    $(location).attr('href', 'personalPage');
                }
            }
        });
    })

    $('.alert .close').on('click', () => {
        closeAlert()
    })
})