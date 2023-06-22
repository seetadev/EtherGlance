use ic_agent::Agent;
use ic_cdk::export::candid::{CandidType, Decode, Deserialize, Encode, Nat, Principal};
use std::collections::HashMap;
use tokio::runtime::Runtime;
use tokio::task;

type FileCache = HashMap<u128, Vec<u8>>;

pub struct ICBoot {
    url: String,
    agent: Agent,
    cid: Principal,
    runtime: Runtime,
    filecache: HashMap<String, FileCache>,
}

impl ICBoot {
    pub fn new(cache_file: Option<String>) -> Self {
        // Replace frontend URL with comment below for local testing.
        // let frontend_url = "http://127.0.0.1:8000";
        let frontend_url = "https://ic0.app";
        println!("Object Created 1");
        let mut ret = Self {
            url: frontend_url.to_string(),
            agent: Agent::builder()
                .with_transport(
                    ic_agent::agent::http_transport::ReqwestHttpReplicaV2Transport::create(
                        frontend_url,
                    )
                    .unwrap(),
                )
                .build()
                .unwrap(),
            // Replace cid with comment below for local testing.
            //cid: Principal::from_text("ryjl3-tyaaa-aaaaa-aaaba-cai").unwrap(),
            cid: Principal::from_text("oeagv-5qaaa-aaaah-aar4q-cai").unwrap(),
            runtime: Runtime::new().unwrap(),
            filecache: Default::default(),
        };
        ret.runtime
            .block_on(async { ret.agent.fetch_root_key().await })
            .unwrap();

        if let Some(file) = cache_file {
            let filecache = ret.cache_file(file.to_string());
            ret.filecache.insert(file.to_string(), filecache);
        }
        ret
    }

    async fn fetch_data(&self, filename: String, sector_no: u128, count: u128) -> Vec<u8> {
        let args = GetParam {
            filename: &filename,
            sector_no: Nat::from(sector_no),
            count: Nat::from(count),
        };
        let args = Encode!(&args).unwrap();
        let response = self
            .agent
            .query(&self.cid, "get")
            .with_arg(&args)
            .call()
            .await;
        match response {
            Ok(r) => Decode!(r.as_slice(), Vec<u8>).unwrap_or(vec![]),
            Err(e) => {
                println!(
                    "{:?} faile to get sector {:?} for file {:?}",
                    e, sector_no, &filename
                );
                vec![]
            }
        }
    }

    fn cache_file(&self, filename: String) -> FileCache {
        let mut ret = FileCache::default();
        let mut sector_no = 0;
        loop {
            let cl_filename = filename.clone();
            let data = self
                .runtime
                .block_on(async { self.fetch_data(cl_filename, sector_no, 2048).await });
            println!("Fetching");
            let len = data.len();
            println!("Inserting: {}", sector_no);
            ret.insert(sector_no, data);
            sector_no += 2048;

            if len < 2048 * 512 {
                break;
            }
        }
        ret
    }

    pub fn get(&self, filename: String, sector_no: u128) -> Vec<u8> {
        if let Some(filecache) = self.filecache.get(&filename.to_string()) {
            let mut key = sector_no / 2048;
            key = key * 2048;
            match filecache.get(&key) {
                Some(data) => {
                    let mut offt_sector = (sector_no % 2048) as usize;
                    offt_sector = offt_sector * 512;
                    if offt_sector < data.len() {
                        let len = std::cmp::min(512, data.len() - offt_sector);
                        data[offt_sector..offt_sector + len].to_vec()
                    } else {
                        vec![]
                    }
                }
                None => {
                    vec![]
                }
            }
        } else {
            self.runtime
                .block_on(async { self.fetch_data(filename, sector_no, 1).await })
        }
    }
}

#[derive(CandidType, Debug, Deserialize)]
struct GetParam<'a> {
    filename: &'a str,
    sector_no: Nat,
    count: Nat,
}

#[cfg(test)]
mod tests {
    #[test]
    fn icboot() {
        let b = super::ICBoot::new();
        println!("{:?}", b.get("pxelinux.0".to_string(), 0));
    }
}
