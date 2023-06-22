use ic_cdk::export::candid::{CandidType, Deserialize};
use std::collections::HashMap;
use std::convert::TryInto;
use std::sync::Once;

#[derive(Default)]
struct File {
    file_name: String,
    len: u128,
    content: HashMap<u128, [u8; 512]>,
}

struct BootDisk {
    name: String,
    content: HashMap<String, File>,
}

fn get_boot_disk() -> &'static mut BootDisk {
    static mut THE_BOOT_DISK: *mut BootDisk = 0 as *mut BootDisk;
    static ONCE: Once = Once::new();
    unsafe {
        ONCE.call_once(|| {
            let initial_boot_disk = BootDisk {
                name: "Bootdisk".to_string(),
                content: HashMap::new(),
            };
            THE_BOOT_DISK = std::mem::transmute(Box::new(initial_boot_disk));
        });
        &mut *(THE_BOOT_DISK)
    }
}

fn getfile(file_name: &str) -> &'static mut File {
    let insert_name = file_name.to_string().clone();
    get_boot_disk()
        .content
        .entry(file_name.to_string())
        .or_insert_with(|| File {
            file_name: insert_name,
            len: 0,
            content: Default::default(),
        })
}

#[derive(Clone, Debug, CandidType, Deserialize)]
struct PutParam {
    filename: String,
    sector_no: u128,
    data_vec: Vec<u8>,
}

#[allow(mutable_transmutes)]
#[ic_cdk_macros::update]
fn put(param: PutParam) {
    let filename = param.filename;
    let data_vec = param.data_vec;
    let data_vec = unsafe { std::mem::transmute::<&Vec<u8>, &mut Vec<u8>>(&data_vec) };

    let len = data_vec.len();

    let pad = 512 - (len % 512);
    for i in 0..pad {
        data_vec.push(0);
    }

    let mut start_sector: usize = TryInto::<usize>::try_into(param.sector_no).unwrap() / 512;

    let mut copy_sector: usize = 0;
    while copy_sector * 512 < data_vec.len() {
        let mut data_arr: [u8; 512] = [0; 512];
        let start_offt = copy_sector * 512;
        data_arr.copy_from_slice(&data_vec[start_offt..start_offt + 512]);

        let sno = copy_sector + start_sector;
        let sno: u128 = sno.try_into().unwrap();
        getfile(&filename).content.insert(sno, data_arr);
        copy_sector = copy_sector + 1;
    }
}

#[derive(Clone, Debug, CandidType, Deserialize)]
struct GetParam {
    filename: String,
    sector_no: u128,
    count: u128,
}

fn get_one_sector(filename: &str, sector_no: u128) -> Vec<u8> {
    let file = getfile(&filename);
    if sector_no == 0 {
        ic_cdk::print(std::format!("Serving file {:?}", &filename));
    }

    if sector_no * 512 > file.len {
        vec![]
    } else {
        let mut data = getfile(&filename)
            .content
            .get(&sector_no)
            .map_or_else(|| vec![0; 512], |x| x.to_vec());
        data.truncate(
            std::cmp::min(512, file.len - sector_no * 512)
                .try_into()
                .unwrap(),
        );

        data
    }
}

#[ic_cdk_macros::query]
fn get(param: GetParam) -> Vec<u8> {
    let sector_no = param.sector_no;
    let mut ret: Vec<u8> = Vec::new();
    for sector in sector_no..sector_no + param.count {
        let mut sec_data = get_one_sector(&param.filename, sector);
        let len = sec_data.len();
        ret.append(&mut sec_data);
        if len < 512 {
            break;
        }
    }
    ret
}

#[derive(Clone, Debug, CandidType, Deserialize)]
struct SetLenParam {
    filename: String,
    len: u128,
}
#[ic_cdk_macros::update]
fn setlen(param: SetLenParam) {
    getfile(&param.filename).len = param.len;
}

#[ic_cdk_macros::query]
fn listing() -> Vec<(String, u128)> {
    get_boot_disk()
        .content
        .iter()
        .map(|(k, v)| (k.clone(), v.len))
        .collect()
}

#[ic_cdk_macros::query]
fn print() {
    ic_cdk::print("Hello World from DFINITY!");
}
