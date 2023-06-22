use ic_agent::Agent;
use ic_cdk::export::candid::{CandidType, Decode, Deserialize, Encode, Nat, Principal};
use std::process::Command;
use std::sync::{Arc, Mutex};
use std::{
    fs::read_dir,
    fs::File,
    io::{self, BufRead, BufReader},
};
use tokio::task;

#[derive(CandidType, Debug, Deserialize)]
struct SetLenParam<'a> {
    filename: &'a str,
    len: Nat,
}

async fn upload_file(
    dir: String,
    path: String,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    const CAP: usize = 1 * 1024 * 1024;
    let file = File::open(path.clone())?;
    let mut reader = BufReader::with_capacity(CAP, file);
    let frontend_url = "https://ic0.app";
    // Uncomment this line for local testing and comment out the prod canister id. 
    // let canister_id = Principal::from_text("ryjl3-tyaaa-aaaaa-aaaba-cai").unwrap();
    let canister_id = Principal::from_text("oeagv-5qaaa-aaaah-aar4q-cai").unwrap();
    let agent = Agent::builder()
        .with_transport(
            ic_agent::agent::http_transport::ReqwestHttpReplicaV2Transport::create(frontend_url)
                .unwrap(),
        )
        .build()
        .unwrap();
    // Uncomment this line for local testing.
    // agent.fetch_root_key().await?;
    let mut counter = 0;
    loop {
        let len = {
            let buffer = reader.fill_buf()?;
            let len = buffer.len();
            let cl_path = path[dir.len() + 1..].to_string();
            if len != 0 {
                let response =
                    create_chunk(&agent, canister_id, cl_path, Nat::from(counter), buffer).await;

                println!("{:?} {:?} {:?}", response, &path, counter);
            }
            len
        };

        if len == 0 {
            break;
        }
        // do stuff with buffer here
        counter = counter + len;
        reader.consume(len);
    }

    // set len

    let md = std::fs::metadata(path.clone()).unwrap();
    let args = SetLenParam {
        filename: &path[dir.len() + 1..],
        len: Nat::from(md.len()),
    };
    let args = Encode!(&args)?;
    let waiter = garcon::Delay::builder()
        .throttle(std::time::Duration::from_millis(500))
        .timeout(std::time::Duration::from_secs(60 * 5))
        .build();

    let response = agent
        .update(&canister_id, "setlen")
        .with_arg(&args)
        .call_and_wait(waiter)
        .await?;
    println!("{:?}", response);
    Ok(())
}

fn path_walk(path: &str, collector: &mut Vec<String>) {
    if let Ok(paths) = read_dir(path) {
        for path in paths {
            let path_in = path.unwrap().path().into_os_string().into_string().unwrap();
            let md = std::fs::metadata(path_in.clone()).unwrap();
            if md.is_file() {
                collector.push(path_in.clone());
            }
            if md.is_dir() {
                path_walk(&path_in, collector);
            }
        }
    }
}

#[derive(CandidType, Debug, Deserialize)]
struct PutParam<'a> {
    filename: &'a str,
    sector_no: Nat,
    data_vec: &'a [u8],
}
async fn create_chunk(
    agent: &Agent,
    canister_id: Principal,
    filename: String,
    sector_no: Nat,
    content: &[u8],
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    //let canister_id = Principal::from_text("ryjl3-tyaaa-aaaaa-aaaba-cai").unwrap();
    // let canister_id = Principal::from_text("rrkah-fqaaa-aaaaa-aaaaq-cai").unwrap();
    let args = PutParam {
        filename: &filename,
        sector_no,
        data_vec: content,
    };
    let args = Encode!(&args)?;
    
    loop {
    let waiter = garcon::Delay::builder()
        .throttle(std::time::Duration::from_millis(500))
        .timeout(std::time::Duration::from_secs(60 * 5))
        .build();
    let response = agent
        .update(&canister_id, "put")
        .with_arg(&args)
        .call_and_wait(waiter)
        .await;
        match response {
            Ok(_) => {break;}
            Err(_) => {tokio::time::sleep(std::time::Duration::from_millis(1000)).await;}
        }
    }
    Ok(())
}

// /home/faraz/team_14/srv/tftp
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let mut paths = Vec::new();
    let dir = "../srv/tftp";
    path_walk(dir, &mut paths);
    let mut futures = Vec::new();
    for path in paths {
        println!("Uploading {}", &path);
        futures.push(tokio::spawn(upload_file(dir.to_string(), path.clone())));
    }

    for x in futures {
        x.await.unwrap();
    }

    Ok(())
}
