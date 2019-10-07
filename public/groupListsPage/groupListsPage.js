$(document).ready(() => {


    addUserInUsersList = (username) => {
        let htmlStr = "<li class=\"list-group-item\">" + username + "</li>"
        $('.list-group').append(htmlStr)
    }


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

    addTask = (taskData) => {
        let htmlStr = '<div class="input-group tasksInput">' +
            '<div class="input-group-prepend">' +
            '<div class="input-group-text">' +
            '<input class="inputCheck" type="checkbox" aria-label="Checkbox for following text input" >' +
            '</div>' +
            '</div>' +
            "<input type=\"text\" class=\"form-control\" aria-label=\"Text input with checkbox\" value=\"" + taskData.text + "\">" +
            '<div class="input-group-append">' +
            '<button class="btn btn-outline-danger" type="button"' +
            'id="inputGroupFileAddon04">Удалить</button>' +
            '</div>' +
            '</div>';
        $('.tasks').append(htmlStr)

        $('.tasks .input-group:last-child').find('.inputCheck').prop('checked', taskData.isDone)

    }

    //добавить элемент списка
    $('.addTasks .btn').on('click', () => {
        let taskData = {
            text: $('.addTasks .form-control').val(),
            isDone: false
        }
        addTask(taskData)
        $('.addTasks .form-control').val("")
    })


    //открыть список покупок
    $('.listsArea').on('click', '.changeBtn', function () {
        $('#myModal').modal()

        id = $(this).parent().parent().parent().parent().attr('id')

        $.get('../shopLists/reciveTasks', {
            id: id
        }, (resp) => {

            if (resp.isError) {
                showAlert(resp.errorMessage, true)
            } else {
                changeModal(resp)
                let tasks = resp.tasks;
                for (let i = 0; tasks.length > i; i++) {
                    addTask(tasks[i])
                }
            }

        })
    });

    //удаление списка
    $('.listsArea').on('click', '.deleteBtn', function () {

        id = $(this).parent().parent().parent().parent().attr('id')

        $.get('groupListsPage/deleteList', {
            id: id
        }, (resp) => {
            if(resp.isError){
                showAlert(resp.errorMessage, true)
            }else{
                $('.elementArea#' + id).detach()
            }
        })
    });


    //сохранение элемента списка
    $('#modalSaveButton').on('click', () => {
        let tasks = [];
        $('.tasksInput').each(function (i) {

            isDone = $(this).find('.inputCheck').is(':checked')
            text = $(this).find('.form-control').val()
            let task = {
                isDone: isDone,
                text: text
            }
            tasks.push(task)
        })

        let data = {
            id: $('.modal-dialog').attr('id'),
            tasks: tasks
        }
        $.ajax({
            url: '../shopLists/saveTasks',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            success: function (resp) {
                if (resp.isError) {
                    showAlert(resp.errorMessage, true)
                }

                $('#closeTasksListButton').trigger('click')
            }
        });
    })


    //добавить новый список в группу
    $('#addNewList').on('click', () => {
        let listName = $('#inputListName').val()
        let listDescript = $('#inputListDescript').val()
        let dat = {
            listName: listName,
            description: listDescript
        }
        $.ajax({
            url: 'groupListsPage/addNewListInGroup',
            type: 'POST',
            data: JSON.stringify(dat),
            contentType: 'application/json; charset=utf-8',
            success: function (resp) {
                if (resp.isError) {
                    showAlert(resp.errorMessage, true)
                } else {
                    $('#inputListName').val("")
                    $('#inputListDescript').val("")
                    let data = {
                        id: resp.id,
                        listName: dat.listName,
                        description: dat.description,
                        username: resp.user

                    }
                    addListElements(data)
                }

            }
        })
    })

    $('#closeTasksListButton').on('click', () => {
        $('#myModal').modal('hide')
    })

    //закрытие модального окна
    $('#myModal').on('hide.bs.modal', function () {
        $('.modal-dialog').attr('id', null)
        $('.tasksInput').each(function (i) {
            $(this).detach();
        })

        $('.addTasks .form-control').val("")

    })




    //пригласить пользователя
    $('.invitePerson button').on('click', () => {
        let userName = $('.invitePerson input').val();
        $.get('groupListsPage/inviteNewPerson', {
            invitedUser: userName
        }, (resp) => {
            if (resp.isError) {
                showAlert(resp.errorMessage, true)
            } else {
                showAlert(resp)
            }
            $('.invitePerson input').val("");
        })
    })

    //получить список групп
    $.get('groupListsPage/getGroupLists', (resp) => {
        if (resp.isError) {
            showAlert(resp.errorMessage, true)
        } else {
            for (let i = 0; resp.length > i; i++) {
                addListElements(resp[i])
            }
        }
    })

     //получить список участников
    $.get('groupListsPage/getUsers', (resp) => {
        if (resp.isError) {
            showAlert(resp.errorMessage, true)
        } else {
            for (let i = 0; resp.length > i; i++) {
                addUserInUsersList(resp[i])
            }
        }
    })

    $('.tasks').on('click', '.tasksInput button', function () {
        $(this).parent().parent().detach()
    })

    $('.alert .close').on('click', () => {
        closeAlert()
    })
})