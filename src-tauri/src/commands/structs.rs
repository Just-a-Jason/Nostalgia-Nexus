use serde::{Deserialize, Serialize};

#[derive(Serialize, Debug, Deserialize)]
pub struct App {
    name: String,
    file_id: String,
}

impl App {
    pub fn new(name: String, file_id: String) -> Self {
        App { name, file_id }
    }
}

impl App {
    pub fn to_string(&self) -> String {
        format!("name={}\nfile_id={}", self.name, self.file_id)
    }

    pub fn name(&self) -> &String {
        &self.name
    }
}
