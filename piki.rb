require "sinatra"
require "pathname"
require "pry"
require "github/markup"
require "html/pipeline"

get "/" do
  @toc = TableOfContents.new
  erb :index
end

get "/notes/*" do |file|
  if notes.join(file).directory?
    @toc = TableOfContents.new(file)
    erb :index
  else
    @doc = pipeline.call(notes.join(file).read)[:output].to_s
    erb :note
  end
end

def pipeline
  @pipeline ||= HTML::Pipeline.new [HTML::Pipeline::MarkdownFilter, HTML::Pipeline::SyntaxHighlightFilter]
end

def notes
  Pathname.new("~/Notes").expand_path
end

class TableOfContents
  attr_reader :path

  def initialize(path="")
    @path = Pathname.new("~/Notes").join(path).expand_path
  end

  def pages
    path.children.map do |note|
      title = if note.directory?
        note.to_s
      else
        note.read.lines.first.gsub("#", "").gsub(/<[^>]+>/, "")
      end

      link  = "/notes/#{note.basename}"
      Page.new(title, link)
    end.sort_by(&:title)
  end

  Page = Struct.new(:title, :link)
end

