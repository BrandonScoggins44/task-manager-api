let token
let user
let userTasks
let filteredTasks
let filteredByDescription
let filteredByCompleteness

let descriptionDir
let completenessDir

let hashFound

displayHome = (option) => {
    home.style.display = 'block'
    hashFound = true
    messageOne.style.display = 'block'
    messageOne.textContent = ''

    if (option) {
        option.includes('login') ? loginForm.style.display = "block" : loginForm.style.display = 'none'
        option.includes('logout') ? logoutForm.style.display = "block" : logoutForm.style.display = 'none'
        option.includes('register') ? registerForm.style.display = "block" : registerForm.style.display = 'none'
    } else {
        loginForm.style.display = 'none'
        logoutForm.style.display = 'none'
        registerForm.style.display = 'none'
    }
}

displayProfile = (option) => {
    profile.style.display = 'block'
    hashFound = true
    messageOne.style.display = 'block'
    messageOne.textContent = ''

    if (token && user) {
        profileMessage.textContent = 'This is your profile.'
        profileName.textContent = `Name: ${user.name}`
        profileAge.textContent = `Age: ${user.age}`
        profileEmail.textContent = `Email: ${user.email}`
        profileCreated.textContent = `User since: ${user.createdAt}`
        profileUpdated.textContent = `Last logged in: ${user.updatedAt}`

        profileOptions.style.display = 'flex'
    } else {
        profileMessage.textContent = 'Please login or register to see your profile.'
        profileName.textContent = ''
        profileAge.textContent = ''
        profileEmail.textContent = ''
        profileCreated.textContent = ''
        profileUpdated.textContent = ''

        profileOptions.style.display = 'none'
    }

    if (option && user) {
        option.includes('update') ? updateUserForm.style.display = "block" : updateUserForm.style.display = 'none'
        option.includes('delete') ? deleteUserForm.style.display = "block" : deleteUserForm.style.display = 'none'
        option.includes('logoutEverywhere') ? logoutEverywhereForm.style.display = "block" : logoutEverywhereForm.style.display = 'none'
    } else {
        updateUserForm.style.display = 'none'
        deleteUserForm.style.display = 'none'
        logoutEverywhereForm.style.display = 'none'
    }
}

displayTasks = () => {
    tasks.style.display = 'block'
    hashFound = true
    messageOne.style.display = 'block'
    messageOne.textContent = ''

    if (token && user && userTasks) {
        taskMessage.textContent = `Manage tasks for ${user.name}.`
        taskOptions.style.display = 'block'
        tasksTableDiv.style.display = 'block'
        buildTasksTable()
    } else {
        taskMessage.textContent = 'Please login or register to view and create tasks.'
        taskOptions.style.display = 'none'
        tasksTableDiv.style.display = 'none'
    }
}

displayAbout = () => {
    about.style.display = 'block'
    hashFound = true
    messageOne.style.display = 'none'
}

displayHelp = () => {
    help.style.display = 'block'
    hashFound = true
}

displayNotFound = () => {
    notFound.style.display = 'block'
    hashFound = true
}

displayLogin = () => {
    displayHome('login')
}

displayLogout = () => {
    displayHome('logout')
}

displayRegister = () => {
    displayHome('register')
}

displayUpdate = () => {
    displayProfile('update')

    if (user) {
        updateName.value = user.name
        updateEmailAddress.value = user.email
        updateAge.value = user.age
    }
}

displayDelete = () => {
    displayProfile('delete')
}

displayLogoutEverywhere = () => {
    displayProfile('logoutEverywhere')
}

login = async () => {

    var data

    if (!token) {
        try {
            const response = await fetch('/users/login',
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ "email": emailAddress.value, "password": password.value })
                })

            if (response && response.status === 200) {
                data = await response.json()
            }
        } catch (e) {
            console.log('Error fetching', e)
        }

        if (data && data.token) {
            token = data.token
            user = data.user
            userTasks = getTasks()
            messageOne.textContent = 'Login Successful! You can now see your profile and tasks.'
        } else {
            messageOne.textContent = 'Login Failed! Please try again or register an account.'
        }
    } else {
        messageOne.textContent = 'You are already logged in! You can now see your profile and tasks.'
    }
}

