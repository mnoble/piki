Todo = function(element) {
  this.element = $(element)
  this.todos   = $("<ul id='todos'/>")
  this.element.before(this.todos)

  this.bind = function() {
    this.element.on("keyup", $.proxy(this.add_todo, this))
  }

  this.add_todo = function(e) {
    var item;

    if (e.which != 13)
      return

    item = $("<li/>")
    item.append(this.checkbox())
    item.append(this.element.html())

    this.todos.append(item)
    this.element.html("")
  }

  this.checkbox = function() {
    return "<input type='checkbox'/>";
  }
}
