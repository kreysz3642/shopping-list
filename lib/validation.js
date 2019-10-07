module.exports = {
    checkName : (inputString) =>{
        if(inputString.length >= 5 && inputString <= 20){
            return null
        }else{
            return "Имя пользователя должно быть от 5 до 20 символов!"
        }
    },

    checkPassword: (inputString) =>{
        if(inputString.length >= 6 && inputString <= 15){
            return null
        }else{
            return "Пароль должен быть от 6 до 15 символов!"
        }
    }, 

    isEmpty : (inputString) =>{
        if(!(inputString == "")){
            return null
        }else{
            return "Строка ввода не должна быть пуста!"
        }
    }

    
}