logout = async () => {

    var response

    if (token) {
        try {
            response = await fetch('/users/logout',
                {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
        } catch (e) {
            console.log('Error fetching', e)
        }

        if (response && response.status === 200) {
            token = undefined
            user = undefined
            userTasks = undefined
            messageOne.textContent = 'Logout Successful!'
        } else {
            messageOne.textContent = 'Unable to logout. Please try again.'
        }
    } else {
        messageOne.textContent = 'You need to login before you can logout.'
    }
}

logoutEverywhere = async () => {

    var response

    if (token && user) {
        try {
            response = await fetch('/users/logoutAll',
                {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
        } catch (e) {
            console.log('Error fetching', e)
        }

        if (response && response.status === 200) {
            token = undefined
            user = undefined
            messageOne.textContent = 'Logout Everywhere Successful!'
        } else {
            messageOne.textContent = 'Unable to logout all instances. Please try again.'
        }
    } else {
        messageOne.textContent = 'You need to login before you can logout.'
    }
}

register = async () => {

    var data

    if (!token) {
        try {
            const response = await fetch('/users',
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ "name": registerName.value, "email": registerEmailAddress.value, "password": registerPassword.value })
                })

            if (response && response.status === 201) {
                data = await response.json()
            }
        } catch (e) {
            console.log('Error fetching', e)
        }

        if (data && data.token) {
            token = data.token
            user = data.user
            userTasks = []
            messageOne.textContent = 'Registration Successful! You can now see your profile and create tasks. Look for our welcome email in your inbox!'
        } else {
            messageOne.textContent = 'Registration Failed! If you already have an account, please login.'
        }
    } else {
        messageOne.textContent = 'You are already logged in! Please logout before registering a new account.'
    }
}

update = async () => {

    var data
    var updatedUser = { "name": updateName.value, "email": updateEmailAddress.value, "age": updateAge.value }

    if (!!updatePassword.value) {
        updatedUser.password = updatePassword.value
    }

    if (token && user) {
        try {
            const response = await fetch('/users/me',
                {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedUser)
                })

            if (response && response.status === 200) {
                data = await response.json()
            }
        } catch (e) {
            console.log('Error fetching', e)
        }

        if (data) {
            user = data
            displayUpdate()
            messageOne.textContent = 'Update Successful!'
        } else {
            messageOne.textContent = 'Update Failed! Please try again.'
        }
    } else {
        messageOne.textContent = 'You must be logged in to update your account.'
    }
}

deleteUser = async () => {

    var data

    if (token && user) {
        try {
            const response = await fetch('/users/me',
                {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })

            if (response && response.status === 200) {
                data = await response.json()
            }
        } catch (e) {
            console.log('Error fetching', e)
        }

        if (data) {
            user = undefined
            token = undefined
            messageOne.textContent = `We're sorry to see you go, ${data.name}! Please check your email for a farewell message.`
        } else {
            messageOne.textContent = 'Unable to delete account! Please try again.'
        }
    } else {
        messageOne.textContent = 'You must be logged in to delete your account.'
    }
}

getTasks = async () => {

    var data

    if (token) {
        try {
            const response = await fetch('/tasks',
                {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })

            if (response && response.status === 200) {
                data = await response.json()
            }
        } catch (e) {
            console.log('Error fetching', e)
        }

        if (data) {
            userTasks = data
            // console.log('got tasks', userTasks)
        } else {
            // console.log('did not get tasks')
        }
    } else {
        // console.log('no token. did not get tasks')
    }
}

