# Forza Horizon 6 Voice Swap

Annoyed that the game ties text and voice language together? This Windows tool lets you use a different voice language by replacing the game's language files and creating matching backups before anything is overwritten.

## Usage

1. Open the app.
2. Select your current in-game language.
3. Select the voice language you want to hear.
4. Click `Execute Swap`.
5. Set the game language to the selected voice target if needed.

The original file is backed up automatically as `.zip.bak`. You can restore or delete backups from the backup manager.

## Build

```bash
npm ci
npx tauri build --no-bundle
```

The executable is created at:

```text
src-tauri/target/release/fh6-voice-swap.exe
```

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
