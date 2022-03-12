use minigrep::Config;
use std::env; // collect
use std::process;

fn main() {
    let args: Vec<String> = env::args().collect();

    let config = Config::new(&args).unwrap_or_else(|err| {
        // stderr
        eprintln!("Problem parsing arguments: {}", err);
        process::exit(1);
    });

    if let Err(e) = minigrep::run(config) {
        // stderr
        eprintln!("Application error: {}", e);
        process::exit(1);
    }
}
