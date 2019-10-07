$(document).ready(() => {


    addListElements = (data) => {
        let htmlStr = "<div class=\"elementArea\" id=\"" + data.id + "\">" +
            "<div class=\"card element\">" +
            "<img src=\"/images/logo.png\" class=\"card-img\">" +
            "<div class=\"card-body\">" +
            "<h5 class=\"card-title\">" + data.listName + "</h5>" +
            "<p class=\"card-text\">" + data.description + "</p>" +
            "</div><div class=\"elmentFoot\">" +
            "<p class=\"card-text\"><small class=\"text-muted\">" + data.username + "</small></p>" +
            "<div class=\"listButtons\" >"+
            "<button  type=\"button\"" +
            "class=\"btn btn-danger deleteBtn\">Удалить</button>" +
            "<button  type=\"button\"" +
            "class=\"btn btn-outline-success changeBtn\">Изменить</button></div></div></div></div>"

        $('.listsArea').append(htmlStr)
    }


    changeModal = (data) => {
        $('.modal-title').text(data.listName)
        $('.modal-dialog').attr('id', data._id)
    }

    addTask = (taskData) =>{
        let htmlStr  = '<div class="input-group tasksInput">'+
        '<div class="input-group-prepend">'+
        '<div class="input-group-text">'+
        '<input class="inputCheck" type="checkbox" aria-label="Checkbox for following text input" >'+
        '</div>'+
        '</div>'+
        "<input type=\"text\" class=\"form-control\" aria-label=\"Text input with checkbox\" value=\"" + taskData.text +"\">"+
        '<div class="input-group-append">'+
        '<button class="btn btn-outline-danger" type="button"'+
        'id="inputGroupFileAddon04">Удалить</button>'+
        '</div>'+
        '</div>';
        $('.tasks').append(htmlStr)

        $('.tasks .input-group:last-child').find('.inputCheck').prop('checked', taskData.isDone)

    }

    $('.addTasks .btn').on('click', ()=>{
        let taskData = {
            text : $('.addTasks .form-control').val(),
            isDone : false
        }

        addTask(taskData)
        $('.addTasks .form-control').val("")
    })


    //получение списков покупок при загрузке сраницы
    $.get('shopLists/reciveLists', (resp) => {
        if(resp.isError){
            showAlert(resp.errorMessage, true)
        }else{
            for (let i = 0; resp.length > i; i++) {
                addListElements(resp[i])
            }
        }
    })

    //открытие списка покупок
    $('.listsArea').on('click', '.changeBtn', function () {
        $('#myModal').modal()

        id = $(this).parent().parent().parent().parent().attr('id')
        $.get('shopLists/reciveTasks', {
            id: id
        }, (data) => {
            changeModal(data)
            let tasks = data.tasks;
            for(let i = 0; tasks.length > i; i++){
                addTask(tasks[i])
            }
        })

    });

    
    //удаление списка покупок
    $('.listsArea').on('click', '.deleteBtn', function () {
        id = $(this).parent().parent().parent().parent().attr('id')

        $.get('shopLists/deleteList', {
            id: id
        }, (resp) => {
            if(resp.isError){
                showAlert(resp.errorMessage, true)
            }else{
                $('.elementArea#' + id).detach()
            }
        })
    });

    //сохранение элементов списка
    $('#modalSaveButton').on('click', ()=>{
        let tasks = [];
        $('.tasksInput').each(function(i){
            
            isDone = $(this).find('.inputCheck').is(':checked')
            text = $(this).find('.form-control').val()
            let task = {
                isDone : isDone,
                text : text                
            }
            tasks.push(task)
        })

        let data = {
            id : $('.modal-dialog').attr('id'),
            tasks : tasks
        }

    
        $.ajax({
            url: 'shopLists/saveTasks',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            success: function (resp) {
                if(resp.isError){
                    showAlert(resp.errorMessage, true)
                }
                $('#closeTasksListButton').trigger('click')
            }
        });
    })
    

    //создание списка покупок
    $('#acceptButton').on('click', () => {
        let inputListName = $('#listsInput').val()
        let descript = $('#listsInputDescriotion').val()
        $('#listsInput').val("")
        let dat = {
            inputListName: inputListName,
            description: descript
        }
        $.ajax({
            url: 'shopLists/createNewList',
            type: 'POST',
            data: JSON.stringify(dat),
            contentType: 'application/json; charset=utf-8',
            success: function (resp) {
                if(resp.isError){
                    showAlert(resp.errorMessage, true)
                }else{
                    let data = {
                        id: resp.id,
                        listName: dat.inputListName,
                        description: dat.description,
                        username: resp.user
    
                    }
                    addListElements(data)
                }
            }
        });

        $('#listsInput').val("")
        $('#listsInputDescriotion').val("")
        
    })

    $('#closeTasksListButton').on('click', ()=>{
        $('#myModal').modal('hide')
    })

    $('#myModal').on('hide.bs.modal', function(){
        $('.addTasks .form-control').val("")
        $('.modal-dialog').attr('id', null)
        $('.tasksInput').each(function(i){
            $(this).detach();
        })

    })


    $('.tasks').on('click', '.tasksInput button', function(){
        $(this).parent().parent().detach()
    })

    $('.alert .close').on('click', () => {
        closeAlert()
    })

})