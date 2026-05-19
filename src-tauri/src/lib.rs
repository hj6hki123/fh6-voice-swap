// Forza Horizon 6 Voice Swap
// Copyright (c) 2026 hj6hki123
// SPDX-License-Identifier: MIT

use serde::Serialize;
use std::fs;
use std::path::{Path, PathBuf};
use std::time::UNIX_EPOCH;

const REL_PATH: &str = r"media\Stripped\StringTables";
const GAME_EXE: &str = "ForzaHorizon6.exe";

#[derive(Serialize, Clone)]
struct FileInfo {
    code: String,
    filename: String,
    size: u64,
}

#[derive(Serialize, Clone)]
struct BackupInfo {
    code: String,
    filename: String,
    backup_size: u64,
    modified: u64,
}

#[derive(Serialize)]
struct ScanResult {
    files: Vec<FileInfo>,
    backups: Vec<BackupInfo>,
}

fn modified_unix(path: &Path) -> u64 {
    fs::metadata(path)
        .and_then(|m| m.modified())
        .ok()
        .and_then(|t| t.duration_since(UNIX_EPOCH).ok())
        .map(|d| d.as_secs())
        .unwrap_or(0)
}

#[tauri::command]
fn detect_default_path() -> Option<String> {
    let candidates: &[&str] = &[
        r"Program Files (x86)\Steam\steamapps\common\ForzaHorizon6",
        r"Program Files\Steam\steamapps\common\ForzaHorizon6",
        r"SteamLibrary\steamapps\common\ForzaHorizon6",
        r"Steam\steamapps\common\ForzaHorizon6",
        r"Games\SteamLibrary\steamapps\common\ForzaHorizon6",
        r"SteamLibrary2\steamapps\common\ForzaHorizon6",
    ];
    for drive in 'C'..='Z' {
        for c in candidates {
            let p = format!(r"{}:\{}\{}", drive, c, REL_PATH);
            if Path::new(&p).is_dir() {
                return Some(p);
            }
        }
    }
    None
}

#[tauri::command]
fn resolve_game_exe(exe_path: String) -> Result<String, String> {
    let exe = Path::new(&exe_path);
    if !exe.is_file() {
        return Err(format!("File does not exist: {}", exe_path));
    }
    let file_name = exe.file_name().and_then(|n| n.to_str()).unwrap_or("");
    if !file_name.eq_ignore_ascii_case(GAME_EXE) {
        return Err(format!("Please select {}", GAME_EXE));
    }
    let game_dir = exe.parent().ok_or("Invalid executable path")?;
    let string_tables = game_dir.join(REL_PATH);
    if !string_tables.is_dir() {
        return Err(format!("StringTables folder not found: {}", string_tables.display()));
    }
    Ok(string_tables.to_string_lossy().into_owned())
}

#[tauri::command]
fn scan_folder(dir: String) -> Result<ScanResult, String> {
    let path = Path::new(&dir);
    if !path.is_dir() {
        return Err(format!("Folder does not exist: {}", dir));
    }
    let mut files = Vec::new();
    let mut backups = Vec::new();

    for entry in fs::read_dir(path).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let p = entry.path();
        if !p.is_file() {
            continue;
        }
        let name = match p.file_name().and_then(|n| n.to_str()) {
            Some(n) => n.to_string(),
            None => continue,
        };
        let lower = name.to_lowercase();
        let meta = entry.metadata().map_err(|e| e.to_string())?;

        if lower.ends_with(".bak") {
            let stem = &name[..name.len() - 4];
            let code_stem = Path::new(stem)
                .file_stem()
                .and_then(|s| s.to_str())
                .unwrap_or(stem);
            backups.push(BackupInfo {
                code: code_stem.to_uppercase(),
                filename: stem.to_string(),
                backup_size: meta.len(),
                modified: modified_unix(&p),
            });
        } else if lower.ends_with(".zip") {
            let code = Path::new(&name)
                .file_stem()
                .and_then(|s| s.to_str())
                .unwrap_or(&name);
            files.push(FileInfo {
                code: code.to_uppercase(),
                filename: name.clone(),
                size: meta.len(),
            });
        }
    }

    files.sort_by(|a, b| a.code.cmp(&b.code));
    backups.sort_by(|a, b| a.code.cmp(&b.code));

    Ok(ScanResult { files, backups })
}

