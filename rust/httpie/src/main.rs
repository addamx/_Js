use clap::Parser;

// cargo build --quiet && target/debug/httpie post httpbin.org/post a=1 b=2

// 定义 httpie 的Cli 的主入口，它包含若干个子命令
// 下面 /// 的注释是文档，clap 会将其作为 Cli 的帮助

#[derive(Parser, Debug)]
#[clap(version = "1.0", author = "xuhr@test.com")]
struct Opts {
  #[clap(subcommand)]
  subcmd: subCommand,
}

// 子命令分别对应不同的 HTTP 方法，目前只支持 get / post
#[derive(Parser, Debug)]
enum subCommand {
  Get(Get),
  Post(Post)
}

// get 命令

/// feed get with an url an we will retrieve the response for you
#[derive(Parser, Debug)]
struct Get {
  /// HTTP 请求的 URL
  url: String
}

// post 子命令。需要输入一个 url，和若干个可选的 key=value，用于提供 json body

/// feed post with an url and optional key=value pairs. We will post the data
/// as JSON, and retrieve the response for you
#[derive(Parser, Debug)]
struct Post {
  /// HTTP 请求的 URL
  url: String,
  /// HTTP 请求的 body
  body: Vec<String>,
}

fn main() {
  let opts: Opts = Opts::parse();
  println!("{:?}", opts);
}
