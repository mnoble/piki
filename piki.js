DEBUG = false

Piki = {
  todo: null,
  notifications: {},

  init: function () {
    this.todo = $("#todo #content")
    this.resizeSidebar()
  },

  resizeSidebar: function () {
    $("#todo").css("height", window.innerHeight + "px")
    $("#page").css("height", window.innerHeight + "px")
  },

  initTodo: function () {
    todo = new Todo(this.todo)
    todo.bind()

    this.fetchTodo()
    this.pollTodo()
    this.fetchNotifications()
  },

  fetchTodo: function () {
    if (localStorage.getItem("todo") == this.todo.html())
      return

    this.todo.html(localStorage.getItem("todo"))
  },

  pollTodo: function () {
    setInterval(this.saveTodo.scope(this), 1000)
  },

  saveTodo: function () {
    localStorage.setItem("todo", this.todo.html())
  },

  fetchNotifications: function () {
    if (DEBUG)
      console.log("Fetching notifications")

    $.ajax({
      type: "GET",
      dataType: "json",
      url: "https://api.github.com/notifications",
      headers: { "Authorization": this.authorization() },
      success: this.didReceiveNotifications.scope(this)
    })
  },

  didReceiveNotifications: function (data, status, xhr) {
    var self = this

    if (DEBUG)
      console.log(data)

    $.each(data, function (index, item) {
      self.notifications[item.id] = item
    })

    this.updateNotifications()
    setTimeout(this.fetchNotifications.scope(this), 60000)
  },

  updateNotifications: function () {
    var div = $("#notifications")
    div.empty()

    $.each(this.notifications, function (id, notification) {
      var item = $("<li>"),
          repo = $("<strong>"),
          link = $("<a>"),
          comment_id;

      repo.html(notification.repository.name)

      comment_id = notification.subject.latest_comment_url.split("/")[-1]

      link.prop("href", notification.subject.url.replace("api.", "").replace("repos/", "").replace("pulls", "pull") + "#issuecomment=" + comment_id)
      link.append(repo)
      link.append(" &mdash; " + notification.subject.title)

      item.append(link)

      div.append(item)
    })
  },

  authorization: function () {
    return "Basic " + btoa("2315d9b4e272811f3c79c980468e4ddc6f5784a6:")
  }
}

Function.prototype.scope = function(scope) {
  var self = this
  return function() { self.apply(scope, arguments) }
}
