let comments = [];
loadComments();


document.getElementById('reply-add').onclick = function () {
    let replyName = document.getElementById('reply-name');
    let replyBody = document.getElementById('reply-body');

    let reply = {
        name: replyName.value,
        body: replyBody.value,
        time: Math.floor(Date.now() / 1000)
    }

    replyName.value = '';
    replyBody.value = '';

    // Получаем выбранный комментарий для ответа
    let selectedCommentIndex = document.getElementById('comment-field').getAttribute('data-selected-comment');
    if (selectedCommentIndex !== null) {
        // Добавляем ответ к выбранному комментарию
        comments[selectedCommentIndex].replies = comments[selectedCommentIndex].replies || [];
        comments[selectedCommentIndex].replies.push(reply);
    }

    saveComments();
    showComments();

    // Закрываем модальное окно для ответа
    $('#replyModal').modal('hide');
}

function addComment() {
    let commentName = document.getElementById('comment-name');
    let commentBody = document.getElementById('comment-body');

    let comment = {
        name: commentName.value,
        body: commentBody.value,
        time: Math.floor(Date.now() / 1000)
    }

    commentName.value = '';
    commentBody.value = '';

    comments.push(comment);
    saveComments();
    showComments();

    // Закрываем модальное окно для нового комментария
    $('#commentModal').modal('hide');
}

function addModalReply() {
    let modalReplyName = document.getElementById('modal-reply-name');
    let modalReplyBody = document.getElementById('modal-reply-body');

    let reply = {
        name: modalReplyName.value,
        body: modalReplyBody.value,
        time: Math.floor(Date.now() / 1000)
    };

    modalReplyName.value = '';
    modalReplyBody.value = '';

    // Получаем выбранный комментарий для ответа
    let selectedCommentIndex = document.getElementById('comment-field').getAttribute('data-selected-comment');
    if (selectedCommentIndex !== null) {
        // Добавляем ответ к выбранному комментарию
        comments[selectedCommentIndex].replies = comments[selectedCommentIndex].replies || [];
        comments[selectedCommentIndex].replies.push(reply);
    }

    saveComments();
    showComments();

    // Закрываем модальное окно для ответа
    $('#replyModal').modal('hide');
}

function saveComments(){
    localStorage.setItem('comments', JSON.stringify(comments));
}

function loadComments(){
    if (localStorage.getItem('comments')) comments = JSON.parse(localStorage.getItem('comments'));
    showComments();
}

function showComments() {
    let commentField = document.getElementById('comment-field');
    let out = '';
    comments.forEach(function (item, index) {
        out += `<p class="text-right small"><em>${timeConverter(item.time)}</em></p>`;
        out += `<p class="alert alert-primary" role="alert">${item.name}</p>`;
        out += `<p class="alert alert-success" role="alert">${item.body}</p>`;

        // Добавляем количество лайков и кнопку для увеличения
        out += `<p>Likes: ${item.likes || 0}</p>`;
        out += `<button type="button" class="btn btn-primary btn-like" onclick="toggleLike(${index})">${item.liked ? 'Unlike' : 'Like'} (${item.likes || 0})</button>`;

        // Добавляем кнопку ответа для каждого комментария
        out += `<button type="button" class="btn btn-info btn-sm" onclick="selectComment(${index})">Reply</button>`;

        // Показываем ответы, если они есть
        if (item.replies) {
            item.replies.forEach(function (reply, replyIndex) {
                out += `<div class="ml-3">`;
                out += `<p class="text-right small"><em>${timeConverter(reply.time)}</em></p>`;
                out += `<p class="alert alert-primary" role="alert">${reply.name}</p>`;
                out += `<p class="alert alert-success" role="alert">${reply.body}</p>`;

                // Добавляем количество лайков и кнопку для увеличения для ответов
                out += `<p>Likes: ${reply.likes || 0}</p>`;
                out += `<button type="button" class="btn btn-success btn-like" onclick="toggleLike(${index}, ${replyIndex})">${reply.liked ? 'Unlike' : 'Like'} (${reply.likes || 0})</button>`;

                out += `</div>`;
            });
        }
    });

    commentField.innerHTML = out;
}
function selectComment(index) {
    document.getElementById('comment-field').setAttribute('data-selected-comment', index);

    // Очищаем текущее содержимое модального окна для ответа
    let replyModalBody = document.querySelector('#replyModal .modal-body');
    replyModalBody.innerHTML = '';

    // Создаем новый набор полей ввода для ответа
    replyModalBody.appendChild(createReplyForm());

    // Открываем модальное окно для ответа
    $('#replyModal').modal('show');
}

function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}
function createReplyForm() {
    let replyForm = document.createElement('div');
    replyForm.innerHTML = `
        <div class="form-group">
            <label for="modal-reply-name">Name:</label>
            <input type="text" class="form-control" id="modal-reply-name" placeholder="Enter your name">
        </div>
        <div class="form-group">
            <label for="modal-reply-body">Reply:</label>
            <textarea class="form-control" id="modal-reply-body" placeholder="Reply"></textarea>
        </div>
        <button type="button" class="btn btn-primary" onclick="addModalReply()">Add Reply</button>
    `;
    return replyForm;
}
function addLike(index) {
    comments[index].likes = comments[index].likes || 0;
    comments[index].likes++;
    saveComments();
    showComments();
}

function toggleLike(commentIndex, replyIndex) {
    if (replyIndex === undefined) {
        // Если лайк принадлежит основному комментарию
        comments[commentIndex].liked = !comments[commentIndex].liked;

        if (comments[commentIndex].liked) {
            comments[commentIndex].likes = (comments[commentIndex].likes || 0) + 1;
        } else {
            comments[commentIndex].likes = Math.max((comments[commentIndex].likes || 0) - 1, 0);
        }
    } else {
        // Если лайк принадлежит ответу на комментарий
        comments[commentIndex].replies[replyIndex].liked = !comments[commentIndex].replies[replyIndex].liked;

        if (comments[commentIndex].replies[replyIndex].liked) {
            comments[commentIndex].replies[replyIndex].likes = (comments[commentIndex].replies[replyIndex].likes || 0) + 1;
        } else {
            comments[commentIndex].replies[replyIndex].likes = Math.max((comments[commentIndex].replies[replyIndex].likes || 0) - 1, 0);
        }
    }

    saveComments();
    showComments();
}

function deleteAllComments() {
    comments = [];
    saveComments();
    showComments();
}

