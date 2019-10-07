$(document).ready(() => {
    addGroupElement = (data) => {
        let htmlStr = "<div class=\"elementArea\" id=\"" + data._id + "\">" +
            "<div class=\"card element\">" +
            "<img src=\"/images/group.png\" class=\"card-img\">" +
            "<div class=\"card-body\">" +
            "<h5 class=\"card-title\">" + data.groupName + "</h5>" +
            "<p class=\"card-text\">" + data.groupDescription + "</p>" +
            "</div><div class=\"elmentFoot\">" +
            "<p class=\"card-text\"><small class=\"text-muted\">" + data.creatorUserName + "</small></p>" +
            "<button  type=\"button\"" +
            "class=\"btn btn-outline-success\">Изменить</button></div></div></div>"

        $('.groupsArea').append(htmlStr)
    }

    addInvites = (data) => {
        let htmlStr = "<li id=\"" + data._id + "\" class=\"list-group-item\">" + data.groupName + "</li>"
        $('.list-group').append(htmlStr)
    }


    $.get('myGroups/reciveGroups', (resp) => {
        if (resp.isError) {
            if (err) resp.send(myError('ошибка сервера, попробуйте позже'))
        } else {
            for (let i = 0; resp.length > i; i++) {
                addGroupElement(resp[i])
            }
        }
    })

    $('.list-group').on('click', '.list-group-item', function () {
        $(this).addClass('active')
    })

    $(document).mouseup(function (e) {
        let invite = $(".list-group-item.active");
        let but = $('#acceptInvite')
        if (!invite.is(e.target) &&
            invite.has(e.target).length === 0 && !but.is(e.target)) {
            invite.removeClass('active')
        }
    });



    //принять приглашение
    $('#acceptInvite').on('click', () => {
        let invite = $('.list-group').find('.active')
        if (invite) {
            inviteId = $('.list-group').find('.active').attr('id')
            $.get('myGroups/acceptInvite', {
                    _id: inviteId
                }, (resp) => {
                    if (resp.isError) {
                        showAlert(resp.errorMessage, true)
                    } else {
                        invite.remove()
                        $.get('myGroups/getGroupInfo', {
                            groupId: resp
                        }, (resp) => {
                            if (resp.isError) {
                                showAlert(resp.errorMessage, true)
                            } else {
                                addGroupElement(resp)
                            }
                        })
                    }
                }

            )
        }
    })


    $.get('myGroups/reciveInvites', (data => {
        if (data) {
            for (let i = 0; data.length > i; i++) {
                addInvites(data[i])
            }
        }
    }))

    //добавить группу
    $('#acceptButton').on('click', () => {
        let groupName = $('#addGroupInput').val()
        let groupDescription = $('#addGroupDescription').val()
        let groupData = {
            groupName: groupName,
            groupDescription: groupDescription
        }
        $.ajax({
            url: 'myGroups/addGroup',
            type: 'POST',
            data: JSON.stringify(groupData),
            contentType: 'application/json; charset=utf-8',
            success: function (resp) {
                if (resp.isError) {
                    showAlert(resp.errorMessage, true)
                } else {
                    let data = {
                        _id: resp.id,
                        creatorUserName: resp.user,
                        ...groupData

                    }
                    addGroupElement(data)
                }
            }
        });

        $('#addGroupInput').val("")
        $('#addGroupDescription').val("")
    })




    $('.groupsArea').on('click', '.btn', function () {
        let id = $(this).parent().parent().parent().attr('id');
        $.get('myGroups/setGroupLists', {
            id: id
        }, function (data) {
            $(location).attr('href', '/personalPage/myGroups/groupListsPage')
        })
    })
    $('.alert .close').on('click', () => {
        closeAlert()
    })
})