fn resolve_zip(dir: &str, code: &str) -> Result<PathBuf, String> {
    let dir_path = Path::new(dir);
    for entry in fs::read_dir(dir_path).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let p = entry.path();
        if !p.is_file() {
            continue;
        }
        let name = match p.file_name().and_then(|n| n.to_str()) {
            Some(n) => n,
            None => continue,
        };
        let lower = name.to_lowercase();
        if !lower.ends_with(".zip") {
            continue;
        }
        let stem = Path::new(name).file_stem().and_then(|s| s.to_str()).unwrap_or("");
        if stem.eq_ignore_ascii_case(code) {
            return Ok(p);
        }
    }
    Err(format!("Language file not found: {}.zip", code))
}

#[tauri::command]
fn do_swap(dir: String, display_code: String, voice_code: String) -> Result<(), String> {
    if display_code.eq_ignore_ascii_case(&voice_code) {
        return Err("Subtitle and voice languages are the same; no swap is needed".into());
    }
    let src = resolve_zip(&dir, &display_code)?;
    let dst = resolve_zip(&dir, &voice_code)?;
    let mut bak = dst.clone();
    let mut bak_name = dst
        .file_name()
        .and_then(|n| n.to_str())
        .ok_or("invalid path")?
        .to_string();
    bak_name.push_str(".bak");
    bak.set_file_name(&bak_name);

    if !bak.exists() {
        fs::copy(&dst, &bak).map_err(|e| format!("Backup failed: {}", e))?;
    }
    fs::copy(&src, &dst).map_err(|e| format!("Copy failed: {}", e))?;
    Ok(())
}

#[tauri::command]
fn do_restore(dir: String, code: String) -> Result<(), String> {
    let dst = resolve_zip(&dir, &code)?;
    let mut bak = dst.clone();
    let mut bak_name = dst
        .file_name()
        .and_then(|n| n.to_str())
        .ok_or("invalid path")?
        .to_string();
    bak_name.push_str(".bak");
    bak.set_file_name(&bak_name);
    if !bak.exists() {
        return Err(format!("Backup not found: {}", bak.display()));
    }
    fs::copy(&bak, &dst).map_err(|e| format!("Restore failed: {}", e))?;
    fs::remove_file(&bak).map_err(|e| format!("Failed to delete backup: {}", e))?;
    Ok(())
}

#[tauri::command]
fn delete_backup(dir: String, code: String) -> Result<(), String> {
    let dst = resolve_zip(&dir, &code)?;
    let mut bak = dst.clone();
    let mut bak_name = dst
        .file_name()
        .and_then(|n| n.to_str())
        .ok_or("invalid path")?
        .to_string();
    bak_name.push_str(".bak");
    bak.set_file_name(&bak_name);
    if !bak.exists() {
        return Err("Backup file not found".into());
    }
    fs::remove_file(&bak).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn reset_all(dir: String) -> Result<u32, String> {
    let dir_path = Path::new(&dir);
    if !dir_path.is_dir() {
        return Err(format!("Folder does not exist: {}", dir));
    }
    let mut restored = 0u32;
    let entries: Vec<_> = fs::read_dir(dir_path)
        .map_err(|e| e.to_string())?
        .filter_map(|e| e.ok())
        .collect();
    for entry in entries {
        let p = entry.path();
        if !p.is_file() {
            continue;
        }
        let name = match p.file_name().and_then(|n| n.to_str()) {
            Some(n) => n.to_string(),
            None => continue,
        };
        if !name.to_lowercase().ends_with(".bak") {
            continue;
        }
        let original_name = &name[..name.len() - 4];
        let original_path = dir_path.join(original_name);
        fs::copy(&p, &original_path).map_err(|e| format!("Failed to restore {}: {}", original_name, e))?;
        fs::remove_file(&p).map_err(|e| format!("Failed to delete {}: {}", name, e))?;
        restored += 1;
    }
    Ok(restored)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            detect_default_path,
            resolve_game_exe,
            scan_folder,
            do_swap,
            do_restore,
            delete_backup,
            reset_all
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