createTask = async () => {

    var data

    if (token) {
        let description = taskDescription.value
        let completeness = taskCompleted.value

        let isUnique = true

        if (description.length > 0 && completeness.length > 0) {

            userTasks.forEach((task) => {
                if (task.description == description) {
                    isUnique = false
                }
            })

            if (isUnique) {
                try {
                    const response = await fetch('/tasks',
                        {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ "description": description, "completed": completeness })
                        })

                    if (response && response.status === 201) {
                        data = await response.json()
                    }
                } catch (e) {
                    console.log('Error fetching', e)
                }

                if (data) {
                    userTasks.push(data)
                    buildTasksTable()
                    messageOne.textContent = 'New task created!'
                } else {
                    messageOne.textContent = 'Unable to create new task! Please try again.'
                }
            } else {
                messageOne.textContent = 'Unable to create new task! Task descriptions must be unique.'
            }
        } else {
            messageOne.textContent = 'Task description and status must be provided.'
        }
    } else {
        messageOne.textContent = 'You must be logged in to create tasks.'
    }
}

buildTasksTable = (option) => {
    let tasks

    if (option) {
        messageOne.textContent = ''
    }

    filterTasksByCompletion()
    filterTasksByDescription()

    if (filteredTasks) {
        tasks = filteredTasks
    } else {
        tasks = userTasks
    }

    while (tasksTable.rows.length > 1) {
        tasksTable.deleteRow(tasksTable.rows.length - 1)
    }

    for (i = 0; i < tasks.length; i++) {
        let newRow = tasksTable.insertRow(i + 1)
        newRow.insertCell(0).innerHTML = tasks[i].description
        newRow.insertCell(1).innerHTML = tasks[i].completed === true ? 'Completed' : 'In Progress'
        newRow.addEventListener('click', function () { populateTaskFields(newRow.cells[0].innerHTML, newRow.cells[1].innerHTML) })
    }
}

populateTaskFields = (description, completed) => {
    taskDescription.value = description
    taskCompleted.value = completed == 'Completed' ? '1' : '0'
}

clearTaskFields = () => {
    taskDescription.value = ''
    taskCompleted.value = ''
    messageOne.textContent = ''
    buildTasksTable()
}

updateTask = async () => {

    var data

    if (token) {
        let description = taskDescription.value
        let completeness = taskCompleted.value

        let matchFound = false
        let foundMatch

        if (description.length > 0 && completeness.length > 0) {

            userTasks.forEach((task) => {
                if (task.description == description) {
                    matchFound = true
                    foundMatch = task
                }
            })

            if (matchFound) {
                try {
                    const response = await fetch(`/tasks/${foundMatch._id}`,
                        {
                            method: "PATCH",
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ "completed": completeness })
                        })

                    if (response && response.status === 200) {
                        data = await response.json()
                    }
                } catch (e) {
                    console.log('Error fetching', e)
                }

                if (data) {
                    userTasks[userTasks.findIndex((task) => task.description == foundMatch.description)] = data
                    buildTasksTable()
                    messageOne.textContent = 'Task updated!'
                } else {
                    messageOne.textContent = 'Unable to create new task! Please try again.'
                }
            } else {
                messageOne.textContent = 'Unable to update task! Task description does not exist. Try creating a new task instead.'
            }
        } else {
            messageOne.textContent = 'Task description and status must be provided.'
        }
    } else {
        messageOne.textContent = 'You must be logged in to update tasks.'
    }
}

deleteTask = async () => {

    var data

    if (token) {
        let description = taskDescription.value
        let completeness = taskCompleted.value

        let matchFound = false
        let foundMatch

        if (description.length > 0 && completeness.length > 0) {

            userTasks.forEach((task) => {
                if (task.description == description) {
                    matchFound = true
                    foundMatch = task
                }
            })

            if (matchFound) {
                try {
                    const response = await fetch(`/tasks/${foundMatch._id}`,
                        {
                            method: "DELETE",
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            }
                        })

                    if (response && response.status === 200) {
                        data = await response.json()
                    }
                } catch (e) {
                    console.log('Error fetching', e)
                }

                if (data) {
                    userTasks = userTasks.filter((task) => task.description != foundMatch.description)
                    buildTasksTable()
                    messageOne.textContent = 'Task deleted!'
                } else {
                    messageOne.textContent = 'Unable to delete task! Please try again.'
                }
            } else {
                messageOne.textContent = 'Unable to delete task! Task description does not exist.'
            }
        } else {
            messageOne.textContent = 'Task description and status must be provided.'
        }
    } else {
        messageOne.textContent = 'You must be logged in to delete tasks.'
    }
}

