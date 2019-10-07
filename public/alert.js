let warning = false;

showAlert = (alertMessage, isWarning = false) => {
    warning = isWarning
    $('.alert strong').text(alertMessage)
    if(isWarning){
        $('.alert').addClass('alert-danger')
    }else{
        $('.alert').addClass('alert-success')
    }

    $('.alert').animate({
        top: '100px',
        opacity: 1
    }, 500)
}

closeAlert = () =>{
    $('.alert').animate({
        top: '0px',
        opacity: 0
    }, 500)
    if(warning){
        $('.alert').removeClass('alert-danger')
    }else{
        $('.alert').removeClass('alert-success')
    }
}