require "sinatra"
require "pathname"
require "pry"
require "github/markup"

set :public_folder, "."

get "/" do
  @toc = TableOfContents.new
  erb :index
end

get "/notes/*" do |file|
  @doc = GitHub::Markup.render(file, notes.join(file).read)
  erb :note
end

def notes
  Pathname.new("~/Notes").expand_path
end

class TableOfContents
  def pages
    notes.children.map do |note|
      title = note.read.lines.first.gsub("#", "").gsub(/<[^>]+>/, "")
      link  = "/notes/#{note.basename}"
      Page.new(title, link)
    end.sort_by(&:title)
  end

  Page = Struct.new(:title, :link)
end