sortTasks = (n) => {
    for (i = 0; i < userTasks.length - 1; i++) {
        for (j = i + 1; j < userTasks.length; j++) {
            if (n === 0) {
                if (!descriptionDir || descriptionDir === 'asc') {
                    if (userTasks[i].description.toLowerCase() > userTasks[j].description.toLowerCase()) {
                        let tempTask = userTasks[i]
                        userTasks[i] = userTasks[j]
                        userTasks[j] = tempTask
                    }
                } else {
                    if (userTasks[i].description.toLowerCase() < userTasks[j].description.toLowerCase()) {
                        let tempTask = userTasks[i]
                        userTasks[i] = userTasks[j]
                        userTasks[j] = tempTask
                    }
                }
            } else if (n === 1) {
                if (!completenessDir || completenessDir === 'asc') {
                    if (userTasks[i].completed > userTasks[j].completed) {
                        let tempTask = userTasks[i]
                        userTasks[i] = userTasks[j]
                        userTasks[j] = tempTask
                    }
                } else {
                    if (userTasks[i].completed < userTasks[j].completed) {
                        let tempTask = userTasks[i]
                        userTasks[i] = userTasks[j]
                        userTasks[j] = tempTask
                    }
                }
            }
        }
    }

    if (!descriptionDir || descriptionDir === 'asc') {
        descriptionDir = 'desc'
    } else if (descriptionDir === 'desc') {
        descriptionDir = 'asc'
    }

    if (!completenessDir || completenessDir === 'asc') {
        completenessDir = 'desc'
    } else if (completenessDir === 'desc') {
        completenessDir = 'asc'
    }

    buildTasksTable()
}

filterTasksByCompletion = () => {
    let filter = taskCompleted.value

    filteredTasks = undefined

    if (filter != '') {

        filteredTasks = []

        for (i = 0; i < userTasks.length; i++) {
            if (userTasks[i].completed == (filter == '1')) {
                filteredTasks.push(userTasks[i])
            }
        }
    }
}

filterTasksByDescription = () => {
    let filter = taskDescription.value.toUpperCase()

    if (!filteredTasks) {
        filteredTasks = []

        for (i = 0; i < userTasks.length; i++) {
            if (userTasks[i].description.toUpperCase().indexOf(filter) > -1) {
                filteredTasks.push(userTasks[i])
            }
        }
    } else {
        let tasks = []

        for (i = 0; i < filteredTasks.length; i++) {
            if (filteredTasks[i].description.toUpperCase().indexOf(filter) > -1) {
                tasks.push(filteredTasks[i])
            }
        }

        filteredTasks = tasks
    }
}

loadContent = () => {

    hashFound = false
    messageOne.textContent = ''

    location.hash.includes('home') ? displayHome() : home.style.display = 'none'
    location.hash.includes('profile') ? displayProfile() : profile.style.display = 'none'
    location.hash.includes('tasks') ? displayTasks() : tasks.style.display = 'none'
    location.hash.includes('about') ? displayAbout() : about.style.display = 'none'
    location.hash.includes('help') ? displayHelp() : help.style.display = 'none'
    location.hash.includes('notFound') ? displayNotFound() : notFound.style.display = 'none'

    if (!hashFound) {
        location.hash = '#notFound'
        loadContent()
    }
}

if (!location.hash) {
    location.hash = '#home'
}

loadContent()

window.addEventListener('hashchange', loadContent)
